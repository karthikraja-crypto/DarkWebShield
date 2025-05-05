
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExportButton from './ExportButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useScan } from '@/contexts/ScanContext';

interface ScanResultExportProps {
  results: any[];
  className?: string;
  recommendationsData?: any[];
  historyData?: any[];
  scanType?: string;
  scanValue?: string;
}

const ScanResultExport = ({ 
  results, 
  recommendationsData = [],
  historyData = [],
  scanType = '',
  scanValue = '',
  className 
}: ScanResultExportProps) => {
  const { isIdMonitored, scanHistory } = useScan();

  // Extract scan history data to include in reports
  const scanHistoryForReport = scanHistory.map(scan => ({
    date: scan.date,
    type: scan.type,
    value: scan.value,
    breachesFound: scan.breachesFound,
    isRealScan: scan.isRealScan
  }));

  return (
    <Card className={`cyber-card ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Export Options</span>
          <ExportButton 
            data={results} 
            recommendationsData={recommendationsData}
            historyData={scanHistoryForReport}
            variant="outline" 
            className="border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10"
            showOverallReport={results.length > 0}
          />
        </CardTitle>
        <CardDescription>
          Export your scan results for offline analysis or reporting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-cyber-dark/20 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Comprehensive Report</h3>
            <p className="text-sm text-muted-foreground">
              Generate a detailed security analysis with all detected breaches, risk assessment, and personalized recommendations.
            </p>
            
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="report-content">
                <AccordionTrigger className="text-xs text-cyber-primary py-1">What's included in the report?</AccordionTrigger>
                <AccordionContent className="text-xs space-y-1.5 pb-2">
                  <p>• Executive Summary with risk level assessment</p>
                  <p>• Scan & Breach Summary with historical data</p>
                  <p>• Detailed records of each detected breach</p>
                  <p>• Risk Analysis with affected services</p>
                  <p>• Personalized Security Recommendations</p>
                  <p>• Complete Scan History & Monitoring Summary</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-cyber-dark/20 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Individual Formats</h3>
            <p className="text-sm text-muted-foreground">
              Export as CSV for data manipulation, PDF for a professionally formatted report, Word document for editing, or detailed individual breach reports.
            </p>
            
            {results.length === 1 && (
              <div className="mt-2 text-xs text-cyber-accent">
                <p>✓ Individual breach report available for this result</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResultExport;
