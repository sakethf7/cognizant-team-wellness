
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Heart, 
  AlertCircle, 
  Upload, 
  Calendar,
  Bell,
  ChefHat,
  FileText
} from "lucide-react";
import MealPlanner from "./MealPlanner";
import HealthNotifications from "./HealthNotifications";

interface HealthCondition {
  id: string;
  name: string;
  severity: "low" | "medium" | "high";
  medications: string[];
  dietaryRestrictions: string[];
}

export default function HealthBot() {
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>([]);
  const [isProfileSetup, setIsProfileSetup] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "meals" | "notifications">("profile");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved health profile
    const savedProfile = localStorage.getItem('healthProfile');
    if (savedProfile) {
      const conditions = JSON.parse(savedProfile);
      setHealthConditions(conditions);
      setIsProfileSetup(conditions.length > 0);
    }
  }, []);

  const addHealthCondition = (condition: Omit<HealthCondition, 'id'>) => {
    const newCondition = {
      ...condition,
      id: Date.now().toString()
    };
    const updatedConditions = [...healthConditions, newCondition];
    setHealthConditions(updatedConditions);
    localStorage.setItem('healthProfile', JSON.stringify(updatedConditions));
    
    toast({
      title: "Health condition added",
      description: "Your AI bot will now consider this when making recommendations.",
    });
  };

  const removeCondition = (id: string) => {
    const updatedConditions = healthConditions.filter(c => c.id !== id);
    setHealthConditions(updatedConditions);
    localStorage.setItem('healthProfile', JSON.stringify(updatedConditions));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-hero rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="h-8 w-8" />
          <h1 className="text-3xl font-bold">AI Health Assistant</h1>
        </div>
        <p className="text-white/80 text-lg">
          Your personal health companion that understands your conditions and helps you stay healthy at work
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === "profile" ? "default" : "outline"}
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Health Profile
        </Button>
        <Button 
          variant={activeTab === "meals" ? "default" : "outline"}
          onClick={() => setActiveTab("meals")}
          disabled={!isProfileSetup}
          className="flex items-center gap-2"
        >
          <ChefHat className="h-4 w-4" />
          Meal Planner
        </Button>
        <Button 
          variant={activeTab === "notifications" ? "default" : "outline"}
          onClick={() => setActiveTab("notifications")}
          disabled={!isProfileSetup}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Health Reminders
        </Button>
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <HealthProfileSetup 
          conditions={healthConditions}
          onAddCondition={addHealthCondition}
          onRemoveCondition={removeCondition}
          onComplete={() => setIsProfileSetup(true)}
        />
      )}

      {activeTab === "meals" && isProfileSetup && (
        <MealPlanner conditions={healthConditions} />
      )}

      {activeTab === "notifications" && isProfileSetup && (
        <HealthNotifications conditions={healthConditions} />
      )}
    </div>
  );
}

// Health Profile Setup Component
interface HealthProfileSetupProps {
  conditions: HealthCondition[];
  onAddCondition: (condition: Omit<HealthCondition, 'id'>) => void;
  onRemoveCondition: (id: string) => void;
  onComplete: () => void;
}

function HealthProfileSetup({ conditions, onAddCondition, onRemoveCondition, onComplete }: HealthProfileSetupProps) {
  const [conditionName, setConditionName] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [medications, setMedications] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!conditionName.trim()) return;

    onAddCondition({
      name: conditionName.trim(),
      severity,
      medications: medications.split(',').map(m => m.trim()).filter(Boolean),
      dietaryRestrictions: dietaryRestrictions.split(',').map(r => r.trim()).filter(Boolean)
    });

    // Reset form
    setConditionName("");
    setMedications("");
    setDietaryRestrictions("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Conditions */}
      {conditions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{condition.name}</h4>
                      <Badge variant={condition.severity === "high" ? "destructive" : condition.severity === "medium" ? "secondary" : "outline"}>
                        {condition.severity} severity
                      </Badge>
                    </div>
                    {condition.dietaryRestrictions.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Dietary needs: {condition.dietaryRestrictions.join(", ")}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onRemoveCondition(condition.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add Health Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Add your health conditions so the AI can provide personalized recommendations
              </p>
              <Button onClick={() => setShowForm(true)}>
                Add Health Condition
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Condition Name</label>
                <Input
                  placeholder="e.g., Diabetes Type 2, Hypertension, Food Allergies"
                  value={conditionName}
                  onChange={(e) => setConditionName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <Button
                      key={level}
                      variant={severity === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSeverity(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Medications (comma separated)</label>
                <Input
                  placeholder="e.g., Metformin, Lisinopril"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dietary Restrictions (comma separated)</label>
                <Textarea
                  placeholder="e.g., Low sodium, No sugar, Gluten-free, Low fat"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!conditionName.trim()}>
                  Add Condition
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {conditions.length > 0 && (
        <div className="text-center">
          <Button onClick={onComplete} className="bg-wellness hover:bg-wellness/90">
            Complete Profile Setup
          </Button>
        </div>
      )}
    </div>
  );
}
