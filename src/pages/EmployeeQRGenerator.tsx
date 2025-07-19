import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeGenerator } from "@/components/attendance/QRCodeGenerator";
import { LogOut, QrCode } from "lucide-react";

const EmployeeQRGenerator = () => {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("currentEmployee") || "{}");
  const [qrData] = useState(`${employee.id || '0123'}`);

  const handleLogout = () => {
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("currentEmployee");
    navigate("/employee-login");
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EF4444 100%)'
    }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">JKS</span>
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
          <button 
            onClick={() => navigate("/employee/scan")}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2"
          >
            📷 Scan QR
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Generator
          </button>
          <button 
            onClick={() => navigate("/employee/report")}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2"
          >
            📊 My Reports
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle>QR Code Generator</CardTitle>
              <p className="text-gray-600">Generate your personalized QR code for attendance</p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <Input 
                  value={qrData}
                  readOnly
                  className="text-center font-mono"
                />
              </div>
              
              <div className="bg-white p-8 rounded-lg inline-block border">
                <QRCodeGenerator 
                  employeeId={employee.id || '0123'} 
                  locationId="EMPLOYEE_GENERATED" 
                />
              </div>
              
              <Button className="w-full bg-gray-800 text-white">
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center py-6 bg-blue-600">
        <p className="text-white">© 2025 AttendEase - Employee Attendance Portal</p>
      </div>
    </div>
  );
};

export default EmployeeQRGenerator;