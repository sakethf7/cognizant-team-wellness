
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings,
  Bot,
  Shield,
  LogOut
} from "lucide-react";
import { User } from "@/components/Login";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
}

const getNavigationItems = (userRole: string) => {
  const baseItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["employee", "manager", "admin"] },
    { id: "checkins", label: "Check-ins", icon: MessageSquare, roles: ["employee", "manager", "admin"] },
    { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["employee", "manager", "admin"] },
    { id: "healthbot", label: "AI Health Bot", icon: Bot, roles: ["employee", "manager", "admin"] },
    { id: "team", label: "Team", icon: Users, roles: ["manager", "admin"] },
    { id: "admin", label: "Admin Panel", icon: Shield, roles: ["admin"] },
    { id: "settings", label: "Settings", icon: Settings, roles: ["employee", "manager", "admin"] },
  ];
  
  return baseItems.filter(item => item.roles.includes(userRole));
};

export default function Navigation({ activeTab, onTabChange, user }: NavigationProps) {
  const { logout } = useAuth();
  const navigationItems = getNavigationItems(user.role);
  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">HealthBot</h1>
            <p className="text-sm text-muted-foreground">AI Wellness Assistant</p>
          </div>
        </div>

        <div className="mb-6 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-muted/50",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
