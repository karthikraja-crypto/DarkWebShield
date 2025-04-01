
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ChevronRight, AlertTriangle, Check, History } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SecurityScoreCard from '@/components/SecurityScoreCard';
import BreachCard, { BreachData } from '@/components/BreachCard';
import RecommendationsList from '@/components/RecommendationsList';

const Dashboard = () => {
  // Mock data
  const [securityScore] = useState(76);
  const [breachCount] = useState(2);
  const [lastScanDate] = useState(new Date().toISOString());
  const [riskFactor] = useState<'high' | 'medium' | 'low'>('medium');
  
  // Mock breaches data
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
  
  // Mock recommendations
  const [recommendations, setRecommendations] = useState([
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
  
  // Mock scan history
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
  
  // Handle mark recommendation as completed
  const handleCompleteRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, completed: true } : rec
    ));
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
            {/* Security Score */}
            <div className="md:col-span-4">
              <SecurityScoreCard 
                score={securityScore} 
                breachCount={breachCount} 
                lastScanDate={lastScanDate} 
                riskFactor={riskFactor} 
              />
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-8">
              <Card className="cyber-card h-full">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Tools to safeguard your digital identity</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/scan">
                    <div className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer">
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
                  </Link>
                  
                  <Link to="/alerts">
                    <div className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer">
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
                  </Link>
                  
                  <Link to="/monitor">
                    <div className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyber-success/10 flex items-center justify-center">
                            <Check className="h-5 w-5 text-cyber-success" />
                          </div>
                          <div>
                            <h3 className="font-medium">Continuous Monitoring</h3>
                            <p className="text-xs text-muted-foreground">
                              Track your digital footprint
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/history">
                    <div className="cyber-card p-4 hover:bg-cyber-primary/5 transition-colors cursor-pointer">
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
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
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
                        <Button variant="outline" className="text-cyber-primary border-cyber-primary/30">
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

      <Footer />
    </div>
  );
};

export default Dashboard;
