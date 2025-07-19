import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, LogOut, Scan, QrCode } from "lucide-react";
import { Html5QrcodeScanner } from 'html5-qrcode';
const EmployeeScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const employee = JSON.parse(localStorage.getItem("currentEmployee") || "{}");

  // Check if it's the first scan of the day
  const isFirstScanOfDay = () => {
    const today = new Date().toDateString();
    const existingScans = JSON.parse(localStorage.getItem("scanHistory") || "[]");
    const todayScans = existingScans.filter((scan: any) => 
      new Date(scan.timestamp).toDateString() === today
    );
    return todayScans.length === 0;
  };

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Simulate camera opening and QR scan
    setTimeout(() => {
      const mockQRData = `EMP${employee.id || '0123'}_${Date.now()}`;
      setLastScan(mockQRData);
      setIsScanning(false);

      const isFirstScan = isFirstScanOfDay();
      const scanType = isFirstScan ? "check-in" : "check-out";

      // Save scan data
      const scanRecord = {
        timestamp: new Date().toISOString(),
        qrData: mockQRData,
        location: "Main Office",
        type: scanType,
        employeeId: employee.id || '0123',
        employeeName: employee.name || 'Employee User'
      };
      
      const existingScans = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      existingScans.push(scanRecord);
      localStorage.setItem("scanHistory", JSON.stringify(existingScans));

      // Update department analytics
      const departmentStats = JSON.parse(localStorage.getItem("departmentStats") || "{}");
      const department = employee.department || "General";
      if (!departmentStats[department]) {
        departmentStats[department] = { checkIns: 0, checkOuts: 0 };
      }
      departmentStats[department][scanType === "check-in" ? "checkIns" : "checkOuts"]++;
      localStorage.setItem("departmentStats", JSON.stringify(departmentStats));

      // Show appropriate popup message
      toast({
        title: isFirstScan ? "Check-in successful" : "Check-out successful",
        description: isFirstScan ? "Have a nice day!" : "You did a great job today!",
      });
    }, 2000);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      // Simple QR code processing simulation for PNG files
      const reader = new FileReader();
      reader.onload = () => {
        const mockQRData = `QR_UPLOAD_${employee.id || '0123'}_${Date.now()}`;
        setLastScan(mockQRData);
        
        const isFirstScan = isFirstScanOfDay();
        const scanType = isFirstScan ? "check-in" : "check-out";
        
        // Save scan data
        const scanRecord = {
          timestamp: new Date().toISOString(),
          qrData: mockQRData,
          location: "Uploaded Image",
          type: scanType,
          employeeId: employee.id || '0123',
          employeeName: employee.name || 'Employee User'
        };
        
        const existingScans = JSON.parse(localStorage.getItem("scanHistory") || "[]");
        existingScans.push(scanRecord);
        localStorage.setItem("scanHistory", JSON.stringify(existingScans));

        // Update department analytics
        const departmentStats = JSON.parse(localStorage.getItem("departmentStats") || "{}");
        const department = employee.department || "General";
        if (!departmentStats[department]) {
          departmentStats[department] = { checkIns: 0, checkOuts: 0 };
        }
        departmentStats[department][scanType === "check-in" ? "checkIns" : "checkOuts"]++;
        localStorage.setItem("departmentStats", JSON.stringify(departmentStats));
        
        // Show appropriate popup message
        toast({
          title: isFirstScan ? "Check-in successful" : "Check-out successful", 
          description: isFirstScan ? "Have a nice day!" : "You did a great job today!",
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PNG image file only",
        variant: "destructive"
      });
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("currentEmployee");
    navigate("/employee-login");
  };
  return <div className="min-h-screen bg-gradient-jks-subtle">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-jks-medium">
              <img src="/src/assets/jks-logo.png" alt="JKS Logo" className="w-10 h-10 object-contain" />
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
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scan QR
          </button>
          <button onClick={() => navigate("/employee/generator")} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Generator
          </button>
          <button onClick={() => navigate("/employee/report")} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2">
            📊 My Reports
          </button>
        </div>
      </div>

      <div className="p-6 text-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scan QR Code</h1>
          <p className="text-muted-foreground mb-8">Mark your attendance by scanning your QR code</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Camera Scanner */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera Scanner
                </CardTitle>
                <p className="text-gray-600">Use your device camera to scan QR codes directly</p>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                    {isScanning ? <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Scanning for QR code...</p>
                      </div> : <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Camera preview will appear here</p>
                      </div>}
                  </div>
                  
                  <Button onClick={handleStartScan} disabled={isScanning} className="w-full bg-primary text-white">
                    {isScanning ? "Scanning..." : "Start Camera Scanner"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📁 Upload QR Image
                </CardTitle>
                <p className="text-gray-600">Upload a QR code image from your device</p>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium">Select QR Code Image (PNG only)</label>
                  <input type="file" accept="image/png" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
                  <div className="mt-2 space-y-4">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                      Choose File
                    </Button>
                    <Button 
                      onClick={() => {
                        if (fileInputRef.current?.files?.[0]) {
                          handleFileUpload({ target: { files: fileInputRef.current.files } } as any);
                        } else {
                          toast({
                            title: "No File Selected",
                            description: "Please select a PNG file first",
                            variant: "destructive"
                          });
                        }
                      }} 
                      className="w-full bg-primary text-white"
                    >
                      Process QR Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Camera Scanner:</strong> Click "Start Camera Scanner" and point your camera at the QR code</li>
                <li>• <strong>Image Upload:</strong> Select a QR code image from your device and click "Process QR Image"</li>
                <li>• <strong>First scan of the day = Check-in</strong></li>
                <li>• <strong>Second scan of the day = Check-out</strong></li>
                <li>• Make sure the QR code is clear and well-lit for best results</li>
              </ul>
            </CardContent>
          </Card>

          {/* Last Scan Result */}
          {lastScan && <Card className="bg-green-50 border border-green-200 mt-6">
              <CardContent className="pt-6">
                <h3 className="font-medium text-green-800 mb-2">Last Scan Result:</h3>
                <p className="text-sm text-green-700 font-mono break-all">{lastScan}</p>
                <p className="text-sm text-green-600 mt-2">
                  Scanned at: {new Date().toLocaleString()}
                </p>
              </CardContent>
            </Card>}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center py-6 bg-primary">
        <p className="text-white">© 2025 JKS Engineering - Employee Attendance Portal</p>
      </div>
    </div>;
};
export default EmployeeScan;