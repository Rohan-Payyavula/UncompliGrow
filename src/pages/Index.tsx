
import React, { useState, useEffect } from 'react';
import Tree from '@/components/Tree';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getHabits, getGoals, getChallenges, addHabit, completeHabit, deleteHabit } from '@/services/api';
import { Habit, Goal, Challenge } from '@/services/api';
import HabitItem from '@/components/HabitItem';

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newHabitDialog, setNewHabitDialog] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showHabitList, setShowHabitList] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [habitsData, goalsData, challengesData] = await Promise.all([
          getHabits(),
          getGoals(),
          getChallenges()
        ]);
        
        setHabits(habitsData);
        setGoals(goalsData);
        setChallenges(challengesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your growth data. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

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

  const handleCompleteHabit = async (id: string) => {
    try {
      const updatedHabit = await completeHabit(id);
      
      setHabits(habits.map(habit => 
        habit.id === id ? updatedHabit : habit
      ));
      
      if (updatedHabit.completed) {
        toast({
          title: 'Habit Completed',
          description: `Great job! You've maintained a ${updatedHabit.streak} day streak.`,
        });
      }
      
      setShowHabitList(false);
    } catch (error) {
      console.error('Error completing habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      });
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
          <h1 className="text-2xl font-bold text-primary">UncompliGrow</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHabitList(!showHabitList)}
            >
              {showHabitList ? "View Tree" : "Quick Complete Habits"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNewHabitDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Habit
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pt-8 pb-24 relative">
        <div className="max-w-screen-xl mx-auto h-[75vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-primary">Loading your growth...</div>
            </div>
          ) : showHabitList ? (
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Complete Today's Habits</h2>
              <p className="text-muted-foreground mb-6">
                As you complete your habits, watch your tree grow stronger!
              </p>
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
            <Tree habits={habits} goals={goals} challenges={challenges} />
          )}
        </div>
      </main>

      <Navigation />

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

export default Index;
