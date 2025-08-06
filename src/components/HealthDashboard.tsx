import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Droplets, 
  Coffee, 
  Activity, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp,
  Smile,
  Zap,
  Eye
} from "lucide-react";

interface HealthMetric {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  trend: "up" | "down" | "stable";
}

export default function HealthDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wellnessScore, setWellnessScore] = useState(78);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const healthMetrics: HealthMetric[] = [
    {
      id: "hydration",
      title: "Hydration",
      value: 6,
      target: 8,
      unit: "glasses",
      icon: Droplets,
      color: "calm",
      trend: "up"
    },
    {
      id: "breaks",
      title: "Breaks Taken",
      value: 4,
      target: 6,
      unit: "breaks",
      icon: Coffee,
      color: "energy",
      trend: "stable"
    },
    {
      id: "activity",
      title: "Steps Today",
      value: 3200,
      target: 5000,
      unit: "steps",
      icon: Activity,
      color: "wellness",
      trend: "up"
    },
    {
      id: "focus",
      title: "Focus Time",
      value: 180,
      target: 240,
      unit: "minutes",
      icon: Brain,
      color: "calm",
      trend: "up"
    }
  ];

  const getWellnessLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "wellness" };
    if (score >= 60) return { level: "Good", color: "energy" };
    if (score >= 40) return { level: "Fair", color: "energy" };
    return { level: "Needs Attention", color: "destructive" };
  };

  const wellnessLevel = getWellnessLevel(wellnessScore);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-hero rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}!</h1>
            <p className="text-white/80 text-lg">Ready to make today healthier than yesterday?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-white/80">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Wellness Score */}
      <Card className="bg-gradient-to-r from-card to-card/80 border-0 shadow-wellness">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-wellness animate-pulse-wellness" />
            Wellness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-wellness">{wellnessScore}</div>
              <Badge variant="secondary" className={`bg-${wellnessLevel.color}/10 text-${wellnessLevel.color} border-${wellnessLevel.color}/20`}>
                {wellnessLevel.level}
              </Badge>
            </div>
            <TrendingUp className="h-8 w-8 text-wellness animate-float" />
          </div>
          <Progress value={wellnessScore} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">Based on today's health activities and check-ins</p>
        </CardContent>
      </Card>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric) => {
          const Icon = metric.icon;
          const progress = (metric.value / metric.target) * 100;
          
          return (
            <Card key={metric.id} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className={`h-4 w-4 text-${metric.color}`} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{metric.value.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ {metric.target.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{Math.round(progress)}% of goal</span>
                    <Badge variant="outline" className="h-5 px-1">
                      {metric.trend === "up" ? "↗️" : metric.trend === "down" ? "↘️" : "➡️"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Quick Health Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="wellness" className="h-auto p-4 flex-col gap-2">
              <Droplets className="h-6 w-6" />
              <span>Log Water</span>
              <span className="text-xs opacity-80">Stay hydrated</span>
            </Button>
            <Button variant="energy" className="h-auto p-4 flex-col gap-2">
              <Clock className="h-6 w-6" />
              <span>Take Break</span>
              <span className="text-xs opacity-80">Refresh your mind</span>
            </Button>
            <Button variant="calm" className="h-auto p-4 flex-col gap-2">
              <Eye className="h-6 w-6" />
              <span>Eye Exercise</span>
              <span className="text-xs opacity-80">Rest your eyes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-energy" />
            How are you feeling right now?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {[
              { emoji: "😊", label: "Great", color: "wellness" },
              { emoji: "🙂", label: "Good", color: "primary" },
              { emoji: "😐", label: "Okay", color: "secondary" },
              { emoji: "😔", label: "Low", color: "muted" },
              { emoji: "😫", label: "Stressed", color: "destructive" }
            ].map((mood) => (
              <Button key={mood.label} variant="outline" className="flex-col h-auto p-3 gap-1">
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}