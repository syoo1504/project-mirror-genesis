import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Clock, MapPin, Download, TrendingUp } from "lucide-react";

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
  
  // Enhanced employee data - try to get full name from admin records
  const getEmployeeFullName = () => {
    const employees = [
      { id: "1106", name: "Arissa Irda Binti Rais" },
      { id: "0123", name: "Alex" },
      { id: "0107", name: "Muhammad Ilyashah Bin Norazman" },
    ];
    const fullEmployee = employees.find(emp => emp.id === employee.id);
    return fullEmployee ? fullEmployee.name : (employee.name || 'Employee User');
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
    const reportData = {
      employee: {
        id: employee.id || 'EMP001',
        name: getEmployeeFullName(),
        department: employee.department || 'General',
      },
      summary: {
        totalScans: scanHistory.length,
        thisMonth: scanHistory.filter(record => 
          new Date(record.timestamp).getMonth() === new Date().getMonth()
        ).length,
        totalHours: getTotalHours(),
        attendanceRate: calculateAttendanceRate(),
      },
      records: scanHistory,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${employee.id || 'EMP001'}-${new Date().toISOString().split('T')[0]}.json`;
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
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/scanner")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Report</h1>
            <p className="text-gray-600">Your attendance history and statistics</p>
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
                <p className="text-gray-600">{getEmployeeFullName()}</p>
              </div>
              <div>
                <span className="font-medium">Department:</span>
                <p className="text-gray-600">{employee.department || 'General'}</p>
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
                {scanHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{formatDate(record.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatTime(record.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{record.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={record.type === "check-in" ? "default" : "secondary"}>
                        {record.type === "check-in" ? "Check In" : "Check Out"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeReport;