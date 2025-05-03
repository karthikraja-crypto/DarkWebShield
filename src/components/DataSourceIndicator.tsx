
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertOctagon, AlertCircle } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataSourceIndicatorProps {
  compact?: boolean;
}

const DataSourceIndicator = ({ compact = false }: DataSourceIndicatorProps) => {
  const { isRealData, isRealTimeScanMode, useRealTimeScannedData } = useScan();
  
  const getStatusText = () => {
    if (isRealTimeScanMode) {
      return useRealTimeScannedData
        ? 'Viewing actual breach data related to your scan'
        : 'Real-Time mode active. Run a scan to see actual results.';
    } else {
      return 'Viewing sample data for demonstration purposes';
    }
  };
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={isRealData ? "destructive" : "secondary"} 
              className="ml-2"
            >
              {isRealData ? 'Real Data' : 'Sample Data'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {getStatusText()}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="flex items-center p-2 bg-muted/30 rounded-md">
      <div className="flex items-center gap-2">
        {isRealData ? (
          <AlertOctagon className="h-4 w-4 text-destructive" />
        ) : (
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        )}
        <span className={`text-sm ${isRealData ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};

export default DataSourceIndicator;
