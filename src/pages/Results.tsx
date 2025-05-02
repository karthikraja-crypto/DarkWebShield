
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
    getLastScanInfo
  } = useScan();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // Get the last scan type and value
  const { scanType, scanValue } = getLastScanInfo();

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

  const handleGenerateOverallReport = () => {
    const reportPrefix = isRealTimeScanMode ? 'real-time-scan' : 'darkwebshield-scan';
    toast.info('Generating comprehensive security report...');
    
    // Prepare the report data
    const reportData = breaches.map(breach => ({
      Title: breach.title,
      Domain: breach.domain,
      Date: new Date(breach.breachDate).toLocaleDateString(),
      Risk: breach.riskLevel.toUpperCase(),
      AffectedData: breach.affectedData.join(', '),
      Description: breach.description
    }));
    
    // Prepare recommendations data
    const recommendationsData = recommendations.map(rec => ({
      Title: rec.title,
      Priority: rec.priority,
      Status: 'Pending',
      Description: rec.description
    }));
    
    // Use real scan history data if in real-time mode
    const relevantScanHistory = isRealTimeScanMode 
      ? scanHistory.filter(scan => scan.isRealScan)
      : scanHistory;
      
    // Process scan history data
    const scanHistoryData = relevantScanHistory.map(scan => ({
      date: scan.date,
      breachesFound: scan.breachesFound
    }));
    
    setTimeout(() => {
      exportOverallReport(reportData, recommendationsData, scanHistoryData, reportPrefix + '-results');
      toast.success('Comprehensive security report has been generated and downloaded');
    }, 1000);
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
          <div className="mb-8 flex justify-between items-center">
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
            <Button 
              variant="outline" 
              className="text-cyber-primary border-cyber-primary/30"
              onClick={handleGenerateOverallReport}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isRealTimeScanMode ? 'Export Real-Time Report' : 'Export Report'}
            </Button>
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
                riskFactor={breaches.length > 0 ? 'high' : 'low'}
              />
              <RecommendationsList recommendations={recommendations} />
              
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
