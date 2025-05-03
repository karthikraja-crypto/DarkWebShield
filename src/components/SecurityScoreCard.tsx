
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SecurityScoreProps {
  score: number;
  breachCount: number;
  lastScanDate: string;
  riskFactor: 'high' | 'medium' | 'low';
}

const SecurityScoreCard: React.FC<SecurityScoreProps> = ({
  score,
  breachCount,
  lastScanDate,
  riskFactor
}) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-cyber-success';
    if (score >= 50) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  const getScoreDescription = () => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getScoreProgressColor = () => {
    if (score >= 80) return 'bg-cyber-success';
    if (score >= 50) return 'bg-cyber-warning';
    return 'bg-cyber-danger';
  };

  const getRiskFactorColor = () => {
    switch (riskFactor) {
      case 'high': return 'text-cyber-danger';
      case 'medium': return 'text-cyber-warning';
      case 'low': return 'text-cyber-success';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskIcon = () => {
    switch (riskFactor) {
      case 'high': return <ShieldAlert className="h-5 w-5 text-cyber-danger" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-cyber-warning" />;
      case 'low': return <ShieldCheck className="h-5 w-5 text-cyber-success" />;
      default: return <InfoIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="cyber-card animate-pulse-glow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Security Score</CardTitle>
        <CardDescription>Your digital identity protection rating</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative mx-auto w-32 h-32 mb-4 cursor-help">
                  <div className="absolute inset-0 rounded-full border-4 border-cyber-primary/20"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyber-primary"
                    style={{ 
                      transform: `rotate(${score * 3.6}deg)`,
                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
                    <span className="text-sm text-muted-foreground">{getScoreDescription()}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] p-3">
                <p className="text-sm">
                  Security Score is calculated based on:
                </p>
                <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
                  <li>Number of detected breaches</li>
                  <li>Risk level of each breach (High/Medium/Low)</li>
                  <li>Sensitivity of exposed data types</li>
                  <li>Age and relevance of breaches</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span>Protection Level</span>
              <span className={getScoreColor()}>{getScoreDescription()}</span>
            </div>
            <Progress value={score} className="h-2 bg-cyber-dark">
              <div 
                className={`h-full ${getScoreProgressColor()}`} 
                style={{ width: `${score}%` }}
              ></div>
            </Progress>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Breaches Detected</p>
            <p className={`text-lg font-semibold ${breachCount > 0 ? 'text-cyber-warning' : 'text-cyber-success'}`}>
              {breachCount}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Risk Factor</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <p className={`text-lg font-semibold flex items-center gap-1 ${getRiskFactorColor()}`}>
                      {getRiskIcon()}
                      <span className="capitalize">{riskFactor}</span>
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {riskFactor === 'high' 
                      ? 'Critical vulnerabilities detected, immediate action required' 
                      : riskFactor === 'medium' 
                        ? 'Some risks detected, action recommended' 
                        : 'Minor risks detected, monitoring advised'
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Last Scan</p>
            <p className="text-lg font-semibold">
              {new Date(lastScanDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-cyber-primary/20">
        <p className="text-xs text-muted-foreground w-full text-center">
          Updated in real-time with AI-powered dark web scanning
        </p>
      </CardFooter>
    </Card>
  );
};

export default SecurityScoreCard;
