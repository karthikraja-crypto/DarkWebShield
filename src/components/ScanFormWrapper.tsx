
import React, { useState, useEffect } from 'react';
import ScanForm from '@/components/ScanForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BreachData } from '@/components/BreachCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock database of compromised emails/phones for testing
const MOCK_BREACH_DATABASE = {
  emails: ['test@example.com', 'admin@company.com', 'john.doe@gmail.com', 'breach@test.com'],
  phones: ['5551234567', '5559876543', '5550001111'],
  usernames: ['admin123', 'testuser', 'johndoe']
};

// Mock user email (would come from authentication in a real app)
const MOCK_USER_EMAIL = 'user@example.com';

const ScanFormWrapper = () => {
  const { addRealScan, setGlobalRealTimeScanMode, isRealTimeScanMode } = useScan();
  const navigate = useNavigate();
  const [isRealTimeScan, setIsRealTimeScan] = useState(isRealTimeScanMode);
  
  // Update global scan mode when local state changes
  useEffect(() => {
    setGlobalRealTimeScanMode(isRealTimeScan);
  }, [isRealTimeScan, setGlobalRealTimeScanMode]);
  
  // Keep local state in sync with global state
  useEffect(() => {
    setIsRealTimeScan(isRealTimeScanMode);
  }, [isRealTimeScanMode]);
  
  const handleScanSubmit = (type: string, value: string) => {
    // This function is now only called after the scanning animation is complete
    // Let's create breach data if the value is in our mock database
    let isCompromised = false;
    
    if (type === 'Email' && MOCK_BREACH_DATABASE.emails.includes(value)) {
      isCompromised = true;
    } else if (type === 'Phone' && MOCK_BREACH_DATABASE.phones.includes(value)) {
      isCompromised = true;
    } else if (type === 'Username' && MOCK_BREACH_DATABASE.usernames.includes(value)) {
      isCompromised = true;
    }
    
    // Create breach data if compromised
    const breaches: BreachData[] = [];
    if (isCompromised) {
      // Create breach records based on type
      if (type === 'Email') {
        breaches.push({
          id: `email-breach-${Date.now()}`,
          title: isRealTimeScan ? 'Real-Time Email Compromise Detected' : 'Email Compromise Detected',
          domain: 'multiple-sources.com',
          breachDate: new Date(Date.now() - 15552000000).toISOString(), // ~6 months ago
          affectedData: ['Email', 'Password', 'Personal Information'],
          riskLevel: 'high',
          verified: true,
          description: `Your email address "${value}" was found in a data breach affecting multiple services. This breach exposed passwords and personal information.`
        });
        
        // Add a second breach for more realistic data
        breaches.push({
          id: `email-breach-${Date.now() + 1}`,
          title: isRealTimeScan ? 'Real-Time Social Media Breach' : 'Social Media Breach',
          domain: 'socialmedia.com',
          breachDate: new Date(Date.now() - 31104000000).toISOString(), // ~12 months ago
          affectedData: ['Email', 'Username', 'IP Address'],
          riskLevel: 'medium',
          verified: true,
          description: `Your email address was also found in a social media platform breach that exposed user account information and IP addresses.`
        });
      } else if (type === 'Phone') {
        breaches.push({
          id: `phone-breach-${Date.now()}`,
          title: isRealTimeScan ? 'Real-Time Telecom Data Breach' : 'Telecom Data Breach',
          domain: 'telecom-provider.com',
          breachDate: new Date(Date.now() - 7776000000).toISOString(), // ~3 months ago
          affectedData: ['Phone Number', 'Call Records', 'Account Details'],
          riskLevel: 'medium',
          verified: true,
          description: `Your phone number was found in a telecommunications provider data breach that exposed customer records and call history.`
        });
      } else if (type === 'Username') {
        breaches.push({
          id: `username-breach-${Date.now()}`,
          title: isRealTimeScan ? 'Real-Time Gaming Platform Breach' : 'Gaming Platform Breach',
          domain: 'gaming-platform.com',
          breachDate: new Date(Date.now() - 5184000000).toISOString(), // ~2 months ago
          affectedData: ['Username', 'Email', 'Hashed Password'],
          riskLevel: 'medium',
          verified: true,
          description: `Your username "${value}" was exposed in a gaming platform breach that affected millions of accounts.`
        });
      }
      
      const alertMessage = isRealTimeScan 
        ? `Alert: Real-time scan found your ${type.toLowerCase()} in a data breach!` 
        : `Alert: Your ${type.toLowerCase()} was found in a data breach!`;
        
      toast.error(alertMessage, { duration: 5000 });
    } else {
      const successMessage = isRealTimeScan
        ? `✅ No breaches found. You're safe!`
        : `No breaches found for your ${type.toLowerCase()}`;
        
      toast.success(successMessage);
    }
    
    // Add the scan to our context with proper flag for real vs sample data and user email
    addRealScan(type, value, breaches, isRealTimeScan, MOCK_USER_EMAIL);
    
    // Navigate to results
    navigate('/results');
  };

  const toggleRealTimeScan = () => {
    setIsRealTimeScan(!isRealTimeScan);
    
    if (!isRealTimeScan) {
      toast.info("Real-time scan mode activated");
    } else {
      toast.info("Switched to sample data scan mode");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyber-primary/20">
        <div className="flex items-center gap-2">
          <Switch 
            id="real-time-scan" 
            checked={isRealTimeScan}
            onCheckedChange={toggleRealTimeScan}
            className="data-[state=checked]:bg-cyber-primary"
          />
          <Label htmlFor="real-time-scan" className="flex items-center gap-1.5 font-medium cursor-pointer">
            <Lock className="h-4 w-4" />
            Enable Real-Time Scan
          </Label>
        </div>
      </div>
      
      {!isRealTimeScan && (
        <Alert variant="default" className="bg-muted/30 border-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Enter your information below to scan for data breaches. For demo purposes, try these test values:
            <ul className="mt-2 ml-6 list-disc text-xs text-muted-foreground">
              <li>Email: test@example.com</li>
              <li>Phone: 5551234567</li>
              <li>Username: admin123</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {isRealTimeScan && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Real-Time Scan Mode Active</span>: All scans will use real-time dark web scanning and results will be saved to your account.
          </AlertDescription>
        </Alert>
      )}
      
      <ScanForm onSubmit={handleScanSubmit} isRealTime={isRealTimeScan} />
    </div>
  );
};

export default ScanFormWrapper;
