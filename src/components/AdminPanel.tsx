import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Bell, UtensilsCrossed, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: "breakfast" | "lunch" | "dinner" | "snacks";
  price: number;
  calories: number;
  allergens: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "health" | "general" | "urgent";
  timestamp: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "general" as "health" | "general" | "urgent"
  });
  
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    category: "lunch" as "breakfast" | "lunch" | "dinner" | "snacks",
    price: 0,
    calories: 0,
    allergens: ""
  });

  const [cafeteriaMenu, setCafeteriaMenu] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Grilled Chicken Salad",
      category: "lunch",
      price: 12.99,
      calories: 350,
      allergens: ["none"]
    },
    {
      id: "2", 
      name: "Vegetarian Wrap",
      category: "lunch",
      price: 9.99,
      calories: 420,
      allergens: ["gluten", "dairy"]
    }
  ]);

  const [systemNotifications, setSystemNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Wellness Week",
      message: "Join our wellness activities this week!",
      type: "general",
      timestamp: new Date().toISOString()
    }
  ]);

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "Please fill in all notification fields",
        variant: "destructive"
      });
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      timestamp: new Date().toISOString()
    };

    setSystemNotifications(prev => [notification, ...prev]);
    setNewNotification({ title: "", message: "", type: "general" });
    
    toast({
      title: "Notification Sent",
      description: "System notification has been sent to all users",
    });
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || newMenuItem.price <= 0) {
      toast({
        title: "Error", 
        description: "Please fill in all menu item fields",
        variant: "destructive"
      });
      return;
    }

    const menuItem: MenuItem = {
      id: Date.now().toString(),
      name: newMenuItem.name,
      category: newMenuItem.category,
      price: newMenuItem.price,
      calories: newMenuItem.calories,
      allergens: newMenuItem.allergens.split(",").map(a => a.trim()).filter(Boolean)
    };

    setCafeteriaMenu(prev => [...prev, menuItem]);
    setNewMenuItem({ name: "", category: "lunch", price: 0, calories: 0, allergens: "" });
    
    toast({
      title: "Menu Updated",
      description: "New menu item has been added successfully",
    });
  };

  const removeMenuItem = (id: string) => {
    setCafeteriaMenu(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Menu item has been removed",
    });
  };

  const removeNotification = (id: string) => {
    setSystemNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification Removed",
      description: "System notification has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
          <UtensilsCrossed className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage notifications and cafeteria menu</p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">System Notifications</TabsTrigger>
          <TabsTrigger value="menu">Cafeteria Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Send New Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notif-title">Title</Label>
                <Input
                  id="notif-title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notif-message">Message</Label>
                <Textarea
                  id="notif-message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notif-type">Type</Label>
                <select
                  id="notif-type"
                  value={newNotification.type}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="general">General</option>
                  <option value="health">Health</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <Button onClick={handleSendNotification} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemNotifications.map((notif) => (
                  <div key={notif.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{notif.title}</h4>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        notif.type === "urgent" ? "bg-destructive/10 text-destructive" :
                        notif.type === "health" ? "bg-wellness/10 text-wellness" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {notif.type}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notif.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                Add New Menu Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Menu item name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <select
                    id="item-category"
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-price">Price ($)</Label>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    value={newMenuItem.price || ""}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-calories">Calories</Label>
                  <Input
                    id="item-calories"
                    type="number"
                    value={newMenuItem.calories || ""}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-allergens">Allergens (comma-separated)</Label>
                <Input
                  id="item-allergens"
                  value={newMenuItem.allergens}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, allergens: e.target.value }))}
                  placeholder="gluten, dairy, nuts"
                />
              </div>

              <Button onClick={handleAddMenuItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {cafeteriaMenu.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.category} • ${item.price} • {item.calories} cal
                      </p>
                      {item.allergens.length > 0 && (
                        <p className="text-xs text-orange-600">
                          Allergens: {item.allergens.join(", ")}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMenuItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}