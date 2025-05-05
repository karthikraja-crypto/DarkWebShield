
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { exportReport, exportOverallReport, ExportFormat } from '@/utils/exportUtils';
import { toast } from 'sonner';
import { useScan } from '@/contexts/ScanContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps {
  data: any[];
  recommendationsData?: any[];
  historyData?: any[];
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  showOverallReport?: boolean;
}

const ExportButton = ({ 
  data, 
  recommendationsData = [], 
  historyData = [],
  className, 
  variant = 'default',
  showOverallReport = false
}: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { isRealTimeScanMode } = useScan();

  const handleExport = async (format: ExportFormat, isOverallReport: boolean = false) => {
    try {
      setIsExporting(true);
      
      // Simulate some processing time 
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (format === 'individual' && data.length > 0) {
        // Export individual breach report using the unified exportReport function
        const filename = isRealTimeScanMode 
          ? `real-time-breach-report-${Date.now()}`
          : `darkwebshield-breach-report-${Date.now()}`;
          
        exportReport([data[0]], format, filename);
        
        toast.success('Individual breach report exported successfully');
      } else if (isOverallReport) {
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
        
        // Process data for export - convert objects to structured format
        const processedData = data.map(item => ({
          Title: item.title || item.domain || item.BreachName || 'Unknown',
          Domain: item.domain || 'Unknown',
          Date: item.breachDate ? new Date(item.breachDate).toLocaleDateString() : (item.BreachDate ? new Date(item.BreachDate).toLocaleDateString() : 'Unknown'),
          Risk: (item.riskLevel || item.Severity || 'medium').toUpperCase(),
          AffectedData: Array.isArray(item.affectedData) ? item.affectedData.join(', ') : (item.AffectedData || item.affectedData || 'Unknown'),
          Description: item.description || item.Description || 'No detailed information available'
        }));
        
        // Process recommendations data
        const processedRecommendations = recommendationsData.map(rec => ({
          Title: rec.title || rec.Title || 'Unknown',
          Priority: rec.priority || rec.Priority || 'medium',
          Status: rec.completed ? 'Completed' : 'Pending',
          Description: rec.description || rec.Description || ''
        }));
        
        // Process history data if available
        const processedHistoryData = historyData && historyData.length > 0 
          ? historyData 
          : [];
        
        const filename = isRealTimeScanMode 
          ? `real-time-security-report-${Date.now()}` 
          : `darkwebshield-overall-report-${Date.now()}`;
          
        // Export comprehensive report with processed data
        exportOverallReport(
          processedData, 
          processedRecommendations, 
          processedHistoryData, 
          filename
        );
        toast.success('Comprehensive security report with scan history exported successfully');
      } else {
        // Process data for standard export
        const processedData = data.map(item => {
          // Convert any complex object structures to a flat format for export
          const flatItem: Record<string, any> = {};
          Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              Object.entries(value).forEach(([subKey, subValue]) => {
                flatItem[`${key}_${subKey}`] = subValue;
              });
            } else if (Array.isArray(value)) {
              flatItem[key] = value.join(', ');
            } else {
              flatItem[key] = value;
            }
          });
          return flatItem;
        });
        
        const filename = isRealTimeScanMode 
          ? `real-time-report-${Date.now()}` 
          : `darkwebshield-report-${Date.now()}`;
          
        // Export regular report with processed data
        exportReport(processedData, format, filename, {
          reportType: 'standard'
        });
        toast.success(`Report exported successfully as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          className={className}
          disabled={isExporting || !data.length}
        >
          {isExporting ? (
            <>
              <FileText className="mr-2 h-4 w-4 animate-pulse" />
              Exporting...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              {showOverallReport ? 'Export Report' : 'Export'}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {showOverallReport && (
          <DropdownMenuItem onClick={() => handleExport('pdf', true)}>
            <Download className="mr-2 h-4 w-4" />
            Export Overall Report with History
          </DropdownMenuItem>
        )}
        {showOverallReport && (
          <DropdownMenuItem onClick={() => handleExport('word', true)}>
            <Download className="mr-2 h-4 w-4" />
            Export as Word Document (.doc)
          </DropdownMenuItem>
        )}
        {data.length === 1 && (
          <DropdownMenuItem onClick={() => handleExport('individual')}>
            <Download className="mr-2 h-4 w-4" />
            Individual Breach Report
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('word')}>
          <Download className="mr-2 h-4 w-4" />
          Export as Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
