
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Check, Shield, CalendarDays, Database, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportReport } from '@/utils/exportUtils';
import { toast } from 'sonner';

export interface BreachData {
  id: string;
  title: string;
  domain: string;
  breachDate: string;
  affectedData: string[];
  riskLevel: 'high' | 'medium' | 'low';
  verified: boolean;
  description: string;
}

interface BreachCardProps {
  breach: BreachData;
}

const BreachCard: React.FC<BreachCardProps> = ({ breach }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-cyber-danger border-cyber-danger';
      case 'medium':
        return 'text-cyber-warning border-cyber-warning';
      case 'low':
        return 'text-cyber-success border-cyber-success';
      default:
        return 'text-muted-foreground border-muted-foreground';
    }
  };

  const getRiskProgressColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-cyber-danger';
      case 'medium':
        return 'bg-cyber-warning';
      case 'low':
        return 'bg-cyber-success';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getRiskPercentage = (risk: string) => {
    switch (risk) {
      case 'high':
        return 90;
      case 'medium':
        return 50;
      case 'low':
        return 20;
      default:
        return 0;
    }
  };

  const handleExportBreachReport = () => {
    toast.info(`Generating report for ${breach.title}...`);
    
    // Prepare the data in the format expected by the exportReport function
    const reportData = {
      BreachName: breach.title,
      Domain: breach.domain,
      BreachDate: breach.breachDate,
      Severity: breach.riskLevel,
      AffectedData: breach.affectedData.join(', '),
      Description: breach.description
    };
    
    setTimeout(() => {
      exportReport([reportData], 'individual', `breach-report-${breach.domain}`);
      toast.success('Breach report has been generated and downloaded');
    }, 500);
  };

  return (
    <Card className="cyber-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{breach.title}</CardTitle>
          <Badge variant="outline" className={`${getRiskColor(breach.riskLevel)} px-2 py-0.5`}>
            {breach.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Database className="h-3 w-3" />
          <span>{breach.domain}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Breach Date:</span>
            </div>
            <span>{new Date(breach.breachDate).toLocaleDateString()}</span>
          </div>
          <Progress 
            value={getRiskPercentage(breach.riskLevel)} 
            className="h-1.5 bg-cyber-dark"
          >
            <div 
              className={`h-full ${getRiskProgressColor(breach.riskLevel)}`} 
              style={{ width: `${getRiskPercentage(breach.riskLevel)}%` }} 
            />
          </Progress>
        </div>
        
        <div>
          <h4 className="text-xs font-medium mb-2">Affected Data Types:</h4>
          <div className="flex flex-wrap gap-1">
            {breach.affectedData.map((data, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-cyber-dark/50">
                {data}
              </Badge>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{breach.description}</p>
        
        {/* Add Export Report button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-cyber-primary border-cyber-primary/30 hover:bg-cyber-primary/10"
          onClick={handleExportBreachReport}
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-cyber-primary/20 pt-4">
        {breach.verified ? (
          <div className="flex items-center text-xs text-cyber-success">
            <Check className="h-3 w-3 mr-1" />
            <span>Verified breach</span>
          </div>
        ) : (
          <div className="flex items-center text-xs text-cyber-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>Unverified breach</span>
          </div>
        )}
        <div className="flex items-center text-xs text-cyber-primary">
          <Shield className="h-3 w-3 mr-1" />
          <span>Protected by DarkWebShield</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BreachCard;
