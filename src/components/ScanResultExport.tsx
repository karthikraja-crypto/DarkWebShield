
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExportButton from './ExportButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { bell, bellOff } from 'lucide-react';
import { toast } from 'sonner';
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
  const { toggleMonitoring, isIdMonitored } = useScan();
  const [isMonitoring, setIsMonitoring] = useState<boolean>(scanValue ? isIdMonitored(scanType, scanValue) : false);

  const handleToggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);
    
    // Call context method to toggle monitoring
    toggleMonitoring(scanType, scanValue, newState);
    
    // Show appropriate toast message
    if (newState) {
      toast.success(`Continuous Monitoring enabled for ${scanType}`);
    } else {
      toast.info(`Monitoring stopped for ${scanType}`);
    }
  };

  return (
    <Card className={`cyber-card ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Export Options</span>
          <ExportButton 
            data={results} 
            recommendationsData={recommendationsData}
            historyData={historyData}
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
          {/* Continuous Monitoring Button */}
          {scanType && scanValue && (
            <div className="bg-cyber-dark/10 p-4 rounded-md border border-cyber-primary/20 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">🔁 Continuous Monitoring</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isMonitoring 
                      ? `Actively monitoring ${scanType}: ${scanValue.replace(/^(.{3}).*(.{3})$/, '$1***$2')}`
                      : `Enable monitoring for ${scanType}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isMonitoring ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    checked={isMonitoring}
                    onCheckedChange={handleToggleMonitoring}
                    className={isMonitoring ? "bg-cyber-primary" : ""}
                  />
                </div>
              </div>
            </div>
          )}
          
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
                  <p>• Monitoring & Alerts Summary</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-cyber-dark/20 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Individual Formats</h3>
            <p className="text-sm text-muted-foreground">
              Export as CSV for data manipulation, PDF for a professionally formatted report, or detailed individual breach reports.
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
