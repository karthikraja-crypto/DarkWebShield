
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShieldAlert, AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';
import { BreachData } from '@/components/BreachCard';

type GovernmentIDType = 
  'aadhar' | 
  'pan' | 
  'passport' | 
  'drivingLicense' | 
  'voterID' | 
  'ssn';

// Common patterns for known ID formats
const ID_PATTERNS = {
  aadhar: /^\d{4}$/,
  pan: /^[A-Z0-9]{4}$/,
  passport: /^[A-Z0-9]{4}$/,
  drivingLicense: /^[A-Z0-9]{4}$/,
  voterID: /^[A-Z0-9]{4}$/,
  ssn: /^\d{4}$/
};

// Known breach database simulation - in real app, this would be an API call
const BREACH_DATABASE = {
  aadhar: ['1234', '5678', '9012', '3456'],
  pan: ['ABCD', 'EFGH', 'IJKL', 'MNOP'],
  passport: ['A123', 'B456', 'C789', 'D012'],
  drivingLicense: ['X123', 'Y456', 'Z789', 'W012'],
  voterID: ['ID34', 'ID56', 'ID78', 'ID90'],
  ssn: ['1234', '5678', '9012', '3456']
};

const GovernmentIDSection = () => {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<GovernmentIDType>('passport');
  const [idValue, setIdValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isEncryptionConfirmed, setIsEncryptionConfirmed] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Get the scan context
  const { addRealScan, isRealTimeScanMode } = useScan();

  // Advanced ID encryption for security
  const secureEncrypt = (value: string, type: GovernmentIDType): string => {
    // This is a simulated encryption - in production, use proper encryption libraries
    const salt = `${type}-${new Date().getTime()}`;
    const encrypted = value.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode((code + 7) % 126);
    }).join('');
    
    return `${encrypted}_${salt}_encrypted`;
  };

  const validateIdFormat = (value: string, type: GovernmentIDType): boolean => {
    const pattern = ID_PATTERNS[type];
    if (!pattern) return true; // If no pattern defined, allow any input
    
    return pattern.test(value);
  };

  const checkBreachDatabase = (value: string, type: GovernmentIDType): boolean => {
    // Simulating database check - in production, this would be a secure API call
    const breachList = BREACH_DATABASE[type] || [];
    return breachList.includes(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!idValue.trim()) {
      toast.error('Please enter an ID to scan');
      setValidationError('ID value is required');
      return;
    }

    if (!validateIdFormat(idValue, idType)) {
      toast.error(`Invalid format for ${getIdTypeName(idType)}`);
      setValidationError(`Please enter a valid ${getIdTypeName(idType)} format (${getIdPlaceholder(idType)})`);
      return;
    }

    if (!isEncryptionConfirmed) {
      toast.error('Please confirm secure encryption before scanning');
      return;
    }
    
    // Encrypt ID before scanning
    const encryptedValue = secureEncrypt(idValue, idType);
    console.log('Encrypted ID:', encryptedValue); // Would be removed in production
    
    // Simulate advanced scanning process
    setIsScanning(true);
    setScanProgress(0);

    const scanMessage = isRealTimeScanMode
      ? `Starting real-time secure scan for ${getIdTypeName(idType)}...`
      : `Starting secure scan for ${getIdTypeName(idType)}...`;
      
    toast.info(scanMessage);
    
    // Simulate multi-stage scanning process
    const simulateScanStages = () => {
      // Stage 1: Initial encryption check
      setTimeout(() => {
        setScanProgress(20);
        toast.info('Verifying encryption integrity...', { id: 'scan-progress' });
        
        // Stage 2: First database check
        setTimeout(() => {
          setScanProgress(40);
          toast.info('Searching primary breach database...', { id: 'scan-progress' });
          
          // Stage 3: Deep web scan
          setTimeout(() => {
            setScanProgress(60);
            toast.info('Scanning deep web forums...', { id: 'scan-progress' });
            
            // Stage 4: Dark web marketplace scan
            setTimeout(() => {
              setScanProgress(80);
              toast.info('Analyzing dark web marketplaces...', { id: 'scan-progress' });
              
              // Final stage: Results compilation
              setTimeout(() => {
                setScanProgress(100);
                setIsScanning(false);
                
                // Determine if breach found - now using our simulated database
                const breachFound = checkBreachDatabase(idValue, idType);
                
                // Create breach data if found
                let foundBreaches: BreachData[] = [];
                
                if (breachFound) {
                  // Create a real breach entry
                  foundBreaches = [{
                    id: `breach-${Date.now()}`,
                    title: `${getIdTypeName(idType)} Breach Detected`,
                    domain: 'darkwebmarketplace.onion',
                    breachDate: new Date(Date.now() - 7776000000).toISOString(), // ~90 days ago
                    affectedData: [getIdTypeName(idType), 'Personal Information', 'Identity Documents'],
                    riskLevel: 'high',
                    verified: true,
                    description: `Your ${getIdTypeName(idType)} appears to have been exposed in a recent dark web breach. This is a serious security risk that could lead to identity theft.`
                  }];
                  
                  toast.error('Alert: Your ID may have been exposed in a data breach', {
                    duration: 5000
                  });
                  
                  // Add the real scan to our context
                  addRealScan(idType, idValue, foundBreaches, isRealTimeScanMode);
                } else {
                  const successMessage = isRealTimeScanMode
                    ? '✅ No breaches found. You\'re safe!'
                    : 'Scan completed. No breaches detected for your ID.';
                    
                  toast.success(successMessage);
                  
                  // Add the scan to our context (with empty breaches)
                  addRealScan(idType, idValue, [], isRealTimeScanMode);
                }
                
                // Navigate to results with detailed breach info
                navigate('/results');
              }, 700);
            }, 700);
          }, 800);
        }, 600);
      }, 500);
    };
    
    simulateScanStages();
  };

  const getIdTypeName = (type: GovernmentIDType): string => {
    switch (type) {
      case 'aadhar': return 'Aadhar Number';
      case 'pan': return 'PAN Card Number';
      case 'passport': return 'Passport Number';
      case 'drivingLicense': return 'Driver\'s License Number';
      case 'voterID': return 'Voter ID';
      case 'ssn': return 'Social Security Number (SSN)';
      default: return 'Government ID';
    }
  };

  const getIdPlaceholder = (type: GovernmentIDType): string => {
    switch (type) {
      case 'aadhar': return 'Enter last 4 digits of Aadhar';
      case 'pan': return 'Enter last 4 digits of PAN';
      case 'passport': return 'Enter last 4 digits of Passport';
      case 'drivingLicense': return 'Enter last 4 digits of License';
      case 'voterID': return 'Enter last 4 digits of Voter ID';
      case 'ssn': return 'Enter last 4 digits of SSN';
      default: return 'Enter last 4 digits';
    }
  };

  return (
    <Card className="cyber-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyber-primary">
          <ShieldAlert className="h-5 w-5" />
          {isRealTimeScanMode ? 'Real-Time Government ID Protection' : 'Government ID Protection'}
        </CardTitle>
        <CardDescription>
          Securely check if your government IDs have been compromised in data breaches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isRealTimeScanMode && (
          <Alert className="mb-4 bg-muted/30 border-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              For demo purposes, try ID "1234" to see a breach result.
            </AlertDescription>
          </Alert>
        )}
      
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select 
                value={idType} 
                onValueChange={(value) => {
                  setIdType(value as GovernmentIDType);
                  setIdValue(''); // Reset value when type changes
                  setValidationError('');
                }}
              >
                <SelectTrigger className="cyber-input">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Number (India)</SelectItem>
                  <SelectItem value="pan">PAN Card Number (India)</SelectItem>
                  <SelectItem value="passport">Passport Number</SelectItem>
                  <SelectItem value="drivingLicense">Driver's License Number</SelectItem>
                  <SelectItem value="voterID">Voter ID</SelectItem>
                  <SelectItem value="ssn">Social Security Number (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idValue">ID Number (Last 4 digits only)</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="idValue"
                  className={`cyber-input pl-10 ${validationError ? 'border-red-500' : ''}`}
                  value={idValue}
                  onChange={(e) => {
                    setIdValue(e.target.value);
                    setValidationError('');
                  }}
                  placeholder={getIdPlaceholder(idType)}
                  maxLength={4}
                />
              </div>
              {validationError ? (
                <p className="text-xs text-red-500 mt-1">{validationError}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  We only need the last 4 digits for secure scanning
                </p>
              )}
            </div>

            <Alert className="bg-cyber-dark/40 border-cyber-primary/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                For your security, all ID numbers are encrypted before scanning and never stored permanently.
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="encryptionConfirm" 
                checked={isEncryptionConfirmed}
                onCheckedChange={(checked) => setIsEncryptionConfirmed(checked === true)}
              />
              <Label htmlFor="encryptionConfirm" className="text-sm">
                I understand that my data will be securely encrypted and not stored permanently
              </Label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
            disabled={isScanning || !isEncryptionConfirmed}
          >
            {isScanning ? (
              <>
                <span className="mr-2">Scanning</span>
                <div className="relative h-4 w-36 bg-cyber-dark/20 overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-scan-line animate-scanning" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="ml-2">{scanProgress}%</span>
              </>
            ) : (isRealTimeScanMode ? 'Start Real-Time Secure ID Scan' : 'Start Secure ID Scan')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GovernmentIDSection;
