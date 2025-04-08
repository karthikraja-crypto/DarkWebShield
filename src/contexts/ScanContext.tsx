
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BreachData } from '@/components/BreachCard';
import { Recommendation } from '@/components/RecommendationsList';

// Define types for scan history
export interface ScanHistoryItem {
  id: string;
  date: string;
  type: string;
  value: string;
  breachesFound: number;
  isRealScan: boolean;
}

// Sample breach data
export const sampleBreaches: BreachData[] = [
  {
    id: 'sample-1',
    title: 'Adobe Breach (SAMPLE)',
    domain: 'adobe.com',
    breachDate: '2013-10-03',
    affectedData: ['Email', 'Passwords', 'Credit Cards'],
    riskLevel: 'high',
    verified: true,
    description: '[SAMPLE DATA] In October 2013, 153 million Adobe accounts were breached, resulting in exposed passwords and credit cards.'
  },
  {
    id: 'sample-2',
    title: 'MySpace Breach (SAMPLE)',
    domain: 'myspace.com',
    breachDate: '2016-05-26',
    affectedData: ['Email', 'Username', 'Password'],
    riskLevel: 'medium',
    verified: true,
    description: '[SAMPLE DATA] In May 2016, MySpace suffered a data breach that exposed over 360 million accounts.'
  }
];

// Sample recommendations
export const sampleRecommendations: Recommendation[] = [
  {
    id: 'sample-rec-1',
    title: 'Enable Two-Factor Authentication (SAMPLE)',
    description: 'Protect your account with an extra layer of security.',
    priority: 'high',
    icon: 'lock',
    completed: false,
    setupSteps: [
      'Go to your account settings page',
      'Navigate to the "Security" section',
      'Enable Two-Factor Authentication',
      'Follow the on-screen instructions'
    ]
  },
  {
    id: 'sample-rec-2',
    title: 'Update Your Password (SAMPLE)',
    description: 'Your current password may be vulnerable.',
    priority: 'medium',
    icon: 'key',
    completed: false,
    setupSteps: [
      'Go to your account settings',
      'Find the "Change Password" option',
      'Create a strong password with at least 12 characters'
    ]
  }
];

// Sample scan history
export const sampleScanHistory: ScanHistoryItem[] = [
  {
    id: 'sample-history-1',
    date: new Date('2023-11-15').toISOString(),
    type: 'Email',
    value: 'j***@example.com',
    breachesFound: 2,
    isRealScan: false
  },
  {
    id: 'sample-history-2',
    date: new Date('2023-10-22').toISOString(),
    type: 'Phone',
    value: '+1 (XXX) XXX-5678',
    breachesFound: 1,
    isRealScan: false
  }
];

// Define context type
interface ScanContextType {
  breaches: BreachData[];
  recommendations: Recommendation[];
  scanHistory: ScanHistoryItem[];
  isRealData: boolean;
  securityScore: number;
  addRealScan: (scanType: string, value: string, foundBreaches: BreachData[]) => void;
  toggleSampleMode: () => void;
  hasNewNotification: boolean;
  clearNotification: () => void;
  getLastScanDate: () => string;
}

// Create context
export const ScanContext = createContext<ScanContextType | undefined>(undefined);

// Provider component
export const ScanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [breaches, setBreaches] = useState<BreachData[]>(sampleBreaches);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(sampleRecommendations);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(sampleScanHistory);
  const [isRealData, setIsRealData] = useState<boolean>(false);
  const [securityScore, setSecurityScore] = useState<number>(75);
  const [hasNewNotification, setHasNewNotification] = useState<boolean>(false);

  // Function to add a new real scan
  const addRealScan = (scanType: string, value: string, foundBreaches: BreachData[]) => {
    // Format the value for privacy (e.g., j***@example.com)
    const maskedValue = maskSensitiveData(value, scanType);
    
    // Create new scan history item
    const newScanHistoryItem: ScanHistoryItem = {
      id: `scan-${Date.now()}`,
      date: new Date().toISOString(),
      type: scanType,
      value: maskedValue,
      breachesFound: foundBreaches.length,
      isRealScan: true
    };
    
    // Update state
    setScanHistory(prev => [newScanHistoryItem, ...prev]);
    
    if (foundBreaches.length > 0) {
      setBreaches(foundBreaches);
      setIsRealData(true);
      setHasNewNotification(true);
      
      // Calculate new security score based on breaches
      const newScore = calculateSecurityScore(foundBreaches);
      setSecurityScore(newScore);
      
      // Generate recommendations based on found breaches
      const newRecommendations = generateRecommendations(foundBreaches);
      setRecommendations(newRecommendations);
    }
  };

  // Toggle between sample and real data
  const toggleSampleMode = () => {
    if (isRealData) {
      // Switch to sample data
      setBreaches(sampleBreaches);
      setRecommendations(sampleRecommendations);
      setSecurityScore(75);
    } else {
      // Find the most recent real scan if any
      const realScans = scanHistory.filter(scan => scan.isRealScan);
      if (realScans.length > 0) {
        // We have real scan data, show the most recent one
        // In a real app, we'd fetch the associated breaches and recommendations
        setIsRealData(true);
      }
    }
    setIsRealData(!isRealData);
  };

  // Clear notification marker
  const clearNotification = () => {
    setHasNewNotification(false);
  };

  // Get the last scan date
  const getLastScanDate = (): string => {
    if (scanHistory.length === 0) return '';
    return scanHistory[0].date;
  };

  // Utility function to mask sensitive data
  const maskSensitiveData = (value: string, type: string): string => {
    if (type === 'Email') {
      const [username, domain] = value.split('@');
      if (username && domain) {
        return `${username.substring(0, 1)}***@${domain}`;
      }
    } else if (type === 'Phone') {
      // Mask middle digits of phone number
      return value.replace(/(\d{3})\d{4}(\d{3})/, '$1-XXXX-$2');
    } else if (['SSN', 'aadhar', 'passport', 'drivingLicense', 'voterID'].includes(type)) {
      // For government IDs, we're already only using last 4 digits
      return `***-**-${value}`;
    } else if (type === 'Username') {
      // Mask middle characters of username
      if (value.length <= 3) return value;
      return `${value.substring(0, 1)}***${value.substring(value.length - 1)}`;
    }
    return value;
  };

  // Calculate security score based on breaches
  const calculateSecurityScore = (breaches: BreachData[]): number => {
    const baseScore = 100;
    const highRiskPenalty = 15;
    const mediumRiskPenalty = 10;
    const lowRiskPenalty = 5;
    
    let totalPenalty = 0;
    breaches.forEach(breach => {
      switch (breach.riskLevel) {
        case 'high':
          totalPenalty += highRiskPenalty;
          break;
        case 'medium':
          totalPenalty += mediumRiskPenalty;
          break;
        case 'low':
          totalPenalty += lowRiskPenalty;
          break;
      }
    });
    
    return Math.max(0, Math.min(100, baseScore - totalPenalty));
  };

  // Generate recommendations based on breaches
  const generateRecommendations = (breaches: BreachData[]): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Check for password breaches
    if (breaches.some(b => b.affectedData.includes('Passwords') || b.affectedData.includes('Password'))) {
      recommendations.push({
        id: `rec-${Date.now()}-1`,
        title: 'Change Compromised Passwords',
        description: 'Your passwords may have been exposed in a data breach.',
        priority: 'high',
        icon: 'key',
        completed: false,
        setupSteps: [
          'Identify all accounts using the same password',
          'Change passwords on all affected accounts',
          'Use a unique, strong password for each account',
          'Consider using a password manager'
        ]
      });
    }
    
    // Add 2FA recommendation for any breach
    recommendations.push({
      id: `rec-${Date.now()}-2`,
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts.',
      priority: 'high',
      icon: 'lock',
      completed: false,
      setupSteps: [
        'Identify your most important accounts',
        'Look for 2FA/MFA options in security settings',
        'Set up 2FA using an authenticator app (preferred) or SMS',
        'Save backup codes in a secure location'
      ]
    });
    
    // Credit monitoring for financial data breaches
    if (breaches.some(b => 
      b.affectedData.includes('Credit Cards') || 
      b.affectedData.includes('Bank Account') ||
      b.affectedData.includes('Financial')
    )) {
      recommendations.push({
        id: `rec-${Date.now()}-3`,
        title: 'Monitor Your Credit',
        description: 'Set up credit monitoring to detect fraudulent activity.',
        priority: 'medium',
        icon: 'shield',
        completed: false,
        setupSteps: [
          'Request credit reports from major bureaus',
          'Review reports for unauthorized accounts',
          'Set up credit monitoring services',
          'Consider a credit freeze for maximum protection'
        ]
      });
    }
    
    return recommendations;
  };

  return (
    <ScanContext.Provider 
      value={{ 
        breaches, 
        recommendations, 
        scanHistory, 
        isRealData, 
        securityScore,
        addRealScan, 
        toggleSampleMode,
        hasNewNotification,
        clearNotification,
        getLastScanDate
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook to use the scan context
export const useScan = () => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};
