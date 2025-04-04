
/**
 * Utility functions for exporting reports in different formats
 */

/**
 * Converts the scan results data to CSV format and triggers a download
 */
export const exportToCSV = (data: any[], filename: string = 'export') => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Handle values with commas or quotes
      const escaped = typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      return escaped;
    });
    csvRows.push(values.join(','));
  }
  
  // Combine into a single string
  const csvString = csvRows.join('\n');
  
  // Create a blob
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate a PDF report with enhanced formatting and content
 */
export const exportToPDF = (data: any[], filename: string = 'export', options: ExportOptions = {}) => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }
  
  // Create a temporary div for printing
  const printContent = document.createElement('div');
  printContent.style.display = 'none';
  
  // Determine report type and content
  const isComprehensive = options.reportType === 'comprehensive';
  const reportTitle = isComprehensive ? 'Comprehensive Security Report' : 'Security Breach Report';
  const reportDescription = isComprehensive 
    ? 'Complete analysis of your digital security status and detected vulnerabilities'
    : 'Detailed analysis of the selected security breach';
  
  // Generate the report content based on the type
  printContent.innerHTML = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .page-break { page-break-after: always; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1, h2, h3 { color: #2a4365; }
          .report-header { margin-bottom: 20px; border-bottom: 2px solid #2a4365; padding-bottom: 20px; }
          .report-section { margin-bottom: 30px; }
          .timestamp { color: #666; font-size: 14px; }
          .risk-high { color: #e53e3e; }
          .risk-medium { color: #dd6b20; }
          .risk-low { color: #38a169; }
          .summary-box { background-color: #f8f9fa; border-left: 4px solid #2a4365; padding: 15px; margin: 20px 0; }
          .recommendations { background-color: #f0fff4; border-left: 4px solid #38a169; padding: 15px; margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          .logo { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1 style="color: #2a4365;">DarkWebShield</h1>
        </div>
        <div class="report-header">
          <h1>${reportTitle}</h1>
          <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        ${isComprehensive ? `
        <div class="report-section">
          <h2>Executive Summary</h2>
          <div class="summary-box">
            <p>This report provides a comprehensive analysis of your digital security status based on our continuous monitoring and scanning services. We have identified ${data.length} potential security ${data.length === 1 ? 'breach' : 'breaches'} that may affect your digital identity.</p>
            <p>Overall risk assessment: <strong class="risk-${getRiskLevel(data)}">${getRiskLevel(data).toUpperCase()}</strong></p>
          </div>
        </div>
        ` : ''}
        
        <div class="report-section">
          <h2>Detected ${data.length === 1 ? 'Breach' : 'Breaches'}</h2>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0]).map(key => `<th>${formatHeader(key)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.entries(row).map(([key, value]) => `
                    <td>${formatValue(key, value)}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        ${isComprehensive ? `
        <div class="report-section">
          <h2>Risk Analysis</h2>
          <p>Based on the detected breaches, we have identified the following risk factors:</p>
          <ul>
            ${generateRiskAnalysis(data)}
          </ul>
        </div>
        
        <div class="page-break"></div>
        
        <div class="report-section">
          <h2>Security Recommendations</h2>
          <div class="recommendations">
            ${generateRecommendations(data)}
          </div>
        </div>
        
        <div class="report-section">
          <h2>Protection Status</h2>
          <p>DarkWebShield is actively monitoring your digital footprint and will alert you to any new breaches or security threats as they are discovered.</p>
        </div>
        ` : `
        <div class="report-section">
          <h2>Breach Details</h2>
          <p><strong>Description:</strong> ${data[0].Description || 'No additional details available.'}</p>
          <p><strong>Risk Level:</strong> <span class="risk-${(data[0].Severity || 'medium').toLowerCase()}">${(data[0].Severity || 'MEDIUM').toUpperCase()}</span></p>
          <p><strong>Recommended Actions:</strong></p>
          <ul>
            <li>Change passwords for affected accounts immediately</li>
            <li>Enable two-factor authentication where available</li>
            <li>Monitor accounts for suspicious activity</li>
            <li>Check for unauthorized transactions or account changes</li>
          </ul>
        </div>
        `}
        
        <div class="footer">
          <p>This report is confidential and intended solely for the use of the individual to whom it is addressed.</p>
          <p>© ${new Date().getFullYear()} DarkWebShield. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
  
  document.body.appendChild(printContent);
  
  // Store the current title
  const originalTitle = document.title;
  document.title = filename;
  
  // Print the div as PDF (using browser's print functionality)
  window.print();
  
  // Reset title and remove the print content
  document.title = originalTitle;
  document.body.removeChild(printContent);
};

/**
 * Helper function to format header names
 */
const formatHeader = (header: string): string => {
  // Convert camelCase or snake_case to Title Case with spaces
  return header
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Helper function to format cell values appropriately
 */
const formatValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return 'N/A';
  
  if (key.toLowerCase().includes('date')) {
    // Format dates
    try {
      return new Date(value).toLocaleDateString();
    } catch (e) {
      return value;
    }
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return value.toString();
};

/**
 * Determine overall risk level based on breach data
 */
const getRiskLevel = (data: any[]): 'high' | 'medium' | 'low' => {
  const hasHighRisk = data.some(item => {
    const risk = (item.Risk || item.Severity || item.riskLevel || '').toLowerCase();
    return risk === 'high';
  });
  
  const hasMediumRisk = data.some(item => {
    const risk = (item.Risk || item.Severity || item.riskLevel || '').toLowerCase();
    return risk === 'medium';
  });
  
  if (hasHighRisk) return 'high';
  if (hasMediumRisk) return 'medium';
  return 'low';
};

/**
 * Generate risk analysis based on breach data
 */
const generateRiskAnalysis = (data: any[]): string => {
  const riskFactors = [
    { 
      condition: data.length > 0,
      text: `Your information was found in ${data.length} data ${data.length === 1 ? 'breach' : 'breaches'}.`
    },
    {
      condition: data.some(item => (item.AffectedData || item.affectedData || '').toString().toLowerCase().includes('password')),
      text: 'Password credentials were exposed in at least one breach.'
    },
    {
      condition: data.some(item => (item.AffectedData || item.affectedData || '').toString().toLowerCase().includes('credit')),
      text: 'Financial information may have been exposed.'
    },
    {
      condition: data.some(item => new Date(item.Date || item.BreachDate || item.breachDate).getFullYear() >= new Date().getFullYear() - 1),
      text: 'Recent breaches (within the last year) were detected.'
    }
  ];
  
  return riskFactors
    .filter(factor => factor.condition)
    .map(factor => `<li>${factor.text}</li>`)
    .join('') || '<li>No specific risk factors identified.</li>';
};

/**
 * Generate recommendations based on breach data
 */
const generateRecommendations = (data: any[]): string => {
  const recommendations = [
    '<h3>Immediate Actions:</h3><ul>',
    '<li>Change passwords for all affected accounts.</li>',
    '<li>Enable two-factor authentication on all important accounts.</li>',
    data.some(item => (item.AffectedData || item.affectedData || '').toString().toLowerCase().includes('credit')) 
      ? '<li><strong>Critical:</strong> Monitor your credit report and consider placing a credit freeze.</li>' : '',
    '</ul>',
    '<h3>Ongoing Protection:</h3><ul>',
    '<li>Use a password manager to create and store strong, unique passwords.</li>',
    '<li>Regularly review account activity for signs of unauthorized access.</li>',
    '<li>Continue monitoring with DarkWebShield to detect new breaches promptly.</li>',
    '</ul>'
  ];
  
  return recommendations.join('');
};

// Define export options interface
export interface ExportOptions {
  reportType?: 'comprehensive' | 'standard';
  includeRecommendations?: boolean;
  includeRiskAnalysis?: boolean;
}

/**
 * General function to export data in specified format with enhanced options
 */
export const exportReport = (
  data: any[], 
  format: 'csv' | 'pdf' = 'csv', 
  filename: string = 'security-report', 
  options: ExportOptions = {}
) => {
  if (format === 'csv') {
    exportToCSV(data, filename);
  } else if (format === 'pdf') {
    exportToPDF(data, filename, options);
  } else {
    console.error('Unsupported export format');
  }
};

/**
 * Export a comprehensive overall report with all data
 */
export const exportOverallReport = (
  breaches: any[],
  recommendations: any[] = [],
  scanHistory: any[] = [],
  filename: string = 'overall-security-report'
) => {
  // Combine all data for a comprehensive report
  const reportData = [...breaches];
  
  // Export as PDF with comprehensive options
  exportReport(reportData, 'pdf', filename, {
    reportType: 'comprehensive',
    includeRecommendations: true,
    includeRiskAnalysis: true
  });
};

/**
 * Export a detailed report for a single breach
 */
export const exportBreachReport = (breach: any, filename: string = 'breach-report') => {
  exportReport([breach], 'pdf', filename, {
    reportType: 'standard',
    includeRecommendations: true
  });
};
