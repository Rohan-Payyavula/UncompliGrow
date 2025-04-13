
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import HabitItem from '@/components/HabitItem';
import Navigation from '@/components/Navigation';
import { getHabits, completeHabit, addHabit, deleteHabit, Habit } from '@/services/api';

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newHabitDialog, setNewHabitDialog] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await getHabits();
        setHabits(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading habits:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your habits. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    loadHabits();
  }, [toast]);

  const handleCompleteHabit = async (id: string) => {
    try {
      const updatedHabit = await completeHabit(id);
      
      // Update the habits state with the new data
      setHabits(habits.map(habit => 
        habit.id === id ? updatedHabit : habit
      ));
      
      if (updatedHabit.completed) {
        toast({
          title: 'Habit Completed',
          description: `Great job! You've maintained a ${updatedHabit.streak} day streak.`,
        });
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddHabit = async () => {
    if (newHabitTitle.trim()) {
      try {
        const newHabit = await addHabit(newHabitTitle);
        setHabits([...habits, newHabit]);
        setNewHabitDialog(false);
        setNewHabitTitle('');
        toast({
          title: 'Habit Added',
          description: 'Your new habit has been added successfully.',
        });
      } catch (error) {
        console.error('Error adding habit:', error);
        toast({
          title: 'Error',
          description: 'Failed to add your habit. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      const success = await deleteHabit(id);
      
      if (success) {
        setHabits(habits.filter(habit => habit.id !== id));
        toast({
          title: 'Habit Deleted',
          description: 'Your habit has been removed successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete habit. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <h1 className="text-xl font-semibold">Your Habits</h1>
          <Button size="sm" onClick={() => setNewHabitDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Habit
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Daily habits form the trunk of your growth tree. Complete them consistently to strengthen your foundation.
          </p>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-pulse">Loading your habits...</div>
            </div>
          ) : habits.length > 0 ? (
            <div>
              {habits.map(habit => (
                <HabitItem 
                  key={habit.id} 
                  habit={habit} 
                  onComplete={handleCompleteHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">No Habits Yet</h3>
              <p className="text-muted-foreground mb-4">Start building your growth tree by adding daily habits.</p>
              <Button onClick={() => setNewHabitDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </div>
      </main>

      <Navigation />

      {/* Add New Habit Dialog */}
      <Dialog open={newHabitDialog} onOpenChange={setNewHabitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="habitTitle">Habit Name</Label>
            <Input
              id="habitTitle"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewHabitDialog(false)}>Cancel</Button>
            <Button onClick={handleAddHabit}>Add Habit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Habits;
