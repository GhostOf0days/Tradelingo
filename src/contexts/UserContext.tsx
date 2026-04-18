import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// small user snapshot in the browser while the full row lives in mongo.
export type User = {
  email: string;
  displayName: string;
  experiencePoints: number;
  level?: number;
  streakDays?: number;
  lastActivityDate?: string;
};

// xp bands for the badge must match the server level helper.
export const calculateLevel = (xp: number): number => {
  if (xp < 1000) return 1;
  if (xp < 2500) return 2;
  if (xp < 4500) return 3;
  if (xp < 7000) return 4;
  if (xp < 10000) return 5;
  return 5 + Math.floor((xp - 10000) / 5000);
};

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateStreak: () => void;
  level: number;
};

const UserContext = createContext<UserContextValue | null>(null);

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
    // cached streak may be off until the update streak request runs.
    if (shouldResetStreak(parsed.lastActivityDate)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (parsed.lastActivityDate === yesterdayStr) {
        parsed.streakDays = (parsed.streakDays || 0) + 1;
      } else {
        parsed.streakDays = 1;
      }
    }
    return parsed;
  });

  // keep the signed in user in localStorage across reloads.
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
      if (!newUser.level) {
        newUser.level = calculateLevel(newUser.experiencePoints || 0);
      }
    }
    setUserState(newUser);
  };

  const updateStreak = async () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      // touch streak once per utc day locally then sync with the backend.
      if (user.lastActivityDate !== today) {
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
          console.warn('Failed to update streak on backend:', err);
        }
      }
    }
  };

  // fill in level from xp when older caches never stored it.
  const level = user?.level || calculateLevel(user?.experiencePoints || 0);

  return (
    <UserContext.Provider value={{ user, setUser, updateStreak, level }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const value = useContext(UserContext);
  if (value === null) {
    throw new Error('please use useUser inside UserProvider');
  }
  return value;
}
