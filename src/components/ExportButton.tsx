
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

  const handleExport = async (format: 'csv' | 'pdf', isOverallReport: boolean = false) => {
    try {
      setIsExporting(true);
      
      // Simulate some processing time 
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isOverallReport) {
        // Export comprehensive report
        exportOverallReport(
          data, 
          recommendationsData, 
          historyData, 
          `darkwebshield-overall-report-${Date.now()}`
        );
        toast.success('Comprehensive security report exported successfully');
      } else {
        // Export regular report
        exportReport(data, format, `darkwebshield-report-${Date.now()}`, {
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
