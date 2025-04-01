
import React from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FeatureDetailsProps {
  title: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
}

const FeatureDetails: React.FC<FeatureDetailsProps> = ({
  title,
  description,
  detailedDescription,
  icon
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="cyber-card p-6">
      <div className="w-12 h-12 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="p-0 text-sm text-cyber-primary hover:underline hover:bg-transparent flex items-center gap-1">
            {isOpen ? 'Hide Details' : 'Learn more'}
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 text-sm text-muted-foreground border-t border-cyber-primary/20 pt-4">
          <p>{detailedDescription}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FeatureDetails;
