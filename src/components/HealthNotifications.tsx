
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Clock, 
  Heart, 
  Pill,
  Activity,
  Droplets,
  Eye,
  Brain,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface HealthCondition {
  id: string;
  name: string;
  severity: "low" | "medium" | "high";
  medications: string[];
  dietaryRestrictions: string[];
}

interface HealthNotification {
  id: string;
  type: "medication" | "checkup" | "activity" | "diet" | "monitoring";
  title: string;
  message: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  time: string;
  enabled: boolean;
  condition: string;
  priority: "low" | "medium" | "high";
  icon: React.ElementType;
}

interface HealthNotificationsProps {
  conditions: HealthCondition[];
}

export default function HealthNotifications({ conditions }: HealthNotificationsProps) {
  const [notifications, setNotifications] = useState<HealthNotification[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<HealthNotification[]>([]);
  const { toast } = useToast();

  // Generate personalized notifications based on conditions
  useEffect(() => {
    const generateNotifications = () => {
      const baseNotifications: Omit<HealthNotification, 'id' | 'condition'>[] = [];

      conditions.forEach(condition => {
        if (condition.name.toLowerCase().includes('diabetes')) {
          baseNotifications.push(
            {
              type: "monitoring",
              title: "Blood Sugar Check",
              message: "Time to check your blood glucose levels",
              frequency: "daily",
              time: "08:00",
              enabled: true,
              priority: "high",
              icon: Heart
            },
            {
              type: "diet",
              title: "Meal Planning Reminder",
              message: "Review today's cafeteria menu for diabetic-friendly options",
              frequency: "daily", 
              time: "07:30",
              enabled: true,
              priority: "medium",
              icon: Calendar
            },
            {
              type: "activity",
              title: "Post-Meal Walk",
              message: "Take a 10-minute walk to help manage blood sugar",
              frequency: "daily",
              time: "13:30",
              enabled: true,
              priority: "medium",
              icon: Activity
            }
          );
        }

        if (condition.name.toLowerCase().includes('hypertension')) {
          baseNotifications.push(
            {
              type: "monitoring",
              title: "Blood Pressure Check",
              message: "Remember to check your blood pressure",
              frequency: "weekly",
              time: "09:00",
              enabled: true,
              priority: "high",
              icon: Heart
            },
            {
              type: "diet",
              title: "Low Sodium Reminder",
              message: "Choose low-sodium options from today's menu",
              frequency: "daily",
              time: "11:30",
              enabled: true,
              priority: "medium",
              icon: Droplets
            }
          );
        }

        // Add medication reminders
        condition.medications.forEach(medication => {
          baseNotifications.push({
            type: "medication",
            title: `${medication} Reminder`,
            message: `Time to take your ${medication}`,
            frequency: "daily",
            time: "09:00",
            enabled: true,
            priority: "high",
            icon: Pill
          });
        });

        // Add general wellness reminders
        baseNotifications.push(
          {
            type: "activity",
            title: "Eye Rest Break",
            message: "Take a break and rest your eyes for 2 minutes",
            frequency: "daily",
            time: "15:00",
            enabled: true,
            priority: "low",
            icon: Eye
          },
          {
            type: "activity", 
            title: "Stress Check",
            message: "How are you feeling? Take a moment for mindfulness",
            frequency: "daily",
            time: "16:00",
            enabled: true,
            priority: "medium",
            icon: Brain
          }
        );
      });

      // Convert to full notifications with IDs
      const fullNotifications = baseNotifications.map((notification, index) => ({
        ...notification,
        id: `${index}`,
        condition: conditions.find(c => 
          notification.message.toLowerCase().includes(c.name.toLowerCase()) ||
          notification.title.toLowerCase().includes(c.name.toLowerCase())
        )?.name || "General Wellness"
      }));

      return fullNotifications;
    };

    const generatedNotifications = generateNotifications();
    setNotifications(generatedNotifications);
  }, [conditions]);

  // Simulate active notifications (in real app, this would be based on current time and schedule)
  useEffect(() => {
    const currentHour = new Date().getHours();
    const active = notifications.filter(notification => {
      const notificationHour = parseInt(notification.time.split(':')[0]);
      return notification.enabled && Math.abs(currentHour - notificationHour) <= 1;
    });
    setActiveNotifications(active);
  }, [notifications]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const dismissNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
    
    toast({
      title: "Notification dismissed",
      description: "This reminder has been marked as completed.",
    });
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
      case "medication": return Pill;
      case "checkup": return Heart;
      case "activity": return Activity;
      case "diet": return Calendar;
      case "monitoring": return Heart;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Notifications */}
      {activeNotifications.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Bell className="h-5 w-5 animate-pulse" />
              Active Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeNotifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div key={notification.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`bg-${getPriorityColor(notification.priority)}/10 text-${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </Badge>
                      <Button size="sm" onClick={() => dismissNotification(notification.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map(notification => {
              const TypeIcon = getTypeIcon(notification.type);
              
              return (
                <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {notification.frequency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                        <span>•</span>
                        <span>{notification.condition}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={`bg-${getPriorityColor(notification.priority)}/10 text-${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </Badge>
                    <Switch 
                      checked={notification.enabled}
                      onCheckedChange={() => toggleNotification(notification.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{notifications.filter(n => n.enabled).length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{notifications.filter(n => n.priority === "high").length}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-wellness">{notifications.filter(n => n.type === "medication").length}</div>
              <div className="text-sm text-muted-foreground">Medications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-energy">{notifications.filter(n => n.frequency === "daily").length}</div>
              <div className="text-sm text-muted-foreground">Daily Reminders</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
