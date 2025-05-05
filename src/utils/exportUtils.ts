// Export functions for different report formats
export type ExportFormat = 'csv' | 'pdf' | 'individual' | 'word';

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
    
    case 'word':
      // Export as Word document
      generateWordDocument(data, filename, options, userData, reportId);
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
  
  // Also generate a Word document version
  generateComprehensiveWordDocument(
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

/**
 * Generate a Word document for export
 */
function generateWordDocument(
  data: any[],
  filename: string,
  options: ExportOptions,
  userData: any,
  reportId: string
) {
  console.log(`Generating Word document with ${data.length} records`);
  
  // Create report content
  let content = "";
  content += "DarkWebShield – Breach Summary Report\n";
  content += "===================================\n\n";
  content += `Report ID: ${reportId}\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `User: ${userData?.name || 'Unknown User'}\n\n`;
  
  // Add breach data table
  content += "Breach Summary\n";
  content += "--------------\n\n";
  
  // Add each breach
  data.forEach((breach, index) => {
    content += `Breach ${index + 1}: ${breach.title || breach.domain || 'Unknown Source'}\n`;
    content += `Date: ${breach.breachDate ? new Date(breach.breachDate).toLocaleDateString() : 'Unknown'}\n`;
    content += `Risk Level: ${breach.riskLevel?.toUpperCase() || 'UNKNOWN'}\n`;
    content += `Affected Data: ${Array.isArray(breach.affectedData) ? breach.affectedData.join(', ') : 'Unknown'}\n`;
    content += `Description: ${breach.description || 'No details available'}\n\n`;
  });
  
  // Add security recommendations
  content += "Security Recommendations\n";
  content += "------------------------\n\n";
  content += "1. Change passwords on all affected services\n";
  content += "2. Enable two-factor authentication where available\n";
  content += "3. Monitor accounts for suspicious activities\n";
  content += "4. Use a password manager to generate and store strong passwords\n";
  
  // Create and download the Word document
  downloadWordDocument(content, filename);
}

/**
 * Generate a comprehensive Word document for export
 */
function generateComprehensiveWordDocument(
  breachData: any[],
  recommendationsData: any[],
  historyData: any[],
  filename: string,
  userData: any,
  reportId: string
) {
  console.log('Generating Comprehensive Word Document');
  
  // Create report content
  let content = "";
  content += "DarkWebShield – Comprehensive Security Report\n";
  content += "===========================================\n\n";
  content += `Report ID: ${reportId}\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `User: ${userData?.name || 'Unknown User'}\n`;
  content += `Email: ${userData?.email || 'Unknown Email'}\n\n`;
  
  // Executive Summary
  content += "Executive Summary\n";
  content += "----------------\n\n";
  content += `Total Breaches: ${breachData.length}\n`;
  content += `Scan Count: ${historyData.length}\n`;
  content += `Risk Level: ${calculateOverallRisk(breachData)}\n\n`;
  
  // Scan History
  content += "Scan History\n";
  content += "-----------\n\n";
  historyData.forEach((scan, index) => {
    content += `Scan ${index + 1}: ${scan.type} - ${scan.value}\n`;
    content += `Date: ${new Date(scan.date).toLocaleDateString()}\n`;
    content += `Breaches Found: ${scan.breachesFound}\n`;
    content += `${scan.isRealScan ? 'Real-Time Scan' : 'Sample Scan'}\n\n`;
  });
  
  // Detailed Breach Data
  content += "Detailed Breach Data\n";
  content += "------------------\n\n";
  breachData.forEach((breach, index) => {
    content += `Breach ${index + 1}: ${breach.Title || breach.Domain || 'Unknown Source'}\n`;
    content += `Date: ${breach.Date || 'Unknown'}\n`;
    content += `Risk Level: ${breach.Risk || 'UNKNOWN'}\n`;
    content += `Affected Data: ${breach.AffectedData || 'Unknown'}\n`;
    content += `Description: ${breach.Description || 'No details available'}\n\n`;
  });
  
  // Recommendations
  content += "Security Recommendations\n";
  content += "------------------------\n\n";
  recommendationsData.forEach((rec, index) => {
    content += `${index + 1}. ${rec.Title}\n`;
    content += `   Priority: ${rec.Priority.toUpperCase()}\n`;
    content += `   Status: ${rec.Status}\n`;
    content += `   ${rec.Description}\n\n`;
  });
  
  // Security Tips
  content += "Security Tips & Monitoring Summary\n";
  content += "--------------------------------\n\n";
  content += "1. Use unique passwords for all accounts\n";
  content += "2. Enable two-factor authentication wherever possible\n";
  content += "3. Regularly monitor your accounts for suspicious activity\n";
  content += "4. Consider using a password manager\n";
  content += "5. Be cautious of phishing attempts\n\n";
  content += "Your account is being actively monitored for new breaches. You will be notified immediately if your data appears in any new leaks.\n";
  
  // Create and download the Word document
  downloadWordDocument(content, filename);
}

/**
 * Download a Word document
 */
function downloadWordDocument(content: string, filename: string) {
  // Create a blob with Word document MIME type
  // For a simple approach, we'll create a document with basic formatting
  // In a real implementation, you would use a library like docx-js to create proper Word documents
  
  // Header for MS Word document (XML format)
  const header = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>DarkWebShield Report</title>
<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.5;
  }
  h1, h2, h3 {
    color: #333366;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #dddddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  .section {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
</head>
<body>
`;

  // Format content with HTML
  let htmlContent = header;
  
  // Replace plain text formatting with HTML
  const formattedContent = content
    .replace(/DarkWebShield – (.*?)(?:\n)/g, '<div class="header"><h1>DarkWebShield – $1</h1></div>')
    .replace(/={3,}/g, '')
    .replace(/-([-]+)/g, '')
    .replace(/^(.+?):\s*(.*?)$/gm, '<strong>$1:</strong> $2<br>')
    .replace(/^(.*?)\n\n/gm, '<p>$1</p>')
    .replace(/^([A-Za-z].*?)\n([^A-Za-z])/gm, '<h2>$1</h2>$2');
  
  htmlContent += formattedContent;
  htmlContent += `</body></html>`;
  
  // Add MS Word specific metadata to make it open in Word
  const wordDocumentPrefix = 
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <!--[if gte mso 9]>
      <xml>
      <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
      @page {
        size: 8.5in 11.0in;
        margin: 1.0in 1.25in 1.0in 1.25in;
        mso-header-margin: .5in;
        mso-footer-margin: .5in;
        mso-paper-source: 0;
      }
      </style>
      </head>
      `;
  
  const wordContent = wordDocumentPrefix + htmlContent.substring(htmlContent.indexOf('<body>'));
  
  // Create blob and download
  const blob = new Blob([wordContent], { type: 'application/vnd.ms-word' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.doc`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
