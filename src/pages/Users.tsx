import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

const employees = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Present",
    checkIn: new Date(Date.now() - 3 * 60 * 60 * 1000),
    location: "Office Main",
    avatar: "/placeholder.svg",
    initials: "JD",
  },
  {
    id: "EMP002",
    name: "Sarah Smith", 
    email: "sarah.smith@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Present",
    checkIn: new Date(Date.now() - 4 * 60 * 60 * 1000),
    location: "Office Branch",
    avatar: "/placeholder.svg",
    initials: "SS",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com", 
    department: "Sales",
    position: "Sales Representative",
    status: "Late",
    checkIn: new Date(Date.now() - 2 * 60 * 60 * 1000 - 30 * 60 * 1000),
    location: "Remote",
    avatar: "/placeholder.svg",
    initials: "MJ",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "HR",
    position: "HR Specialist", 
    status: "Absent",
    checkIn: null,
    location: "-",
    avatar: "/placeholder.svg",
    initials: "ED",
  },
];

const Employees = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present": return "bg-green-100 text-green-800 border-green-200";
      case "late": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "absent": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Employee Management</h1>
              <p className="text-muted-foreground">Manage employee profiles and attendance</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Employees ({filteredEmployees.length})</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{employee.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {employee.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.position} • {employee.department}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        {employee.checkIn && (
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" />
                            In: {format(employee.checkIn, "HH:mm")}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {employee.location}
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline"
                        className={getStatusColor(employee.status)}
                      >
                        {employee.status}
                      </Badge>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Employees;