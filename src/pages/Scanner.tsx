import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  qrData: string;
  checkInTime?: string;
  checkOutTime?: string;
  isLate: boolean;
  timestamp: string;
  status: 'success' | 'error';
  type: 'check-in' | 'check-out';
}

const Scanner = () => {
  const [status, setStatus] = useState('Waiting for QR scan...');
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Standard work start time (9:00 AM)
  const WORK_START_TIME = '09:00';

  const getEmployeeData = (): Employee[] => {
    return JSON.parse(localStorage.getItem('employeeData') || '[]');
  };

  const findEmployee = (employeeId: string): Employee | null => {
    const employees = getEmployeeData();
    return employees.find(emp => emp.employee_id === employeeId) || null;
  };

  const isLateArrival = (checkInTime: string): boolean => {
    const checkIn = new Date(`1970-01-01T${checkInTime}`);
    const workStart = new Date(`1970-01-01T${WORK_START_TIME}:00`);
    return checkIn > workStart;
  };

  const getLastAttendanceRecord = (employeeId: string): AttendanceRecord | null => {
    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const employeeRecords = records.filter((r: AttendanceRecord) => r.employeeId === employeeId);

    // Get today's records only
    const today = new Date().toDateString();
    const todayRecords = employeeRecords.filter((r: AttendanceRecord) =>
      new Date(r.timestamp).toDateString() === today
    );

    return todayRecords.length > 0 ? todayRecords[todayRecords.length - 1] : null;
  };

  const saveAttendanceRecord = (record: AttendanceRecord) => {
    const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const updatedRecords = [...existingRecords, record];
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  };

  const processQRData = (qrData: string) => {
    console.log('QR Data received:', qrData);
    setStatus(`Processing QR: ${qrData}`);

    try {
      // Try to parse the QR data
      let employeeId: string;
      
      if (qrData.includes('employeeId')) {
        // JSON format
        const parsed = JSON.parse(qrData);
        employeeId = parsed.employeeId;
      } else if (qrData.includes('_')) {
        // Underscore separated format
        const parts = qrData.split('_');
        employeeId = parts.find(part => part.startsWith('EMP')) || parts[0];
      } else {
        // Simple employee ID
        employeeId = qrData;
      }

      const employee = findEmployee(employeeId);
      
      if (!employee) {
        setStatus(`Employee not found: ${employeeId}`);
        toast({
          title: "Error",
          description: `Employee ID ${employeeId} not found in system`,
          variant: "destructive",
        });
        return;
      }

      if (employee.status !== 'Active') {
        setStatus(`Employee ${employeeId} is not active`);
        toast({
          title: "Error",
          description: `Employee ${employee.name} is not active`,
          variant: "destructive",
        });
        return;
      }

      const lastRecord = getLastAttendanceRecord(employeeId);
      const currentTime = new Date();
      const timeString = currentTime.toTimeString().slice(0, 5);
      
      let recordType: 'check-in' | 'check-out';
      let message: string;

      if (!lastRecord || lastRecord.type === 'check-out') {
        // Check-in
        recordType = 'check-in';
        const isLate = isLateArrival(timeString);
        message = `Check-in successful for ${employee.name}${isLate ? ' (Late)' : ''}`;

        const record: AttendanceRecord = {
          id: `${employeeId}_${currentTime.getTime()}`,
          employeeId,
          employeeName: employee.name,
          qrData,
          checkInTime: timeString,
          isLate,
          timestamp: currentTime.toISOString(),
          status: 'success',
          type: recordType
        };

        saveAttendanceRecord(record);
      } else {
        // Check-out
        recordType = 'check-out';
        message = `Check-out successful for ${employee.name}`;

        const record: AttendanceRecord = {
          id: `${employeeId}_${currentTime.getTime()}`,
          employeeId,
          employeeName: employee.name,
          qrData,
          checkOutTime: timeString,
          isLate: false,
          timestamp: currentTime.toISOString(),
          status: 'success',
          type: recordType
        };

        saveAttendanceRecord(record);
      }

      setStatus(message);
      toast({
        title: "Success",
        description: message,
      });

      // Store the scan result in localStorage for the portal to display
      localStorage.setItem('lastScanResult', JSON.stringify({
        success: true,
        message,
        employee: employee.name,
        time: timeString,
        type: recordType
      }));

    } catch (error) {
      console.error('Error processing QR data:', error);
      setStatus('Invalid QR code format');
      toast({
        title: "Error",
        description: "Invalid QR code format",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Initialize dummy employee data if not exists
    const existingData = localStorage.getItem('employeeData');
    if (!existingData) {
      const dummyEmployees: Employee[] = [
        {
          employee_id: 'EMP001',
          name: 'John Doe',
          email: 'john.doe@company.com',
          phone: '+1234567890',
          department: 'IT',
          designation: 'Software Engineer',
          status: 'Active'
        },
        {
          employee_id: 'EMP002',
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          phone: '+1234567891',
          department: 'HR',
          designation: 'HR Manager',
          status: 'Active'
        },
        {
          employee_id: 'EMP003',
          name: 'Mike Johnson',
          email: 'mike.johnson@company.com',
          phone: '+1234567892',
          department: 'Finance',
          designation: 'Accountant',
          status: 'Active'
        }
      ];
      localStorage.setItem('employeeData', JSON.stringify(dummyEmployees));
    }

    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          processQRData(decodedText);
          scanner.clear();
          setIsScanning(false);
          
          // Auto restart scanning after 3 seconds
          setTimeout(() => {
            setIsScanning(true);
            setStatus('Waiting for QR scan...');
          }, 3000);
        },
        (error) => {
          // Handle scan error silently
          console.log('Scan error:', error);
        }
      );

      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      };
    }
  }, [isScanning]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ADD8E6 0%, #E0E0E0 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          AttendEase QR Scanner
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '30px'
        }}>
          Scan employee QR codes for attendance tracking
        </p>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div id="qr-reader" style={{
            border: '3px dashed #ccc',
            borderRadius: '10px',
            minHeight: '300px'
          }}></div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px'
          }}>
            Status
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: status.includes('successful') ? '#22c55e' : 
                  status.includes('Error') || status.includes('not found') ? '#ef4444' : '#666'
          }}>
            {status}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <button
            onClick={() => navigate('/employee-login')}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            Employee Portal
          </button>
          
          <button
            onClick={() => navigate('/admin-login')}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.background = '#6b7280'}
          >
            Admin Login
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '10px'
        }}>
          <h4 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
          }}>
            📱 How to Use
          </h4>
          <ol style={{
            textAlign: 'left',
            fontSize: '1rem',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li>Hold your QR code steady in front of the camera</li>
            <li>Wait for the automatic scan and beep sound</li>
            <li>Check the status message for confirmation</li>
            <li>The system will automatically be ready for the next scan</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Scanner;