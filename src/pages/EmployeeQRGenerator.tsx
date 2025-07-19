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

    // Set employee data from sessionStorage
    setEmployee({
      employee_id: employeeId,
      name: `Employee ${employeeId}`, // Simple demo name
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
              <div>
                <Input value={employee.employee_id} readOnly className="text-center font-mono" />
              </div>
              
              <div className="bg-white p-8 rounded-lg inline-block border">
                <QRCodeGenerator employeeId={employee.employee_id} locationId="EMPLOYEE_GENERATED" />
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