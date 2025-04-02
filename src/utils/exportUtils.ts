
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
 * Generate a basic PDF report from scan data and trigger download
 * Uses window.print() for basic PDF generation
 */
export const exportToPDF = (data: any[], filename: string = 'export') => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }
  
  // Create a temporary div for printing
  const printContent = document.createElement('div');
  printContent.style.display = 'none';
  printContent.innerHTML = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
          .report-header { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .timestamp { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>DarkWebShield Security Report</h1>
          <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
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
 * General function to export data in specified format
 */
export const exportReport = (data: any[], format: 'csv' | 'pdf' = 'csv', filename: string = 'security-report') => {
  if (format === 'csv') {
    exportToCSV(data, filename);
  } else if (format === 'pdf') {
    exportToPDF(data, filename);
  } else {
    console.error('Unsupported export format');
  }
};
