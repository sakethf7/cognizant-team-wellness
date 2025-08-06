import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  MessageSquare, 
  Zap,
  Heart,
  Brain,
  Eye,
  Coffee
} from "lucide-react";

interface CheckIn {
  id: string;
  time: string;
  type: "wellness" | "break" | "hydration" | "mood" | "energy";
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface Suggestion {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  duration: string;
  category: "physical" | "mental" | "hydration" | "break";
  color: string;
}

export default function CheckInSystem() {
  const [activeCheckIns, setActiveCheckIns] = useState<CheckIn[]>([]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [stressLevel, setStressLevel] = useState([3]);
  const [feedback, setFeedback] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize check-ins based on current time
    const generateCheckIns = () => {
      const hour = currentTime.getHours();
      const checkIns: CheckIn[] = [];

      if (hour >= 9 && hour < 10) {
        checkIns.push({
          id: "morning-start",
          time: "9:00 AM",
          type: "wellness",
          title: "Morning Wellness Check",
          description: "How are you feeling as you start your day?",
          completed: false,
          priority: "high"
        });
      }

      if (hour >= 11 && hour < 12) {
        checkIns.push({
          id: "hydration-reminder",
          time: "11:00 AM",
          type: "hydration",
          title: "Hydration Break",
          description: "Time to drink some water! Have you had enough fluids?",
          completed: false,
          priority: "medium"
        });
      }

      if (hour >= 14 && hour < 15) {
        checkIns.push({
          id: "afternoon-energy",
          time: "2:00 PM",
          type: "energy",
          title: "Energy Level Check",
          description: "How's your energy? Consider a quick walk or stretch.",
          completed: false,
          priority: "high"
        });
      }

      if (hour >= 16 && hour < 17) {
        checkIns.push({
          id: "eye-break",
          time: "4:00 PM",
          type: "break",
          title: "Eye Rest Reminder",
          description: "Give your eyes a break from the screen.",
          completed: false,
          priority: "medium"
        });
      }

      setActiveCheckIns(checkIns);
    };

    generateCheckIns();
  }, [currentTime]);

  const suggestions: Suggestion[] = [
    {
      id: "stretch",
      icon: Zap,
      title: "Desk Stretch",
      description: "Simple stretches you can do at your desk",
      duration: "3 min",
      category: "physical",
      color: "wellness"
    },
    {
      id: "breathing",
      icon: Heart,
      title: "Deep Breathing",
      description: "Calm your mind with breathing exercises",
      duration: "5 min",
      category: "mental",
      color: "calm"
    },
    {
      id: "walk",
      icon: Coffee,
      title: "Quick Walk",
      description: "Take a short walk around the office",
      duration: "10 min",
      category: "physical",
      color: "energy"
    },
    {
      id: "eyes",
      icon: Eye,
      title: "20-20-20 Rule",
      description: "Look at something 20 feet away for 20 seconds",
      duration: "1 min",
      category: "break",
      color: "calm"
    },
    {
      id: "meditation",
      icon: Brain,
      title: "Mini Meditation",
      description: "Quick mindfulness session",
      duration: "7 min",
      category: "mental",
      color: "calm"
    }
  ];

  const completeCheckIn = (checkInId: string) => {
    setActiveCheckIns(prev => 
      prev.map(checkIn => 
        checkIn.id === checkInId 
          ? { ...checkIn, completed: true }
          : checkIn
      )
    );
    
    toast({
      title: "Check-in completed!",
      description: "Great job taking care of your health.",
    });
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    
    toast({
      title: "Feedback submitted",
      description: "Thank you for sharing your thoughts!",
    });
    setFeedback("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "energy";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "wellness": return Heart;
      case "break": return Clock;
      case "hydration": return Coffee;
      case "mood": return Lightbulb;
      case "energy": return Zap;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Check-ins */}
      <Card className="border-wellness/20 bg-gradient-to-r from-card to-wellness/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-wellness animate-pulse-wellness" />
            Active Check-ins
            <Badge variant="secondary" className="ml-auto">
              {activeCheckIns.filter(c => !c.completed).length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCheckIns.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-wellness mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">All caught up! Check back later for more wellness reminders.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCheckIns.map((checkIn) => {
                const Icon = getTypeIcon(checkIn.type);
                return (
                  <div
                    key={checkIn.id}
                    className={`p-4 rounded-lg border transition-all ${
                      checkIn.completed 
                        ? "bg-muted/50 opacity-60" 
                        : "bg-card hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 text-${checkIn.type === 'wellness' ? 'wellness' : checkIn.type === 'break' ? 'calm' : 'energy'} mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{checkIn.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`h-5 px-2 text-xs border-${getPriorityColor(checkIn.priority)}/50 text-${getPriorityColor(checkIn.priority)}`}
                            >
                              {checkIn.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{checkIn.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{checkIn.description}</p>
                        </div>
                      </div>
                      <Button
                        variant={checkIn.completed ? "outline" : "wellness"}
                        size="sm"
                        onClick={() => completeCheckIn(checkIn.id)}
                        disabled={checkIn.completed}
                      >
                        {checkIn.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </>
                        ) : (
                          "Complete"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Energy Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span className="font-medium">Current: {energyLevel[0]}/10</span>
              <span>High</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Stress Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={stressLevel}
              onValueChange={setStressLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Relaxed</span>
              <span className="font-medium">Current: {stressLevel[0]}/10</span>
              <span>Stressed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-energy" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.slice(0, 3).map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 text-${suggestion.color} group-hover:scale-110 transition-transform`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                      <Badge variant="outline" className="h-5 px-2 text-xs">
                        {suggestion.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-calm" />
            Share Your Thoughts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How can we better support your wellness today? Any suggestions or feedback?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button onClick={submitFeedback} variant="calm" disabled={!feedback.trim()}>
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}