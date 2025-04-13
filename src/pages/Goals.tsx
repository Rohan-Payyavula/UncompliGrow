
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import GoalItem from '@/components/GoalItem';
import Navigation from '@/components/Navigation';
import { getGoals, addGoal, addTask, completeTask, deleteGoal, deleteTask, Goal } from '@/services/api';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGoalDialog, setNewGoalDialog] = useState(false);
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [deleteGoalDialog, setDeleteGoalDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [goalToDelete, setGoalToDelete] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await getGoals();
        setGoals(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading goals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your goals. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    loadGoals();
  }, [toast]);

  const handleAddGoal = async () => {
    if (newGoalTitle.trim()) {
      try {
        const newGoalData = await addGoal(newGoalTitle, selectedParentId);
        // Refresh goals to get the updated structure
        const updatedGoals = await getGoals();
        setGoals(updatedGoals);
        
        setNewGoalDialog(false);
        setNewGoalTitle('');
        setSelectedParentId(undefined);
        
        toast({
          title: 'Goal Added',
          description: 'Your new goal has been added successfully.',
        });
      } catch (error) {
        console.error('Error adding goal:', error);
        toast({
          title: 'Error',
          description: 'Failed to add your goal. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() && selectedGoalId) {
      try {
        await addTask(newTaskTitle, selectedGoalId);
        // Refresh goals to get the updated structure
        const updatedGoals = await getGoals();
        setGoals(updatedGoals);
        
        setNewTaskDialog(false);
        setNewTaskTitle('');
        setSelectedGoalId('');
        
        toast({
          title: 'Task Added',
          description: 'Your new task has been added successfully.',
        });
      } catch (error) {
        console.error('Error adding task:', error);
        toast({
          title: 'Error',
          description: 'Failed to add your task. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    setGoalToDelete(goalId);
    setDeleteGoalDialog(true);
  };

  const confirmDeleteGoal = async () => {
    try {
      const success = await deleteGoal(goalToDelete);
      
      if (success) {
        // Refresh goals to get the updated structure
        const updatedGoals = await getGoals();
        setGoals(updatedGoals);
        
        toast({
          title: 'Goal Deleted',
          description: 'Your goal has been removed successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete goal. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete goal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteGoalDialog(false);
      setGoalToDelete('');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const success = await deleteTask(taskId);
      
      if (success) {
        // Refresh goals to get the updated structure
        const updatedGoals = await getGoals();
        setGoals(updatedGoals);
        
        toast({
          title: 'Task Deleted',
          description: 'Your task has been removed successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete task. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddSubgoal = (parentId: string) => {
    setSelectedParentId(parentId);
    setNewGoalDialog(true);
  };

  const handleAddTaskToGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setNewTaskDialog(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      // Refresh goals to get the updated structure
      const updatedGoals = await getGoals();
      setGoals(updatedGoals);
      
      toast({
        title: 'Task Updated',
        description: 'Your task status has been updated.',
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get only root goals for display
  const rootGoals = goals.filter(goal => !goal.parentId);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <h1 className="text-xl font-semibold">Your Goals</h1>
          <Button size="sm" onClick={() => {
            setSelectedParentId(undefined);
            setNewGoalDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            New Goal
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Goals form the branches of your growth tree. As you complete tasks, your branches grow and flourish.
          </p>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-pulse">Loading your goals...</div>
            </div>
          ) : rootGoals.length > 0 ? (
            <div>
              {rootGoals.map(goal => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onAddSubgoal={handleAddSubgoal}
                  onAddTask={handleAddTaskToGoal}
                  onCompleteTask={handleCompleteTask}
                  onDeleteGoal={handleDeleteGoal}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-4">Start growing branches on your tree by adding goals.</p>
              <Button onClick={() => {
                setSelectedParentId(undefined);
                setNewGoalDialog(true);
              }}>
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Goal
              </Button>
            </div>
          )}
        </div>
      </main>

      <Navigation />

      {/* Add New Goal Dialog */}
      <Dialog open={newGoalDialog} onOpenChange={setNewGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedParentId ? 'Add New Subgoal' : 'Add New Goal'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="goalTitle">Goal Title</Label>
              <Input
                id="goalTitle"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="e.g., Learn Spanish"
                className="mt-2"
              />
            </div>
            
            {!selectedParentId && goals.length > 0 && (
              <div>
                <Label htmlFor="parentGoal">Parent Goal (Optional)</Label>
                <Select onValueChange={(value) => setSelectedParentId(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a parent goal (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map(goal => (
                      <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewGoalDialog(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Task Dialog */}
      <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g., Complete first lesson"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Goal Confirmation Dialog */}
      <Dialog open={deleteGoalDialog} onOpenChange={setDeleteGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This will also remove all tasks and subgoals associated with it. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteGoalDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteGoal}>Delete Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
