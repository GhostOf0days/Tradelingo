import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type User = {
  email: string;
  displayName: string;
  experiencePoints: number;
  streakDays?: number;
  lastActivityDate?: string;
};

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateStreak: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

// true if last activity was not today (YYYY-MM-DD)
function shouldResetStreak(lastActivityDate: string | undefined): boolean {
  if (!lastActivityDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return lastActivityDate !== today;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('tradelingo_user');
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    if (shouldResetStreak(parsed.lastActivityDate)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (parsed.lastActivityDate === yesterdayStr) {
        parsed.streakDays = (parsed.streakDays || 0) + 1; // continue streak
      } else {
        parsed.streakDays = 1; // gap or first load
      }
    }
    return parsed;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('tradelingo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tradelingo_user');
    }
  }, [user]);

  const setUser = (newUser: User | null) => {
    if (newUser) {
      const today = new Date().toISOString().split('T')[0];
      newUser.lastActivityDate = today;
      newUser.streakDays = newUser.streakDays || 1;
    }
    setUserState(newUser);
  };

  const updateStreak = async () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      if (user.lastActivityDate !== today) { // once per day
        const updatedUser = {
          ...user,
          streakDays: (user.streakDays || 1) + 1,
          lastActivityDate: today,
        };
        setUserState(updatedUser);
        try {
          await fetch('/api/update-streak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
        } catch (err) {
          console.error('Failed to update streak on backend:', err);
        }
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateStreak }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const value = useContext(UserContext);
  if (value === null) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return value;
}