
import React from 'react';
import { Check, AlertCircle, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChallengeItemProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  };
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ challenge, onComplete, onDelete }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm mb-4 border overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
            challenge.completed 
              ? "bg-primary text-primary-foreground" 
              : "bg-accent text-accent-foreground"
          )}>
            {challenge.completed ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{challenge.title}</h3>
              {onDelete && (
                <button 
                  onClick={() => onDelete(challenge.id)}
                  className="text-destructive hover:bg-destructive/10 p-1 rounded ml-2"
                  title="Delete challenge"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {challenge.description}
            </p>
          </div>
        </div>
        
        {!challenge.completed && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => onComplete(challenge.id)}
              variant="outline"
              className="w-full"
            >
              Complete Challenge
            </Button>
          </div>
        )}
      </div>
      
      {challenge.completed && (
        <div className="bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Completed</span> • Your roots grow stronger with each challenge!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengeItem;
