
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import SecurityScoreCard from '@/components/SecurityScoreCard';
import RecommendationsList from '@/components/RecommendationsList';
import BreachCard from '@/components/BreachCard';
import ScanResultExport from '@/components/ScanResultExport';
import { exportOverallReport } from '@/utils/exportUtils';
import { toast } from 'sonner';
import DataSourceIndicator from '@/components/DataSourceIndicator';
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
    getLastScanDate 
  } = useScan();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location]);

  const handleGenerateOverallReport = () => {
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
    
    // Use scan history data
    const scanHistoryData = scanHistory.map(scan => ({
      date: scan.date,
      breachesFound: scan.breachesFound
    }));
    
    setTimeout(() => {
      exportOverallReport(reportData, recommendationsData, scanHistoryData, 'darkwebshield-scan-results');
      toast.success('Comprehensive security report has been generated and downloaded');
    }, 1000);
  };

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
                Scan Results 
                <DataSourceIndicator compact />
              </h1>
              <p className="text-muted-foreground">
                Detailed analysis of potential security threats and vulnerabilities
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-cyber-primary border-cyber-primary/30"
              onClick={handleGenerateOverallReport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Overall Report
            </Button>
          </div>
          
          <DataSourceIndicator />
          
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
                      <span className="font-semibold">Type:</span> {scanHistory.length > 0 ? scanHistory[0].type : 'Unknown'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Breach Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Found Breaches</h2>
                {breaches.length > 0 ? (
                  breaches.map((breach) => (
                    <BreachCard 
                      key={breach.id} 
                      breach={breach}
                    />
                  ))
                ) : (
                  <Card className="cyber-card p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No breaches detected</p>
                      <p className="text-sm text-muted-foreground">
                        Good news! We didn't find your information in any known data breaches.
                        Continue to monitor your accounts regularly for best security practices.
                      </p>
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
              
              {/* Update ScanResultExport with proper data */}
              <ScanResultExport results={breaches.map(breach => ({
                BreachName: breach.title,
                Domain: breach.domain,
                BreachDate: breach.breachDate,
                Severity: breach.riskLevel,
                AffectedData: breach.affectedData.join(', '),
                Description: breach.description.substring(0, 100) + '...'
              }))} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
