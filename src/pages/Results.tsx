
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Info, Check, ChevronLeft, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreachCard, { BreachData } from '@/components/BreachCard';
import RecommendationsList, { Recommendation } from '@/components/RecommendationsList';

interface ScanResult {
  scanType: string;
  inputValue: string;
  timestamp: string;
}

const Results = () => {
  const location = useLocation();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [riskScore, setRiskScore] = useState(68);
  
  // Mock breach data
  const [breaches, setBreaches] = useState<BreachData[]>([
    {
      id: '1',
      title: 'TechForum Data Breach',
      domain: 'techforum.com',
      breachDate: '2023-07-12T00:00:00Z',
      affectedData: ['Email', 'Username', 'IP Address'],
      riskLevel: 'medium',
      verified: true,
      description: 'TechForum suffered a security incident that exposed user account information. Approximately 1.2 million accounts were affected.'
    },
    {
      id: '2',
      title: 'CloudStore Breach',
      domain: 'cloudstore.io',
      breachDate: '2022-11-05T00:00:00Z',
      affectedData: ['Email', 'Password (hashed)', 'Name'],
      riskLevel: 'high',
      verified: true,
      description: 'CloudStore experienced a major security breach that exposed user credentials and personal information. The data was found being sold on dark web forums.'
    }
  ]);
  
  // Mock recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Change Password Immediately',
      description: 'Update your password for the affected accounts and ensure it is strong and unique.',
      priority: 'critical',
      icon: 'key',
      completed: false,
    },
    {
      id: '2',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security by enabling 2FA on all your important accounts.',
      priority: 'high',
      icon: 'lock',
      completed: false,
    },
    {
      id: '3',
      title: 'Check Account Activity',
      description: 'Review recent account activity for any suspicious login attempts or changes.',
      priority: 'medium',
      icon: 'user',
      completed: false,
    },
    {
      id: '4',
      title: 'Set Up Breach Alerts',
      description: 'Configure real-time notifications for future data breaches affecting your accounts.',
      priority: 'low',
      icon: 'mail',
      completed: false,
    }
  ]);
  
  useEffect(() => {
    // Get scan result from location state
    if (location.state) {
      setScanResult(location.state as ScanResult);
      
      // Simulate a scan result with different breaches based on scan type
      if (location.state.scanType === 'email') {
        setBreaches([...breaches]);
      } else if (location.state.scanType === 'phone') {
        setBreaches(breaches.slice(0, 1));
        setRiskScore(42);
      } else if (location.state.scanType === 'username') {
        setBreaches([
          {
            id: '3',
            title: 'GamingSite Breach',
            domain: 'gamingsite.net',
            breachDate: '2023-02-18T00:00:00Z',
            affectedData: ['Username', 'Email'],
            riskLevel: 'low',
            verified: false,
            description: 'GamingSite experienced a data leak affecting usernames and associated emails. The breach has not been officially confirmed by the company.'
          }
        ]);
        setRiskScore(28);
      } else {
        setBreaches([]);
        setRiskScore(92);
      }
    }
  }, [location.state]);
  
  // Handle mark recommendation as completed
  const handleCompleteRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, completed: true } : rec
    ));
  };
  
  if (!scanResult) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center">
            <AlertTriangle className="h-16 w-16 text-cyber-warning mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">No Scan Results Found</h1>
            <p className="text-muted-foreground mb-6">
              Please start a new scan to view results.
            </p>
            <Link to="/scan">
              <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                Start New Scan
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/scan" className="inline-flex items-center text-cyber-primary hover:underline mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Scan
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Scan Results</h1>
                <p className="text-muted-foreground">
                  Scan completed on {new Date(scanResult.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-cyber-primary/30 text-cyber-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Link to="/scan">
                  <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                    New Scan
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6 mb-10">
            {/* Scan Details */}
            <div className="md:col-span-8">
              <Card className="cyber-card">
                <CardHeader className="pb-2">
                  <CardTitle>Scan Details</CardTitle>
                  <CardDescription>Information about the completed scan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Scan Type</p>
                      <p className="font-medium capitalize">{scanResult.scanType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="font-medium">
                        {scanResult.scanType === 'email' 
                          ? scanResult.inputValue.replace(/(.{2})(.*)(@.*)/, '$1***$3')
                          : scanResult.scanType === 'phone'
                          ? scanResult.inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3')
                          : '***' + scanResult.inputValue.slice(-4)
                        }
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Scan Date</p>
                      <p className="font-medium">{new Date(scanResult.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Breaches Found</p>
                      <p className="font-medium flex items-center">
                        {breaches.length > 0 ? (
                          <Badge className="bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30">
                            {breaches.length} {breaches.length === 1 ? 'Breach' : 'Breaches'}
                          </Badge>
                        ) : (
                          <Badge className="bg-cyber-success/20 text-cyber-success border border-cyber-success/30">
                            No Breaches
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Score */}
            <div className="md:col-span-4">
              <Card className="cyber-card">
                <CardHeader className="pb-2">
                  <CardTitle>Risk Level</CardTitle>
                  <CardDescription>Your exposure risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          className="text-cyber-dark"
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          strokeDasharray={`${riskScore * 2.83} 283`} 
                          strokeDashoffset="0" 
                          className={`
                            ${riskScore < 40 ? 'text-cyber-success' : 
                              riskScore < 70 ? 'text-cyber-warning' : 
                              'text-cyber-danger'}
                          `}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-2xl font-bold ${
                          riskScore < 40 ? 'text-cyber-success' : 
                          riskScore < 70 ? 'text-cyber-warning' : 
                          'text-cyber-danger'
                        }`}>
                          {riskScore}
                        </span>
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-medium ${
                        riskScore < 40 ? 'text-cyber-success' : 
                        riskScore < 70 ? 'text-cyber-warning' : 
                        'text-cyber-danger'
                      }`}>
                        {riskScore < 40 ? 'Low Risk' : 
                         riskScore < 70 ? 'Medium Risk' : 
                         'High Risk'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {riskScore < 40 
                          ? 'Minimal exposure detected. Continue monitoring.' 
                          : riskScore < 70 
                          ? 'Some exposure detected. Review recommended actions.' 
                          : 'Significant exposure. Immediate action required.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="breaches">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="breaches">Breaches</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breaches">
              {breaches.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    {breaches.length} Breach{breaches.length === 1 ? '' : 'es'} Detected
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {breaches.map(breach => (
                      <BreachCard key={breach.id} breach={breach} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-cyber-dark/30 rounded-lg border border-cyber-primary/20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyber-success/10 flex items-center justify-center">
                    <Check className="h-8 w-8 text-cyber-success" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Breaches Detected</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Great news! We haven't found your information in any known data breaches. 
                    Keep monitoring regularly to stay protected.
                  </p>
                  <Link to="/dashboard">
                    <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations">
              <RecommendationsList 
                recommendations={recommendations} 
                onComplete={handleCompleteRecommendation} 
              />
            </TabsContent>
            
            <TabsContent value="details">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Detailed Scan Analysis</CardTitle>
                  <CardDescription>Comprehensive overview of your digital exposure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Exposure Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="cyber-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-cyber-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Scan Coverage</p>
                            <p className="font-medium">
                              {breaches.length > 0 ? '14.4 billion records' : '12.7 billion records'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cyber-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center">
                            <AlertTriangle className={`h-5 w-5 ${breaches.length > 0 ? 'text-cyber-warning' : 'text-cyber-success'}`} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Exposure Status</p>
                            <p className="font-medium">
                              {breaches.length > 0 ? 'Compromised' : 'Not Exposed'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cyber-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center">
                            <Info className="h-5 w-5 text-cyber-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Breach</p>
                            <p className="font-medium">
                              {breaches.length > 0 
                                ? new Date(breaches[0].breachDate).toLocaleDateString() 
                                : 'None Detected'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Exposed Data Types</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {breaches.length > 0 ? (
                        <>
                          {Array.from(new Set(breaches.flatMap(b => b.affectedData))).map((dataType, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="justify-center py-2 border-cyber-warning text-cyber-warning"
                            >
                              {dataType}
                            </Badge>
                          ))}
                        </>
                      ) : (
                        <p className="text-muted-foreground col-span-full">No data types were found exposed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Risk Assessment</h3>
                    <p className="text-muted-foreground">
                      {riskScore < 40 
                        ? 'Your risk level is low. Continue to monitor your accounts regularly and follow best security practices.' 
                        : riskScore < 70 
                        ? 'Your risk level is moderate. We recommend taking action on the security recommendations provided.' 
                        : 'Your risk level is high. Immediate action is required to secure your accounts and personal information.'}
                    </p>
                    
                    <div className="bg-cyber-dark/50 p-4 rounded-lg border border-cyber-primary/20">
                      <h4 className="font-medium mb-2">Suggested Next Steps</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              rec.priority === 'critical' || rec.priority === 'high' 
                                ? 'bg-cyber-danger/20' 
                                : 'bg-cyber-warning/20'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                rec.priority === 'critical' || rec.priority === 'high' 
                                  ? 'bg-cyber-danger' 
                                  : 'bg-cyber-warning'
                              }`}></div>
                            </div>
                            <span>{rec.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
