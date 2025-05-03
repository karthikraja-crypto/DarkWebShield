
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { BreachData } from '@/components/BreachCard';
import { Recommendation } from '@/components/RecommendationsList';
import { toast } from 'sonner';

// Define types for scan history and monitoring
export interface ScanHistoryItem {
  id: string;
  date: string;
  type: string;
  value: string;
  breachesFound: number;
  isRealScan: boolean;
  userEmail?: string; // Add reference to user email
}

export interface MonitoredId {
  id: string;
  type: string;
  value: string;
  dateAdded: string;
  userEmail?: string; // Add reference to user email
}

// Define notification types
export interface NotificationItem {
  id: string;
  type: 'breach' | 'scan' | 'system' | 'custom' | 'monitoring';
  title: string;
  message: string;
  date: string;
  relatedId?: string;
  relatedType?: string;
  relatedValue?: string;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high' | 'info';
  userEmail?: string; // Add reference to user email
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
  isRealTimeScanMode: boolean;
  securityScore: number;
  addRealScan: (scanType: string, value: string, foundBreaches: BreachData[], isRealScanRequest: boolean, userEmail?: string) => void;
  setGlobalRealTimeScanMode: (isRealTime: boolean) => void;
  hasNewNotification: boolean;
  clearNotification: () => void;
  getLastScanDate: () => string;
  getLastScanInfo: () => {scanType: string, scanValue: string};
  useRealTimeScannedData: boolean;
  monitoredIds: MonitoredId[];
  toggleMonitoring: (type: string, value: string, enabled: boolean, userEmail?: string) => void;
  isIdMonitored: (type: string, value: string) => boolean;
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => void;
  displayNoRealTimeScansMessage: boolean;
  hasRealTimeHistory: boolean;
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
  const [isRealTimeScanMode, setIsRealTimeScanMode] = useState<boolean>(false);
  const [lastScanInfo, setLastScanInfo] = useState<{scanType: string, scanValue: string}>({
    scanType: '',
    scanValue: ''
  });
  const [monitoredIds, setMonitoredIds] = useState<MonitoredId[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [displayNoRealTimeScansMessage, setDisplayNoRealTimeScansMessage] = useState<boolean>(false);
  
  // This state will control whether we show real scanned data or default to samples
  const [useRealTimeScannedData, setUseRealTimeScannedData] = useState<boolean>(false);
  
  // Auto-disable real-time scanning after timeout
  const REAL_TIME_SCAN_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const [realTimeScanTimer, setRealTimeScanTimer] = useState<NodeJS.Timeout | null>(null);

  // Check if we have any real-time scan history
  const hasRealTimeHistory = scanHistory.some(scan => scan.isRealScan);
  
  // Setup auto-disable timer for real-time scanning
  useEffect(() => {
    if (isRealTimeScanMode) {
      // Clear any existing timer
      if (realTimeScanTimer) {
        clearTimeout(realTimeScanTimer);
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        setIsRealTimeScanMode(false);
        setUseRealTimeScannedData(false);
        toast.info("Real-time scanning has been automatically disabled due to inactivity", {
          duration: 5000
        });
        
        // Add system notification about scan mode disabling
        addNotification({
          type: 'system',
          title: 'Real-Time Scanning Disabled',
          message: 'Real-time scanning has been automatically disabled after 30 minutes of inactivity.',
          severity: 'info'
        });
        
      }, REAL_TIME_SCAN_TIMEOUT);
      
      setRealTimeScanTimer(timer);
    } else if (realTimeScanTimer) {
      // Clear timer when real-time mode is disabled
      clearTimeout(realTimeScanTimer);
      setRealTimeScanTimer(null);
    }
    
    // Cleanup on component unmount
    return () => {
      if (realTimeScanTimer) {
        clearTimeout(realTimeScanTimer);
      }
    };
  }, [isRealTimeScanMode]);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setHasNewNotification(true);
  }, []);
  
  // Function to set the global real-time scan mode
  const setGlobalRealTimeScanMode = useCallback((isRealTime: boolean) => {
    setIsRealTimeScanMode(isRealTime);
    
    // When switching to sample mode, reset to sample data
    if (!isRealTime) {
      setBreaches(sampleBreaches);
      setRecommendations(sampleRecommendations);
      setIsRealData(false);
      setSecurityScore(75);
      setUseRealTimeScannedData(false);
      setDisplayNoRealTimeScansMessage(false);
      
      // Add notification about switching to sample mode
      addNotification({
        type: 'system',
        title: 'Sample Data Mode',
        message: 'Switched to sample data mode. All data displayed is for demonstration purposes only.',
        severity: 'info'
      });
    } else {
      // When switching to real-time mode, look for real scan data
      const realScans = scanHistory.filter(scan => scan.isRealScan);
      if (realScans.length > 0) {
        // We have real scan data, show it
        setUseRealTimeScannedData(true);
        setDisplayNoRealTimeScansMessage(false);
        
        // Add notification about switching to real-time mode
        addNotification({
          type: 'system',
          title: 'Real-Time Scan Mode',
          message: 'Switched to real-time scan mode. All data displayed reflects actual scan results.',
          severity: 'info'
        });
      } else {
        // No real scan data yet, keep sample data until first scan
        setUseRealTimeScannedData(false);
        setDisplayNoRealTimeScansMessage(true);
        
        // Add notification about no real-time data
        addNotification({
          type: 'system',
          title: 'No Real-Time Data',
          message: 'Real-time scan mode is active, but no real scans have been performed yet. Please run a scan to see real data.',
          severity: 'info'
        });
      }
    }
  }, [scanHistory, addNotification]);

  // Function to add a new real scan
  const addRealScan = useCallback((scanType: string, value: string, foundBreaches: BreachData[], isRealScanRequest: boolean, userEmail?: string) => {
    // Format the value for privacy (e.g., j***@example.com)
    const maskedValue = maskSensitiveData(value, scanType);
    
    // Store last scan info
    setLastScanInfo({
      scanType: scanType,
      scanValue: value
    });
    
    // Create new scan history item
    const newScanHistoryItem: ScanHistoryItem = {
      id: `scan-${Date.now()}`,
      date: new Date().toISOString(),
      type: scanType,
      value: maskedValue,
      breachesFound: foundBreaches.length,
      isRealScan: isRealScanRequest,
      userEmail: userEmail // Store the user email if provided
    };
    
    // Update scan history
    setScanHistory(prev => [newScanHistoryItem, ...prev]);
    
    // Only update breach data & recommendations if we're in real-time mode
    // or if it's a real scan and breaches were found
    if (isRealScanRequest) {
      setBreaches(foundBreaches);
      setIsRealData(true);
      setHasNewNotification(true);
      setUseRealTimeScannedData(true);
      setDisplayNoRealTimeScansMessage(false);
      
      // Calculate new security score based on breaches
      const newScore = calculateSecurityScore(foundBreaches);
      setSecurityScore(newScore);
      
      // Generate recommendations based on found breaches
      const newRecommendations = generateRecommendations(foundBreaches);
      setRecommendations(newRecommendations);
      
      // Add scan notification
      addNotification({
        type: 'scan',
        title: `${scanType} Scan Completed`,
        message: foundBreaches.length > 0 
          ? `Your ${scanType.toLowerCase()} scan found ${foundBreaches.length} breaches. Review the results now.`
          : `Your ${scanType.toLowerCase()} scan completed with no breaches found.`,
        severity: foundBreaches.length > 0 ? 'high' : 'info',
        relatedType: scanType,
        relatedValue: value,
        userEmail: userEmail // Include user email in notification if provided
      });
    }
  }, [addNotification]);

  // Toggle monitoring for a specific ID
  const toggleMonitoring = useCallback((type: string, value: string, enabled: boolean, userEmail?: string) => {
    if (!type || !value) return;
    
    if (enabled) {
      // Add to monitored IDs if not already there
      setMonitoredIds(prev => {
        // Check if already monitored
        const exists = prev.some(item => item.type === type && item.value === value);
        if (exists) return prev;
        
        // Add new monitored ID
        const newMonitoredId = {
          id: `monitor-${Date.now()}`,
          type,
          value,
          dateAdded: new Date().toISOString(),
          userEmail: userEmail // Store the user email if provided
        };
        
        // Generate a notification for the new monitoring
        addNotification({
          type: 'monitoring',
          title: 'Continuous Monitoring Activated',
          message: `Continuous Monitoring activated for ${type}: ${maskSensitiveData(value, type)}. You will be alerted of any future breaches involving this ID.`,
          severity: 'info',
          relatedId: newMonitoredId.id,
          relatedType: type,
          relatedValue: value,
          userEmail: userEmail // Include user email in notification if provided
        });
        
        return [...prev, newMonitoredId];
      });
    } else {
      // Remove from monitored IDs
      setMonitoredIds(prev => prev.filter(item => !(item.type === type && item.value === value)));
      
      // Add a notification about monitoring being deactivated
      addNotification({
        type: 'monitoring',
        title: 'Monitoring Stopped',
        message: `Continuous monitoring has been disabled for ${type}: ${maskSensitiveData(value, type)}.`,
        severity: 'info',
        relatedType: type,
        relatedValue: value,
        userEmail: userEmail
      });
    }
  }, [addNotification]);
  
  // Check if an ID is being monitored
  const isIdMonitored = useCallback((type: string, value: string): boolean => {
    return monitoredIds.some(item => item.type === type && item.value === value);
  }, [monitoredIds]);

  // Clear notification marker
  const clearNotification = useCallback(() => {
    setHasNewNotification(false);
  }, []);

  // Get the last scan date
  const getLastScanDate = useCallback((): string => {
    if (scanHistory.length === 0) return '';
    
    if (isRealTimeScanMode) {
      // In real-time mode, look for the most recent real scan
      const realScans = scanHistory.filter(scan => scan.isRealScan);
      if (realScans.length > 0) {
        return realScans[0].date;
      }
    }
    
    // Otherwise return the most recent scan of any type
    return scanHistory[0].date;
  }, [scanHistory, isRealTimeScanMode]);
  
  // Get the last scan info (type and value)
  const getLastScanInfo = useCallback(() => {
    return lastScanInfo;
  }, [lastScanInfo]);

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

  // Updated security score calculation based on breaches
  const calculateSecurityScore = (breaches: BreachData[]): number => {
    if (breaches.length === 0) {
      return 95; // Excellent score when no breaches found
    }
    
    const baseScore = 100;
    
    // Define penalties based on risk levels
    const riskPenalties = {
      high: 30,     // Severe penalty for high risk breaches
      medium: 15,   // Moderate penalty for medium risk breaches
      low: 5        // Small penalty for low risk breaches
    };
    
    // Define additional penalties for sensitive data types
    const sensitiveDataPenalties: Record<string, number> = {
      'Credit Cards': 10,
      'Password': 8,
      'Passwords': 8,
      'SSN': 15,
      'Banking Info': 12,
      'Government ID': 15,
      'Health Records': 10,
      'Biometric Data': 12,
      'Financial': 10
    };
    
    // Calculate total penalty starting with base penalties for each breach
    let totalPenalty = 0;
    let hasHighRiskBreach = false;
    
    breaches.forEach(breach => {
      // Apply risk level penalty
      switch (breach.riskLevel) {
        case 'high':
          totalPenalty += riskPenalties.high;
          hasHighRiskBreach = true;
          break;
        case 'medium':
          totalPenalty += riskPenalties.medium;
          break;
        case 'low':
        default:
          totalPenalty += riskPenalties.low;
          break;
      }
      
      // Apply additional penalties for sensitive data types
      breach.affectedData.forEach(dataType => {
        if (sensitiveDataPenalties[dataType]) {
          totalPenalty += sensitiveDataPenalties[dataType];
        }
      });
      
      // For older breaches (> 1 year), reduce penalty slightly
      const breachDate = new Date(breach.breachDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (breachDate < oneYearAgo) {
        totalPenalty *= 0.9; // 10% reduction for older breaches
      }
    });
    
    // Ensure high-risk breaches always result in a low score (below 40)
    if (hasHighRiskBreach) {
      return Math.min(40, Math.max(5, baseScore - totalPenalty));
    }
    
    // Calculate final score
    const finalScore = Math.max(5, Math.min(95, baseScore - totalPenalty));
    
    return Math.round(finalScore);
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
    
    // If no specific recommendations are generated, add a general one
    if (recommendations.length === 0) {
      recommendations.push({
        id: `rec-${Date.now()}-4`,
        title: 'Maintain Good Security Practices',
        description: 'Follow these general security practices to stay protected.',
        priority: 'medium',
        icon: 'shield',
        completed: false,
        setupSteps: [
          'Use strong, unique passwords for all accounts',
          'Enable two-factor authentication where available',
          'Keep your devices and software updated',
          'Be cautious with emails and suspicious links'
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
        isRealTimeScanMode,
        securityScore,
        addRealScan, 
        setGlobalRealTimeScanMode,
        hasNewNotification,
        clearNotification,
        getLastScanDate,
        getLastScanInfo,
        useRealTimeScannedData,
        monitoredIds,
        toggleMonitoring,
        isIdMonitored,
        notifications,
        addNotification,
        displayNoRealTimeScansMessage,
        hasRealTimeHistory
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
