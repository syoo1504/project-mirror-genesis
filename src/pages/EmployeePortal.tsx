import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Scan, FileText, Users } from "lucide-react";
const EmployeePortal = () => {
  const navigate = useNavigate();
  const menuItems = [{
    title: "QR Scanner",
    description: "Scan QR codes for attendance",
    icon: Scan,
    path: "/employee/scan",
    color: "bg-blue-500"
  }, {
    title: "Generate QR",
    description: "Generate your attendance QR code",
    icon: QrCode,
    path: "/employee/generator",
    color: "bg-green-500"
  }, {
    title: "View Report",
    description: "Check your attendance report",
    icon: FileText,
    path: "/employee/report",
    color: "bg-purple-500"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-blue-300 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QR Based Attendance System</h1>
          <p className="text-xl text-gray-600">Employee Portal</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(item.path)}>
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${item.color}`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button className="w-full">
                  Access
                </Button>
              </CardContent>
            </Card>)}
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/admin-login")} className="mr-4">
            <Users className="h-4 w-4 mr-2" />
            Admin Login
          </Button>
          <Button variant="outline" onClick={() => {
          localStorage.removeItem("employeeLoggedIn");
          localStorage.removeItem("currentEmployee");
          navigate("/employee-login");
        }}>
            Employee Login
          </Button>
        </div>
      </div>
    </div>;
};
export default EmployeePortal;