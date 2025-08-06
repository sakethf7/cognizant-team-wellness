import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target,
  Award,
  Activity,
  Clock,
  Droplets,
  Brain
} from "lucide-react";

interface WeeklyData {
  day: string;
  wellness: number;
  energy: number;
  hydration: number;
  breaks: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  date?: string;
  color: string;
}

export default function Analytics() {
  const weeklyData: WeeklyData[] = [
    { day: "Mon", wellness: 85, energy: 7, hydration: 8, breaks: 6 },
    { day: "Tue", wellness: 78, energy: 6, hydration: 6, breaks: 5 },
    { day: "Wed", wellness: 82, energy: 8, hydration: 7, breaks: 7 },
    { day: "Thu", wellness: 90, energy: 9, hydration: 8, breaks: 8 },
    { day: "Fri", wellness: 88, energy: 8, hydration: 9, breaks: 6 },
    { day: "Sat", wellness: 75, energy: 6, hydration: 5, breaks: 4 },
    { day: "Sun", wellness: 80, energy: 7, hydration: 6, breaks: 5 }
  ];

  const achievements: Achievement[] = [
    {
      id: "hydration-master",
      title: "Hydration Master",
      description: "Reached daily water goal for 7 days straight",
      icon: Droplets,
      earned: true,
      date: "2024-01-15",
      color: "calm"
    },
    {
      id: "break-champion",
      title: "Break Champion",
      description: "Took recommended breaks for 5 consecutive days",
      icon: Clock,
      earned: true,
      date: "2024-01-12",
      color: "energy"
    },
    {
      id: "wellness-warrior",
      title: "Wellness Warrior",
      description: "Maintained 80+ wellness score for 2 weeks",
      icon: Award,
      earned: false,
      color: "wellness"
    },
    {
      id: "mindful-worker",
      title: "Mindful Worker",
      description: "Completed 20 mindfulness sessions",
      icon: Brain,
      earned: false,
      color: "calm"
    }
  ];

  const currentWeek = weeklyData.slice(-7);
  const averageWellness = Math.round(currentWeek.reduce((acc, day) => acc + day.wellness, 0) / currentWeek.length);
  const averageEnergy = Math.round(currentWeek.reduce((acc, day) => acc + day.energy, 0) / currentWeek.length * 10) / 10;

  const trends = {
    wellness: { value: +12, direction: "up" },
    energy: { value: +8, direction: "up" },
    hydration: { value: -5, direction: "down" },
    breaks: { value: +15, direction: "up" }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-wellness/10 to-wellness/5 border-wellness/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-wellness">Avg. Wellness</p>
                <p className="text-2xl font-bold">{averageWellness}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                {trends.wellness.direction === "up" ? (
                  <TrendingUp className="h-4 w-4 text-wellness" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={trends.wellness.direction === "up" ? "text-wellness" : "text-destructive"}>
                  {trends.wellness.value}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-energy/10 to-energy/5 border-energy/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-energy">Avg. Energy</p>
                <p className="text-2xl font-bold">{averageEnergy}/10</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-energy" />
                <span className="text-energy">{trends.energy.value}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-calm/10 to-calm/5 border-calm/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-calm">Hydration Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-destructive">{trends.hydration.value}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Break Frequency</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-wellness" />
                <span className="text-wellness">{trends.breaks.value}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Weekly Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentWeek.map((day, index) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium w-12">{day.day}</span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Wellness: {day.wellness}%</span>
                    <span>Energy: {day.energy}/10</span>
                    <span>Water: {day.hydration}/8</span>
                    <span>Breaks: {day.breaks}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Progress value={day.wellness} className="h-2" />
                  <Progress value={day.energy * 10} className="h-2" />
                  <Progress value={(day.hydration / 8) * 100} className="h-2" />
                  <Progress value={(day.breaks / 8) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-energy" />
              This Week's Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Hydration Goal</span>
                <Badge variant="secondary">6/7 days</Badge>
              </div>
              <Progress value={85.7} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Break Consistency</span>
                <Badge variant="secondary">5/7 days</Badge>
              </div>
              <Progress value={71.4} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Wellness Score 80+</span>
                <Badge variant="secondary">7/7 days</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-wellness" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border transition-all ${
                      achievement.earned 
                        ? `bg-${achievement.color}/10 border-${achievement.color}/20` 
                        : "bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 ${achievement.earned ? `text-${achievement.color}` : 'text-muted-foreground'} mt-0.5`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          {achievement.earned && (
                            <Badge variant="secondary" className="h-5 px-2 text-xs">
                              Earned {achievement.date && new Date(achievement.date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-calm" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-wellness/10 rounded-lg border border-wellness/20">
              <p className="text-sm"><strong>Great progress!</strong> Your wellness score has improved by 12% this week. Keep up the excellent hydration habits.</p>
            </div>
            <div className="p-4 bg-energy/10 rounded-lg border border-energy/20">
              <p className="text-sm"><strong>Energy boost:</strong> Taking regular breaks has increased your afternoon energy levels by 23%.</p>
            </div>
            <div className="p-4 bg-calm/10 rounded-lg border border-calm/20">
              <p className="text-sm"><strong>Recommendation:</strong> Try scheduling 2-minute breathing exercises during your 2 PM energy dip for better focus.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}