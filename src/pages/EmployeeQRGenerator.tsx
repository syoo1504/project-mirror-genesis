import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeGenerator } from "@/components/attendance/QRCodeGenerator";
import { useNavigate } from "react-router-dom";
import { QrCode, ArrowLeft, Download } from "lucide-react";

const EmployeeQRGenerator = () => {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("currentEmployee") || "{}");
  const [qrData] = useState(`ATTENDEASE_${employee.id || 'EMP001'}_${Date.now()}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-800">QR Code Generator</h1>
            <p className="text-gray-600">Generate your attendance QR code</p>
          </div>
        </div>

        {/* Employee Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Employee ID:</span>
                <p className="text-gray-600">{employee.id || 'EMP001'}</p>
              </div>
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-gray-600">{employee.name || 'Employee User'}</p>
              </div>
              <div>
                <span className="font-medium">Department:</span>
                <p className="text-gray-600">{employee.department || 'General'}</p>
              </div>
              <div>
                <span className="font-medium">Generated:</span>
                <p className="text-gray-600">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Your Attendance QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-white p-8 rounded-lg inline-block mb-4">
              <QRCodeGenerator 
                employeeId={employee.id || 'EMP001'} 
                locationId="EMPLOYEE_GENERATED" 
              />
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>QR Data: {qrData}</p>
            </div>
            
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📱 How to Use</h4>
              <p className="text-sm text-blue-700">
                Show this QR code to the scanner device or use it for attendance tracking.
                Each QR code is unique and timestamped for security.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeQRGenerator;