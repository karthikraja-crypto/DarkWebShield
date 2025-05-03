
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GovernmentIDSection from '@/components/GovernmentIDSection';
import ScanFormWrapper from '@/components/ScanFormWrapper';
import RealTimeScanStatus from '@/components/RealTimeScanStatus';
import { Shield, Search, Lock, FileText, Scan as ScanIcon, ShieldAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataSourceIndicator from '@/components/DataSourceIndicator';

const Scan = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded-full px-4 py-1 mb-4">
                <Search className="h-4 w-4 text-cyber-primary" />
                <span className="text-sm text-cyber-primary">New Dark Web Scan</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Exposed Data
              </h1>
              <p className="text-xl text-muted-foreground">
                Check if your personal information has been leaked in data breaches
              </p>
            </div>
            
            <RealTimeScanStatus />
            <DataSourceIndicator />

            <Tabs defaultValue="personal" className="mb-12 mt-6">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="personal" className="py-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Personal Info Scan</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="government" className="py-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Government ID Scan</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <ScanFormWrapper />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="cyber-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center shrink-0">
                          <Shield className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Multiple Data Types</h3>
                          <p className="text-muted-foreground text-sm">
                            Check for various types of personal data exposure including email addresses, phone numbers, usernames, credit cards, and more.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cyber-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center shrink-0">
                          <Lock className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">End-to-End Encryption</h3>
                          <p className="text-muted-foreground text-sm">
                            Your data is securely encrypted and we never store sensitive information like passwords or full credit card numbers.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cyber-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center shrink-0">
                          <Search className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">AI-Powered Scanning</h3>
                          <p className="text-muted-foreground text-sm">
                            Our advanced AI technology scans the dark web for your personal information with higher accuracy than traditional methods.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="government">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <GovernmentIDSection />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="cyber-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center shrink-0">
                          <ShieldAlert className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Maximum Security</h3>
                          <p className="text-muted-foreground text-sm">
                            Government ID scans use enhanced encryption and only require the last 4 digits for secure matching against breached data.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cyber-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center shrink-0">
                          <ScanIcon className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Specialized Scanning</h3>
                          <p className="text-muted-foreground text-sm">
                            Our specialized algorithms detect government ID patterns in dark web data dumps and immediately alert you to potential risks.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cyber-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-cyber-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Detailed Reports</h3>
                          <p className="text-muted-foreground text-sm">
                            Receive comprehensive reports on how your government IDs might have been exposed, along with recommended protection steps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="bg-cyber-dark/50 rounded-lg p-6 border border-cyber-primary/20 text-center mb-8">
              <h2 className="text-xl font-medium mb-4">Why You Should Run a Scan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-cyber-primary mb-2">14.4B</div>
                  <p className="text-sm text-muted-foreground">Leaked credentials found in data breaches</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyber-primary mb-2">75%</div>
                  <p className="text-sm text-muted-foreground">Of users have been affected by a data breach</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyber-primary mb-2">$4.4M</div>
                  <p className="text-sm text-muted-foreground">Average cost of a data breach to businesses</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-medium mb-3">Our Scanning Process is Quick and Secure</h3>
              <p className="text-muted-foreground mb-6">
                Each scan takes approximately 30 seconds and searches through billions of records.
              </p>
              <div className="w-full h-2 bg-cyber-dark/50 rounded-full overflow-hidden mb-8">
                <div className="h-full w-1/3 bg-scan-line animate-scanning"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Scan;
