import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { exportReport, exportOverallReport } from '@/utils/exportUtils';
import { toast } from 'sonner';
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

  const handleExport = async (format: 'csv' | 'pdf' | 'individual', isOverallReport: boolean = false) => {
    try {
      setIsExporting(true);
      
      // Simulate some processing time 
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (format === 'individual' && data.length > 0) {
        // Export individual breach report using the unified exportReport function
        exportReport([data[0]], format, `darkwebshield-breach-report-${Date.now()}`);
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
          Title: item.title || item.domain || 'Unknown',
          Domain: item.domain || 'Unknown',
          Date: item.breachDate ? new Date(item.breachDate).toLocaleDateString() : 'Unknown',
          Risk: (item.riskLevel || 'medium').toUpperCase(),
          AffectedData: Array.isArray(item.affectedData) ? item.affectedData.join(', ') : (item.affectedData || 'Unknown'),
          Description: item.description || 'No detailed information available'
        }));
        
        // Process recommendations data
        const processedRecommendations = recommendationsData.map(rec => ({
          Title: rec.title || 'Unknown',
          Priority: rec.priority || 'medium',
          Status: rec.completed ? 'Completed' : 'Pending',
          Description: rec.description || ''
        }));
        
        // Export comprehensive report with processed data
        exportOverallReport(
          processedData, 
          processedRecommendations, 
          historyData, 
          `darkwebshield-overall-report-${Date.now()}`
        );
        toast.success('Comprehensive security report exported successfully');
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
        
        // Export regular report with processed data
        exportReport(processedData, format, `darkwebshield-report-${Date.now()}`, {
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
              {showOverallReport ? 'Overall Report' : 'Export Report'}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {showOverallReport && (
          <DropdownMenuItem onClick={() => handleExport('pdf', true)}>
            <Download className="mr-2 h-4 w-4" />
            Export Overall Report
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
