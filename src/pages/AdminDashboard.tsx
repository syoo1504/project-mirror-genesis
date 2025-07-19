import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  LogOut, 
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DangerZone } from "@/components/DangerZone";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string;
}

interface AttendanceRecord {
  employee: string;
  date: string;
  checkIn: string;
  checkOut: string;
  lateDuration: string;
  status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("currentAdmin") || "{}");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("All Employees");
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1106", name: "Arissa Irda Binti Rais", email: "arissa@jks.com.my", phone: "0123456789", department: "HR", designation: "HR Executive", status: "Active" },
    { id: "0123", name: "Alex", email: "alex@jks.com", phone: "0123456788", department: "HR", designation: "HR Manager", status: "Active" },
    { id: "0107", name: "Muhammad Ilyashah Bin Norazman", email: "ilyashah@jks.com", phone: "0198724315", department: "IT", designation: "IT Officer", status: "Active" },
  ]);

  // Employee management state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployeeForEdit] = useState<Employee | null>(null);
  const [selectedEmployeeForDelete, setSelectedEmployeeForDelete] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    status: "Active"
  });
  
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { employee: "Arissa Irda Binti Rais (1106)", date: "7/20/2025", checkIn: "00:35", checkOut: "00:35", lateDuration: "On time", status: "success" },
    { employee: "Muhammad Ilyashah Bin Norazman (0107)", date: "7/19/2025", checkIn: "00:34", checkOut: "00:34", lateDuration: "On time", status: "success" },
    { employee: "Muhammad Ilyashah Bin Norazman (0107)", date: "7/12/2025", checkIn: "18:59", checkOut: "18:59", lateDuration: "9h 59m", status: "success" },
  ]);

  const departmentData = [
    { name: "Desktop Engineer", value: 25, color: "#10B981" },
    { name: "Data Analyst", value: 13, color: "#3B82F6" },
    { name: "Assistant Manager", value: 13, color: "#8B5CF6" },
    { name: "Purchasing Manager", value: 13, color: "#06B6D4" },
    { name: "HR Executive", value: 13, color: "#8B5CF6" },
    { name: "Financial Analyst", value: 13, color: "#F97316" },
    { name: "HR Manager", value: 13, color: "#EAB308" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("currentAdmin");
    navigate("/admin-login");
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendanceRecords = selectedEmployeeFilter === "All Employees" 
    ? attendanceRecords 
    : attendanceRecords.filter(record => 
        record.employee.includes(selectedEmployeeFilter)
      );

  // Employee management functions
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const employee: Employee = {
      ...newEmployee,
      id: newEmployee.id
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      id: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      status: "Active"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Employee Added",
      description: `${employee.name} has been added successfully`,
    });
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;

    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    ));
    setIsEditDialogOpen(false);
    setSelectedEmployeeForEdit(null);
    
    toast({
      title: "Employee Updated",
      description: `${selectedEmployee.name} has been updated successfully`,
    });
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployeeForDelete) return;

    setEmployees(employees.filter(emp => emp.id !== selectedEmployeeForDelete.id));
    setIsDeleteDialogOpen(false);
    setSelectedEmployeeForDelete(null);
    
    toast({
      title: "Employee Deleted",
      description: `${selectedEmployeeForDelete.name} has been deleted permanently`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-jks-subtle">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-jks-medium">
              <img src="/lovable-uploads/63555184-67ab-44f8-8ab2-18d6ed91f94e.png" alt="JKS Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <Button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In Today</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked Out Today</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">1</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white">
            <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="analytics">Department Analytics</TabsTrigger>
            <TabsTrigger value="reports">Export Reports</TabsTrigger>
            <TabsTrigger value="backup">Backup & Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Attendance Records</CardTitle>
                    <p className="text-gray-600">View and filter employee attendance records with late duration tracking</p>
                  </div>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Clear All Data
                  </Button>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Filter by Employee</label>
                    <Select value={selectedEmployeeFilter} onValueChange={setSelectedEmployeeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Employees">All Employees</SelectItem>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Filter by Date</label>
                    <Input type="date" placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-gray-600">Employee</th>
                        <th className="text-left py-3 text-gray-600">Date</th>
                        <th className="text-left py-3 text-gray-600">Check In</th>
                        <th className="text-left py-3 text-gray-600">Check Out</th>
                        <th className="text-left py-3 text-gray-600">Late Duration</th>
                        <th className="text-left py-3 text-gray-600">Status</th>
                      </tr>
                    </thead>
                     <tbody>
                      {filteredAttendanceRecords.map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">{record.employee}</td>
                          <td className="py-3">{record.date}</td>
                          <td className="py-3">
                            {record.lateDuration !== "On time" && record.checkIn.includes("18:") ? (
                              <Badge variant="destructive">Late</Badge>
                            ) : (
                              record.checkIn
                            )}
                          </td>
                          <td className="py-3">{record.checkOut}</td>
                          <td className="py-3">
                            {record.lateDuration === "On time" ? (
                              <span className="text-gray-600">On time</span>
                            ) : (
                              <Badge variant="destructive">{record.lateDuration}</Badge>
                            )}
                          </td>
                          <td className="py-3">
                            <Badge className="bg-gray-800 text-white">success</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Employee Management</CardTitle>
                    <p className="text-gray-600">Manage employee records - add, edit, and delete employees</p>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gray-800 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>
                          Enter the employee details below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="id" className="text-right">ID</Label>
                          <Input
                            id="id"
                            value={newEmployee.id}
                            onChange={(e) => setNewEmployee({...newEmployee, id: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input
                            id="name"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">Email</Label>
                          <Input
                            id="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">Phone</Label>
                          <Input
                            id="phone"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="department" className="text-right">Department</Label>
                          <Input
                            id="department"
                            value={newEmployee.department}
                            onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="designation" className="text-right">Designation</Label>
                          <Input
                            id="designation"
                            value={newEmployee.designation}
                            onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">Status</Label>
                          <Select value={newEmployee.status} onValueChange={(value) => setNewEmployee({...newEmployee, status: value})}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddEmployee} className="bg-gray-800 text-white">
                          Add Employee
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees by name, ID, email, department, or designation..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-gray-600">Employee ID</th>
                        <th className="text-left py-3 text-gray-600">Name</th>
                        <th className="text-left py-3 text-gray-600">Email</th>
                        <th className="text-left py-3 text-gray-600">Phone</th>
                        <th className="text-left py-3 text-gray-600">Department</th>
                        <th className="text-left py-3 text-gray-600">Designation</th>
                        <th className="text-left py-3 text-gray-600">Status</th>
                        <th className="text-left py-3 text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b">
                          <td className="py-3">{employee.id}</td>
                          <td className="py-3">{employee.name}</td>
                          <td className="py-3">{employee.email}</td>
                          <td className="py-3">{employee.phone}</td>
                          <td className="py-3">{employee.department}</td>
                          <td className="py-3">{employee.designation}</td>
                          <td className="py-3">
                            <Badge variant="secondary">{employee.status}</Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedEmployeeForEdit(employee)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Employee</DialogTitle>
                                    <DialogDescription>
                                      Update the employee details below.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedEmployee && (
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-id" className="text-right">ID</Label>
                                        <Input
                                          id="edit-id"
                                          value={selectedEmployee.id}
                                          onChange={(e) => setSelectedEmployeeForEdit({...selectedEmployee, id: e.target.value})}
                                          className="col-span-3"
                                          disabled
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-name" className="text-right">Name</Label>
                                        <Input
                                          id="edit-name"
                                          value={selectedEmployee.name}
                                          onChange={(e) => setSelectedEmployeeForEdit({...selectedEmployee, name: e.target.value})}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-email" className="text-right">Email</Label>
                                        <Input
                                          id="edit-email"
                                          value={selectedEmployee.email}
                                          onChange={(e) => setSelectedEmployeeForEdit({...selectedEmployee, email: e.target.value})}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                                        <Input
                                          id="edit-phone"
                                          value={selectedEmployee.phone}
                                          onChange={(e) => setSelectedEmployeeForEdit({...selectedEmployee, phone: e.target.value})}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-department" className="text-right">Department</Label>
                                        <Input
                                          id="edit-department"
                                          value={selectedEmployee.department}
                                          onChange={(e) => setSelectedEmployeeForEdit({...selectedEmployee, department: e.target.value})}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-designation" className="text-right">designation</Label>
                                        <Input
                                          id="edit-designation"
                                          value={selectedEmployee.designation}
                                          onChange={(e) => setSelectedEmployeeForEdit({...selectedEmployee, designation: e.target.value})}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-status" className="text-right">Status</Label>
                                        <Select value={selectedEmployee.status} onValueChange={(value) => setSelectedEmployeeForEdit({...selectedEmployee, status: value})}>
                                          <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button onClick={handleEditEmployee} className="bg-gray-800 text-white">
                                      Update Employee
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedEmployeeForDelete(employee)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the employee record for {selectedEmployeeForDelete?.name}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteEmployee} className="bg-red-600 hover:bg-red-700">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <p className="text-gray-600">Employee distribution across departments</p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <p className="text-gray-600">Attendance and punctuality rates by department</p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(() => {
                        const departmentStats = JSON.parse(localStorage.getItem("departmentStats") || "{}");
                        return Object.entries(departmentStats).map(([dept, stats]: [string, any]) => ({
                          department: dept,
                          checkIns: stats.checkIns || 0,
                          checkOuts: stats.checkOuts || 0
                        }));
                      })()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="checkIns" fill="#10B981" name="Check-ins" />
                        <Bar dataKey="checkOuts" fill="#3B82F6" name="Check-outs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  <CardTitle>Export Attendance Reports</CardTitle>
                </div>
                <p className="text-gray-600">Generate detailed attendance reports for employees</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Employee</label>
                    <Select defaultValue="All Employees">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Employees">All Employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <Select defaultValue="Summary Report">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Summary Report">Summary Report</SelectItem>
                        <SelectItem value="Detailed Report">Detailed Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" defaultValue="2025-06-30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" defaultValue="2025-07-19" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gray-800 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export Summary Report
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Detailed Report
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Report Preview</h3>
                  <p className="text-sm text-gray-600">Employee: All Employees</p>
                  <p className="text-sm text-gray-600">Date Range: 2025-06-30 to 2025-07-19</p>
                  <p className="text-sm text-gray-600">Records Found: 4</p>
                  <p className="text-sm text-gray-600">Report Type: Summary (Statistics)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <div className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <div className="w-6 h-6 bg-primary rounded"></div>
                    </div>
                    <div>
                      <CardTitle>Data Summary</CardTitle>
                      <p className="text-muted-foreground">Current system data overview</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                      <div className="text-3xl font-bold text-primary mb-2">8</div>
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">5</div>
                      <p className="text-sm text-muted-foreground">Attendance Records</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                      <div className="text-sm font-medium text-purple-600 mb-1">Last Updated</div>
                      <p className="text-sm text-muted-foreground">7/20/2025, 1:51:02 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <CardTitle>Backup & Restore</CardTitle>
                  </div>
                  <p className="text-gray-600">Create backups of your data or restore from previous backups</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Create Backup</h3>
                    <p className="text-sm text-gray-600 mb-4">Download a complete backup of all employee and attendance data</p>
                    <Button className="bg-gray-800 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Restore from Backup</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload and restore data from a previous backup file</p>
                    <div className="flex items-center gap-4">
                      <Button variant="outline">
                        Choose File
                      </Button>
                      <span className="text-sm text-gray-500">No file chosen</span>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-blue-600">Supabase Integration</CardTitle>
                  </div>
                  <p className="text-gray-600">Sync your local data with Supabase database for cloud storage and backup</p>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Migrate to Supabase</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload all local data to Supabase database</p>
                    <Button className="bg-gray-800 text-white">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Migrate Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <DangerZone />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
