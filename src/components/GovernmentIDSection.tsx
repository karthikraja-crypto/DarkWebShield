
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
import { ShieldAlert, AlertTriangle, Lock } from 'lucide-react';

type GovernmentIDType = 
  'aadhar' | 
  'pan' | 
  'passport' | 
  'drivingLicense' | 
  'voterID' | 
  'ssn';

const GovernmentIDSection = () => {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<GovernmentIDType>('passport');
  const [idValue, setIdValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isEncryptionConfirmed, setIsEncryptionConfirmed] = useState(false);

  // Simulate ID encryption for security (in a real app, use proper encryption)
  const secureEncrypt = (value: string): string => {
    // This is a placeholder for actual encryption logic
    return value.replace(/[0-9a-zA-Z]/g, '*') + "_encrypted";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idValue.trim()) {
      toast.error('Please enter an ID to scan');
      return;
    }

    if (!isEncryptionConfirmed) {
      toast.error('Please confirm secure encryption before scanning');
      return;
    }
    
    // Encrypt ID before scanning
    const encryptedValue = secureEncrypt(idValue);
    console.log('Encrypted ID:', encryptedValue); // Would be removed in production
    
    // Simulate scanning process
    setIsScanning(true);
    toast.info(`Starting secure scan for ${getIdTypeName(idType)}...`);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate randomly finding breaches (30% chance for demo)
      const breachFound = Math.random() < 0.3;
      
      if (breachFound) {
        toast.error('Alert: Your ID may have been exposed in a data breach', {
          duration: 5000
        });
        
        // Navigate to results with breach info
        navigate('/results', { 
          state: { 
            scanType: 'governmentID',
            idType,
            breachDetected: true,
            riskLevel: 'high',
            timestamp: new Date().toISOString()
          }
        });
      } else {
        toast.success('Scan completed. No breaches detected for your ID.');
        
        navigate('/results', { 
          state: { 
            scanType: 'governmentID',
            idType,
            breachDetected: false,
            riskLevel: 'low',
            timestamp: new Date().toISOString()
          }
        });
      }
    }, 3500);
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
          Government ID Protection
        </CardTitle>
        <CardDescription>
          Securely check if your government IDs have been compromised in data breaches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select 
                value={idType} 
                onValueChange={(value) => setIdType(value as GovernmentIDType)}
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
                  className="cyber-input pl-10"
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder={getIdPlaceholder(idType)}
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We only need the last 4 digits for secure scanning
              </p>
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
                <div className="h-4 w-16 bg-cyber-dark/20 overflow-hidden rounded-full">
                  <div className="h-full w-1/2 bg-scan-line animate-scanning"></div>
                </div>
              </>
            ) : 'Start Secure ID Scan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GovernmentIDSection;
