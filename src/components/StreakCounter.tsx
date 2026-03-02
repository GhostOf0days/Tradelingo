import { Flame } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import './StreakCounter.css';

export default function StreakCounter() {
  const { user } = useUser();
  const streakDays = user?.streakDays || 0;

  if (!user || streakDays === 0) {
    return null; // Don't show streak if user not logged in or no streak
  }

  return (
    <div className="streak-counter" title={`${streakDays} day streak! Keep it up!`}>
      <Flame size={18} className="streak-counter__icon" />
      <span className="streak-counter__text">{streakDays}</span>
    </div>
  );
}
