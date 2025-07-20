import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Clock, MapPin, Download, TrendingUp, QrCode } from "lucide-react";

interface ScanRecord {
  timestamp: string;
  qrData: string;
  location: string;
  type: "check-in" | "check-out";
}

const EmployeeReport = () => {
  const navigate = useNavigate();
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const employee = JSON.parse(localStorage.getItem("currentEmployee") || "{}");
  
  // Enhanced employee data - get full name and department from admin records (synced with admin dashboard)
  const getEmployeeDetails = () => {
    const employees = [
      { id: "1106", name: "Arissa Irda Binti Rais", department: "HR" },
      { id: "0123", name: "Alex", department: "HR" }, 
      { id: "0107", name: "Muhammad Ilyashah Bin Norazman", department: "IT" },
      { id: "1804", name: "Employee 1804", department: "General" },
      // Add more employees as needed to sync with admin dashboard
    ];
    const fullEmployee = employees.find(emp => emp.id === employee.id);
    return {
      name: fullEmployee ? fullEmployee.name : (employee.name || 'Employee User'),
      department: fullEmployee ? fullEmployee.department : (employee.department || 'General')
    };
  };

  const calculateAttendanceRate = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthRecords = scanHistory.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });
    
    const workingDaysInMonth = 22; // Approximate working days
    const attendanceDays = new Set(thisMonthRecords.map(record => 
      new Date(record.timestamp).toDateString()
    )).size;
    
    return Math.min(100, Math.round((attendanceDays / workingDaysInMonth) * 100));
  };

  const downloadReport = () => {
    const employeeDetails = getEmployeeDetails();
    
    // Create CSV content matching Supabase attendance_records table structure EXACTLY
    const csvHeaders = "employee_id,attendance_date,check_in_time,check_out_time,status,location,notes\n";
    
    // Group records by date first to create proper attendance records
    const groupedRecords = scanHistory.reduce((groups: any, record) => {
      const date = formatDate(record.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {});

    const csvData = Object.entries(groupedRecords).map(([date, records]: [string, any]) => {
      const dayRecords = records as ScanRecord[];
      const checkIn = dayRecords.find(r => r.type === "check-in");
      const checkOut = dayRecords.find(r => r.type === "check-out");
      
      const employeeId = employee.id || 'EMP001';
      const attendanceDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
      const checkInTime = checkIn ? new Date(checkIn.timestamp).toISOString() : '';
      const checkOutTime = checkOut ? new Date(checkOut.timestamp).toISOString() : '';
      
      // Determine status
      const checkInDate = checkIn ? new Date(checkIn.timestamp) : null;
      const isLate = checkInDate && (checkInDate.getHours() > 8 || (checkInDate.getHours() === 8 && checkInDate.getMinutes() > 30));
      const status = checkIn ? (isLate ? 'late' : 'present') : 'absent';
      
      const location = checkIn?.location || 'Main Office';
      const notes = isLate ? 'Late arrival' : '';
      
      return `"${employeeId}","${attendanceDate}","${checkInTime}","${checkOutTime}","${status}","${location}","${notes}"`;
    });
    
    const csvContent = csvHeaders + csvData.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase-attendance-records-${employee.id || 'EMP001'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
    setScanHistory(history.reverse()); // Show latest first
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTotalHours = () => {
    // Simple calculation - count check-ins as 8 hours each
    const checkIns = scanHistory.filter(record => record.type === "check-in");
    return checkIns.length * 8;
  };

  return (
    <div className="min-h-screen bg-gradient-jks-subtle p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Navigation */}
        <div className="bg-white shadow-sm border-b px-6 py-4 mb-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Attendance Report</h1>
              <p className="text-gray-600">Your attendance history and statistics</p>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex space-x-6 mt-4 pt-4 border-t">
            <button 
              onClick={() => navigate("/employee/scan")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2"
            >
              📷 Scan QR
            </button>
            <button 
              onClick={() => navigate("/employee/generator")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Generator
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm flex items-center gap-2">
              📊 My Reports
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scanHistory.length}</div>
              <p className="text-xs text-muted-foreground">
                All time records
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scanHistory.filter(record => 
                  new Date(record.timestamp).getMonth() === new Date().getMonth()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Records this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalHours()}h</div>
              <p className="text-xs text-muted-foreground">
                Estimated total
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{calculateAttendanceRate()}%</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Employee Info */}
        <Card className="mb-6 hover-lift">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Employee Information</CardTitle>
              <Button onClick={downloadReport} className="bg-primary hover:bg-primary-hover">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Employee ID:</span>
                <p className="text-gray-600">{employee.id || 'EMP001'}</p>
              </div>
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-gray-600">{getEmployeeDetails().name}</p>
              </div>
              <div>
                <span className="font-medium">Department:</span>
                <p className="text-gray-600">{getEmployeeDetails().department}</p>
              </div>
              <div>
                <span className="font-medium">Report Generated:</span>
                <p className="text-gray-600">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No attendance records found</p>
                <p className="text-sm text-gray-500">Start scanning QR codes to build your history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  // Group records by date
                  const groupedRecords = scanHistory.reduce((groups: any, record) => {
                    const date = formatDate(record.timestamp);
                    if (!groups[date]) {
                      groups[date] = [];
                    }
                    groups[date].push(record);
                    return groups;
                  }, {});

                  return Object.entries(groupedRecords).map(([date, records]: [string, any]) => {
                    const dayRecords = records as ScanRecord[];
                    const checkIn = dayRecords.find(r => r.type === "check-in");
                    const checkOut = dayRecords.find(r => r.type === "check-out");
                    
                    // Calculate working hours
                    let workingHours = "0h 0m";
                    if (checkIn && checkOut) {
                      const checkInTime = new Date(checkIn.timestamp);
                      const checkOutTime = new Date(checkOut.timestamp);
                      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
                      const hours = Math.floor(diffMs / (1000 * 60 * 60));
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      workingHours = `${hours}h ${minutes}m`;
                    }

                    // Check if late (after 8:30 AM) - official working hours 8:30 AM to 5:30 PM
                    const checkInTime = checkIn ? new Date(checkIn.timestamp) : null;
                    const isLate = checkInTime && (checkInTime.getHours() > 8 || (checkInTime.getHours() === 8 && checkInTime.getMinutes() > 30));

                    return (
                      <div key={date} className="border rounded-lg p-4 bg-gray-50">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-800">{date}</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Check-in</div>
                            <div className="flex items-center gap-2">
                              {checkIn ? (
                                <>
                                  <span className="font-mono text-sm">
                                    {formatTime(checkIn.timestamp).substring(0, 5)}
                                  </span>
                                  {isLate && (
                                    <Badge variant="destructive" className="text-xs px-2 py-0">
                                      LATE
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">--:--</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Check-out</div>
                            <div className="font-mono text-sm">
                              {checkOut 
                                ? formatTime(checkOut.timestamp).substring(0, 5)
                                : "--:--"
                              }
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Working Hours</div>
                            <div className="font-mono text-sm">
                              {workingHours} {workingHours === "0h 0m" ? "0" : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeReport;