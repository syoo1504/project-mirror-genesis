import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeGenerator } from "@/components/attendance/QRCodeGenerator";
import { LogOut, QrCode } from "lucide-react";
import jksLogo from "@/assets/jks-logo.png";
const EmployeeQRGenerator = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in via sessionStorage
    const isLoggedIn = sessionStorage.getItem('employee-logged-in');
    const employeeId = sessionStorage.getItem('employee-id');
    
    if (!isLoggedIn || !employeeId) {
      navigate("/employee-login");
      return;
    }

    // Get employee data from localStorage (set during login)
    const currentEmployee = JSON.parse(localStorage.getItem('currentEmployee') || '{}');
    setEmployee({
      employee_id: employeeId,
      name: currentEmployee.name || `Employee ${employeeId}`,
      department: currentEmployee.department || 'General'
    });
  }, [navigate]);

  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('employee-logged-in');
    sessionStorage.removeItem('employee-id');
    navigate("/employee-login");
  };

  if (!employee) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  return <div className="min-h-screen bg-gradient-jks-subtle">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-jks-medium">
              <img src={jksLogo} alt="JKS Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Employee Portal</h1>
              <p className="text-sm text-gray-600">Scan your QR code for attendance</p>
            </div>
          </div>
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b px-6 py-2">
        <div className="flex space-x-6">
          <button onClick={() => navigate("/employee/scan")} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2">
            📷 Scan QR
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Generator
          </button>
          <button onClick={() => navigate("/employee/report")} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2">
            📊 My Reports
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle>QR Code Generator</CardTitle>
              <p className="text-gray-600">
            </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* Employee Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-800">Employee Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Employee ID:</span>
                    <p className="text-gray-600">{employee.employee_id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Name:</span>
                    <p className="text-gray-600">{employee.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>
                    <p className="text-gray-600">{employee.department}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    // Download employee report in CSV format
                    const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
                    const employeeScans = scanHistory.filter((scan: any) => scan.employeeId === employee.employee_id);
                    
                    // Create CSV content
                    const csvHeaders = "Date,Time,Type,Location\n";
                    const csvData = employeeScans.map((scan: any) => {
                      const date = new Date(scan.timestamp).toLocaleDateString();
                      const time = new Date(scan.timestamp).toLocaleTimeString();
                      return `${date},${time},${scan.type},${scan.location || 'Main Office'}`;
                    }).join('\n');
                    
                    const csvContent = csvHeaders + csvData;
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `employee-${employee.employee_id}-report-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Download Report (CSV)
                </Button>
              </div>
              
              <div>
                <Input value={employee.employee_id} readOnly className="text-center font-mono" />
              </div>
              
              <div className="bg-white p-8 rounded-lg inline-block border">
                <QRCodeGenerator employeeId={employee.employee_id} locationId="EMPLOYEE_GENERATED" />
              </div>
              
              {/* Attendance History Section */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-800">Attendance History</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {(() => {
                    const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
                    const employeeScans = scanHistory
                      .filter((scan: any) => scan.employeeId === employee.employee_id)
                      .slice(0, 10) // Show last 10 records
                      .reverse(); // Show newest first
                    
                    if (employeeScans.length === 0) {
                      return <p className="text-gray-500 text-sm">No attendance records found</p>;
                    }
                    
                    return employeeScans.map((scan: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                        <span>{new Date(scan.timestamp).toLocaleDateString()}</span>
                        <span className="font-mono">
                          {new Date(scan.timestamp).toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          scan.type === 'check-in' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {scan.type}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Welcome, {employee.name}! Use this QR code for attendance tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center py-6 bg-primary">
        <p className="text-white">© 2025 JKS Engineering - Employee Attendance Portal</p>
      </div>
    </div>;
};
export default EmployeeQRGenerator;