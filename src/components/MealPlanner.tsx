
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ChefHat, 
  Calendar, 
  Clock, 
  Star,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface HealthCondition {
  id: string;
  name: string;
  severity: "low" | "medium" | "high";
  medications: string[];
  dietaryRestrictions: string[];
}

interface MealRecommendation {
  id: string;
  name: string;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  suitability: "recommended" | "caution" | "avoid";
  reasons: string[];
  alternatives?: string[];
}

interface MealPlannerProps {
  conditions: HealthCondition[];
}

export default function MealPlanner({ conditions }: MealPlannerProps) {
  const [currentMenu, setCurrentMenu] = useState<MealRecommendation[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Sample cafeteria menu (in real implementation, this would come from an API)
  const generateDailyMenu = () => {
    const menuItems: MealRecommendation[] = [
      // Breakfast
      {
        id: "1",
        name: "Oatmeal with Fresh Berries",
        category: "breakfast",
        calories: 250,
        nutrients: { protein: 8, carbs: 45, fat: 3, fiber: 6, sodium: 150 },
        suitability: "recommended",
        reasons: ["High fiber, low sugar - great for diabetes management"],
        alternatives: ["Steel-cut oats with cinnamon"]
      },
      {
        id: "2", 
        name: "Pancakes with Syrup",
        category: "breakfast",
        calories: 420,
        nutrients: { protein: 8, carbs: 68, fat: 12, fiber: 2, sodium: 680 },
        suitability: "avoid",
        reasons: ["High sugar and refined carbs - can spike blood glucose"],
        alternatives: ["Whole wheat pancakes with sugar-free syrup", "Greek yogurt with berries"]
      },
      // Lunch
      {
        id: "3",
        name: "Grilled Chicken Salad",
        category: "lunch", 
        calories: 320,
        nutrients: { protein: 35, carbs: 15, fat: 12, fiber: 8, sodium: 450 },
        suitability: "recommended",
        reasons: ["High protein, low carbs, good for blood sugar control"],
        alternatives: ["Salmon salad", "Turkey and avocado wrap"]
      },
      {
        id: "4",
        name: "Fried Rice with Vegetables",
        category: "lunch",
        calories: 380,
        nutrients: { protein: 12, carbs: 58, fat: 14, fiber: 3, sodium: 950 },
        suitability: "caution", 
        reasons: ["High sodium and refined carbs - limit portion size"],
        alternatives: ["Brown rice with steamed vegetables", "Quinoa bowl"]
      },
      // Snacks
      {
        id: "5",
        name: "Mixed Nuts (1 oz)",
        category: "snack",
        calories: 170,
        nutrients: { protein: 6, carbs: 6, fat: 15, fiber: 3, sodium: 90 },
        suitability: "recommended",
        reasons: ["Healthy fats and protein - helps stabilize blood sugar"],
        alternatives: ["Apple with almond butter", "Greek yogurt"]
      }
    ];

    return menuItems.map(item => {
      // AI logic to determine suitability based on conditions
      let suitability = item.suitability;
      let reasons = [...item.reasons];

      conditions.forEach(condition => {
        if (condition.name.toLowerCase().includes('diabetes')) {
          if (item.nutrients.carbs > 50 || item.nutrients.sodium > 800) {
            suitability = item.nutrients.carbs > 60 ? "avoid" : "caution";
            reasons.push(`${condition.name}: Monitor carbohydrate and sodium intake`);
          }
        }
        
        if (condition.name.toLowerCase().includes('hypertension')) {
          if (item.nutrients.sodium > 600) {
            suitability = suitability === "recommended" ? "caution" : "avoid";
            reasons.push(`${condition.name}: High sodium content may affect blood pressure`);
          }
        }

        condition.dietaryRestrictions.forEach(restriction => {
          if (restriction.toLowerCase().includes('low sodium') && item.nutrients.sodium > 400) {
            suitability = "caution";
            reasons.push(`Dietary restriction: ${restriction} - consider smaller portion`);
          }
        });
      });

      return { ...item, suitability, reasons };
    });
  };

  const loadTodaysMenu = () => {
    setIsLoading(true);
    setTimeout(() => {
      const menu = generateDailyMenu();
      setCurrentMenu(menu);
      setIsLoading(false);
      
      toast({
        title: "Menu updated",
        description: "Today's cafeteria menu has been analyzed for your health conditions.",
      });
    }, 1000);
  };

  useEffect(() => {
    loadTodaysMenu();
  }, [conditions]);

  const toggleMealSelection = (mealId: string) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "recommended": return "wellness";
      case "caution": return "energy";
      case "avoid": return "destructive";
      default: return "secondary";
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case "recommended": return CheckCircle;
      case "caution": return AlertTriangle;
      case "avoid": return AlertTriangle;
      default: return Clock;
    }
  };

  const categorizeMenu = () => {
    const categories = {
      breakfast: currentMenu.filter(item => item.category === "breakfast"),
      lunch: currentMenu.filter(item => item.category === "lunch"), 
      dinner: currentMenu.filter(item => item.category === "dinner"),
      snack: currentMenu.filter(item => item.category === "snack")
    };
    return categories;
  };

  const categories = categorizeMenu();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              Today's Smart Meal Recommendations
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadTodaysMenu} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Menu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Personalized for your health conditions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Categories */}
      {Object.entries(categories).map(([category, items]) => 
        items.length > 0 && (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {items.map((meal) => {
                  const SuitabilityIcon = getSuitabilityIcon(meal.suitability);
                  const isSelected = selectedMeals.includes(meal.id);
                  
                  return (
                    <div 
                      key={meal.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleMealSelection(meal.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{meal.name}</h4>
                          <p className="text-sm text-muted-foreground">{meal.calories} calories</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`bg-${getSuitabilityColor(meal.suitability)}/10 text-${getSuitabilityColor(meal.suitability)}`}>
                            <SuitabilityIcon className="h-3 w-3 mr-1" />
                            {meal.suitability}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-muted-foreground mb-3">
                        <div>Protein: {meal.nutrients.protein}g</div>
                        <div>Carbs: {meal.nutrients.carbs}g</div>
                        <div>Fat: {meal.nutrients.fat}g</div>
                        <div>Fiber: {meal.nutrients.fiber}g</div>
                        <div>Sodium: {meal.nutrients.sodium}mg</div>
                      </div>

                      <div className="space-y-1">
                        {meal.reasons.map((reason, index) => (
                          <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {reason}
                          </p>
                        ))}
                      </div>

                      {meal.alternatives && meal.alternatives.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Better alternatives:</p>
                          <div className="flex flex-wrap gap-1">
                            {meal.alternatives.map((alt, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {alt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Selected Meals Summary */}
      {selectedMeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Meal Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedMeals.map(mealId => {
                const meal = currentMenu.find(m => m.id === mealId);
                return meal ? (
                  <div key={mealId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span>{meal.name}</span>
                    <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
                  </div>
                ) : null;
              })}
              <div className="pt-2 border-t font-medium">
                Total Calories: {selectedMeals.reduce((total, mealId) => {
                  const meal = currentMenu.find(m => m.id === mealId);
                  return total + (meal?.calories || 0);
                }, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
