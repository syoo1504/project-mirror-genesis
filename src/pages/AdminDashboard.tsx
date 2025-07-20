import { useState, useEffect, useRef } from "react";
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
import { supabase } from "@/integrations/supabase/client";
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

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load real attendance data from localStorage with real-time updates
  useEffect(() => {
    const loadAttendanceData = () => {
      const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      
      // Group scans by employee and date to create attendance records
      const attendanceMap = new Map();
      
      scanHistory.forEach((scan: any) => {
        const date = new Date(scan.timestamp).toLocaleDateString();
        const employeeKey = `${scan.employeeId}-${date}`;
        
        if (!attendanceMap.has(employeeKey)) {
          // Find employee details from the employees database
          const employee = employees.find(emp => emp.id === scan.employeeId);
          
          // Use the employee's full name from the database, fallback to scan data
          const employeeName = employee?.name || scan.employeeName || 'Unknown Employee';
          
          attendanceMap.set(employeeKey, {
            employee: `${employeeName} (${scan.employeeId})`,
            date: date,
            checkIn: "",
            checkOut: "",
            lateDuration: "On time",
            status: "success"
          });
        }
        
        const record = attendanceMap.get(employeeKey);
        // Format time as HH:MM (24-hour format) matching the first image
        const time = new Date(scan.timestamp).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        if (scan.type === "check-in") {
          record.checkIn = time;
          // Check if late (after 8:30 AM) - official working hours 8:30 AM to 5:30 PM
          const checkInTime = new Date(scan.timestamp);
          if (checkInTime.getHours() > 8 || (checkInTime.getHours() === 8 && checkInTime.getMinutes() > 30)) {
            const lateMinutes = ((checkInTime.getHours() - 8) * 60 + checkInTime.getMinutes()) - 30;
            const lateHours = Math.floor(lateMinutes / 60);
            const lateRemainingMinutes = lateMinutes % 60;
            record.lateDuration = `${lateHours}h ${lateRemainingMinutes}m`;
          }
        } else if (scan.type === "check-out") {
          record.checkOut = time;
        }
      });
      
      const records = Array.from(attendanceMap.values()).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setAttendanceRecords(records);
    };

    loadAttendanceData();
    
    // Set up interval to refresh data every 3 seconds for live updates
    const interval = setInterval(loadAttendanceData, 3000);
    
    return () => clearInterval(interval);
  }, [employees]);

  // Force re-render of department data when attendance records change
  useEffect(() => {
    // This ensures department cards update when attendance changes
    // The getDepartmentData function will be called again
  }, [attendanceRecords, employees]);
  
  const [attendanceRecordsStatic] = useState<AttendanceRecord[]>([
    { employee: "Arissa Irda Binti Rais (1106)", date: "7/20/2025", checkIn: "00:35", checkOut: "00:35", lateDuration: "On time", status: "success" },
    { employee: "Muhammad Ilyashah Bin Norazman (0107)", date: "7/19/2025", checkIn: "00:34", checkOut: "00:34", lateDuration: "On time", status: "success" },
    { employee: "Muhammad Ilyashah Bin Norazman (0107)", date: "7/12/2025", checkIn: "18:59", checkOut: "18:59", lateDuration: "9h 59m", status: "success" },
  ]);

  // Calculate real-time department data
  const getDepartmentData = () => {
    const departmentStats = new Map();
    
    // Initialize with all departments from employees
    employees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      if (!departmentStats.has(dept)) {
        departmentStats.set(dept, {
          name: dept,
          totalEmployees: 0,
          activeEmployees: 0,
          totalAttendance: 0,
          lateRecords: 0,
          attendanceRate: 0,
          punctualityRate: 0,
          color: getRandomColor(dept)
        });
      }
    });

    // Count employees by department
    employees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      const deptData = departmentStats.get(dept);
      deptData.totalEmployees++;
      if (emp.status === 'Active') {
        deptData.activeEmployees++;
      }
    });

    // Calculate attendance stats by department
    attendanceRecords.forEach(record => {
      // Extract employee ID from record
      const employeeMatch = record.employee.match(/\(([^)]+)\)$/);
      const employeeId = employeeMatch ? employeeMatch[1] : '';
      
      // Find employee to get department
      const employee = employees.find(emp => emp.id === employeeId);
      const dept = employee?.department || 'Unassigned';
      
      if (departmentStats.has(dept)) {
        const deptData = departmentStats.get(dept);
        
        // Count total attendance records
        if (record.checkIn && record.checkIn !== '--:--') {
          deptData.totalAttendance++;
        }
        
        // Count late records
        if (record.lateDuration !== 'On time') {
          deptData.lateRecords++;
        }
      }
    });

    // Calculate rates
    departmentStats.forEach((deptData, dept) => {
      // Attendance rate = (total attendance / total possible days) * 100
      // For now, using active employees as baseline
      const possibleDays = deptData.activeEmployees * 30; // Assuming 30 day period
      deptData.attendanceRate = possibleDays > 0 
        ? Math.round((deptData.totalAttendance / possibleDays) * 100) 
        : 0;
      
      // Punctuality rate = ((total attendance - late records) / total attendance) * 100
      deptData.punctualityRate = deptData.totalAttendance > 0 
        ? Math.round(((deptData.totalAttendance - deptData.lateRecords) / deptData.totalAttendance) * 100)
        : 100;
    });

    return Array.from(departmentStats.values());
  };

  const getRandomColor = (dept: string) => {
    const colors = ["#10B981", "#3B82F6", "#8B5CF6", "#06B6D4", "#F97316", "#EAB308", "#EF4444"];
    const index = dept.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const departmentData = getDepartmentData();
  
  // For pie chart, calculate percentages
  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.totalEmployees, 0);
  const pieChartData = departmentData.map(dept => ({
    name: dept.name,
    value: totalEmployees > 0 ? Math.round((dept.totalEmployees / totalEmployees) * 100) : 0,
    color: dept.color
  }));

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  // Calculate real-time stats
  const todayDate = new Date().toLocaleDateString();
  const todayRecords = attendanceRecords.filter(record => record.date === todayDate);
  const checkedInToday = todayRecords.filter(record => record.checkIn && record.checkIn !== "").length;
  const checkedOutToday = todayRecords.filter(record => record.checkOut && record.checkOut !== "").length;
  const lateToday = todayRecords.filter(record => record.lateDuration !== "On time").length;

  // Employee management functions with Supabase sync
  const handleAddEmployee = async () => {
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

    // Add to local state
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    
    // Sync to Supabase immediately
    try {
      const { error } = await supabase
        .from('employees')
        .insert({
          employee_id: employee.id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          position: employee.designation,
          designation: employee.designation,
          is_active: employee.status === 'Active'
        });
      
      if (error) {
        console.error('Error syncing employee to Supabase:', error);
      }
    } catch (error) {
      console.error('Error syncing employee:', error);
    }

    // Update localStorage for login compatibility
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

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
      description: `${employee.name} has been added successfully and synced to database`,
    });
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    // Update local state
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    );
    setEmployees(updatedEmployees);
    
    // Sync to Supabase immediately
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: selectedEmployee.name,
          email: selectedEmployee.email,
          phone: selectedEmployee.phone,
          department: selectedEmployee.department,
          position: selectedEmployee.designation,
          designation: selectedEmployee.designation,
          is_active: selectedEmployee.status === 'Active'
        })
        .eq('employee_id', selectedEmployee.id);
      
      if (error) {
        console.error('Error syncing employee update to Supabase:', error);
      }
    } catch (error) {
      console.error('Error syncing employee update:', error);
    }

    // Update localStorage for login compatibility
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setIsEditDialogOpen(false);
    setSelectedEmployeeForEdit(null);
    
    toast({
      title: "Employee Updated",
      description: `${selectedEmployee.name} has been updated successfully and synced to database`,
    });
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployeeForDelete) return;

    // Update local state
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployeeForDelete.id);
    setEmployees(updatedEmployees);
    
    // Sync to Supabase immediately
    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: false })
        .eq('employee_id', selectedEmployeeForDelete.id);
      
      if (error) {
        console.error('Error syncing employee deletion to Supabase:', error);
      }
    } catch (error) {
      console.error('Error syncing employee deletion:', error);
    }

    // Update localStorage for login compatibility
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setIsDeleteDialogOpen(false);
    setSelectedEmployeeForDelete(null);
    
    toast({
      title: "Employee Deleted",
      description: `${selectedEmployeeForDelete.name} has been deleted permanently and synced to database`,
      variant: "destructive"
    });
  };

  const handleMigrateData = async () => {
    try {
      toast({
        title: "Migration Started",
        description: "Uploading local data to Supabase database...",
      });

      // First ensure admin profile exists for the current user
      try {
        const { error: adminError } = await supabase.rpc('ensure_admin_exists');
        if (adminError) {
          console.error('Error ensuring admin exists:', adminError);
        }
      } catch (error) {
        console.error('Error calling ensure_admin_exists:', error);
      }

      let migratedEmployees = 0;
      let migratedAttendance = 0;

      // 1. Migrate employees to Supabase with all required fields
      for (const employee of employees) {
        const { error: empError } = await supabase
          .from('employees')
          .upsert({
            employee_id: employee.id,
            name: employee.name,
            email: employee.email || '',
            phone: employee.phone || '',
            department: employee.department || '',
            designation: employee.designation || '',
            position: employee.designation || '',
            is_active: employee.status === 'Active'
          }, {
            onConflict: 'employee_id'
          });

        if (empError) {
          console.error('Error migrating employee:', empError);
        } else {
          migratedEmployees++;
        }
      }

      // 2. Migrate attendance records from localStorage scan history
      const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      for (const scan of scanHistory) {
        const scanDate = new Date(scan.timestamp);
        const formattedDate = scanDate.toISOString().split('T')[0];
        
        // Group scans by employee and date to handle check-in/check-out
        const existingRecord = await supabase
          .from('attendance_records')
          .select('*')
          .eq('employee_id', scan.employeeId)
          .eq('attendance_date', formattedDate)
          .maybeSingle();

        if (existingRecord.error && existingRecord.error.code !== 'PGRST116') {
          console.error('Error checking existing record:', existingRecord.error);
          continue;
        }

        const recordData: any = {
          employee_id: scan.employeeId,
          attendance_date: formattedDate,
          status: 'present',
          location: scan.location || 'Main Office',
          notes: scan.isLate ? 'Late arrival' : null
        };

        if (scan.type === 'check-in') {
          recordData.check_in_time = scan.timestamp;
          if (existingRecord.data?.check_out_time) {
            recordData.check_out_time = existingRecord.data.check_out_time;
          }
        } else if (scan.type === 'check-out') {
          recordData.check_out_time = scan.timestamp;
          if (existingRecord.data?.check_in_time) {
            recordData.check_in_time = existingRecord.data.check_in_time;
          }
        }

        const { error: attError } = await supabase
          .from('attendance_records')
          .upsert(recordData, {
            onConflict: 'employee_id,attendance_date'
          });

        if (attError) {
          console.error('Error migrating attendance record:', attError);
        } else {
          migratedAttendance++;
        }
      }

      // 3. Also migrate admin dashboard attendance records if any
      for (const record of attendanceRecords) {
        // Extract employee ID from the record (format: "Name (ID)")
        const employeeMatch = record.employee.match(/\(([^)]+)\)$/);
        const employeeId = employeeMatch ? employeeMatch[1] : record.employee;

        // Convert date format to YYYY-MM-DD
        const dateParts = record.date.split('/');
        const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;

        const { error: attError } = await supabase
          .from('attendance_records')
          .upsert({
            employee_id: employeeId,
            attendance_date: formattedDate,
            check_in_time: record.checkIn && record.checkIn !== '--:--' ? `${formattedDate} ${record.checkIn}:00` : null,
            check_out_time: record.checkOut && record.checkOut !== '--:--' ? `${formattedDate} ${record.checkOut}:00` : null,
            status: 'present',
            notes: record.lateDuration !== 'On time' ? `Late: ${record.lateDuration}` : null
          }, {
            onConflict: 'employee_id,attendance_date'
          });

        if (attError) {
          console.error('Error migrating admin attendance record:', attError);
        } else {
          migratedAttendance++;
        }
      }

      toast({
        title: "Migration Completed",
        description: `Successfully migrated ${migratedEmployees} employees and ${migratedAttendance} attendance records to Supabase.`,
      });

    } catch (error: any) {
      toast({
        title: "Migration Failed",
        description: error.message || "An error occurred during migration",
        variant: "destructive"
      });
    }
  };

  const handleCreateBackup = () => {
    try {
      const backupData = {
        employees,
        attendanceRecords,
        timestamp: new Date().toISOString(),
        version: "1.0"
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Created",
        description: "System backup has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Backup Failed",
        description: error.message || "An error occurred during backup",
        variant: "destructive"
      });
    }
  };

  // Export functions for attendance reports
  const handleExportSummaryReport = () => {
    const csvHeaders = "Employee,Total Days,Present,Absent,Late,Attendance Rate\n";
    
    // Group attendance by employee
    const employeeStats = employees.map(emp => {
      const empRecords = attendanceRecords.filter(record => 
        record.employee.includes(emp.name) || record.employee.includes(emp.id)
      );
      
      const totalDays = empRecords.length;
      const present = empRecords.filter(r => r.checkIn && r.checkIn !== "--:--").length;
      const absent = totalDays - present;
      const late = empRecords.filter(r => r.lateDuration !== "On time").length;
      const attendanceRate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;
      
      return `"${emp.name}",${totalDays},${present},${absent},${late},${attendanceRate}%`;
    });
    
    const csvContent = csvHeaders + employeeStats.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-summary-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Summary report has been exported successfully",
    });
  };

  const handleExportDetailedReport = () => {
    // CSV format that exactly matches Supabase attendance_records table structure
    const csvHeaders = "employee_id,attendance_date,check_in_time,check_out_time,status,location,notes\n";
    
    const csvData = attendanceRecords.map(record => {
      // Extract employee ID from the record (format: "Name (ID)")
      const employeeMatch = record.employee.match(/\(([^)]+)\)$/);
      const employeeId = employeeMatch ? employeeMatch[1] : 'EMP001';
      
      // Convert date to YYYY-MM-DD format
      const dateParts = record.date.split('/');
      const attendanceDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
      
      // Format times as full timestamps if they exist
      const checkInTime = (record.checkIn && record.checkIn !== "--:--") 
        ? `${attendanceDate} ${record.checkIn}:00` 
        : '';
      const checkOutTime = (record.checkOut && record.checkOut !== "--:--") 
        ? `${attendanceDate} ${record.checkOut}:00` 
        : '';
      
      const status = (record.checkIn && record.checkIn !== "--:--") ? "present" : "absent";
      const location = "Main Office";
      const notes = record.lateDuration !== "On time" ? `Late: ${record.lateDuration}` : "";
      
      return `"${employeeId}","${attendanceDate}","${checkInTime}","${checkOutTime}","${status}","${location}","${notes}"`;
    });
    
    const csvContent = csvHeaders + csvData.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase-attendance-records-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded", 
      description: "Supabase-compatible CSV report exported successfully",
    });
  };


  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please choose a backup file first",
        variant: "destructive"
      });
      return;
    }

    try {
      const fileContent = await selectedFile.text();
      const backupData = JSON.parse(fileContent);

      // Validate backup structure
      if (!backupData.employees || !backupData.attendanceRecords) {
        throw new Error("Invalid backup file format");
      }

      // Restore data
      setEmployees(backupData.employees);
      setAttendanceRecords(backupData.attendanceRecords);

      // Update localStorage as well
      localStorage.setItem('employees', JSON.stringify(backupData.employees));
      localStorage.setItem('attendanceRecords', JSON.stringify(backupData.attendanceRecords));

      toast({
        title: "Restore Successful",
        description: `Restored ${backupData.employees.length} employees and ${backupData.attendanceRecords.length} attendance records`,
      });

      // Clear file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "Failed to restore from backup file. Please check the file format.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-jks-subtle">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-jks-medium">
              <img src="/src/assets/jks-logo.png" alt="JKS Logo" className="w-10 h-10 object-contain" />
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
              <div className="text-3xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In Today</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{checkedInToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked Out Today</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{checkedOutToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{lateToday}</div>
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
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      setAttendanceRecords([]);
                      localStorage.removeItem('attendanceRecords');
                      toast({
                        title: "Data Cleared",
                        description: "All attendance records have been cleared",
                        variant: "destructive"
                      });
                    }}
                  >
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
                             <div className="flex items-center gap-2">
                               <span className="font-mono">
                                 {record.checkIn || "--:--"}
                               </span>
                               {record.lateDuration !== "On time" && record.checkIn && (
                                 <Badge variant="destructive" className="text-xs">
                                   LATE
                                 </Badge>
                               )}
                             </div>
                           </td>
                           <td className="py-3">
                             <span className="font-mono">
                               {record.checkOut || "--:--"}
                             </span>
                           </td>
                           <td className="py-3">
                             <Badge variant={record.lateDuration === "On time" ? "secondary" : "destructive"}>
                               {record.lateDuration}
                             </Badge>
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
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {pieChartData.map((entry, index) => (
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
                      <BarChart data={departmentData.map(dept => ({
                        department: dept.name,
                        checkIns: dept.totalAttendance,
                        checkOuts: dept.totalAttendance - dept.lateRecords
                      }))}>
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

              {/* Live Department Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentData.map((dept) => (
                  <Card key={dept.name} className="bg-white border hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Employees:</span>
                        <span className="text-lg font-bold text-gray-800">{dept.totalEmployees}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold bg-gray-800 text-white px-2 py-1 rounded-full">
                            {dept.activeEmployees}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Attendance:</span>
                        <span className="text-lg font-bold text-gray-800">{dept.totalAttendance}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Late Records:</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            dept.lateRecords === 0 
                              ? 'bg-gray-800 text-white' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {dept.lateRecords}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Attendance Rate:</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            dept.attendanceRate === 0 
                              ? 'bg-red-100 text-red-700' 
                              : dept.attendanceRate < 10 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-gray-800 text-white'
                          }`}>
                            {dept.attendanceRate}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Punctuality Rate:</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            dept.punctualityRate === 100 
                              ? 'bg-gray-800 text-white' 
                              : dept.punctualityRate >= 75 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {dept.punctualityRate}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  <Button 
                    onClick={handleExportSummaryReport}
                    className="bg-gray-800 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Summary Report
                  </Button>
                  <Button 
                    onClick={handleExportDetailedReport}
                    variant="outline"
                  >
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
                    <Button onClick={handleCreateBackup} className="bg-gray-800 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Restore from Backup</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload and restore data from a previous backup file</p>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                      />
                      <Button onClick={handleChooseFile} variant="outline">
                        Choose File
                      </Button>
                      <span className="text-sm text-gray-500">
                        {selectedFile ? selectedFile.name : "No file chosen"}
                      </span>
                      <Button onClick={handleRestoreBackup} variant="outline">
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
                    <Button onClick={handleMigrateData} className="bg-gray-800 text-white">
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
