
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  ChevronRight, 
  AlertTriangle, 
  Check, 
  History, 
  X, 
  Activity,
  Bell
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SecurityScoreCard from '@/components/SecurityScoreCard';
import BreachCard, { BreachData } from '@/components/BreachCard';
import RecommendationsList, { Recommendation } from '@/components/RecommendationsList';
import { exportReport } from '@/utils/exportUtils';

const Dashboard = () => {
  const navigate = useNavigate();

  const [securityScore] = useState(76);
  const [breachCount] = useState(2);
  const [lastScanDate] = useState(new Date().toISOString());
  const [riskFactor] = useState<'high' | 'medium' | 'low'>('medium');
  
  const [breaches] = useState<BreachData[]>([
    {
      id: '1',
      title: 'MegaStore Data Breach',
      domain: 'megastore.com',
      breachDate: '2023-08-15T00:00:00Z',
      affectedData: ['Email', 'Username', 'Password (hashed)'],
      riskLevel: 'medium',
      verified: true,
      description: 'MegaStore suffered a data breach that exposed user account details. The breach affected approximately 3.2 million customers.'
    },
    {
      id: '2',
      title: 'SocialConnect Exposure',
      domain: 'socialconnect.net',
      breachDate: '2023-05-03T00:00:00Z',
      affectedData: ['Email', 'Name', 'Phone Number'],
      riskLevel: 'high',
      verified: true,
      description: 'SocialConnect experienced a major data leak that exposed personal information of users. The data was found for sale on multiple dark web marketplaces.'
    }
  ]);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts by enabling 2FA wherever possible.',
      priority: 'critical',
      icon: 'lock',
      completed: false,
    },
    {
      id: '2',
      title: 'Change Compromised Passwords',
      description: 'Update passwords for any accounts that were affected by the recent data breaches.',
      priority: 'high',
      icon: 'key',
      completed: false,
    },
    {
      id: '3',
      title: 'Set Up Email Alerts',
      description: 'Configure real-time email notifications for any new breaches detected.',
      priority: 'medium',
      icon: 'mail',
      completed: true,
    },
    {
      id: '4',
      title: 'Review Account Permissions',
      description: 'Check and remove unnecessary permissions from connected applications and services.',
      priority: 'low',
      icon: 'user',
      completed: false,
    }
  ]);
  
  const [scanHistory] = useState([
    {
      id: '1',
      date: new Date('2023-11-15').toISOString(),
      type: 'Email',
      value: 'j***@example.com',
      breachesFound: 2
    },
    {
      id: '2',
      date: new Date('2023-11-10').toISOString(),
      type: 'Username',
      value: 'user***',
      breachesFound: 1
    },
    {
      id: '3',
      date: new Date('2023-11-05').toISOString(),
      type: 'Phone',
      value: '+1 (***) ***-4567',
      breachesFound: 0
    }
  ]);
  
  const [selectedScan, setSelectedScan] = useState<{
    id: string;
    date: string;
    type: string;
    value: string;
    breachesFound: number;
    details?: string;
  } | null>(null);
  
  const [scanDetailsOpen, setScanDetailsOpen] = useState(false);
  
  const [monitoringActive, setMonitoringActive] = useState(false);

  const handleCompleteRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, completed: true } : rec
    ));
  };

  const handleViewScanDetails = (scan: any) => {
    setSelectedScan({
      ...scan,
      details: scan.breachesFound > 0 
        ? `This scan detected ${scan.breachesFound} data breach${scan.breachesFound === 1 ? '' : 'es'} associated with your ${scan.type.toLowerCase()}. The affected information may include personal details, credentials, or other sensitive data.`
        : "No data breaches were found associated with this identifier. Your information appears to be secure."
    });
    setScanDetailsOpen(true);
  };

  const handleExportReport = () => {
    toast.info('Generating breach report...');
    
    const reportData = breaches.map(breach => ({
      Title: breach.title,
      Domain: breach.domain,
      Date: new Date(breach.breachDate).toLocaleDateString(),
      Risk: breach.riskLevel.toUpperCase(),
      AffectedData: breach.affectedData.join(', '),
      Description: breach.description
    }));
    
    setTimeout(() => {
      exportReport(reportData, 'pdf', 'security-breach-report');
      toast.success('Security report has been generated and downloaded');
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'scan':
        navigate('/scan');
        break;
      case 'alerts':
        navigate('/settings', { state: { activeTab: 'notifications' } });
        break;
      case 'monitor':
        if (!monitoringActive) {
          setMonitoringActive(true);
          toast.success('Continuous monitoring has been activated');
          
          setTimeout(() => {
            if (Math.random() > 0.5) {
              toast.error('New breach detected! Check your notifications.', {
                action: {
                  label: 'View',
                  onClick: () => navigate('/notifications')
                }
              });
            }
          }, 10000);
        } else {
          setMonitoringActive(false);
          toast.info('Continuous monitoring has been deactivated');
        }
        break;
      case 'history':
        // Fix for the TypeScript error - properly type the element and check if it exists
        const historyTab = document.querySelector('button[value="history"]') as HTMLButtonElement | null;
        if (historyTab) {
          historyTab.click();
        }
        break;
      default:
        break;
    }
  };

  const handleGenerateDetailedReport = () => {
    if (selectedScan) {
      toast.success("Detailed breach report generated and sent to notifications");
      setScanDetailsOpen(false);
      
      setTimeout(() => {
        toast.info('Report is available in your notifications', {
          action: {
            label: 'View',
            onClick: () => navigate('/notifications')
          }
        });
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your digital footprint and protect your identity
            </p>
          </header>

          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <SecurityScoreCard 
                score={securityScore} 
                breachCount={breachCount} 
                lastScanDate={lastScanDate} 
                riskFactor={riskFactor} 
              />
            </div>

            <div className="md:col-span-8">
              <Card className="cyber-card h-full">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Tools to safeguard your digital identity</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleQuickAction('scan')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Start New Scan</h3>
                          <p className="text-xs text-muted-foreground">
                            Check for new leaked data
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div 
                    className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleQuickAction('alerts')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyber-warning/10 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-cyber-warning" />
                        </div>
                        <div>
                          <h3 className="font-medium">Configure Alerts</h3>
                          <p className="text-xs text-muted-foreground">
                            Set up breach notifications
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div 
                    className={`cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer ${
                      monitoringActive ? 'border-cyber-success border-2' : ''
                    }`}
                    onClick={() => handleQuickAction('monitor')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${
                          monitoringActive 
                            ? 'bg-cyber-success/10 flex items-center justify-center' 
                            : 'bg-cyber-primary/10 flex items-center justify-center'
                        }`}>
                          <Activity className={`h-5 w-5 ${
                            monitoringActive ? 'text-cyber-success' : 'text-cyber-primary'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {monitoringActive ? 'Stop Monitoring' : 'Continuous Monitoring'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {monitoringActive 
                              ? 'Actively monitoring your data' 
                              : 'Track your digital footprint'
                            }
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div 
                    className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleQuickAction('history')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center">
                          <History className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">View Scan History</h3>
                          <p className="text-xs text-muted-foreground">
                            Review previous scan results
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-12">
              <Tabs defaultValue="breaches">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="breaches">Detected Breaches</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="history">Scan History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="breaches" className="space-y-4">
                  {breaches.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                          {breaches.length} Breach{breaches.length === 1 ? '' : 'es'} Detected
                        </h2>
                        <Button 
                          variant="outline" 
                          className="text-cyber-primary border-cyber-primary/30"
                          onClick={handleExportReport}
                        >
                          Export Report
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {breaches.map(breach => (
                          <BreachCard key={breach.id} breach={breach} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyber-success/10 flex items-center justify-center">
                        <Check className="h-8 w-8 text-cyber-success" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No Breaches Detected</h3>
                      <p className="text-muted-foreground mb-6">
                        We haven't found your information in any known data breaches.
                      </p>
                      <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                        Run Another Scan
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <RecommendationsList 
                    recommendations={recommendations} 
                    onComplete={handleCompleteRecommendation} 
                  />
                </TabsContent>
                
                <TabsContent value="history">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Scan History</CardTitle>
                      <CardDescription>Previous scans and their results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {scanHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-cyber-primary/20">
                                <th className="text-left py-3 px-4 font-medium">Date</th>
                                <th className="text-left py-3 px-4 font-medium">Type</th>
                                <th className="text-left py-3 px-4 font-medium">Value</th>
                                <th className="text-left py-3 px-4 font-medium">Breaches Found</th>
                                <th className="text-right py-3 px-4 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {scanHistory.map(scan => (
                                <tr key={scan.id} className="border-b border-cyber-primary/10 hover:bg-cyber-primary/5">
                                  <td className="py-3 px-4">
                                    {new Date(scan.date).toLocaleDateString()}
                                  </td>
                                  <td className="py-3 px-4">{scan.type}</td>
                                  <td className="py-3 px-4">{scan.value}</td>
                                  <td className="py-3 px-4">
                                    {scan.breachesFound > 0 ? (
                                      <span className="text-cyber-warning flex items-center gap-1">
                                        <AlertTriangle className="h-4 w-4" />
                                        {scan.breachesFound}
                                      </span>
                                    ) : (
                                      <span className="text-cyber-success flex items-center gap-1">
                                        <Check className="h-4 w-4" />
                                        0
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-cyber-primary hover:text-cyber-primary/80 hover:bg-cyber-primary/10"
                                      onClick={() => handleViewScanDetails(scan)}
                                    >
                                      View Details
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No scan history available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={scanDetailsOpen} onOpenChange={setScanDetailsOpen}>
        <DialogContent className="cyber-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Scan Details</span>
              <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
            <DialogDescription>
              Information about the selected scan
            </DialogDescription>
          </DialogHeader>
          {selectedScan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedScan.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedScan.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Identifier</p>
                  <p className="font-medium">{selectedScan.value}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Breaches Found</p>
                  <p className={`font-medium flex items-center gap-1 ${selectedScan.breachesFound > 0 ? 'text-cyber-warning' : 'text-cyber-success'}`}>
                    {selectedScan.breachesFound > 0 ? (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        {selectedScan.breachesFound}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        0
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Analysis</p>
                <p>{selectedScan.details}</p>
              </div>
              {selectedScan.breachesFound > 0 && (
                <div className="pt-2">
                  <Button 
                    className="w-full bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
                    onClick={handleGenerateDetailedReport}
                  >
                    Generate Detailed Report
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
