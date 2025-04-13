
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Target, CalendarCheck, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4 md:px-8 z-50">
      <div className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center">
          <li>
            <Link to="/">
              <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2">
                <Sprout className="h-5 w-5" />
                <span className="text-xs">Tree</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/habits">
              <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2">
                <CalendarCheck className="h-5 w-5" />
                <span className="text-xs">Habits</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/goals">
              <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2">
                <Target className="h-5 w-5" />
                <span className="text-xs">Goals</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/challenges">
              <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-2">
                <Leaf className="h-5 w-5" />
                <span className="text-xs">Roots</span>
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
