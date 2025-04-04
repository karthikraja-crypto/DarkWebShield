
import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import SecurityScoreCard from '@/components/SecurityScoreCard';
import RecommendationsList, { Recommendation } from '@/components/RecommendationsList';
import BreachCard, { BreachData } from '@/components/BreachCard';
import ScanResultExport from '@/components/ScanResultExport';
import { exportOverallReport } from '@/utils/exportUtils';
import { toast } from 'sonner';
import { AuthContext } from '@/App';

// Mock data for breaches aligned with BreachData interface
const mockBreaches: BreachData[] = [
  {
    id: '1',
    title: 'Adobe Breach',
    domain: 'adobe.com',
    breachDate: '2013-10-03',
    affectedData: ['Email', 'Passwords', 'Credit Cards'],
    riskLevel: 'high',
    verified: true,
    description: 'In October 2013, 153 million Adobe accounts were breached, resulting in exposed user IDs, usernames, passwords, and password hints. The passwords were a mix of unsalted SHA-1 hashes and crypt().'
  },
  {
    id: '2',
    title: 'MySpace Breach',
    domain: 'myspace.com',
    breachDate: '2016-05-26',
    affectedData: ['Email', 'Username', 'Password'],
    riskLevel: 'high',
    verified: true,
    description: 'In May 2016, MySpace suffered a data breach that exposed over 360 million accounts. The breach included email addresses, usernames, and passwords.'
  },
  {
    id: '3',
    title: 'LinkedIn Breach',
    domain: 'linkedin.com',
    breachDate: '2012-06-06',
    affectedData: ['Email', 'Password', 'User Details'],
    riskLevel: 'high',
    verified: true,
    description: 'In June 2012, LinkedIn suffered a major data breach that exposed 164 million accounts. The exposed data included email addresses and passwords.'
  }
];

// Mock data for recommendations aligned with updated Recommendation interface
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Enable Two-Factor Authentication',
    description: 'Protect your account with an extra layer of security.',
    priority: 'high',
    icon: 'lock',
    completed: false,
    setupSteps: [
      'Go to your account settings page',
      'Navigate to the "Security" or "Privacy" section',
      'Look for "Two-Factor Authentication" or "2FA" option',
      'Select your preferred 2FA method (SMS, authenticator app, etc.)',
      'Follow the on-screen instructions to set up your device',
      'Save your backup codes in a secure location',
      'Verify that 2FA is working by logging out and back in'
    ]
  },
  {
    id: '2',
    title: 'Update Your Password',
    description: 'Your current password may be vulnerable. Update it to a strong, unique password.',
    priority: 'medium',
    icon: 'key',
    completed: false,
    setupSteps: [
      'Go to your account settings',
      'Find the "Change Password" option',
      'Create a strong password with at least 12 characters',
      'Include a mix of uppercase, lowercase, numbers, and symbols',
      'Avoid using personal information or common phrases',
      'Use a password manager to store your password securely',
      'Enable password change notifications if available'
    ]
  },
  {
    id: '3',
    title: 'Monitor Your Credit Report',
    description: 'Regularly check your credit report for any unauthorized activity.',
    priority: 'low',
    icon: 'shield',
    completed: false,
    setupSteps: [
      'Request your free annual credit report from annualcreditreport.com',
      'Review your report for any accounts you don\'t recognize',
      'Check for inquiries you didn\'t authorize',
      'Set up credit monitoring through your bank or a third-party service',
      'Consider placing a fraud alert or credit freeze for added protection',
      'Report any suspicious activity immediately',
      'Schedule regular reviews of your credit report (at least quarterly)'
    ]
  }
];

const Results = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scanDate, setScanDate] = useState<string>('');
  const [scanDuration, setScanDuration] = useState<number>(0);
  const [breachCount, setBreachCount] = useState<number>(0);
  const [riskFactor, setRiskFactor] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    // Simulate fetching scan results from an API or processing data
    // For now, using mock data
    setSecurityScore(75); // Mock security score
    setBreaches(mockBreaches); // Mock breaches
    setRecommendations(mockRecommendations); // Mock recommendations
    setScanDate(new Date().toISOString()); // Mock scan date
    setScanDuration(45); // Mock scan duration in seconds
    setBreachCount(mockBreaches.length); // Set breach count
  }, [location]);

  const handleGenerateOverallReport = () => {
    toast.info('Generating comprehensive security report...');
    
    // Prepare the report data
    const reportData = breaches.map(breach => ({
      Title: breach.title,
      Domain: breach.domain,
      Date: new Date(breach.breachDate).toLocaleDateString(),
      Risk: breach.riskLevel.toUpperCase(),
      AffectedData: breach.affectedData.join(', '),
      Description: breach.description
    }));
    
    // Prepare recommendations data
    const recommendationsData = recommendations.map(rec => ({
      Title: rec.title,
      Priority: rec.priority,
      Status: 'Pending',
      Description: rec.description
    }));
    
    setTimeout(() => {
      exportOverallReport(reportData, recommendationsData, [], 'darkwebshield-scan-results');
      toast.success('Comprehensive security report has been generated and downloaded');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Scan Results</h1>
              <p className="text-muted-foreground">
                Detailed analysis of potential security threats and vulnerabilities
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-cyber-primary border-cyber-primary/30"
              onClick={handleGenerateOverallReport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Overall Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Scan Information Card */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Scan Information</CardTitle>
                  <CardDescription>Details about the most recent scan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Date:</span> {new Date(scanDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span> {scanDuration} seconds
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Breach Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Found Breaches</h2>
                {breaches.map((breach) => (
                  <BreachCard 
                    key={breach.id} 
                    breach={breach}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <SecurityScoreCard 
                score={securityScore} 
                breachCount={breachCount}
                lastScanDate={scanDate}
                riskFactor={riskFactor}
              />
              <RecommendationsList recommendations={recommendations} />
              
              {/* ScanResultExport component is still included but might be redundant now */}
              <ScanResultExport results={[
                ...breaches.map(breach => ({
                  BreachName: breach.title,
                  Domain: breach.domain,
                  BreachDate: breach.breachDate,
                  Severity: breach.riskLevel,
                  AffectedData: breach.affectedData.join(', '),
                  Description: breach.description.substring(0, 100) + '...'
                }))
              ]} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
