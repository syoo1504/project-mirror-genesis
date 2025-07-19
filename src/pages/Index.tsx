import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { AttendanceList } from "@/components/attendance/AttendanceList";
import { QRCodeGenerator } from "@/components/attendance/QRCodeGenerator";
import { QuickCheckIn } from "@/components/attendance/QuickCheckIn";
import { Users, Clock, CheckCircle, AlertCircle, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for demonstration
const mockAttendanceRecords = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "John Doe",
    checkIn: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    checkOut: undefined,
    location: "Office Main",
    status: "present" as const,
    workingHours: 3.0
  },
  {
    id: "2", 
    employeeId: "EMP002",
    employeeName: "Sarah Smith",
    checkIn: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    checkOut: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    location: "Office Branch",
    status: "present" as const,
    workingHours: 3.0
  },
  {
    id: "3",
    employeeId: "EMP003", 
    employeeName: "Mike Johnson",
    checkIn: new Date(Date.now() - 2 * 60 * 60 * 1000 - 30 * 60 * 1000), // 2.5 hours ago
    checkOut: undefined,
    location: "Remote",
    status: "late" as const,
    workingHours: 2.5
  }
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCheckIn = (data: { employeeId: string; location: string }) => {
    console.log("Check in:", data);
    // Implement check-in logic here
  };

  const handleCheckOut = (data: { employeeId: string; location: string }) => {
    console.log("Check out:", data);
    // Implement check-out logic here
  };

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
            <h1 className="text-3xl font-bold mb-2">Attendance Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor employee attendance with QR code technology
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AttendanceStats
              title="Total Employees"
              value="48"
              subtitle="Active today"
              icon={Users}
              trend={{ value: "+3 from yesterday", isPositive: true }}
            />
            <AttendanceStats
              title="Present Today"
              value="42"
              subtitle="87.5% attendance"
              icon={CheckCircle}
              trend={{ value: "+5% from yesterday", isPositive: true }}
            />
            <AttendanceStats
              title="Late Arrivals"
              value="3"
              subtitle="6.3% of present"
              icon={AlertCircle}
              trend={{ value: "-2 from yesterday", isPositive: true }}
            />
            <AttendanceStats
              title="Avg Working Hours"
              value="7.8h"
              subtitle="Per employee"
              icon={Clock}
              trend={{ value: "+0.3h from yesterday", isPositive: true }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance List - Takes 2/3 width */}
            <div className="lg:col-span-2">
              <AttendanceList records={mockAttendanceRecords} />
            </div>

            {/* Side Panel - Takes 1/3 width */}
            <div className="space-y-6">
              {/* Quick Check In */}
              <QuickCheckIn onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
              
              {/* QR Code Generator */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Location QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QRCodeGenerator 
                    employeeId="LOCATION" 
                    locationId="OFFICE_MAIN" 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
