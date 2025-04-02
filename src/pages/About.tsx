
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, Bell, Database, Server, Brain } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-cyber-dark">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded-full px-4 py-1 mb-6">
                <Shield className="h-4 w-4 text-cyber-primary" />
                <span className="text-sm text-cyber-primary">About DarkWebShield</span>
              </div>
              <h1 className="text-4xl font-bold mb-6">
                Protecting Your Digital Identity in an Unsafe World
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Our mission is to help individuals and businesses safeguard their personal information from dark web exposure.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="relative">
                  <div className="aspect-video bg-cyber-dark/50 rounded-lg overflow-hidden cyber-border">
                    <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="h-24 w-24 text-cyber-primary opacity-50" />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-cyber-primary/10 rounded-lg blur-xl"></div>
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-cyber-secondary/10 rounded-lg blur-xl"></div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-6">
                  DarkWebShield was founded in 2025 by a team of cybersecurity experts with a shared vision: to democratize access to advanced dark web monitoring tools.
                </p>
                <p className="text-muted-foreground mb-6">
                  After witnessing the devastating impact of data breaches on individuals and businesses, our founders recognized the need for an accessible solution that could help people understand and mitigate their digital exposure risks.
                </p>
                <p className="text-muted-foreground">
                  Today, DarkWebShield empowers users to take control of their digital footprint with AI-powered scanning technology that continuously monitors the dark web for exposed personal information.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-20 bg-cyber-dark/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                To provide individuals and organizations with the tools they need to protect their digital identities in an increasingly vulnerable online world.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="cyber-card bg-transparent">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-cyber-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Identify Vulnerabilities</h3>
                  <p className="text-muted-foreground">
                    We help users discover where their personal information has been exposed through data breaches and dark web marketplaces.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cyber-card bg-transparent">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-cyber-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Enhance Protection</h3>
                  <p className="text-muted-foreground">
                    We provide actionable recommendations to help users strengthen their security posture and mitigate risks.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cyber-card bg-transparent">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-cyber-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Continuous Vigilance</h3>
                  <p className="text-muted-foreground">
                    We maintain constant monitoring of the dark web to alert users of new exposures as they occur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Our Technology */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
              <p className="text-xl text-muted-foreground">
                DarkWebShield leverages cutting-edge AI and machine learning to provide comprehensive dark web monitoring.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="cyber-card p-6">
                <Database className="h-8 w-8 text-cyber-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Massive Data Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform scans billions of records from data breaches, dark web forums, and marketplaces.
                </p>
              </div>
              
              <div className="cyber-card p-6">
                <Server className="h-8 w-8 text-cyber-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Infrastructure</h3>
                <p className="text-sm text-muted-foreground">
                  Secure, scalable cloud architecture that ensures fast, reliable scanning operations.
                </p>
              </div>
              
              <div className="cyber-card p-6">
                <Brain className="h-8 w-8 text-cyber-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning algorithms that detect patterns and analyze the severity of data exposures.
                </p>
              </div>
              
              <div className="cyber-card p-6">
                <Lock className="h-8 w-8 text-cyber-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Human Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Our security experts validate critical findings to ensure accuracy and relevance.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center cyber-card p-12">
              <h2 className="text-3xl font-bold mb-6">
                Ready to protect your digital identity?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who trust DarkWebShield to monitor and protect their personal information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80 text-lg px-6 py-6">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/scan">
                  <Button variant="outline" className="border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 text-lg px-6 py-6">
                    Try a Free Scan
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

export default About;
