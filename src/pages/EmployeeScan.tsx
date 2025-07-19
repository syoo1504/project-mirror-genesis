import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Scan, Camera, Upload, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeScan = () => {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartScan = () => {
    setScanning(true);
    // Simulate QR scan
    setTimeout(() => {
      const mockQRData = `ATTENDEASE_${Date.now()}_LOCATION_MAIN_OFFICE`;
      setLastScan(mockQRData);
      setScanning(false);
      
      // Save scan data
      const scanRecord = {
        timestamp: new Date().toISOString(),
        qrData: mockQRData,
        location: "Main Office",
        type: "check-in"
      };
      
      const existingScans = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      existingScans.push(scanRecord);
      localStorage.setItem("scanHistory", JSON.stringify(existingScans));
      
      toast({
        title: "QR Code Scanned",
        description: "Attendance recorded successfully",
      });
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR code reading from image
      const mockQRData = `ATTENDEASE_${Date.now()}_LOCATION_UPLOADED`;
      setLastScan(mockQRData);
      
      toast({
        title: "QR Code Detected",
        description: "Attendance recorded from uploaded image",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("currentEmployee");
    navigate("/employee-login");
  };

  const employee = JSON.parse(localStorage.getItem("currentEmployee") || "{}");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>
            <p className="text-gray-600">Welcome, {employee.name || "Employee"}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Scanner Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Attendance QR Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Scanner */}
            <div className="text-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {scanning ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Scanning for QR code...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Camera preview will appear here</p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleStartScan} 
                disabled={scanning}
                className="w-full mb-4"
              >
                {scanning ? "Scanning..." : "Start Camera Scan"}
              </Button>
            </div>

            {/* File Upload */}
            <div className="border-t pt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload QR Code Image
              </Button>
            </div>

            {/* Last Scan Result */}
            {lastScan && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Last Scan Result:</h3>
                <p className="text-sm text-green-700 font-mono break-all">{lastScan}</p>
                <p className="text-sm text-green-600 mt-2">
                  Scanned at: {new Date().toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/employee/generator")}
          >
            Generate QR
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/employee/report")}
          >
            View Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeScan;