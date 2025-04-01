import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Lock, FileKey, KeyRound, MailCheck, User, CheckCircle2 } from 'lucide-react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon: 'lock' | 'file' | 'key' | 'mail' | 'user' | 'shield';
  completed: boolean;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
  onComplete?: (id: string) => void;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  recommendations,
  onComplete 
}) => {
  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'lock':
        return <Lock className="h-5 w-5" />;
      case 'file':
        return <FileKey className="h-5 w-5" />;
      case 'key':
        return <KeyRound className="h-5 w-5" />;
      case 'mail':
        return <MailCheck className="h-5 w-5" />;
      case 'user':
        return <User className="h-5 w-5" />;
      case 'shield':
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-cyber-danger text-white';
      case 'high':
        return 'bg-cyber-warning text-black';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-cyber-success text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Security Recommendations</CardTitle>
            <CardDescription>Steps to improve your security posture</CardDescription>
          </div>
          <AlertTriangle className="h-5 w-5 text-cyber-warning" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {recommendations.map((recommendation) => (
            <li 
              key={recommendation.id} 
              className={`p-3 border rounded-md transition-all ${
                recommendation.completed 
                  ? 'border-cyber-success/30 bg-cyber-success/5' 
                  : 'border-cyber-primary/20 hover:border-cyber-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  recommendation.completed 
                    ? 'bg-cyber-success/10 text-cyber-success' 
                    : 'bg-cyber-primary/10 text-cyber-primary'
                }`}>
                  {recommendation.completed 
                    ? <CheckCircle2 className="h-5 w-5" /> 
                    : getIconComponent(recommendation.icon)
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationsList;
