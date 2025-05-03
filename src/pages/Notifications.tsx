import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle, Shield, Bell, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScan } from '@/contexts/ScanContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Define notification filter types
type NotificationFilter = 'all' | 'breach' | 'scan' | 'system' | 'custom';

const Notifications = () => {
  const { scanHistory, breaches, isRealTimeScanMode, clearNotification } = useScan();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  
  // Clear any new notification alerts when visiting this page
  useEffect(() => {
    clearNotification();
  }, [clearNotification]);
  
  // Get scans based on mode
  const relevantScans = isRealTimeScanMode
    ? scanHistory.filter(scan => scan.isRealScan)
    : scanHistory;
  
  // Get scans with breaches based on mode
  const scansWithBreaches = relevantScans.filter(scan => scan.breachesFound > 0);

  // Filter notifications based on selected category
  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return scansWithBreaches;
    if (activeFilter === 'breach') return scansWithBreaches.filter(scan => scan.breachesFound > 1);
    if (activeFilter === 'scan') return relevantScans.filter(scan => scan.breachesFound === 0);
    if (activeFilter === 'system') return relevantScans.filter(scan => scan.isRealScan);
    if (activeFilter === 'custom') return []; // Custom alerts not implemented yet
    return scansWithBreaches;
  };
  
  const filteredNotifications = getFilteredNotifications();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Bell className="h-5 w-5 mr-2 text-cyber-primary" />
                <h1 className="text-3xl font-bold">
                  {isRealTimeScanMode ? 'Real-Time Notifications & Alerts' : 'Notifications & Alerts'}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Stay informed about your digital security with personalized alerts
              </p>
              
              {/* Filter Toggle Group */}
              <Card className="mb-6 p-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-2">Filter notifications by:</h3>
                  <ToggleGroup type="single" value={activeFilter} onValueChange={(value) => value && setActiveFilter(value as NotificationFilter)}>
                    <ToggleGroupItem value="all" aria-label="All notifications">
                      All
                    </ToggleGroupItem>
                    <ToggleGroupItem value="breach" aria-label="Breach alerts">
                      Breach Alerts
                    </ToggleGroupItem>
                    <ToggleGroupItem value="scan" aria-label="Scan reports">
                      Scan Reports
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" aria-label="System messages">
                      System Messages
                    </ToggleGroupItem>
                    <ToggleGroupItem value="custom" aria-label="Custom alerts">
                      Custom Alerts
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </Card>
            </div>
            
            <div className="space-y-8 mt-6">
              {/* Recent Breach Alerts */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {activeFilter === 'all' ? 'Recent Alerts' : 
                       activeFilter === 'breach' ? 'Breach Alerts' :
                       activeFilter === 'scan' ? 'Scan Reports' :
                       activeFilter === 'system' ? 'System Messages' :
                       'Custom Alerts'}
                    </span>
                    {filteredNotifications.length > 0 && (
                      <Badge variant="destructive">
                        {filteredNotifications.length} {filteredNotifications.length === 1 ? 'Alert' : 'Alerts'}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {activeFilter === 'all' ? 'Important security notifications about your scanned data' :
                     activeFilter === 'breach' ? 'Notifications about detected data breaches' :
                     activeFilter === 'scan' ? 'Results from your security scans' :
                     activeFilter === 'system' ? 'System updates and security alerts' :
                     'Personalized security alerts'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.slice(0, 5).map((scan) => (
                        <div key={scan.id} className="flex items-start gap-3 pb-4 border-b border-muted last:border-0 last:pb-0">
                          <div className="bg-red-500/10 p-2 rounded-full">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">
                                {isRealTimeScanMode ? 'Your' : (scan.isRealScan ? 'Your' : 'Sample')} {scan.type} was found in {scan.breachesFound} {scan.breachesFound === 1 ? 'breach' : 'breaches'}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {new Date(scan.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isRealTimeScanMode || scan.isRealScan
                                ? `Your ${scan.type.toLowerCase()} "${scan.value}" appears to be compromised. Immediate action is recommended to secure your accounts.`
                                : `This is a sample alert showing how a real breach notification would appear for ${scan.type.toLowerCase()} "${scan.value}".`
                              }
                            </p>
                            <Button 
                              variant="link" 
                              className="px-0 h-auto py-1 text-cyber-primary" 
                              onClick={() => navigate('/results')}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center bg-green-500/10 p-3 rounded-full mb-3">
                        <Shield className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No {activeFilter !== 'all' ? `${activeFilter} ` : ''}alerts</h3>
                      <p className="text-muted-foreground text-sm">
                        {isRealTimeScanMode 
                          ? `No ${activeFilter !== 'all' ? activeFilter + ' ' : ''}notifications at this time. We'll keep monitoring for new threats.` 
                          : `You're viewing sample data. Run a scan to check for ${activeFilter !== 'all' ? activeFilter + ' ' : ''}alerts.`
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scan History Table */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Scan History</CardTitle>
                  <CardDescription>
                    {isRealTimeScanMode
                      ? (relevantScans.length > 0
                          ? `You've run ${relevantScans.length} real scan${relevantScans.length === 1 ? '' : 's'}`
                          : "No real scans performed yet"
                        )
                      : "Scan history with sample and real data"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {relevantScans.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Breaches</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relevantScans.slice(0, 10).map((scan) => (
                          <TableRow key={scan.id}>
                            <TableCell>{new Date(scan.date).toLocaleDateString()}</TableCell>
                            <TableCell>{scan.type}</TableCell>
                            <TableCell>{scan.value}</TableCell>
                            <TableCell>{scan.breachesFound}</TableCell>
                            <TableCell>
                              {scan.breachesFound > 0 ? (
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                  <span className="text-red-500 font-medium">Alert</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                  <span className="text-green-500">Secure</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {isRealTimeScanMode
                        ? "No real-time scans performed yet. Run a scan in real-time mode to see results here."
                        : "No scan history available. Try scanning some data first."
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Security Tips */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-cyber-primary" />
                    <span>Security Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="bg-muted w-1 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">Use a password manager</h4>
                        <p className="text-sm text-muted-foreground">
                          Password managers help you create and store strong, unique passwords for all your accounts.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-muted w-1 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">Enable two-factor authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your accounts with two-factor authentication.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-muted w-1 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">Check for breaches regularly</h4>
                        <p className="text-sm text-muted-foreground">
                          Run regular scans to detect if your information has been compromised in new data breaches.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
