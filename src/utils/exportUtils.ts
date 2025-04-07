
// Export functions for different report formats
export type ExportFormat = 'csv' | 'pdf' | 'individual';

interface ExportOptions {
  reportType?: 'standard' | 'detailed';
  includeUserInfo?: boolean;
  includeSummary?: boolean;
}

/**
 * Export data as a formatted report
 */
export const exportReport = (
  data: any[], 
  format: ExportFormat, 
  filename: string, 
  options: ExportOptions = {}
) => {
  console.log(`Exporting ${data.length} records as ${format} file: ${filename}`);
  
  // Get user info from localStorage for the report header
  let userData = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userData = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }

  const reportId = `DWS-${Date.now().toString(36).toUpperCase()}`;
  
  switch (format) {
    case 'csv':
      // Export as CSV logic
      downloadCSV(data, filename);
      break;
    
    case 'pdf':
      // Export as PDF logic
      generatePDF(data, filename, options, userData, reportId);
      break;
    
    case 'individual':
      // Export individual breach report
      if (data.length > 0) {
        generateIndividualBreachReport(data[0], filename, userData, reportId);
      }
      break;
      
    default:
      console.error(`Unsupported export format: ${format}`);
  }
};

/**
 * Export comprehensive security report with all data
 */
export const exportOverallReport = (
  breachData: any[], 
  recommendationsData: any[], 
  historyData: any[],
  filename: string
) => {
  console.log('Generating overall security report with comprehensive data');
  
  // Get user info from localStorage
  let userData = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userData = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }

  const reportId = `DWS-FULL-${Date.now().toString(36).toUpperCase()}`;
  
  // Generate the PDF with formatted sections
  generateComprehensivePDF(
    breachData, 
    recommendationsData, 
    historyData, 
    filename, 
    userData,
    reportId
  );
};

// Helper functions for the export process

function downloadCSV(data: any[], filename: string) {
  try {
    // Convert data to CSV format
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0] || {});
    const csv = [
      header.join(','),
      ...data.map(row => header.map(fieldName => 
        JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating CSV:', error);
  }
}

function generatePDF(
  data: any[], 
  filename: string, 
  options: ExportOptions,
  userData: any,
  reportId: string
) {
  // Simulate PDF generation for now
  console.log(`Generating PDF with ${data.length} records`);
  console.log(`Title: DarkWebShield – Breach Summary Report`);
  console.log(`Report ID: ${reportId}`);
  console.log(`User: ${userData?.name || 'Unknown User'}`);
  console.log(`Date: ${new Date().toLocaleDateString()}`);
  
  // In a real scenario, we would use a library like pdfmake or jspdf
  // to generate a proper PDF with sections as specified
  
  // Simulate download
  setTimeout(() => {
    const a = document.createElement('a');
    // This is a placeholder. In a real implementation, we would create 
    // an actual PDF and use its URL here
    a.href = 'data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago...';
    a.download = `${filename}.pdf`;
    a.click();
  }, 100);
}

function generateIndividualBreachReport(
  breach: any,
  filename: string,
  userData: any,
  reportId: string
) {
  console.log('Generating Individual Breach Report');
  console.log('Title: 🔐 DarkWebShield – Individual Breach Report');
  console.log(`User: ${userData?.name || 'Unknown User'}`);
  console.log(`Report ID: ${reportId}`);
  console.log(`Breach ID: ${breach.id || 'Unknown'}`);
  
  // Format for individual breach report following the specified structure
  const reportContent = `
🔐 DarkWebShield – Individual Breach Report
User: ${userData?.name || 'Unknown User'}
Email: ${userData?.email || 'Unknown Email'}
Report ID: ${reportId}
Breach ID: ${breach.id || 'Unknown'}
Generated On: ${new Date().toLocaleString()}

🔹 Breach Details
Breach Source: ${breach.domain || breach.title || 'Unknown Source'}
Breach Date: Leaked on ${new Date(breach.breachDate).toLocaleDateString() || 'Unknown Date'}
Data Exposed: ${Array.isArray(breach.affectedData) ? breach.affectedData.join(', ') : 'Unknown'}
Password Status: ${breach.passwordStatus || 'Unknown'}
Risk Level: ${(breach.riskLevel || 'Medium').toUpperCase()}
Leak Type: ${breach.leakType || 'Unknown'}
Exposed Email: ${userData?.email || 'Unknown Email'}
${breach.associatedIP ? `Associated IP: ${breach.associatedIP}` : ''}

🔍 Threat Impact
${getImpactText(breach.riskLevel)}

✅ Recommended Actions
${getRecommendedActions(breach)}

🔁 Ongoing Monitoring
This breach will remain under active surveillance
You'll be notified if it's found in new dark web dumps
  `;
  
  console.log(reportContent);
  
  // Simulate download
  // In a real scenario, this would create a properly formatted PDF
  setTimeout(() => {
    const blob = new Blob([reportContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
  }, 100);
}

function generateComprehensivePDF(
  breachData: any[],
  recommendationsData: any[],
  historyData: any[],
  filename: string,
  userData: any,
  reportId: string
) {
  console.log('Generating Comprehensive Security Report');
  console.log('Title: DarkWebShield – Breach Summary Report');
  
  // Create report sections
  const executiveSummary = `
Executive Summary
----------------
Total Breaches: ${breachData.length}
Scan Count: ${historyData.length}
Risk Level: ${calculateOverallRisk(breachData)}
  `;
  
  // Create scan history table
  const scanHistoryTable = `
Scan History
-----------
${historyData.map(scan => 
  `Date: ${new Date(scan.date).toLocaleDateString()} | Type: ${scan.type} | Breaches Found: ${scan.breachesFound}`
).join('\n')}
  `;
  
  // Create detailed breach data
  const detailedBreachData = `
Detailed Breach Data
------------------
${breachData.map(breach => 
  `Site: ${breach.Title || breach.Domain || 'Unknown'}
  Date: ${breach.Date || 'Unknown'}
  Exposed Data: ${breach.AffectedData || 'Unknown'}
  Risk Level: ${breach.Risk || 'UNKNOWN'}
  Recommendations: ${getBreachRecommendations(breach)}
  `
).join('\n\n')}
  `;
  
  // Create security tips
  const securityTips = `
Security Tips & Monitoring Summary
--------------------------------
1. Use unique passwords for all accounts
2. Enable two-factor authentication wherever possible
3. Regularly monitor your accounts for suspicious activity
4. Consider using a password manager
5. Be cautious of phishing attempts

Your account is being actively monitored for new breaches. You will be notified immediately if your data appears in any new leaks.
  `;
  
  // Full report content
  const reportContent = `
DarkWebShield – Breach Summary Report
===================================
User Name: ${userData?.name || 'Unknown User'}
Email: ${userData?.email || 'Unknown Email'}
Date: ${new Date().toLocaleString()}
Report ID: ${reportId}

${executiveSummary}

${scanHistoryTable}

${detailedBreachData}

${securityTips}
  `;
  
  console.log(reportContent);
  
  // Simulate download
  // In a real scenario, this would create a properly formatted PDF
  setTimeout(() => {
    const blob = new Blob([reportContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
  }, 100);
}

// Helper functions

function calculateOverallRisk(breachData: any[]): string {
  if (!breachData.length) return 'LOW';
  
  // Count risk levels
  const riskCounts = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  breachData.forEach(breach => {
    const risk = (breach.Risk || breach.riskLevel || '').toLowerCase();
    if (risk === 'high') riskCounts.high++;
    else if (risk === 'medium') riskCounts.medium++;
    else riskCounts.low++;
  });
  
  // Determine overall risk
  if (riskCounts.high > 0) return 'HIGH';
  if (riskCounts.medium > 0) return 'MEDIUM';
  return 'LOW';
}

function getImpactText(riskLevel: string): string {
  const risk = (riskLevel || 'medium').toLowerCase();
  
  if (risk === 'high') {
    return `Your account is at high risk of unauthorized access
    
This data may be used in:
- Credential stuffing attacks
- Spam/phishing campaigns
- Impersonation attempts`;
  } else if (risk === 'medium') {
    return `Your account may be vulnerable to targeted attacks
    
This data could potentially be used for:
- Personalized phishing attempts
- Account takeover if password is weak`;
  } else {
    return `Your account exposure is limited
    
While the risk is low, be aware of:
- Potential spam to exposed email addresses
- Correlation with other exposed data`;
  }
}

function getRecommendedActions(breach: any): string {
  const site = breach.domain || breach.title || 'affected sites';
  
  return `- Change the password immediately on ${site}
- Update similar passwords used on other services
- Enable 2FA on all critical accounts
- Monitor financial transactions for fraud
- Avoid using real data on unsecured sites`;
}

function getBreachRecommendations(breach: any): string {
  const risk = (breach.Risk || 'medium').toLowerCase();
  
  if (risk === 'high') {
    return 'Immediate password change, enable 2FA, monitor accounts';
  } else if (risk === 'medium') {
    return 'Update passwords, review account security';
  } else {
    return 'Monitor account for unusual activity';
  }
}
