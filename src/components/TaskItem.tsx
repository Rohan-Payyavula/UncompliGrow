
import React from 'react';
import { Check, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
    goalId: string;
  };
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-background rounded border mb-2">
      <div className="flex items-center">
        <button
          onClick={() => onComplete(task.id)}
          className={cn(
            "w-5 h-5 rounded-full mr-3 flex items-center justify-center transition-colors",
            task.completed 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted border border-input"
          )}
        >
          {task.completed && <Check className="h-3 w-3" />}
        </button>
        <span className={cn(task.completed && "line-through text-muted-foreground")}>
          {task.title}
        </span>
      </div>
      {onDelete && (
        <button 
          onClick={() => onDelete(task.id)}
          className="text-destructive hover:bg-destructive/10 p-1 rounded"
          title="Delete task"
        >
          <Trash className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default TaskItem;
