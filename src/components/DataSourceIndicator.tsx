
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertOctagon, AlertCircle } from 'lucide-react';
import { useScan } from '@/contexts/ScanContext';

interface DataSourceIndicatorProps {
  compact?: boolean;
}

const DataSourceIndicator = ({ compact = false }: DataSourceIndicatorProps) => {
  const { isRealData, setGlobalRealTimeScanMode } = useScan();
  
  if (compact) {
    return (
      <Badge 
        variant={isRealData ? "destructive" : "secondary"} 
        className="ml-2"
      >
        {isRealData ? 'Real Data' : 'Sample Data'}
      </Badge>
    );
  }
  
  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
      <div className="flex items-center gap-2">
        {isRealData ? (
          <AlertOctagon className="h-4 w-4 text-destructive" />
        ) : (
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        )}
        <span className={`text-sm ${isRealData ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {isRealData 
            ? 'Viewing actual breach data related to your scan' 
            : 'Viewing sample data for demonstration purposes'}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setGlobalRealTimeScanMode(!isRealData)}
      >
        {isRealData ? 'View Sample Data' : 'View Real Data'}
      </Button>
    </div>
  );
};

export default DataSourceIndicator;
