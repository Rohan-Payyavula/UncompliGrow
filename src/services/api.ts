
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface Habit {
  id: string;
  title: string;
  streak: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  goalId: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  parentId?: string;
  subgoals: Goal[];
  tasks: Task[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// Mock data
let habits: Habit[] = [
  { id: uuidv4(), title: 'Morning Meditation', streak: 5, completed: true },
  { id: uuidv4(), title: 'Daily Reading', streak: 3, completed: false },
  { id: uuidv4(), title: 'Exercise', streak: 7, completed: true },
  { id: uuidv4(), title: 'Gratitude Journaling', streak: 1, completed: false },
];

let tasks: Task[] = [
  { id: uuidv4(), title: 'Research topic', completed: true, goalId: '1' },
  { id: uuidv4(), title: 'Create outline', completed: false, goalId: '1' },
  { id: uuidv4(), title: 'Write first draft', completed: false, goalId: '1' },
  { id: uuidv4(), title: 'Research gym options', completed: true, goalId: '2' },
  { id: uuidv4(), title: 'Buy workout clothes', completed: true, goalId: '2' },
  { id: uuidv4(), title: 'Schedule first session', completed: false, goalId: '2' },
  { id: uuidv4(), title: 'Download learning app', completed: true, goalId: '3' },
  { id: uuidv4(), title: 'Complete first lesson', completed: true, goalId: '3' },
  { id: uuidv4(), title: 'Practice daily', completed: false, goalId: '3' },
  { id: uuidv4(), title: 'Research destinations', completed: true, goalId: '4' },
  { id: uuidv4(), title: 'Set budget', completed: false, goalId: '4' },
  { id: uuidv4(), title: 'Book flights', completed: false, goalId: '4' },
  { id: uuidv4(), title: 'Create reading list', completed: true, goalId: '5' },
  { id: uuidv4(), title: 'Join book club', completed: false, goalId: '5' },
];

let goals: Goal[] = [
  {
    id: '1',
    title: 'Write a Book',
    progress: 30,
    subgoals: [],
    tasks: []
  },
  {
    id: '2',
    title: 'Get Fit',
    progress: 60,
    subgoals: [],
    tasks: []
  },
  {
    id: '3',
    title: 'Learn Spanish',
    progress: 45,
    subgoals: [],
    tasks: []
  },
  {
    id: '4',
    title: 'Plan Dream Vacation',
    progress: 20,
    subgoals: [],
    tasks: []
  },
  {
    id: '5',
    title: 'Read 24 Books This Year',
    progress: 35,
    parentId: '1',
    subgoals: [],
    tasks: []
  }
];

let challenges: Challenge[] = [
  {
    id: uuidv4(),
    title: 'Morning Gratitude',
    description: 'Write down three things you are grateful for this morning.',
    completed: true
  },
  {
    id: uuidv4(),
    title: 'Mindful Breathing',
    description: 'Take 5 minutes to focus only on your breath, counting each inhale and exhale.',
    completed: false
  },
  {
    id: uuidv4(),
    title: 'Digital Detox Hour',
    description: 'Spend one hour today completely disconnected from all digital devices.',
    completed: true
  },
  {
    id: uuidv4(),
    title: 'Self-Compassion Practice',
    description: 'Write down three positive things about yourself that you appreciate.',
    completed: false
  },
  {
    id: uuidv4(),
    title: 'Nature Connection',
    description: 'Spend at least 15 minutes outside connecting with nature, observing details you normally miss.',
    completed: true
  }
];

// Process data relationships
const processGoalRelationships = () => {
  // Reset subgoals and tasks
  goals.forEach(goal => {
    goal.subgoals = [];
    goal.tasks = [];
  });
  
  // Build relationships
  goals.forEach(goal => {
    if (goal.parentId) {
      const parent = goals.find(g => g.id === goal.parentId);
      if (parent) {
        parent.subgoals.push(goal);
      }
    }
    
    // Add related tasks
    goal.tasks = tasks.filter(task => task.goalId === goal.id);
  });
  
  return goals;
};

// API functions
export const getHabits = (): Promise<Habit[]> => {
  return Promise.resolve([...habits]);
};

export const completeHabit = (id: string): Promise<Habit> => {
  const habit = habits.find(h => h.id === id);
  if (habit) {
    habit.completed = !habit.completed;
    if (habit.completed) {
      habit.streak += 1;
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
    }
  }
  return Promise.resolve(habit || habits[0]);
};

export const addHabit = (title: string): Promise<Habit> => {
  const newHabit: Habit = {
    id: uuidv4(),
    title,
    streak: 0,
    completed: false
  };
  habits.push(newHabit);
  return Promise.resolve(newHabit);
};

export const deleteHabit = (id: string): Promise<boolean> => {
  const initialLength = habits.length;
  habits = habits.filter(habit => habit.id !== id);
  
  return Promise.resolve(habits.length < initialLength);
};

export const getGoals = (): Promise<Goal[]> => {
  return Promise.resolve(processGoalRelationships());
};

export const addGoal = (title: string, parentId?: string): Promise<Goal> => {
  const newGoal: Goal = {
    id: uuidv4(),
    title,
    progress: 0,
    parentId,
    subgoals: [],
    tasks: []
  };
  goals.push(newGoal);
  return Promise.resolve(newGoal);
};

export const deleteGoal = (id: string): Promise<boolean> => {
  // Delete all related tasks
  tasks = tasks.filter(task => task.goalId !== id);
  
  // Check if this goal has subgoals and delete them too
  const subgoalIds: string[] = [];
  const findSubgoals = (goalId: string) => {
    const subgoals = goals.filter(g => g.parentId === goalId);
    subgoals.forEach(subgoal => {
      subgoalIds.push(subgoal.id);
      findSubgoals(subgoal.id); // Recursively find nested subgoals
    });
  };
  
  findSubgoals(id);
  
  // Delete all subgoals found
  goals = goals.filter(goal => !subgoalIds.includes(goal.id));
  
  // Delete the goal itself
  const initialLength = goals.length;
  goals = goals.filter(goal => goal.id !== id);
  
  return Promise.resolve(goals.length < initialLength);
};

export const addTask = (title: string, goalId: string): Promise<Task> => {
  const newTask: Task = {
    id: uuidv4(),
    title,
    completed: false,
    goalId
  };
  tasks.push(newTask);
  
  // Update goal progress
  updateGoalProgress(goalId);
  
  return Promise.resolve(newTask);
};

export const completeTask = (id: string): Promise<Task> => {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    
    // Update goal progress
    updateGoalProgress(task.goalId);
  }
  return Promise.resolve(task || tasks[0]);
};

export const deleteTask = (id: string): Promise<boolean> => {
  let goalId = '';
  const task = tasks.find(t => t.id === id);
  if (task) {
    goalId = task.goalId;
  }
  
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  
  // Update goal progress if task was found and deleted
  if (goalId) {
    updateGoalProgress(goalId);
  }
  
  return Promise.resolve(tasks.length < initialLength);
};

const updateGoalProgress = (goalId: string) => {
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    const goalTasks = tasks.filter(t => t.goalId === goalId);
    if (goalTasks.length > 0) {
      const completedCount = goalTasks.filter(t => t.completed).length;
      goal.progress = Math.round((completedCount / goalTasks.length) * 100);
    }
  }
};

export const getChallenges = (): Promise<Challenge[]> => {
  return Promise.resolve([...challenges]);
};

export const completeChallenge = (id: string): Promise<Challenge> => {
  const challenge = challenges.find(c => c.id === id);
  if (challenge) {
    challenge.completed = true;
  }
  return Promise.resolve(challenge || challenges[0]);
};

export const deleteChallenge = (id: string): Promise<boolean> => {
  const initialLength = challenges.length;
  challenges = challenges.filter(challenge => challenge.id !== id);
  
  return Promise.resolve(challenges.length < initialLength);
};

export const generateDailyChallenge = (): Promise<Challenge> => {
  const challengeIdeas = [
    {
      title: 'Mindful Breathing',
      description: 'Take 5 minutes to focus only on your breath, counting each inhale and exhale.'
    },
    {
      title: 'Gratitude Reflection',
      description: 'Write down three things you are grateful for today.'
    },
    {
      title: 'Digital Detox',
      description: 'Spend one hour completely disconnected from all digital devices.'
    },
    {
      title: 'Self-Compassion',
      description: 'Write down three positive things about yourself that you appreciate.'
    },
    {
      title: 'Nature Connection',
      description: 'Spend at least 15 minutes outside connecting with nature, observing details you normally miss.'
    }
  ];
  
  const randomIdea = challengeIdeas[Math.floor(Math.random() * challengeIdeas.length)];
  
  const newChallenge: Challenge = {
    id: uuidv4(),
    title: randomIdea.title,
    description: randomIdea.description,
    completed: false
  };
  
  challenges.push(newChallenge);
  return Promise.resolve(newChallenge);
};
