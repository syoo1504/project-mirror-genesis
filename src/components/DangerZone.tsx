import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const DangerZone = () => {
  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </div>
        <p className="text-muted-foreground">Irreversible actions that will affect your data</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/10">
          <div>
            <h3 className="font-medium text-destructive">Clear All Data</h3>
            <p className="text-sm text-muted-foreground">Permanently delete all employee and attendance records</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleClearAllData}
            className="bg-destructive hover:bg-destructive/90"
          >
            Clear All Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};