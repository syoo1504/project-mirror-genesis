import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  LogOut, 
  Settings, 
  FileText,
  Download,
  Shield
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("currentAdmin") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("currentAdmin");
    navigate("/admin-login");
  };

  const mockEmployees = [
    { id: "EMP001", name: "John Doe", department: "IT", status: "Present", lastScan: "09:15 AM" },
    { id: "EMP002", name: "Jane Smith", department: "HR", status: "Present", lastScan: "09:02 AM" },
    { id: "EMP003", name: "Mike Johnson", department: "Finance", status: "Late", lastScan: "09:45 AM" },
    { id: "EMP004", name: "Sarah Wilson", department: "Marketing", status: "Absent", lastScan: "N/A" },
  ];

  const stats = [
    { title: "Total Employees", value: "124", icon: Users, color: "bg-blue-500" },
    { title: "Present Today", value: "98", icon: UserCheck, color: "bg-green-500" },
    { title: "Late Arrivals", value: "8", icon: Clock, color: "bg-yellow-500" },
    { title: "Absent", value: "18", icon: AlertTriangle, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {admin.name || "Administrator"}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">As of today</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.id} • {employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Last Scan: {employee.lastScan}</p>
                        </div>
                        <Badge 
                          variant={
                            employee.status === "Present" ? "default" :
                            employee.status === "Late" ? "secondary" : "destructive"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Attendance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Real-time attendance monitoring</p>
                  <p className="text-sm text-gray-500">
                    Live tracking of employee check-ins and check-outs
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="h-6 w-6 mb-2" />
                      Daily Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="h-6 w-6 mb-2" />
                      Monthly Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Employee Summary
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Clock className="h-6 w-6 mb-2" />
                      Time Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">QR Code Security</h3>
                      <p className="text-sm text-gray-500">Manage QR code encryption and validation</p>
                    </div>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Backup & Sync</h3>
                      <p className="text-sm text-gray-500">Data backup and synchronization settings</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">User Management</h3>
                      <p className="text-sm text-gray-500">Add, edit, or remove employee accounts</p>
                    </div>
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;