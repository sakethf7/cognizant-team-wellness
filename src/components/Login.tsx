import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bot, Lock } from "lucide-react";

export type UserRole = "employee" | "manager" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

const mockUsers: User[] = [
  { id: "1", username: "employee1", role: "employee", name: "John Employee" },
  { id: "2", username: "manager1", role: "manager", name: "Sarah Manager" },
  { id: "3", username: "admin1", role: "admin", name: "Alex Admin" },
];

const mockPassword = "password";

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username);
      
      if (user && password === mockPassword) {
        onLogin(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">HealthBot Login</CardTitle>
          <p className="text-muted-foreground">Sign in to your wellness dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-hero text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
              <Lock className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Demo Credentials:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Employee:</strong> employee1 / password</div>
              <div><strong>Manager:</strong> manager1 / password</div>
              <div><strong>Admin:</strong> admin1 / password</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}