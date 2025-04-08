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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Mail, Phone, User, CreditCard, Building, AlertTriangle, Network, BadgeAlert } from 'lucide-react';

type ScanType = 'email' | 'phone' | 'username' | 'creditCard' | 'bankAccount' | 'idNumber' | 'ipAddress' | 'physicalAddress' | 'password';

interface ScanFormProps {
  onSubmit: (type: string, value: string) => void;
  isRealTime?: boolean;
}

const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$|^\d{3}-\d{3}-\d{4}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  creditCard: /^\d{4}$/,
  bankAccount: /^\d{6}$/,
  idNumber: /^\d{4}$/,
  ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
  physicalAddress: /.{5,}/,
  password: /.{1,}/
};

const BREACH_SAMPLES = {
  email: ['test@example.com', 'admin@company.com', 'john.doe@gmail.com', 'info@business.org'],
  phone: ['1234567890', '555-123-4567', '8885551234'],
  username: ['admin', 'user1234', 'johndoe', 'testuser'],
  creditCard: ['1234', '5678', '9012', '3456'],
  bankAccount: ['123456', '789012', '345678'],
  idNumber: ['1234', '5678', '9012'],
  ipAddress: ['192.168.1.1', '10.0.0.1', '172.16.0.1'],
  physicalAddress: ['123 Main St', '456 Oak Avenue', '789 Pine Boulevard'],
  password: ['password', '123456', 'qwerty', 'admin']
};

const ScanForm = ({ onSubmit, isRealTime = false }: ScanFormProps) => {
  const [scanType, setScanType] = useState<ScanType>('email');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [validationError, setValidationError] = useState('');

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
    
    if (!validateInput(scanType, inputValue)) {
      toast.error(`Invalid format for ${scanType}`);
      setValidationError(`Please enter a valid ${scanType} format`);
      return;
    }
    
    setIsScanning(true);
    setScanProgress(0);
    
    const scanMessage = isRealTime 
      ? `Starting real-time scan for ${scanType}...`
      : `Starting scan for ${scanType}...`;
    
    toast.info(scanMessage, { id: 'scan-progress' });
    
    const scanPhases = [
      { progress: 15, message: isRealTime ? 'Initializing secure real-time scanning environment...' : 'Initializing secure scanning environment...' },
      { progress: 30, message: 'Searching public breach databases...' },
      { progress: 45, message: isRealTime ? 'Scanning dark web forums in real-time...' : 'Scanning dark web forums...' },
      { progress: 60, message: 'Searching encrypted marketplaces...' },
      { progress: 75, message: 'Cross-referencing with known breaches...' },
      { progress: 90, message: 'Analyzing results and creating report...' },
      { progress: 100, message: 'Scan complete! Preparing results...' }
    ];
    
    let phaseIndex = 0;
    const runNextPhase = () => {
      if (phaseIndex < scanPhases.length) {
        const phase = scanPhases[phaseIndex];
        setScanProgress(phase.progress);
        toast.info(phase.message, { id: 'scan-progress' });
        phaseIndex++;
        setTimeout(runNextPhase, 600 + Math.random() * 400);
      } else {
        finalizeScan();
      }
    };
    
    const finalizeScan = () => {
      setIsScanning(false);
      onSubmit(scanType, inputValue);
    };
    
    runNextPhase();
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
      case 'idNumber':
        return <BadgeAlert className="h-5 w-5" />;  
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
        return 'Enter your phone number (e.g., 555-123-4567)';
      case 'username':
        return 'Enter your username';
      case 'creditCard':
        return 'Enter last 4 digits of your credit card';
      case 'bankAccount':
        return 'Enter last 6 digits of your bank account';
      case 'idNumber':
        return 'Enter last 4 digits of your ID number';
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
      case 'idNumber':
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
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="creditCard">Credit Card (last 4 digits)</SelectItem>
                  <SelectItem value="bankAccount">Bank Account (last 6 digits)</SelectItem>
                  <SelectItem value="idNumber">ID Number (last 4 digits)</SelectItem>
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
                  maxLength={scanType === 'bankAccount' ? 6 : (scanType === 'creditCard' || scanType === 'idNumber' ? 4 : undefined)}
                />
              </div>
              {validationError ? (
                <p className="text-xs text-red-500 mt-1">{validationError}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Your data is encrypted and secure. We never store sensitive information.
                </p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <span className="mr-2">{isRealTime ? 'Real-Time Scanning' : 'Scanning'}</span>
                <div className="relative h-4 w-36 bg-cyber-dark/20 overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-scan-line animate-scanning" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="ml-2">{scanProgress}%</span>
              </>
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
