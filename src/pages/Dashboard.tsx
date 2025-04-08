
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import SecurityScoreCard from '@/components/SecurityScoreCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, ShieldAlert, Bell, History, FileBarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScan } from '@/contexts/ScanContext';
import DataSourceIndicator from '@/components/DataSourceIndicator';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    breaches, 
    recommendations, 
    scanHistory, 
    securityScore,
    isRealData,
    hasNewNotification,
    clearNotification
  } = useScan();

  // Navigate to the scan page
  const handleNewScan = () => {
    navigate('/scan');
  };

  // Navigate to notifications page and clear the notification indicator
  const handleViewNotifications = () => {
    clearNotification();
    navigate('/notifications');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">Security Dashboard</h1>
                <DataSourceIndicator compact />
              </div>
              <p className="text-muted-foreground mt-1">
                Monitor your digital security status and get recommendations
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleViewNotifications}
                className="relative p-2 bg-background border rounded-md hover:bg-accent transition-colors"
              >
                <Bell className="h-5 w-5" />
                {hasNewNotification && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></span>
                )}
              </button>
              <button
                onClick={handleNewScan}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                New Scan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Score */}
            <Card className="col-span-1">
              <CardContent className="pt-6">
                <SecurityScoreCard score={securityScore} />
              </CardContent>
            </Card>

            {/* Detected Breaches and Recommendations */}
            <Card className="col-span-1 lg:col-span-2">
              <Tabs defaultValue="breaches" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="breaches" className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Detected Breaches</span>
                    <Badge variant="secondary" className="ml-auto">
                      {breaches.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Recommendations</span>
                    <Badge variant="secondary" className="ml-auto">
                      {recommendations.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="breaches">
                  <div className="p-4">
                    {breaches.length > 0 ? (
                      <div className="space-y-4">
                        {breaches.map((breach) => (
                          <div
                            key={breach.id}
                            className="flex items-center justify-between p-4 bg-card border rounded-lg"
                          >
                            <div>
                              <h3 className="font-medium">
                                {breach.title}
                                <Badge
                                  variant={breach.riskLevel === "high" ? "destructive" : "outline"}
                                  className="ml-2"
                                >
                                  {breach.riskLevel === "high" ? "High Risk" : "Medium Risk"}
                                </Badge>
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Data: {breach.affectedData.join(", ")}
                              </p>
                            </div>
                            <button
                              onClick={() => navigate('/results')}
                              className="text-sm text-primary hover:underline"
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No breaches detected</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="recommendations">
                  <div className="p-4">
                    {recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {recommendations.map((recommendation) => (
                          <div
                            key={recommendation.id}
                            className="flex items-center justify-between p-4 bg-card border rounded-lg"
                          >
                            <div>
                              <h3 className="font-medium">
                                {recommendation.title}
                                <Badge
                                  variant={recommendation.priority === "high" ? "destructive" : "outline"}
                                  className="ml-2"
                                >
                                  {recommendation.priority === "high" ? "High Priority" : "Medium Priority"}
                                </Badge>
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {recommendation.description}
                              </p>
                            </div>
                            <button className="text-sm text-primary hover:underline">
                              View Steps
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No recommendations available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Scan History */}
            <Card className="col-span-1 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    <h2 className="text-lg font-medium">Scan History</h2>
                  </div>
                  <button
                    onClick={() => navigate('/results')}
                    className="text-sm text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>

                {scanHistory.length > 0 ? (
                  <div className="space-y-4">
                    {scanHistory.slice(0, 3).map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between p-4 bg-card border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{scan.type} Scan</h3>
                            {!scan.isRealScan && (
                              <Badge variant="secondary" className="text-xs">
                                Sample
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {scan.value} • {new Date(scan.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={scan.breachesFound > 0 ? "destructive" : "outline"}
                            className="mr-2"
                          >
                            {scan.breachesFound} {scan.breachesFound === 1 ? "Breach" : "Breaches"}
                          </Badge>
                          <button
                            onClick={() => navigate('/results')}
                            className="text-sm text-primary hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No scan history available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Report */}
            <Card className="col-span-1">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileBarChart className="h-5 w-5" />
                  <h2 className="text-lg font-medium">Export Report</h2>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Generate a comprehensive report of your security status and scan results.
                </p>

                <button
                  onClick={() => navigate('/results')}
                  className="w-full px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
                >
                  Generate Report
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
