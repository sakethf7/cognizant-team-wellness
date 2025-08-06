import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Bell, 
  BarChart3, 
  Settings, 
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "primary"
    },
    {
      id: "checkins",
      label: "Check-ins",
      icon: Bell,
      badge: "2",
      color: "wellness"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "calm"
    },
    {
      id: "team",
      label: "Team Health",
      icon: Users,
      color: "energy"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "secondary"
    }
  ];

  return (
    <Card className={`h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} relative`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                Health AI
              </h2>
              <p className="text-xs text-muted-foreground">Employee Wellness</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-10 ${
                    isActive 
                      ? `bg-${item.color}/10 text-${item.color} border border-${item.color}/20` 
                      : "hover:bg-accent"
                  } ${isCollapsed ? 'px-2' : 'px-3'}`}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className={`h-4 w-4 ${isActive ? `text-${item.color}` : ''}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`h-5 px-2 text-xs bg-${item.color}/20 text-${item.color} border-${item.color}/30`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-${item.color}/20 text-${item.color} border-${item.color}/30`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3 bg-gradient-wellness text-wellness-foreground">
            <div className="text-sm font-medium mb-1">💡 Health Tip</div>
            <p className="text-xs opacity-90">
              Take a 5-minute break every hour to boost productivity and reduce eye strain.
            </p>
          </Card>
        </div>
      )}
    </Card>
  );
}