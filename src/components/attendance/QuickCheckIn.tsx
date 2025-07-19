import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, MapPin, User } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface QuickCheckInProps {
  onCheckIn: (data: { employeeId: string; location: string }) => void;
  onCheckOut: (data: { employeeId: string; location: string }) => void;
}

export const QuickCheckIn = ({ onCheckIn, onCheckOut }: QuickCheckInProps) => {
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState("Office Main");
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    if (!employeeId.trim()) return;
    
    onCheckIn({ employeeId, location });
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    if (!employeeId.trim()) return;
    
    onCheckOut({ employeeId, location });
    setIsCheckedIn(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          Quick Check In/Out
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Employee ID
          </Label>
          <Input
            id="employeeId"
            placeholder="Enter your employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleCheckIn}
            disabled={!employeeId.trim() || isCheckedIn}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Check In
          </Button>
          <Button 
            onClick={handleCheckOut}
            disabled={!employeeId.trim() || !isCheckedIn}
            variant="destructive"
            className="flex-1"
          >
            Check Out
          </Button>
        </div>

        {isCheckedIn && (
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ Checked in at {format(new Date(), "HH:mm")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};