
import { useState } from "react";
import Navigation from "@/components/Navigation";
import HealthDashboard from "@/components/HealthDashboard";
import CheckInSystem from "@/components/CheckInSystem";
import Analytics from "@/components/Analytics";
import HealthBot from "@/components/HealthBot";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <HealthDashboard />;
      case "checkins":
        return <CheckInSystem />;
      case "analytics":
        return <Analytics />;
      case "healthbot":
        return <HealthBot />;
      case "team":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Team Health Dashboard</h2>
            <p className="text-muted-foreground">Coming soon - Monitor your team's overall wellness metrics</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Customize your wellness preferences and notifications</p>
          </div>
        );
      default:
        return <HealthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <div className="flex-shrink-0">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
