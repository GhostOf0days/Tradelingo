// Compact streak pill in the header (fire emoji + day count). Hidden until you have a streak.
import { useUser } from '../contexts/UserContext';
import './StreakCounter.css';

export default function StreakCounter() {
  const { user } = useUser();
  const streakDays = user?.streakDays || 0;

  if (!user || streakDays === 0) {
    return null;
  }

  return (
    <div className="streak-counter" title={`${streakDays} day streak! Keep it up!`}>
      <span className="streak-counter__icon">🔥</span>
      <span className="streak-counter__text">{streakDays}</span>
    </div>
  );
}
