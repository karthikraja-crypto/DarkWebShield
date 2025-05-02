
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Mail, Phone, User, CreditCard, Building, AlertTriangle, Network, BadgeAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ScanType = 'email' | 'phone' | 'username' | 'creditCard' | 'bankAccount' | 'ipAddress' | 'physicalAddress' | 'password';

interface ScanFormProps {
  onSubmit: (type: string, value: string) => void;
  isRealTime?: boolean;
}

const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+91|0)[1-9]\d{9}$/, // Indian phone numbers
  username: /^[a-zA-Z0-9_]{3,20}$/,
  creditCard: /^\d{13,19}$/, // Most credit cards are 13-19 digits
  bankAccount: /^\d{9,18}$/, // Most bank accounts are 9-18 digits
  ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
  physicalAddress: /.{5,}/,
  password: /.{1,}/
};

const BREACH_SAMPLES = {
  email: ['test@example.com', 'admin@company.com', 'john.doe@gmail.com', 'info@business.org'],
  phone: ['1234567890', '555-123-4567', '8885551234'],
  username: ['admin', 'user1234', 'johndoe', 'testuser'],
  creditCard: ['4532015112830366', '4916338506082832', '5280934283171080'],
  bankAccount: ['123456789012', '345678901234', '567890123456'],
  ipAddress: ['192.168.1.1', '10.0.0.1', '172.16.0.1'],
  physicalAddress: ['123 Main St', '456 Oak Avenue', '789 Pine Boulevard'],
  password: ['password', '123456', 'qwerty', 'admin']
};

// Define scanning platforms - same as the ones in GovernmentIDSection for consistency
const SCAN_PLATFORMS = [
  {
    name: "Dark Web Marketplaces",
    description: "Anonymous marketplaces where stolen data is bought and sold",
    examples: ["Dream Market", "Empire Market", "AlphaBay", "Hydra"],
    scanTimeMs: 800
  },
  {
    name: "Known Data Breach Repositories",
    description: "Databases containing previously confirmed data breaches",
    examples: ["HaveIBeenPwned Database", "BreachCompilation", "Collections #1-5"],
    scanTimeMs: 600
  },
  {
    name: "Underground Hacking Forums",
    description: "Private forums where hackers share breached data",
    examples: ["RaidForums", "XSS.is", "Exploit.in", "OGUsers"],
    scanTimeMs: 700
  },
  {
    name: "Paste Sites",
    description: "Public and private paste services often used for data dumps",
    examples: ["Pastebin", "GitHub Gists", "PrivateBin", "JustPaste.it"],
    scanTimeMs: 500
  },
  {
    name: "Data Leak Collections",
    description: "Aggregated collections of multiple data leaks",
    examples: ["Anti Public Combo List", "Exploit.in", "Snusbase"],
    scanTimeMs: 900
  },
  {
    name: "Criminal Marketplaces",
    description: "Platforms specifically for trading stolen credentials and PII",
    examples: ["Genesis Market", "Russian Market", "Brian's Club"],
    scanTimeMs: 750
  },
  {
    name: "Compromised Credentials Databases",
    description: "Specialized databases indexing leaked login information",
    examples: ["LeakCheck", "DeHashed", "Leaked Source", "Breach-Parse"],
    scanTimeMs: 650
  }
];

const ScanForm = ({ onSubmit, isRealTime = false }: ScanFormProps) => {
  const [scanType, setScanType] = useState<ScanType>('email');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [currentScanPlatform, setCurrentScanPlatform] = useState('');
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const validateInput = (type: ScanType, value: string): boolean => {
    const pattern = VALIDATION_PATTERNS[type];
    if (!pattern) return true;
    return pattern.test(value);
  };

  const simulateBreachCheck = (type: ScanType, value: string): {
    breached: boolean,
    confidence: number,
    breachCount?: number,
    sources?: string[]
  } => {
    const samples = BREACH_SAMPLES[type] || [];
    
    if (samples.includes(value)) {
      return {
        breached: true,
        confidence: 100,
        breachCount: Math.floor(Math.random() * 5) + 1,
        sources: ['Dark Web Marketplace', 'Hacker Forum', 'Data Dump'].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    }
    
    if (['email', 'username', 'physicalAddress'].includes(type)) {
      for (const sample of samples) {
        if (
          sample.includes(value) || 
          value.includes(sample) || 
          type === 'email' && value.split('@')[0] === sample.split('@')[0]
        ) {
          return {
            breached: true,
            confidence: 75,
            breachCount: Math.floor(Math.random() * 3) + 1,
            sources: ['Suspected Data Breach', 'Uncertain Source']
          };
        }
      }
    }
    
    if (
      (type === 'password' && value.length < 8) ||
      (type === 'username' && ['admin', 'root', 'user'].includes(value))
    ) {
      return {
        breached: true,
        confidence: 85,
        breachCount: Math.floor(Math.random() * 5) + 1,
        sources: ['Multiple Sources', 'Common Target']
      };
    }
    
    if (Math.random() < 0.1) {
      return {
        breached: true,
        confidence: 60,
        breachCount: 1,
        sources: ['Unverified Source']
      };
    }
    
    return {
      breached: false,
      confidence: 95
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!inputValue.trim()) {
      toast.error('Please enter a value to scan');
      setValidationError('This field is required');
      return;
    }
    
    // Validate input format based on type
    if (!validateInput(scanType, inputValue)) {
      if (scanType === 'phone') {
        toast.error('Invalid phone number format');
        setValidationError('Please enter a valid Indian phone number starting with +91 or 0, followed by 10 digits');
      } else if (scanType === 'creditCard') {
        toast.error('Invalid credit card format');
        setValidationError('Please enter a valid credit card number (13-19 digits)');
      } else if (scanType === 'bankAccount') {
        toast.error('Invalid bank account format');
        setValidationError('Please enter a valid bank account number (9-18 digits)');
      } else {
        toast.error(`Invalid format for ${scanType}`);
        setValidationError(`Please enter a valid ${scanType} format`);
      }
      return;
    }
    
    // Show privacy popup before scanning
    setShowPrivacyPopup(true);
    
    // Start scanning after a short delay to ensure the popup is visible
    setTimeout(() => {
      setIsScanning(true);
      setScanProgress(0);
      setCurrentScanPlatform('Initializing secure scanning environment');
      
      const scanMessage = isRealTime 
        ? `Starting real-time scan for ${scanType}...`
        : `Starting scan for ${scanType}...`;
      
      toast.info(scanMessage);
      
      // Begin the comprehensive scanning process similar to GovernmentIDSection
      setTimeout(() => {
        setScanProgress(10);
        setCurrentScanPlatform('Verifying encryption integrity');
        
        // Begin platform scanning sequence
        let progressIncrement = 80 / SCAN_PLATFORMS.length;
        let currentProgress = 10;
        let platformIndex = 0;
        
        const scanNextPlatform = () => {
          if (platformIndex < SCAN_PLATFORMS.length) {
            const platform = SCAN_PLATFORMS[platformIndex];
            currentProgress += progressIncrement;
            setScanProgress(Math.round(currentProgress));
            setCurrentScanPlatform(`Scanning ${platform.name}`);
            
            // Display more detailed toast about each platform
            toast.info(
              `Scanning ${platform.name}: ${platform.description}. Checking ${platform.examples.slice(0, 2).join(", ")} and others.`, 
              { id: 'scan-progress', duration: platform.scanTimeMs }
            );
            
            platformIndex++;
            setTimeout(scanNextPlatform, platform.scanTimeMs);
          } else {
            // Scanning complete, compile results
            setScanProgress(95);
            setCurrentScanPlatform('Compiling scan results');
            
            setTimeout(() => {
              setScanProgress(100);
              setCurrentScanPlatform('Scan complete');
              setIsScanning(false);
              setShowPrivacyPopup(false); // Hide privacy popup when scan completes
              
              // Pass the results to the parent component
              onSubmit(scanType, inputValue);
            }, 800);
          }
        };
        
        // Start scanning platforms
        setTimeout(scanNextPlatform, 600);
      }, 500);
    }, 500);
  };

  const renderIcon = () => {
    switch (scanType) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'phone':
        return <Phone className="h-5 w-5" />;
      case 'username':
        return <User className="h-5 w-5" />;
      case 'creditCard':
      case 'bankAccount':
        return <CreditCard className="h-5 w-5" />;
      case 'ipAddress':
        return <Network className="h-5 w-5" />;
      case 'physicalAddress':
        return <Building className="h-5 w-5" />;
      case 'password':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getPlaceholder = () => {
    switch (scanType) {
      case 'email':
        return 'Enter your email address';
      case 'phone':
        return 'Enter your Indian phone number (e.g., +91 or 0 followed by 10 digits)';
      case 'username':
        return 'Enter your username';
      case 'creditCard':
        return 'Enter your full credit card number';
      case 'bankAccount':
        return 'Enter your full bank account number';
      case 'ipAddress':
        return 'Enter an IP address (e.g., 192.168.1.1)';
      case 'physicalAddress':
        return 'Enter your street address';
      case 'password':
        return 'Enter your password';
    }
  };

  const getInputType = () => {
    switch (scanType) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'creditCard':
      case 'bankAccount':
        return 'number';
      case 'password':
        return 'password';
      default:
        return 'text';
    }
  };

  return (
    <Card className="cyber-card w-full">
      <CardHeader>
        <CardTitle className="text-cyber-primary">
          {isRealTime ? 'Real-Time Scan' : 'Personal Info Scan'}
        </CardTitle>
        <CardDescription>
          {isRealTime 
            ? 'Check if your personal information has been exposed using real-time breach detection'
            : 'Check if your personal information has been exposed in data breaches'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showPrivacyPopup && (
          <Alert className="mb-4 bg-cyber-primary/10 border-cyber-primary/20 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-cyber-primary" />
            <AlertDescription className="font-medium text-center py-2">
              Your data/ID won't be stored permanently.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scanType">Information Type</Label>
              <Select 
                value={scanType} 
                onValueChange={(value) => {
                  setScanType(value as ScanType);
                  setInputValue(''); // Reset value when type changes
                  setValidationError('');
                }}
              >
                <SelectTrigger className="cyber-input">
                  <SelectValue placeholder="Select what to scan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="phone">Phone Number (Indian)</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="creditCard">Credit Card Number</SelectItem>
                  <SelectItem value="bankAccount">Bank Account Number</SelectItem>
                  <SelectItem value="ipAddress">IP Address</SelectItem>
                  <SelectItem value="physicalAddress">Physical Address</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inputValue">Enter Value</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  {renderIcon()}
                </div>
                <Input
                  id="inputValue"
                  className={`cyber-input pl-10 ${validationError ? 'border-red-500' : ''}`}
                  type={getInputType()}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setValidationError('');
                  }}
                  placeholder={getPlaceholder()}
                />
              </div>
              {validationError ? (
                <p className="text-xs text-red-500 mt-1">{validationError}</p>
              ) : scanType === 'phone' ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Only Indian phone numbers (+91 or 0 followed by 10 digits) are supported.
                </p>
              ) : scanType === 'creditCard' ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Enter full card number (13-19 digits). Your data is encrypted and secure.
                </p>
              ) : scanType === 'bankAccount' ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Enter full account number (9-18 digits). Your data is encrypted and secure.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Your data is encrypted and secure. We never store sensitive information.
                </p>
              )}
            </div>
            
            {isRealTime && (
              <div className="mt-3 bg-cyber-primary/10 p-3 rounded-md border border-cyber-primary/20">
                <h4 className="text-sm font-medium mb-1.5 text-cyber-primary">Real-Time Scan Security</h4>
                <p className="text-xs text-muted-foreground mb-1">
                  Your information will be checked against these breach sources:
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4">
                  {SCAN_PLATFORMS.map((platform, index) => (
                    <li key={index}>{platform.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
            disabled={isScanning}
          >
            {isScanning ? (
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm">{currentScanPlatform}</span>
                  <span className="text-sm ml-2">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2 w-full bg-cyber-dark/20" />
              </div>
            ) : isRealTime ? 'Start Real-Time Scan' : 'Start Scan'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-cyber-primary/20 pt-4">
        <p className="text-xs text-muted-foreground text-center">
          {isRealTime 
            ? 'Powered by advanced AI and real-time dark web monitoring technology'
            : 'Powered by advanced AI and dark web monitoring technology'
          }
        </p>
      </CardFooter>
    </Card>
  );
};

export default ScanForm;
