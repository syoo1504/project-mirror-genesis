import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TasksList } from "@/components/dashboard/TasksList";
import { Users, TrendingUp, FileText, Calendar } from "lucide-react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value="2,543"
              change="+12%"
              icon={Users}
              trend="up"
            />
            <StatsCard
              title="Revenue"
              value="$45,231"
              change="+8%"
              icon={TrendingUp}
              trend="up"
            />
            <StatsCard
              title="Documents"
              value="89"
              change="-2%"
              icon={FileText}
              trend="down"
            />
            <StatsCard
              title="Events"
              value="24"
              change="+5%"
              icon={Calendar}
              trend="up"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <TasksList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
