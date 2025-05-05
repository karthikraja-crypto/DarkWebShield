import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield, CheckCircle2 } from 'lucide-react';
import SecurityScoreCard from '@/components/SecurityScoreCard';
import RecommendationsList from '@/components/RecommendationsList';
import BreachCard from '@/components/BreachCard';
import ScanResultExport from '@/components/ScanResultExport';
import { exportOverallReport } from '@/utils/exportUtils';
import { toast } from 'sonner';
import { useScan } from '@/contexts/ScanContext';
import { Switch } from '@/components/ui/switch';

const Results = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { 
    breaches, 
    recommendations, 
    scanHistory, 
    isRealData, 
    securityScore,
    getLastScanDate,
    isRealTimeScanMode,
    getLastScanInfo,
    toggleMonitoring,
    isIdMonitored
  } = useScan();

  // Get the last scan type and value
  const { scanType, scanValue } = getLastScanInfo();
  const [isMonitoring, setIsMonitoring] = useState<boolean>(
    scanValue ? isIdMonitored(scanType, scanValue) : false
  );

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  const handleToggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);
    
    // Call context method to toggle monitoring
    if (scanType && scanValue) {
      toggleMonitoring(scanType, scanValue, newState);
      
      // Show appropriate toast message
      if (newState) {
        toast.success(`Continuous Monitoring enabled for ${scanType}`);
      } else {
        toast.info(`Monitoring stopped for ${scanType}`);
      }
    }
  };

  // Get the most recent scan from history
  const getLastScanType = () => {
    if (scanHistory.length === 0) return 'Unknown';
    
    if (isRealTimeScanMode) {
      // Get real scan type if available
      const realScans = scanHistory.filter(scan => scan.isRealScan);
      if (realScans.length > 0) {
        return realScans[0].type;
      }
    }
    
    return scanHistory[0].type;
  };

  // Calculate risk factor based on security score and breaches
  const calculateRiskFactor = (): 'high' | 'medium' | 'low' => {
    // Check for high risk breaches first
    const hasHighRiskBreach = breaches.some(breach => breach.riskLevel === 'high');
    if (hasHighRiskBreach) return 'high';
    
    // Then calculate based on security score
    if (securityScore < 40) return 'high';
    if (securityScore < 75) return 'medium';
    return 'low';
  };

  // Security tips to show when no breaches are found
  const securityTips = [
    "Use strong, unique passwords for each account",
    "Enable two-factor authentication wherever possible",
    "Regularly update your software and applications",
    "Be cautious of phishing attempts and suspicious emails",
    "Monitor your accounts and credit reports regularly",
    "Use a password manager to secure your credentials"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyber-primary">Loading scan results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                {isRealTimeScanMode ? 'Real-Time Scan Results' : 'Scan Results'}
              </h1>
              <p className="text-muted-foreground">
                {isRealTimeScanMode 
                  ? 'Real-time analysis of potential security threats and vulnerabilities'
                  : 'Analysis of potential security threats and vulnerabilities'
                }
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Scan Information Card */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Scan Information</CardTitle>
                  <CardDescription>Details about the most recent scan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Date:</span> {new Date(getLastScanDate()).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span> {getLastScanType()}
                    </p>
                    {scanType && (
                      <p>
                        <span className="font-semibold">Scanned {scanType}:</span> {scanValue ? scanValue.replace(/^(.{3}).*(.{3})$/, '$1***$2') : 'N/A'}
                      </p>
                    )}
                    {isRealTimeScanMode && (
                      <p>
                        <span className="font-semibold">Scan Mode:</span> <span className="text-cyber-primary">Real-Time</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Breach Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {isRealTimeScanMode ? 'Real-Time Breach Results' : 'Found Breaches'}
                </h2>
                {breaches.length > 0 ? (
                  breaches.map((breach) => (
                    <BreachCard 
                      key={breach.id} 
                      breach={breach}
                    />
                  ))
                ) : (
                  <Card className="cyber-card p-6">
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-3">
                        {isRealTimeScanMode ? '✅ No breaches found. You\'re safe!' : 'No breaches found'}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                        Good news! {isRealTimeScanMode ? "We didn't find your information in any known data breaches." : "No breaches were found in this scan."} 
                        Continue to monitor your accounts regularly for best security practices.
                      </p>
                      
                      {/* Security tips */}
                      <div className="bg-cyber-dark/20 rounded-lg p-4 max-w-lg mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-cyber-primary" />
                          <h4 className="font-medium">Security Tips</h4>
                        </div>
                        <ul className="text-left text-sm space-y-2">
                          {securityTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-cyber-primary text-lg leading-none">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <SecurityScoreCard 
                score={securityScore} 
                breachCount={breaches.length}
                lastScanDate={getLastScanDate()}
                riskFactor={calculateRiskFactor()}
              />
              <RecommendationsList recommendations={recommendations} onComplete={undefined} />
              
              {/* Continuous Monitoring Toggle - Now here between recommendations and export */}
              {scanType && scanValue && (
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span>🔁 Continuous Monitoring</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-medium text-sm">
                          {isMonitoring ? 'Active Monitoring' : 'Monitoring Disabled'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          For {scanType}: {scanValue.replace(/^(.{3}).*(.{3})$/, '$1***$2')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {isMonitoring ? "ON" : "OFF"}
                        </span>
                        <Switch
                          checked={isMonitoring}
                          onCheckedChange={handleToggleMonitoring}
                          className={isMonitoring ? "bg-cyber-primary" : ""}
                        />
                      </div>
                    </div>
                    
                    {/* Description Text */}
                    <p className="text-xs text-muted-foreground bg-cyber-dark/10 p-3 rounded-md border border-cyber-primary/10">
                      Enable continuous monitoring to track this ID for future breaches. You'll be instantly notified of any new breach activity detected in real time.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Update ScanResultExport with proper data and scan info */}
              <ScanResultExport 
                results={breaches.map(breach => ({
                  BreachName: breach.title,
                  Domain: breach.domain,
                  BreachDate: breach.breachDate,
                  Severity: breach.riskLevel,
                  AffectedData: breach.affectedData.join(', '),
                  Description: breach.description.substring(0, 100) + '...'
                }))} 
                scanType={scanType}
                scanValue={scanValue}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
