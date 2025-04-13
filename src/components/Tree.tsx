import React from 'react';
import { cn } from '@/lib/utils';

interface TreeProps {
  habits: Habit[];
  goals: Goal[];
  challenges: Challenge[];
}

interface Habit {
  id: string;
  title: string;
  streak: number;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  subgoals: Goal[];
  tasks: Task[];
  parentId?: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  goalId: string;
}

interface Challenge {
  id: string;
  title: string;
  completed: boolean;
}

const Tree: React.FC<TreeProps> = ({ habits, goals, challenges }) => {
  // Calculate trunk thickness based on habit streaks with more noticeable scaling
  const getTrunkWidth = () => {
    const baseWidth = 20; // Reduced from 30 to make the default trunk smaller
    const maxWidth = 120; 
    const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const completedHabits = habits.filter(habit => habit.completed).length;
    
    // Apply both streak-based growth and completion-based growth
    const streakFactor = Math.min(baseWidth + totalStreaks * 3, maxWidth);
    const completionBonus = completedHabits * 8;
    
    return Math.min(streakFactor + completionBonus, maxWidth);
  };

  // Get root goals (goals without parentId)
  const rootGoals = goals.filter(goal => !goal.parentId);
  
  // Calculate number of completed challenges
  const completedChallenges = challenges.filter(challenge => challenge.completed).length;

  // Calculate trunk height based on number of branches and completed habits
  const getTrunkHeight = () => {
    const minHeight = 150;
    const heightPerBranch = 30;
    const completedHabits = habits.filter(habit => habit.completed).length;
    const habitHeightBonus = completedHabits * 15; // Height increases as habits are completed
    
    return minHeight + rootGoals.length * heightPerBranch + habitHeightBonus;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end overflow-hidden pb-16">
      {/* Sky background */}
      <div className="absolute inset-0 bg-uproot-sky opacity-30 z-0"></div>
      
      {/* Tree container */}
      <div className="relative w-full h-full flex flex-col items-center justify-end z-10 pb-12">
        {/* Trunk */}
        <div 
          className="trunk rounded-t-lg origin-bottom relative transition-all duration-700"
          style={{ 
            width: `${getTrunkWidth()}px`, 
            height: `${getTrunkHeight()}px`,
            zIndex: 15
          }}
        >
          {/* Texture for trunk */}
          <div className="absolute inset-0 w-full h-full rounded-t-lg overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1/6 h-full bg-uproot-trunkDark opacity-20 rounded-b-full"></div>
            <div className="absolute top-0 right-1/4 w-1/6 h-full bg-uproot-trunkDark opacity-20 rounded-b-full"></div>
          </div>
          
          {/* Position branches OUTSIDE the trunk */}
          {/* Left side branches */}
          {rootGoals.slice(0, Math.ceil(rootGoals.length / 2)).map((goal, index) => (
            <div 
              key={goal.id} 
              className="absolute z-20"
              style={{ 
                right: `${getTrunkWidth()}px`, // Position branch to start from the left edge of trunk
                top: `${40 + index * 60}px`,
              }}
            >
              {/* Branch connector that extends TO the trunk */}
              <div 
                className="absolute bg-uproot-branch"
                style={{ 
                  width: '30px', 
                  height: '12px',
                  top: '10px',
                  left: '100%',  // Connect to the trunk from the right side of branch
                  transformOrigin: 'right center',
                  transform: 'rotate(10deg)',
                  borderRadius: '5px 0 0 5px',
                  boxShadow: 'inset 0 -2px 4px rgba(109, 53, 30, 0.3)',
                  zIndex: 25,
                }}
              ></div>
              <Branch 
                goal={goal} 
                goals={goals}
                isLeft={true} 
                level={0}
                index={index}
                totalOnSide={Math.ceil(rootGoals.length / 2)}
              />
            </div>
          ))}
          
          {/* Right side branches */}
          {rootGoals.slice(Math.ceil(rootGoals.length / 2)).map((goal, index) => (
            <div 
              key={goal.id} 
              className="absolute z-20"
              style={{ 
                left: `${getTrunkWidth()}px`, // Position branch to start from the right edge of trunk
                top: `${40 + index * 60}px`,
              }}
            >
              {/* Branch connector that extends TO the trunk */}
              <div 
                className="absolute bg-uproot-branch"
                style={{ 
                  width: '30px', 
                  height: '12px',
                  top: '10px',
                  right: '100%',  // Connect to the trunk from the left side of branch
                  transformOrigin: 'left center',
                  transform: 'rotate(-10deg)',
                  borderRadius: '0 5px 5px 0',
                  boxShadow: 'inset 0 -2px 4px rgba(109, 53, 30, 0.3)',
                  zIndex: 25,
                }}
              ></div>
              <Branch 
                goal={goal} 
                goals={goals}
                isLeft={false} 
                level={0}
                index={index}
                totalOnSide={rootGoals.length - Math.ceil(rootGoals.length / 2)}
              />
            </div>
          ))}
        </div>
        
        {/* Ground/Soil */}
        <div className="soil w-full h-16 relative z-20">
          {/* Roots - positioned UNDER the soil with connectors */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            {challenges.map((challenge, index) => (
              <div key={challenge.id} className="relative mx-1">
                {/* Connect root to the trunk */}
                {challenge.completed && (
                  <div 
                    className="absolute top-0 left-1/2 bg-uproot-root w-2 rounded-t-sm transform -translate-x-1/2"
                    style={{ 
                      height: '10px',
                      zIndex: 10,
                      top: '-10px' // Position above the root to connect to the trunk
                    }}
                  ></div>
                )}
                <div 
                  className={cn(
                    "root h-12 w-2 rounded-b-lg transform origin-top transition-all duration-500",
                    challenge.completed ? "animate-grow-root" : "opacity-30 h-3"
                  )}
                  style={{ 
                    // Updated rotation to point outward instead of inward
                    transform: `rotate(${(index - challenges.length / 2 + 0.5) * -15}deg)`,
                    transformOrigin: 'top center',
                    position: 'relative',
                    zIndex: 5
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Branch component with recursive rendering for subgoals
const Branch: React.FC<{
  goal: Goal;
  goals: Goal[];
  isLeft: boolean;
  level: number;
  index: number;
  totalOnSide: number;
}> = ({ goal, goals, isLeft, level, index, totalOnSide }) => {
  // Get subgoals for this goal
  const subgoals = goals.filter(g => g.parentId === goal.id);
  
  // Calculate branch length based on progress
  const getBranchLength = () => {
    const minLength = 50; // Slightly longer minimum branches
    const maxLength = 140 - (level * 25); // Longer branches with more tapering
    return minLength + (maxLength - minLength) * (goal.progress / 100);
  };

  // Calculate angle for the branch, more natural-looking
  const getAngle = () => {
    const baseAngle = isLeft ? 25 : -25;
    const levelFactor = level * 5; // Branches angle more steeply as they get higher up
    const randomVariation = ((index % 3) - 1) * 5; // Slight random variation for more natural look
    const spreadFactor = 10;
    const positionOffset = ((index / totalOnSide) - 0.5) * spreadFactor;
    return baseAngle + positionOffset + (isLeft ? levelFactor : -levelFactor) + randomVariation;
  };

  // Width of the branch, decreasing for higher levels to give a tapering effect
  const getBranchWidth = () => {
    return 10 - level * 2;
  };

  return (
    <div 
      className="relative flex items-center"
      style={{
        transform: `rotate(${getAngle()}deg)`,
        transformOrigin: isLeft ? 'right center' : 'left center',
        zIndex: 20 - level
      }}
    >
      {/* Branch */}
      <div 
        className={cn(
          "branch rounded-sm animate-grow-branch",
          isLeft ? "origin-right" : "origin-left"
        )}
        style={{ 
          width: `${getBranchLength()}px`,
          height: `${getBranchWidth()}px`,
          position: 'relative',
          zIndex: 15,
          boxShadow: 'inset 0 -1px 3px rgba(0, 0, 0, 0.2)',
          overflow: 'visible'
        }}
      >
        {/* Branch texture - grain/lines along the branch */}
        <div 
          className="absolute top-0 h-full bg-uproot-branchDark opacity-20" 
          style={{ 
            width: '100%',
            backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 20%, transparent 40%, rgba(0,0,0,0.1) 60%, transparent 80%, rgba(0,0,0,0.05) 100%)',
          }}
        ></div>
        
        {/* Leaves (tasks) */}
        {goal.tasks.map((task, idx) => (
          <div 
            key={task.id}
            className="relative"
            style={{ 
              position: 'absolute',
              top: isLeft ? `-${10 + (idx % 2) * 5}px` : `${getBranchWidth()}px`,
              left: isLeft ? `${20 + (idx * 25)}px` : 'auto',
              right: !isLeft ? `${20 + (idx * 25)}px` : 'auto',
              zIndex: 30
            }}
          >
            {/* Leaf with stem */}
            <div 
              className={cn(
                "flex flex-col items-center",
                task.completed ? "animate-appear" : "opacity-20 scale-75"
              )}
            >
              {/* Leaf stem */}
              <div 
                className="bg-uproot-branch w-1 h-3"
                style={{
                  transform: isLeft ? 'rotate(-20deg)' : 'rotate(20deg)'
                }}
              ></div>
              {/* Leaf */}
              <div 
                className="leaf w-5 h-5"
                style={{
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Subgoals */}
      {level < 3 && subgoals.length > 0 && (
        <div 
          className={cn(
            "absolute top-0 flex flex-col gap-5",
            isLeft ? "right-0" : "left-0"
          )}
          style={{ 
            top: isLeft ? '-15px' : '10px',
          }}
        >
          {subgoals.map((subgoal, idx) => (
            <div key={subgoal.id} className="relative">
              {/* Enhanced subgoal branch connector - smoother and more visible transition */}
              <div 
                className="absolute bg-uproot-branch"
                style={{
                  height: '6px', // Slightly thicker
                  width: '15px', // Slightly longer
                  top: '50%',
                  [isLeft ? 'right' : 'left']: '-8px', // Extend more
                  transform: 'translateY(-50%)',
                  borderRadius: isLeft ? '3px 0 0 3px' : '0 3px 3px 0',
                  zIndex: 5,
                  boxShadow: 'inset 0 -1px 2px rgba(109, 53, 30, 0.2)' // Add subtle shadow for dimension
                }}
              ></div>
              <Branch 
                goal={subgoal}
                goals={goals}
                isLeft={isLeft}
                level={level + 1}
                index={idx}
                totalOnSide={subgoals.length}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tree;
