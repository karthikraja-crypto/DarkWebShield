
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Search, Lock, Database, Bell, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScanForm from '@/components/ScanForm';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-cyber-dark bg-cyber-grid z-0"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyber-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyber-secondary/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded-full px-4 py-1 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse"></div>
                <span className="text-sm text-cyber-primary">Advanced Dark Web Protection</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 glow-text">
                Protect Your Identity from the <span className="text-cyber-primary">Dark Web</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover if your personal information has been exposed in data breaches with our AI-powered scanning technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/scan">
                  <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80 text-lg px-6 py-6">
                    <Search className="mr-2 h-5 w-5" />
                    Start Free Scan
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 text-lg px-6 py-6">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-cyber-primary mb-1">3B+</p>
                  <p className="text-sm text-muted-foreground">Leaked Credentials</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyber-primary mb-1">24/7</p>
                  <p className="text-sm text-muted-foreground">Continuous Monitoring</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyber-primary mb-1">98%</p>
                  <p className="text-sm text-muted-foreground">Detection Accuracy</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyber-primary mb-1">1M+</p>
                  <p className="text-sm text-muted-foreground">Protected Users</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </Button>
          </div>
        </section>

        {/* Scan Form Section */}
        <section className="py-20 bg-cyber-dark/70">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Check Your Digital Exposure</h2>
                <p className="text-muted-foreground">
                  Enter your information below to see if it has been compromised in a data breach
                </p>
              </div>
              
              <ScanForm />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Protection Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                DarkWebShield uses advanced AI technology to protect your digital identity
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="cyber-card p-6">
                <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-cyber-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Dark Web Scanning</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI-powered technology scans the dark web, including hacker forums and data marketplaces, to find your exposed information.
                </p>
                <Link to="/features" className="text-sm text-cyber-primary hover:underline">
                  Learn more →
                </Link>
              </div>
              
              <div className="cyber-card p-6">
                <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-cyber-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Breach Notifications</h3>
                <p className="text-muted-foreground mb-4">
                  Receive instant alerts if your personal information is found in new data breaches, allowing for immediate action.
                </p>
                <Link to="/features" className="text-sm text-cyber-primary hover:underline">
                  Learn more →
                </Link>
              </div>
              
              <div className="cyber-card p-6">
                <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-cyber-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Risk Assessment</h3>
                <p className="text-muted-foreground mb-4">
                  Get detailed security reports with risk scores and actionable recommendations to protect your digital identity.
                </p>
                <Link to="/features" className="text-sm text-cyber-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 bg-cyber-dark/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How DarkWebShield Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our simple yet powerful process to keep your information safe
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyber-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-xl font-bold text-cyber-primary">1</span>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-primary/30 animate-pulse-glow"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Enter Your Info</h3>
                <p className="text-sm text-muted-foreground">
                  Provide the information you want to check for exposure.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyber-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-xl font-bold text-cyber-primary">2</span>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-primary/30 animate-pulse-glow"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">AI Scan</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI scans the dark web for your exposed data.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyber-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-xl font-bold text-cyber-primary">3</span>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-primary/30 animate-pulse-glow"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  Review detailed reports about your digital exposure.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyber-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-xl font-bold text-cyber-primary">4</span>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-primary/30 animate-pulse-glow"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Take Action</h3>
                <p className="text-sm text-muted-foreground">
                  Follow our recommendations to secure your identity.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Trusted by Security Experts</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what cybersecurity professionals say about our services
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="cyber-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyber-primary/20 flex items-center justify-center text-lg font-bold text-cyber-primary">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">CISO at TechCorp</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "DarkWebShield has become an essential part of our security stack. The AI detection is far superior to other solutions we've tried."
                </p>
              </div>
              
              <div className="cyber-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyber-primary/20 flex items-center justify-center text-lg font-bold text-cyber-primary">
                    AS
                  </div>
                  <div>
                    <p className="font-medium">Alex Smith</p>
                    <p className="text-sm text-muted-foreground">Security Analyst</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The level of detail in the breach reports is impressive. Being able to see exactly where and how my data was exposed makes all the difference."
                </p>
              </div>
              
              <div className="cyber-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyber-primary/20 flex items-center justify-center text-lg font-bold text-cyber-primary">
                    MJ
                  </div>
                  <div>
                    <p className="font-medium">Maria Johnson</p>
                    <p className="text-sm text-muted-foreground">Privacy Advocate</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "As someone who values privacy, I appreciate how DarkWebShield not only finds exposed data but provides actionable steps to protect yourself."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-cyber-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded-full px-4 py-1 mb-6">
                <Shield className="h-4 w-4 text-cyber-primary" />
                <span className="text-sm text-cyber-primary">Start protecting yourself today</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Take control of your digital identity now
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust DarkWebShield to monitor and protect their personal information.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80 text-lg px-6 py-6">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 text-lg px-6 py-6">
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
