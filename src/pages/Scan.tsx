
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScanForm from '@/components/ScanForm';
import { Shield, Search, Lock } from 'lucide-react';

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

            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div>
                <ScanForm />
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
