import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
interface QRCodeGeneratorProps {
  employeeId: string;
  locationId: string;
}
export const QRCodeGenerator = ({
  employeeId,
  locationId
}: QRCodeGeneratorProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      // Create attendance data for QR code
      const attendanceData = {
        locationId,
        timestamp: new Date().toISOString(),
        action: "checkin",
        employeeId
      };

      // Generate QR code with attendance data
      const qrString = JSON.stringify(attendanceData);
      const url = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    generateQRCode();
  }, [employeeId, locationId]);
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `QR_Code_${employeeId}.png`;
    link.href = qrCodeUrl;
    link.click();
  };
  return <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Attendance QR Code</CardTitle>
        <p className="text-sm text-muted-foreground">Save your QR attendance</p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {isLoading ? <div className="flex items-center justify-center h-[300px]">
            
          </div> : qrCodeUrl ? <>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img src={qrCodeUrl} alt="Attendance QR Code" className="w-[300px] h-[300px]" />
            </div>
            <div className="space-y-2">
              
              <div className="flex gap-2 justify-center">
                
                <Button onClick={downloadQRCode} size="sm">
                  Download
                </Button>
              </div>
            </div>
          </> : <p className="text-muted-foreground">Failed to generate QR code</p>}
      </CardContent>
    </Card>;
};