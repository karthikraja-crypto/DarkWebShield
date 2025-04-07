import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Database, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureDetails from '@/components/FeatureDetails';
import { toast } from 'sonner';

const Index = () => {
  console.log('Index page rendering');
  
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in for demo purposes
  // In a real app, this would use a proper auth state management system
  useEffect(() => {
    console.log('Index useEffect running');
    
    // Simulate getting login state - this would be replaced with actual auth check
    const checkLoginStatus = () => {
      console.log('Checking login status');
      // For demo: check if we have a stored login state
      const loginState = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginState === 'true');
      console.log('Login state:', loginState === 'true');
    };
    
    checkLoginStatus();
    
    // Add event listener for login state changes
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleStartScan = () => {
    console.log('Start scan clicked, isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      navigate('/scan');
    } else {
      toast.error('Please log in or sign up to start scanning');
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cyber-dark">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 glow-text">
                Protect Your Digital Identity From Dark Web Threats
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                DarkWebShield scans the dark web for your personal information and alerts you when your data is compromised. Stay protected with real-time monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  onClick={handleStartScan}
                  size="lg" 
                  className="bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-dark font-bold"
                >
                  Start Scanning Now
                </Button>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-cyber-primary text-cyber-primary hover:bg-cyber-primary/10"
                  >
                    Learn How It Works
                  </Button>
                </Link>
              </div>
              
              {!isLoggedIn && (
                <div className="bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg p-4 mb-12">
                  <p className="text-cyber-primary flex items-center justify-center gap-2">
                    <Lock className="h-5 w-5" />
                    <span>You must log in or sign up before scanning</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-cyber-dark/80">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Comprehensive Protection Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our advanced tools work around the clock to keep your identity safe from cyber threats
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureDetails 
                title="Dark Web Monitoring" 
                description="Continuous scanning of the dark web for your personal information"
                detailedDescription="Our sophisticated algorithms continuously scan thousands of dark web sites, forums, and marketplaces where cybercriminals trade stolen data. We monitor for your email addresses, passwords, credit card numbers, social security numbers, and other personal information. When a match is found, you're instantly alerted so you can take immediate action to protect yourself."
                icon={<Shield className="h-6 w-6 text-cyber-primary" />} 
              />
              
              <FeatureDetails 
                title="Data Breach Alerts" 
                description="Instant notifications when your data appears in breaches"
                detailedDescription="Our system monitors known data breaches and immediately alerts you if your personal information is found. We provide detailed reports on what specific information was exposed, when the breach occurred, which company was affected, and what steps you should take to secure your accounts. Real-time alerts help you take prompt action to change passwords and secure your accounts before cybercriminals can use your information."
                icon={<AlertTriangle className="h-6 w-6 text-cyber-primary" />} 
              />
              
              <FeatureDetails 
                title="Identity Protection" 
                description="Tools and guidance to secure your online presence"
                detailedDescription="Beyond monitoring, we offer comprehensive guidance to help you secure your digital identity. This includes step-by-step instructions for creating strong, unique passwords, enabling two-factor authentication, securing your social media accounts, and recognizing phishing attempts. Our protection extends to practical advice on managing your personal information online and minimizing your digital footprint to make you less vulnerable to identity theft."
                icon={<Lock className="h-6 w-6 text-cyber-primary" />} 
              />
              
              <FeatureDetails 
                title="Credential Monitoring" 
                description="Protection against password leaks and credential stuffing"
                detailedDescription="We actively monitor for leaked credentials associated with your email addresses and online accounts. Our system identifies compromised passwords across multiple platforms and alerts you to change them immediately. This proactive approach helps prevent credential stuffing attacks, where hackers use leaked passwords from one service to gain unauthorized access to your other accounts. Timely alerts enable you to update your credentials before your accounts can be compromised."
                icon={<Database className="h-6 w-6 text-cyber-primary" />} 
              />
              
              <FeatureDetails 
                title="Vulnerability Assessment" 
                description="Identify weak points in your digital security"
                detailedDescription="Our comprehensive security assessment identifies vulnerabilities in your online accounts and digital habits. We analyze your security practices and provide personalized recommendations to strengthen your defenses. This includes identifying outdated software, weak password practices, missing security features like two-factor authentication, and vulnerable connected devices. Our detailed reports help you understand your risk level and prioritize security improvements."
                icon={<Shield className="h-6 w-6 text-cyber-primary" />} 
              />
              
              <FeatureDetails 
                title="Security Recommendations" 
                description="Personalized advice to improve your security posture"
                detailedDescription="Based on our findings, we provide tailored recommendations to strengthen your digital security. These actionable insights help you implement best practices for protecting your identity online. Our recommendations include specific steps for securing different types of accounts, managing your personal information across platforms, and adopting privacy-enhancing technologies. Each recommendation comes with detailed instructions, making it easy to implement even complex security measures."
                icon={<Lock className="h-6 w-6 text-cyber-primary" />} 
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-cyber-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Protecting Your Digital Identity Today</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Don't wait until it's too late. Take control of your digital security now.
            </p>
            <Button 
              onClick={handleStartScan}
              size="lg" 
              className="bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-dark font-bold"
            >
              Start Your First Scan
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
