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
  
  // Get user info from localStorage if available
  let userData = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userData = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }
  
  // Create a temporary div for printing
  const printContent = document.createElement('div');
  printContent.style.display = 'none';
  
  // Determine report type and content
  const isComprehensive = options.reportType === 'comprehensive';
  const reportTitle = isComprehensive ? '🔐 DarkWebShield – Comprehensive Data Exposure Report' : 'Security Breach Report';
  const reportId = `DWS-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Group data into monthly periods for the risk trend analysis
  const monthlyBreaches = isComprehensive ? getMonthlyBreachCounts(data) : [];
  
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
          .risk-critical { color: #9B2C2C; }
          .summary-box { background-color: #f8f9fa; border-left: 4px solid #2a4365; padding: 15px; margin: 20px 0; }
          .recommendations { background-color: #f0fff4; border-left: 4px solid #38a169; padding: 15px; margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          .logo { text-align: center; margin-bottom: 20px; }
          .info-table { border: none; width: 100%; margin: 15px 0; }
          .info-table td { border: none; padding: 5px 10px; }
          .info-table tr:nth-child(even) { background-color: #f2f2f2; }
          .section-number { display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #2a4365; color: white; text-align: center; line-height: 30px; margin-right: 10px; }
          .breach-container { background-color: #f8f9fa; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
          .breach-header { display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
          .check-mark { color: #38a169; }
          .x-mark { color: #e53e3e; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1 style="color: #2a4365;">DarkWebShield</h1>
        </div>
        <div class="report-header">
          <h1>${reportTitle}</h1>
          <table class="info-table">
            <tr>
              <td><strong>Generated For:</strong></td>
              <td>${userData?.name || 'User'}</td>
            </tr>
            <tr>
              <td><strong>User ID / Email:</strong></td>
              <td>${userData?.email || 'Not available'}</td>
            </tr>
            <tr>
              <td><strong>Date Generated:</strong></td>
              <td>${currentDate}</td>
            </tr>
            <tr>
              <td><strong>Report ID:</strong></td>
              <td>${reportId}</td>
            </tr>
          </table>
        </div>
        
        ${isComprehensive ? `
        <div class="report-section">
          <h2><span class="section-number">1</span> Executive Summary</h2>
          <div class="summary-box">
            <table class="info-table">
              <tr>
                <td><strong>Total Scans Performed:</strong></td>
                <td>${options.scanHistory?.length || data.length}</td>
              </tr>
              <tr>
                <td><strong>Total Breaches Detected:</strong></td>
                <td>${data.length}</td>
              </tr>
              <tr>
                <td><strong>Risk Level:</strong></td>
                <td><strong class="risk-${getRiskLevel(data)}">${getRiskLevel(data).toUpperCase()}</strong></td>
              </tr>
              <tr>
                <td><strong>Continuous Monitoring:</strong></td>
                <td>${options.monitoringActive ? 'Enabled' : 'Disabled'}</td>
              </tr>
              <tr>
                <td><strong>Most Recent Detection:</strong></td>
                <td>${getMostRecentBreachDate(data)}</td>
              </tr>
            </table>
          </div>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">2</span> Scan & Breach Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Scan Date</th>
                <th>Total Breaches</th>
                <th>Risk Level</th>
                <th>Report Generated</th>
              </tr>
            </thead>
            <tbody>
              ${generateScanSummaryTable(options.scanHistory || [], data)}
            </tbody>
          </table>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">3</span> Detailed Breach Records</h2>
          ${data.map((breach, index) => `
            <div class="breach-container">
              <div class="breach-header">
                <h3>🔹 Breach: ${breach.domain || breach.title}</h3>
                <span>Risk Level: <strong class="risk-${(breach.riskLevel || 'medium').toLowerCase()}">${(breach.riskLevel || 'MEDIUM').toUpperCase()}</strong></span>
              </div>
              <table class="info-table">
                <tr>
                  <td><strong>Date Detected:</strong></td>
                  <td>${formatBreachDate(breach.breachDate || breach.date)}</td>
                </tr>
                <tr>
                  <td><strong>Data Exposed:</strong></td>
                  <td>${formatExposedData(breach.affectedData || breach.dataExposed || [])}</td>
                </tr>
                <tr>
                  <td><strong>Leak Source:</strong></td>
                  <td>${breach.source || 'Dark Web Marketplace'}</td>
                </tr>
                <tr>
                  <td><strong>Password Encryption:</strong></td>
                  <td>${determinePasswordEncryption(breach)}</td>
                </tr>
                <tr>
                  <td><strong>Recommendation:</strong></td>
                  <td>${getBreachRecommendation(breach)}</td>
                </tr>
              </table>
            </div>
          `).join('')}
        </div>
        
        <div class="page-break"></div>
        
        <div class="report-section">
          <h2><span class="section-number">4</span> Risk Analysis</h2>
          <table class="info-table">
            <tr>
              <td><strong>Number of Critical Breaches:</strong></td>
              <td>${countCriticalBreaches(data)}</td>
            </tr>
            <tr>
              <td><strong>Number of High-Risk Services Involved:</strong></td>
              <td>${countHighRiskServices(data)}</td>
            </tr>
            <tr>
              <td><strong>Affected Platforms:</strong></td>
              <td>${getAffectedPlatforms(data)}</td>
            </tr>
          </table>
          
          <h3>Historical Risk Trend</h3>
          <p>Monthly breach detection frequency:</p>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Number of Breaches</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyBreaches.map((month) => `
                <tr>
                  <td>${month.month}</td>
                  <td>${month.count}</td>
                  <td>${month.trend}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">5</span> Security Recommendations</h2>
          <div class="recommendations">
            ${generateSecurityRecommendations(data)}
          </div>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">6</span> Action Log</h2>
          ${options.actionHistory && options.actionHistory.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Action Taken</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${options.actionHistory.map(action => `
                  <tr>
                    <td>${action.action}</td>
                    <td>${formatActionDate(action.date)}</td>
                    <td>${action.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <p>No action history recorded yet. As you take actions to improve your security, they will be logged here.</p>
            <p>Recommended actions:</p>
            <ul>
              <li>Change passwords for affected accounts</li>
              <li>Enable two-factor authentication where available</li>
              <li>Review account activity for suspicious behavior</li>
            </ul>
          `}
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">7</span> Monitoring & Alerts Summary</h2>
          <table class="info-table">
            <tr>
              <td><strong>Monitoring Activated:</strong></td>
              <td>${options.monitoringActive ? '<span class="check-mark">✅</span>' : '<span class="x-mark">❌</span>'}</td>
            </tr>
            <tr>
              <td><strong>Alerts Sent:</strong></td>
              <td>${options.alertsSent ? '<span class="check-mark">✅</span>' : '<span class="x-mark">❌</span>'}</td>
            </tr>
            <tr>
              <td><strong>Alerts Read:</strong></td>
              <td>${options.alertsRead ? '<span class="check-mark">✅</span>' : '<span class="x-mark">❌</span>'}</td>
            </tr>
            <tr>
              <td><strong>Real-Time Status:</strong></td>
              <td>${options.monitoringActive ? 'Monitoring active' : 'Monitoring inactive'}</td>
            </tr>
          </table>
        </div>
        ` : `
        <div class="report-section">
          <h2>Breach Details</h2>
          <p><strong>Description:</strong> ${data[0].Description || data[0].description || 'No additional details available.'}</p>
          <p><strong>Risk Level:</strong> <span class="risk-${(data[0].riskLevel || data[0].Severity || 'medium').toLowerCase()}">${(data[0].riskLevel || data[0].Severity || 'MEDIUM').toUpperCase()}</span></p>
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
          <p>📎 Confidentiality Note: This report contains sensitive personal information. Do not share or distribute without user consent.</p>
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
 * Export an individual breach report in the specified format
 */
export const exportIndividualBreachReport = (breach: any, filename: string = 'individual-breach-report') => {
  if (!breach) {
    console.error('No breach data to export');
    return;
  }
  
  // Get user info from localStorage if available
  let userData = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userData = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }
  
  // Create a temporary div for printing
  const printContent = document.createElement('div');
  printContent.style.display = 'none';
  
  const reportId = `DWS-${Date.now().toString().slice(-8)}`;
  const breachId = breach.id || `B-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleString();
  const breachDate = breach.breachDate ? new Date(breach.breachDate).toLocaleDateString() : 'Unknown';
  const exposedData = Array.isArray(breach.affectedData) ? breach.affectedData.join(', ') : (breach.affectedData || 'Unknown');
  const domain = breach.domain || breach.title || 'Unknown Service';
  const passwordStatus = determinePasswordEncryption(breach);
  const riskLevel = (breach.riskLevel || 'medium').toUpperCase();
  const leakType = breach.source || 'Sold on dark web';
  const exposedEmail = userData?.email || 'user@email.com';
  const associatedIP = breach.ipAddress || 'Not available';
  
  // Generate the formatted individual report content
  printContent.innerHTML = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
          h1 { color: #2a4365; margin-bottom: 20px; }
          h2 { color: #2a4365; border-bottom: 1px solid #eaeaea; padding-bottom: 8px; margin-top: 30px; }
          .header { margin-bottom: 40px; }
          .report-section { margin-bottom: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 6px; }
          .info-row { display: flex; margin-bottom: 10px; }
          .info-label { font-weight: bold; width: 180px; }
          .risk-high { color: #e53e3e; font-weight: bold; }
          .risk-medium { color: #dd6b20; font-weight: bold; }
          .risk-low { color: #38a169; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eaeaea; padding-top: 20px; }
          .logo { text-align: center; margin-bottom: 20px; }
          .breach-header { background-color: #2a4365; color: white; padding: 15px; border-radius: 6px 6px 0 0; margin-bottom: 0; }
          .actions { background-color: #f0fff4; border-left: 4px solid #38a169; }
          .monitoring { background-color: #e6fffa; border-left: 4px solid #0694a2; }
          .threat { background-color: #fff5f5; border-left: 4px solid #e53e3e; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1 style="color: #2a4365;">DarkWebShield</h1>
        </div>
        
        <div class="header">
          <h1>🔐 DarkWebShield – Individual Breach Report</h1>
          <div class="info-row"><div class="info-label">User:</div> ${userData?.name || 'Full Name'}</div>
          <div class="info-row"><div class="info-label">Report ID:</div> ${reportId}</div>
          <div class="info-row"><div class="info-label">Breach ID:</div> ${breachId}</div>
          <div class="info-row"><div class="info-label">Generated On:</div> ${currentDate}</div>
        </div>
        
        <h2 class="breach-header">🔹 Breach Details</h2>
        <div class="report-section">
          <div class="info-row"><div class="info-label">Breach Source:</div> ${domain}</div>
          <div class="info-row"><div class="info-label">Breach Date:</div> Leaked on ${breachDate}</div>
          <div class="info-row"><div class="info-label">Data Exposed:</div> ${exposedData}</div>
          <div class="info-row"><div class="info-label">Password Status:</div> ${passwordStatus}</div>
          <div class="info-row"><div class="info-label">Risk Level:</div> <span class="risk-${(breach.riskLevel || 'medium').toLowerCase()}">${riskLevel}</span></div>
          <div class="info-row"><div class="info-label">Leak Type:</div> ${leakType}</div>
          <div class="info-row"><div class="info-label">Exposed Email:</div> ${exposedEmail}</div>
          <div class="info-row"><div class="info-label">Associated IP (if any):</div> ${associatedIP}</div>
        </div>
        
        <h2>🔍 Threat Impact</h2>
        <div class="report-section threat">
          <p>Your account is at ${(breach.riskLevel || 'medium').toLowerCase()} risk of unauthorized access</p>
          <p>This data may be used in:</p>
          <ul>
            <li>Credential stuffing attacks</li>
            <li>Spam/phishing campaigns</li>
            <li>Impersonation attempts</li>
          </ul>
          ${breach.description ? `<p><strong>Additional Details:</strong> ${breach.description}</p>` : ''}
        </div>
        
        <h2>✅ Recommended Actions</h2>
        <div class="report-section actions">
          <ul>
            <li>Change the password immediately on ${domain}</li>
            <li>Update similar passwords used on other services</li>
            <li>Enable 2FA on all critical accounts</li>
            <li>Monitor financial transactions for fraud</li>
            <li>Avoid using real data on unsecured sites</li>
          </ul>
        </div>
        
        <h2>🔁 Ongoing Monitoring</h2>
        <div class="report-section monitoring">
          <p>This breach will remain under active surveillance</p>
          <p>You'll be notified if it's found in new dark web dumps</p>
        </div>
        
        <div class="footer">
          <p>📎 Confidentiality Note: This report contains sensitive personal information. Do not share or distribute without user consent.</p>
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
const getRiskLevel = (data: any[]): 'critical' | 'high' | 'medium' | 'low' => {
  const hasCriticalRisk = data.some(item => {
    const risk = (item.Risk || item.Severity || item.riskLevel || '').toLowerCase();
    return risk === 'critical';
  });
  
  const hasHighRisk = data.some(item => {
    const risk = (item.Risk || item.Severity || item.riskLevel || '').toLowerCase();
    return risk === 'high';
  });
  
  const hasMediumRisk = data.some(item => {
    const risk = (item.Risk || item.Severity || item.riskLevel || '').toLowerCase();
    return risk === 'medium';
  });
  
  if (hasCriticalRisk) return 'critical';
  if (hasHighRisk) return 'high';
  if (hasMediumRisk) return 'medium';
  return 'low';
};

/**
 * Get most recent breach date
 */
const getMostRecentBreachDate = (data: any[]): string => {
  if (!data || !data.length) return 'N/A';
  
  const dates = data
    .map(item => new Date(item.breachDate || item.date || item.Date || new Date()))
    .sort((a, b) => b.getTime() - a.getTime());
  
  return dates[0].toLocaleDateString();
};

/**
 * Format breach date
 */
const formatBreachDate = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

/**
 * Format exposed data
 */
const formatExposedData = (data: string[] | string): string => {
  if (!data) return 'Unknown';
  
  if (typeof data === 'string') {
    return data;
  }
  
  return data.join(', ');
};

/**
 * Determine password encryption level
 */
const determinePasswordEncryption = (breach: any): string => {
  const affectedData = breach.affectedData || breach.dataExposed || [];
  const hasPasswords = Array.isArray(affectedData) 
    ? affectedData.some(item => item.toLowerCase().includes('password'))
    : String(affectedData).toLowerCase().includes('password');
  
  if (!hasPasswords) return 'No passwords exposed';
  
  // Check if the breach description mentions the encryption
  const description = (breach.description || '').toLowerCase();
  
  if (description.includes('plain') || description.includes('text') || description.includes('unhashed')) {
    return 'Weak or Plaintext (High Risk)';
  } else if (description.includes('hash') || description.includes('bcrypt') || description.includes('sha256')) {
    return 'Hashed (Medium Risk)';
  } else if (description.includes('salt') || description.includes('encrypt')) {
    return 'Encrypted (Lower Risk)';
  }
  
  // Default to medium risk if we can't determine
  return 'Unknown (Assume High Risk)';
};

/**
 * Get breach-specific recommendation
 */
const getBreachRecommendation = (breach: any): string => {
  const affectedData = breach.affectedData || breach.dataExposed || [];
  const recommendations = [];
  
  // Check what kind of data was exposed
  const hasPasswords = Array.isArray(affectedData) 
    ? affectedData.some(item => item.toLowerCase().includes('password'))
    : String(affectedData).toLowerCase().includes('password');
    
  const hasEmail = Array.isArray(affectedData)
    ? affectedData.some(item => item.toLowerCase().includes('email'))
    : String(affectedData).toLowerCase().includes('email');
    
  const hasFinancial = Array.isArray(affectedData)
    ? affectedData.some(item => {
        const lower = item.toLowerCase();
        return lower.includes('credit') || lower.includes('card') || lower.includes('financial');
      })
    : String(affectedData).toLowerCase().match(/credit|card|financial|bank/);
    
  if (hasPasswords) {
    recommendations.push('Change password immediately');
    recommendations.push('Enable 2FA');
  }
  
  if (hasEmail) {
    recommendations.push('Monitor for phishing attempts');
  }
  
  if (hasFinancial) {
    recommendations.push('Monitor financial accounts');
    recommendations.push('Consider freezing credit');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Monitor account for suspicious activity');
  }
  
  return recommendations.join(', ');
};

/**
 * Generate scan summary table
 */
const generateScanSummaryTable = (scanHistory: any[], breachData: any[]): string => {
  if (!scanHistory || scanHistory.length === 0) {
    // If no scan history, create a default entry based on breach data
    return `
      <tr>
        <td>${new Date().toLocaleDateString()}</td>
        <td>${breachData.length}</td>
        <td class="risk-${getRiskLevel(breachData)}">${getRiskLevel(breachData).toUpperCase()}</td>
        <td>✔️</td>
      </tr>
    `;
  }
  
  // Otherwise, use the scan history to create the table
  return scanHistory.slice(0, 5).map(scan => {
    const scanDate = scan.date ? new Date(scan.date) : new Date();
    const breachCount = scan.breachesFound || 0;
    const riskLevel = breachCount > 2 ? 'high' : breachCount > 0 ? 'medium' : 'low';
    
    return `
      <tr>
        <td>${scanDate.toLocaleDateString()}</td>
        <td>${breachCount}</td>
        <td class="risk-${riskLevel}">${riskLevel.toUpperCase()}</td>
        <td>${scan.reportGenerated ? '✔️' : '❌'}</td>
      </tr>
    `;
  }).join('');
};

/**
 * Generate risk analysis
 */
const countCriticalBreaches = (data: any[]): number => {
  return data.filter(item => {
    const risk = (item.riskLevel || item.Risk || item.Severity || '').toLowerCase();
    return risk === 'critical' || risk === 'high';
  }).length;
};

const countHighRiskServices = (data: any[]): number => {
  // Count unique domains/sources that are high risk
  const uniqueDomains = new Set();
  
  data.forEach(item => {
    const risk = (item.riskLevel || item.Risk || item.Severity || '').toLowerCase();
    if (risk === 'critical' || risk === 'high') {
      uniqueDomains.add(item.domain || item.source || item.title);
    }
  });
  
  return uniqueDomains.size;
};

const getAffectedPlatforms = (data: any[]): string => {
  const platforms = new Set<string>();
  
  data.forEach(item => {
    const domain = item.domain || '';
    if (domain.includes('google') || domain.includes('gmail')) platforms.add('Gmail');
    else if (domain.includes('facebook')) platforms.add('Facebook');
    else if (domain.includes('linkedin')) platforms.add('LinkedIn');
    else if (domain.includes('twitter') || domain.includes('x.com')) platforms.add('Twitter/X');
    else if (domain.includes('instagram')) platforms.add('Instagram');
    else if (domain.includes('amazon')) platforms.add('Amazon');
    else if (domain.includes('apple')) platforms.add('Apple');
    else if (domain.includes('microsoft')) platforms.add('Microsoft');
    else if (domain.includes('bank') || domain.includes('financial') || domain.includes('pay')) platforms.add('Banking/Financial');
    else if (domain) platforms.add(domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1));
  });
  
  return Array.from(platforms).join(', ') || 'None identified';
};

const getMonthlyBreachCounts = (data: any[]): Array<{month: string, count: number, trend: string}> => {
  if (!data || data.length === 0) return [];
  
  // Group breaches by month
  const monthlyData: {[key: string]: number} = {};
  
  data.forEach(item => {
    const date = new Date(item.breachDate || item.date || item.Date || new Date());
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (monthlyData[monthYear]) {
      monthlyData[monthYear]++;
    } else {
      monthlyData[monthYear] = 1;
    }
  });
  
  // Convert to array and sort chronologically
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sortedMonths = Object.keys(monthlyData)
    .map(key => {
      const [month, year] = key.split('/');
      return {
        key,
        month: parseInt(month),
        year: parseInt(year),
        count: monthlyData[key]
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  
  // Add trend indicators
  const result = [];
  for (let i = 0; i < sortedMonths.length; i++) {
    const item = sortedMonths[i];
    let trend = '→';
    
    if (i > 0) {
      const prevCount = sortedMonths[i-1].count;
      if (item.count > prevCount) trend = '↑';
      else if (item.count < prevCount) trend = '↓';
    }
    
    result.push({
      month: `${monthNames[item.month-1]} ${item.year}`,
      count: item.count,
      trend
    });
  }
  
  return result;
};

/**
 * Format action date
 */
const formatActionDate = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

/**
 * Generate security recommendations
 */
const generateSecurityRecommendations = (data: any[]): string => {
  const passwordBreached = data.some(breach => {
    const affectedData = breach.affectedData || breach.dataExposed || [];
    return Array.isArray(affectedData)
      ? affectedData.some(item => item.toLowerCase().includes('password'))
      : String(affectedData).toLowerCase().includes('password');
  });
  
  const financialDataBreached = data.some(breach => {
    const affectedData = breach.affectedData || breach.dataExposed || [];
    return Array.isArray(affectedData)
      ? affectedData.some(item => {
          const lower = item.toLowerCase();
          return lower.includes('credit') || lower.includes('card') || lower.includes('financial') || lower.includes('bank');
        })
      : String(affectedData).toLowerCase().match(/credit|card|financial|bank/);
  });
  
  return `
    <h3>Priority Actions:</h3>
    <ol>
      ${passwordBreached ? '<li><strong>Reset passwords</strong> for all breached accounts immediately</li>' : ''}
      <li><strong>Enable multi-factor authentication (MFA)</strong> wherever possible to add an extra layer of security</li>
      ${financialDataBreached ? '<li><strong>Monitor bank activity</strong> closely for unauthorized transactions</li>' : ''}
      <li><strong>Use a password manager</strong> to generate and store strong, unique passwords</li>
    </ol>
    
    <h3>Additional Recommendations:</h3>
    <ul>
      <li>Remove unused online accounts to reduce your digital footprint</li>
      <li>Review app permissions on connected services</li>
      <li>Consider using a credit monitoring service</li>
      <li>Be vigilant for phishing attempts that may target you based on the leaked data</li>
      <li>Set up fraud alerts with credit bureaus if financial information was exposed</li>
      <li>Continue to use DarkWebShield to monitor for new breaches</li>
    </ul>
  `;
};

// Define export options interface
export interface ExportOptions {
  reportType?: 'comprehensive' | 'standard';
  includeRecommendations?: boolean;
  includeRiskAnalysis?: boolean;
  scanHistory?: any[];
  actionHistory?: Array<{action: string, date: string, notes?: string}>;
  monitoringActive?: boolean;
  alertsSent?: boolean;
  alertsRead?: boolean;
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
  // Get monitoring status from localStorage if available
  let monitoringActive = false;
  try {
    monitoringActive = localStorage.getItem('monitoringActive') === 'true';
  } catch (e) {
    console.error('Failed to get monitoring status:', e);
  }
  
  // Sample action history for demonstration
  const actionHistory = [
    { 
      action: 'Email password changed', 
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
      notes: 'Gmail' 
    },
    { 
      action: 'Enabled 2FA', 
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
      notes: 'Facebook' 
    }
  ];
  
  // Export as PDF with comprehensive options
  exportReport(breaches, 'pdf', filename, {
    reportType: 'comprehensive',
    includeRecommendations: true,
    includeRiskAnalysis: true,
    scanHistory,
    actionHistory,
    monitoringActive,
    alertsSent: true,
    alertsRead: true
  });
};

/**
 * Export a detailed report for a single breach
 */
export const exportBreachReport = (breach: any, filename: string = 'breach-report') => {
  if (!breach) {
    console.error('No breach data to export');
    return;
  }
  
  // Create a temporary div for printing
  const printContent = document.createElement('div');
  printContent.style.display = 'none';
  
  // Determine report type and content
  const reportTitle = 'Security Breach Report';
  const reportId = `DWS-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Create an array with just this breach for functions expecting arrays
  const breachData = [breach];
  
  // Define options for the report
  const localOptions: ExportOptions = {
    reportType: 'standard',
    monitoringActive: localStorage.getItem('monitoringActive') === 'true',
    alertsSent: true,
    alertsRead: false,
    scanHistory: []
  };
  
  // Generate the report content
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
          .info-table { border: none; width: 100%; margin: 15px 0; }
          .info-table td { border: none; padding: 5px 10px; }
          .info-table tr:nth-child(even) { background-color: #f2f2f2; }
          .section-number { display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #2a4365; color: white; text-align: center; line-height: 30px; margin-right: 10px; }
          .breach-container { background-color: #f8f9fa; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
          .breach-header { display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
          .check-mark { color: #38a169; }
          .x-mark { color: #e53e3e; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1 style="color: #2a4365;">DarkWebShield</h1>
        </div>
        <div class="report-header">
          <h1>${reportTitle}</h1>
          <table class="info-table">
            <tr>
              <td><strong>Generated For:</strong></td>
              <td>${breach.name || 'User'}</td>
            </tr>
            <tr>
              <td><strong>User ID / Email:</strong></td>
              <td>${breach.email || 'Not available'}</td>
            </tr>
            <tr>
              <td><strong>Date Generated:</strong></td>
              <td>${currentDate}</td>
            </tr>
            <tr>
              <td><strong>Report ID:</strong></td>
              <td>${reportId}</td>
            </tr>
          </table>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">1</span> Executive Summary</h2>
          <div class="summary-box">
            <table class="info-table">
              <tr>
                <td><strong>Total Scans Performed:</strong></td>
                <td>${localOptions.scanHistory?.length || 1}</td>
              </tr>
              <tr>
                <td><strong>Total Breaches Detected:</strong></td>
                <td>${breachData.length}</td>
              </tr>
              <tr>
                <td><strong>Risk Level:</strong></td>
                <td><strong class="risk-${getRiskLevel(breachData)}">${getRiskLevel(breachData).toUpperCase()}</strong></td>
              </tr>
              <tr>
                <td><strong>Continuous Monitoring:</strong></td>
                <td>${localOptions.monitoringActive ? 'Enabled' : 'Disabled'}</td>
              </tr>
              <tr>
                <td><strong>Most Recent Detection:</strong></td>
                <td>${getMostRecentBreachDate(breachData)}</td>
              </tr>
            </table>
          </div>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">2</span> Scan & Breach Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Scan Date</th>
                <th>Total Breaches</th>
                <th>Risk Level</th>
                <th>Report Generated</th>
              </tr>
            </thead>
            <tbody>
              ${generateScanSummaryTable(localOptions.scanHistory || [], breachData)}
            </tbody>
          </table>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">3</span> Detailed Breach Records</h2>
          ${breachData.map((breach, index) => `
            <div class="breach-container">
              <div class="breach-header">
                <h3>🔹 Breach: ${breach.domain || breach.title}</h3>
                <span>Risk Level: <strong class="risk-${(breach.riskLevel || 'medium').toLowerCase()}">${(breach.riskLevel || 'MEDIUM').toUpperCase()}</strong></span>
              </div>
              <table class="info-table">
                <tr>
                  <td><strong>Date Detected:</strong></td>
                  <td>${formatBreachDate(breach.breachDate || breach.date)}</td>
                </tr>
                <tr>
                  <td><strong>Data Exposed:</strong></td>
                  <td>${formatExposedData(breach.affectedData || breach.dataExposed || [])}</td>
                </tr>
                <tr>
                  <td><strong>Leak Source:</strong></td>
                  <td>${breach.source || 'Dark Web Marketplace'}</td>
                </tr>
                <tr>
                  <td><strong>Password Encryption:</strong></td>
                  <td>${determinePasswordEncryption(breach)}</td>
                </tr>
                <tr>
                  <td><strong>Recommendation:</strong></td>
                  <td>${getBreachRecommendation(breach)}</td>
                </tr>
              </table>
            </div>
          `).join('')}
        </div>
        
        <div class="page-break"></div>
        
        <div class="report-section">
          <h2><span class="section-number">4</span> Risk Analysis</h2>
          <table class="info-table">
            <tr>
              <td><strong>Number of Critical Breaches:</strong></td>
              <td>${countCriticalBreaches(breachData)}</td>
            </tr>
            <tr>
              <td><strong>Number of High-Risk Services Involved:</strong></td>
              <td>${countHighRiskServices(breachData)}</td>
            </tr>
            <tr>
              <td><strong>Affected Platforms:</strong></td>
              <td>${getAffectedPlatforms(breachData)}</td>
            </tr>
          </table>
          
          <h3>Historical Risk Trend</h3>
          <p>Monthly breach detection frequency:</p>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Number of Breaches</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              ${getMonthlyBreachCounts(breachData).map((month) => `
                <tr>
                  <td>${month.month}</td>
                  <td>${month.count}</td>
                  <td>${month.trend}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">5</span> Security Recommendations</h2>
          <div class="recommendations">
            ${generateSecurityRecommendations(breachData)}
          </div>
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">6</span> Action Log</h2>
          ${localOptions.actionHistory && localOptions.actionHistory.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Action Taken</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${localOptions.actionHistory.map(action => `
                  <tr>
                    <td>${action.action}</td>
                    <td>${formatActionDate(action.date)}</td>
                    <td>${action.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <p>No action history recorded yet. As you take actions to improve your security, they will be logged here.</p>
            <p>Recommended actions:</p>
            <ul>
              <li>Change passwords for affected accounts immediately</li>
              <li>Enable two-factor authentication where available</li>
              <li>Monitor accounts for suspicious activity</li>
              <li>Check for unauthorized transactions or account changes</li>
            </ul>
          `}
        </div>
        
        <div class="report-section">
          <h2><span class="section-number">7</span> Monitoring & Alerts Summary</h2>
          <table class="info-table">
            <tr>
              <td><strong>Monitoring Activated:</strong></td>
              <td>${localOptions.monitoringActive ? '<span class="check-mark">✅</span>' : '<span class="x-mark">❌</span>'}</td>
            </tr>
            <tr>
              <td><strong>Alerts Sent:</strong></td>
              <td>${localOptions.alertsSent ? '<span class="check-mark">✅</span>' : '<span class="x-mark">❌</span>'}</td>
            </tr>
            <tr>
              <td><strong>Alerts Read:</strong></td>
              <td>${localOptions.alertsRead ? '<span class="check-mark">✅</span>' : '<span class="x-mark">❌</span>'}</td>
            </tr>
            <tr>
              <td><strong>Real-Time Status:</strong></td>
              <td>${localOptions.monitoringActive ? 'Monitoring active' : 'Monitoring inactive'}</td>
            </tr>
          </table>
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
