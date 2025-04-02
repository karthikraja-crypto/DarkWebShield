
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExportButton from './ExportButton';

interface ScanResultExportProps {
  results: any[];
  className?: string;
}

const ScanResultExport = ({ results, className }: ScanResultExportProps) => {
  return (
    <Card className={`cyber-card ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Export Options</span>
          <ExportButton 
            data={results} 
            variant="outline" 
            className="border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10"
          />
        </CardTitle>
        <CardDescription>
          Export your scan results in various formats for offline analysis or reporting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-cyber-dark/20 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">CSV Format</h3>
            <p className="text-sm text-muted-foreground">
              Export as CSV for easy data manipulation in spreadsheet applications like Excel or Google Sheets.
            </p>
          </div>
          
          <div className="bg-cyber-dark/20 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">PDF Format</h3>
            <p className="text-sm text-muted-foreground">
              Export as PDF for a professionally formatted report that can be easily shared with colleagues or management.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResultExport;
