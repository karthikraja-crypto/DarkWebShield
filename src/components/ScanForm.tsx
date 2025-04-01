
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
import { Mail, Phone, User, CreditCard, Building, AlertTriangle } from 'lucide-react';

type ScanType = 'email' | 'phone' | 'username' | 'creditCard' | 'bankAccount' | 'idNumber' | 'ipAddress' | 'physicalAddress';

const ScanForm = () => {
  const navigate = useNavigate();
  const [scanType, setScanType] = useState<ScanType>('email');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast.error('Please enter a value to scan');
      return;
    }
    
    // Simulate scanning process
    setIsScanning(true);
    toast.info('Starting dark web scan...');
    
    // Simulate API call delay
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Scan completed successfully');
      
      // Navigate to results page with the input data
      navigate('/results', { 
        state: { 
          scanType,
          inputValue,
          timestamp: new Date().toISOString()
        }
      });
    }, 3000);
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
      case 'physicalAddress':
        return <Building className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getPlaceholder = () => {
    switch (scanType) {
      case 'email':
        return 'Enter your email address';
      case 'phone':
        return 'Enter your phone number';
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
    }
  };

  return (
    <Card className="cyber-card w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-cyber-primary">Dark Web Scan</CardTitle>
        <CardDescription>
          Check if your personal information has been exposed in data breaches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scanType">Information Type</Label>
              <Select 
                value={scanType} 
                onValueChange={(value) => setScanType(value as ScanType)}
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
                  className="cyber-input pl-10"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholder()}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your data is encrypted and secure. We never store sensitive information.
              </p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <span className="mr-2">Scanning</span>
                <div className="h-4 w-16 bg-cyber-dark/20 overflow-hidden rounded-full">
                  <div className="h-full w-1/2 bg-scan-line animate-scanning"></div>
                </div>
              </>
            ) : 'Start Scan'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-cyber-primary/20 pt-4">
        <p className="text-xs text-muted-foreground text-center">
          Powered by advanced AI and dark web monitoring technology
        </p>
      </CardFooter>
    </Card>
  );
};

export default ScanForm;
