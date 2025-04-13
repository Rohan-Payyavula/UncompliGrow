
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  goalId: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  subgoals: Goal[];
  tasks: Task[];
  parentId?: string;
}

interface GoalItemProps {
  goal: Goal;
  level?: number;
  onAddSubgoal: (parentId: string) => void;
  onAddTask: (goalId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteGoal?: (goalId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ 
  goal, 
  level = 0,
  onAddSubgoal,
  onAddTask,
  onCompleteTask,
  onDeleteGoal,
  onDeleteTask
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasChildren = goal.subgoals.length > 0 || goal.tasks.length > 0;
  
  return (
    <div className="mb-3">
      <div 
        className={cn(
          "flex items-center justify-between p-4 bg-card rounded-lg shadow-sm border cursor-pointer transition-colors",
          expanded && "bg-accent bg-opacity-20 border-accent"
        )}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {hasChildren && (
            <button 
              className="mr-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <div className="flex-1">
            <h3 className="font-medium">{goal.title}</h3>
            <div className="mt-1">
              <Progress value={goal.progress} className="h-1" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onAddTask(goal.id);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="text-xs">Task</span>
          </Button>
          {level < 3 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddSubgoal(goal.id);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="text-xs">Subgoal</span>
            </Button>
          )}
          {onDeleteGoal && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGoal(goal.id);
              }}
              title="Delete goal"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className={cn("pl-4 mt-2", level > 0 && "border-l ml-3")}>
          {/* Tasks */}
          {goal.tasks.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Tasks</h4>
              {goal.tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onComplete={onCompleteTask}
                  onDelete={onDeleteTask} 
                />
              ))}
            </div>
          )}
          
          {/* Subgoals */}
          {goal.subgoals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Subgoals</h4>
              {goal.subgoals.map(subgoal => (
                <GoalItem 
                  key={subgoal.id}
                  goal={subgoal}
                  level={level + 1}
                  onAddSubgoal={onAddSubgoal}
                  onAddTask={onAddTask}
                  onCompleteTask={onCompleteTask}
                  onDeleteGoal={onDeleteGoal}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalItem;
