import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import '../styles/StreakNotification.css';

export default function StreakNotification() {
  const { user } = useUser();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'warning' | 'safe'>('safe');

  useEffect(() => {
    if (!user || !user.lastActivityDate) return;
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = user.lastActivityDate;
    const yesterday = new Date(); // last activity yesterday -> warn
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActivity === yesterdayStr && today !== lastActivity) {
      setNotificationType('warning');
      setShowNotification(true);
    }
  }, [user]);

  if (!user || !showNotification) return null;

  if (notificationType === 'warning') {
    return (
      <div className="streak-notification streak-notification--warning">
        <div className="streak-notification__content">
          <Bell size={20} className="streak-notification__icon" />
          <div className="streak-notification__text">
            <h4>🔥 Streak at Risk!</h4>
            <p>Complete a lesson today to keep your {user.streakDays || 0}-day streak alive!</p>
          </div>
          <button
            className="streak-notification__close"
            onClick={() => setShowNotification(false)}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
