import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Scan, Download, MapPin } from "lucide-react";
import { QRCodeGenerator } from "@/components/attendance/QRCodeGenerator";

const locations = [
  { id: "MAIN_OFFICE", name: "Main Office", address: "123 Business Ave" },
  { id: "BRANCH_OFFICE", name: "Branch Office", address: "456 Commerce St" },
  { id: "WAREHOUSE", name: "Warehouse", address: "789 Industrial Blvd" },
  { id: "REMOTE", name: "Remote Work", address: "Work from Home" },
];

const Scanner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("MAIN_OFFICE");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
            <p className="text-muted-foreground">
              Generate and manage QR codes for attendance tracking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Generate QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Location
                    </label>
                    <div className="space-y-2">
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedLocation === location.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-accent/50"
                          }`}
                          onClick={() => setSelectedLocation(location.id)}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{location.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {location.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            <div>
              <QRCodeGenerator 
                employeeId="LOCATION" 
                locationId={selectedLocation}
              />
            </div>
          </div>

          {/* Scanner Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                How to Use QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">1. Generate</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a location and generate its QR code
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">2. Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Download and display the QR code at the location
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Scan className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">3. Scan</h3>
                  <p className="text-sm text-muted-foreground">
                    Employees scan the code to mark their attendance
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📱 Mobile App Required</h4>
                <p className="text-sm text-blue-700">
                  Employees need the company mobile app to scan QR codes and mark attendance.
                  The app automatically captures location, timestamp, and employee details.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Scanner;