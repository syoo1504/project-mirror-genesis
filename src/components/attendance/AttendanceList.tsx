import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn?: Date;
  checkOut?: Date;
  location: string;
  status: "present" | "absent" | "late" | "partial";
  workingHours?: number;
}

interface AttendanceListProps {
  records: AttendanceRecord[];
  title?: string;
}

const statusColors = {
  present: "bg-green-100 text-green-800 border-green-200",
  absent: "bg-red-100 text-red-800 border-red-200", 
  late: "bg-yellow-100 text-yellow-800 border-yellow-200",
  partial: "bg-blue-100 text-blue-800 border-blue-200"
};

export const AttendanceList = ({ records, title = "Today's Attendance" }: AttendanceListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance records found
            </p>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{record.employeeName}</h3>
                    <Badge 
                      variant="outline"
                      className={statusColors[record.status]}
                    >
                      {record.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {record.location}
                    </div>
                    
                    {record.checkIn && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        In: {format(record.checkIn, "HH:mm")}
                      </div>
                    )}
                    
                    {record.checkOut && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Out: {format(record.checkOut, "HH:mm")}
                      </div>
                    )}
                  </div>
                </div>
                
                {record.workingHours && (
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {record.workingHours.toFixed(1)}h
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Working Hours
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};