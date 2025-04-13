
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ChallengeItem from '@/components/ChallengeItem';
import Navigation from '@/components/Navigation';
import { getChallenges, completeChallenge, generateDailyChallenge, deleteChallenge, Challenge } from '@/services/api';

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const data = await getChallenges();
        setChallenges(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading challenges:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your challenges. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    loadChallenges();
  }, [toast]);

  const handleCompleteChallenge = async (id: string) => {
    try {
      const updatedChallenge = await completeChallenge(id);
      setChallenges(challenges.map(challenge => 
        challenge.id === id ? updatedChallenge : challenge
      ));
      
      toast({
        title: 'Challenge Completed',
        description: 'Great job! Your roots are growing stronger.',
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete challenge. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    try {
      const success = await deleteChallenge(id);
      
      if (success) {
        setChallenges(challenges.filter(challenge => challenge.id !== id));
        toast({
          title: 'Challenge Deleted',
          description: 'Your challenge has been removed successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete challenge. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete challenge. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateChallenge = async () => {
    setIsGenerating(true);
    try {
      const newChallenge = await generateDailyChallenge();
      setChallenges([...challenges, newChallenge]);
      
      toast({
        title: 'New Challenge Generated',
        description: 'A new wellness challenge is ready for you.',
      });
    } catch (error) {
      console.error('Error generating challenge:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a new challenge. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Sort challenges - incomplete first, then completed
  const sortedChallenges = [...challenges].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <h1 className="text-xl font-semibold">Wellness Roots</h1>
          <Button size="sm" onClick={handleGenerateChallenge} disabled={isGenerating}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
            New Challenge
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Wellness challenges form the roots of your growth tree. Complete them to strengthen your foundation.
          </p>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-pulse">Loading your challenges...</div>
            </div>
          ) : sortedChallenges.length > 0 ? (
            <div>
              {sortedChallenges.map(challenge => (
                <ChallengeItem 
                  key={challenge.id} 
                  challenge={challenge} 
                  onComplete={handleCompleteChallenge} 
                  onDelete={handleDeleteChallenge}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">No Challenges Yet</h3>
              <p className="text-muted-foreground mb-4">Generate a wellness challenge to grow your roots.</p>
              <Button onClick={handleGenerateChallenge} disabled={isGenerating}>
                <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate Your First Challenge
              </Button>
            </div>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Challenges;
