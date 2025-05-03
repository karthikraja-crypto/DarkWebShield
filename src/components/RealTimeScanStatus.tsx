
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useScan } from '@/contexts/ScanContext';
import { Database, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RealTimeScanStatusProps {
  compact?: boolean;
}

const RealTimeScanStatus = ({ compact = false }: RealTimeScanStatusProps) => {
  const { isRealTimeScanMode } = useScan();
  
  if (compact) {
    return (
      <Badge 
        variant={isRealTimeScanMode ? "default" : "outline"} 
        className={isRealTimeScanMode ? "bg-cyber-primary" : ""}
      >
        {isRealTimeScanMode ? 'Real-Time' : 'Sample Mode'}
      </Badge>
    );
  }
  
  return (
    <div className={`flex items-center justify-between p-2 ${isRealTimeScanMode ? 'bg-cyber-primary/10 border border-cyber-primary/30' : 'bg-muted/20 border border-muted'} rounded-md mb-4`}>
      <div className="flex items-center gap-2">
        {isRealTimeScanMode ? (
          <Database className="h-4 w-4 text-cyber-primary" />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground" />
        )}
        <span className={`text-sm font-medium ${isRealTimeScanMode ? 'text-cyber-primary' : 'text-muted-foreground'}`}>
          {isRealTimeScanMode ? 'Real-Time Scanning Active' : 'Sample Data Mode'}
        </span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <Badge variant="outline" className="text-xs">
                {isRealTimeScanMode ? '30 min' : 'Demo'}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-64 p-3">
            <p className="text-sm">
              {isRealTimeScanMode 
                ? 'Real-Time scanning will automatically disable after 30 minutes of inactivity to preserve system resources.' 
                : 'In Sample Data Mode, all scans and results are simulated for demonstration purposes only.'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default RealTimeScanStatus;
