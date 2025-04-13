
import React from 'react';
import { Check, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitItemProps {
  habit: {
    id: string;
    title: string;
    streak: number;
    completed: boolean;
  };
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onComplete, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm mb-3 border">
      <div className="flex items-center">
        <button
          onClick={() => onComplete(habit.id)}
          className={cn(
            "w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-colors",
            habit.completed 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted border border-input"
          )}
        >
          {habit.completed && <Check className="h-4 w-4" />}
        </button>
        <div>
          <h3 className="font-medium">{habit.title}</h3>
          <p className="text-xs text-muted-foreground">
            {habit.streak > 0 ? `${habit.streak} day streak` : 'Start your streak today!'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded">
          {habit.completed ? 'Done' : 'Pending'}
        </div>
        {onDelete && (
          <button 
            onClick={() => onDelete(habit.id)}
            className="text-destructive hover:bg-destructive/10 p-1 rounded"
            title="Delete habit"
          >
            <Trash className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HabitItem;
