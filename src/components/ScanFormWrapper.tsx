
import React from 'react';
import ScanForm from '@/components/ScanForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BreachData } from '@/components/BreachCard';

// Mock database of compromised emails/phones for testing
const MOCK_BREACH_DATABASE = {
  emails: ['test@example.com', 'admin@company.com', 'john.doe@gmail.com', 'breach@test.com'],
  phones: ['5551234567', '5559876543', '5550001111'],
  usernames: ['admin123', 'testuser', 'johndoe']
};

const ScanFormWrapper = () => {
  const { addRealScan } = useScan();
  const navigate = useNavigate();
  
  const handleScanSubmit = (type: string, value: string) => {
    toast.info(`Scanning for ${type.toLowerCase()}: ${value}...`);
    
    // Simulate a scanning process
    setTimeout(() => {
      // Check if value is in our mock database
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
            title: 'Email Compromise Detected',
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
            title: 'Social Media Breach',
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
            title: 'Telecom Data Breach',
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
            title: 'Gaming Platform Breach',
            domain: 'gaming-platform.com',
            breachDate: new Date(Date.now() - 5184000000).toISOString(), // ~2 months ago
            affectedData: ['Username', 'Email', 'Hashed Password'],
            riskLevel: 'medium',
            verified: true,
            description: `Your username "${value}" was exposed in a gaming platform breach that affected millions of accounts.`
          });
        }
        
        toast.error(`Alert: Your ${type.toLowerCase()} was found in a data breach!`, { duration: 5000 });
      } else {
        toast.success(`No breaches found for your ${type.toLowerCase()}`);
      }
      
      // Add the scan to our context
      addRealScan(type, value, breaches);
      
      // Navigate to results
      navigate('/results');
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
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
      
      <ScanForm onSubmit={handleScanSubmit} />
    </div>
  );
};

export default ScanFormWrapper;
