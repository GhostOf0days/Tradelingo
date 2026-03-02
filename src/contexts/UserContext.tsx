import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type User = {
  email: string;
  displayName: string;
  experiencePoints: number;
  streakDays?: number;
  lastActivityDate?: string; // ISO date string (e.g., "2026-03-02")
};

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateStreak: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

// Helper: Calculate if streak should reset (date has changed)
function shouldResetStreak(lastActivityDate: string | undefined): boolean {
  if (!lastActivityDate) return false;
  const today = new Date().toISOString().split('T')[0]; // Get today's date as YYYY-MM-DD
  return lastActivityDate !== today;
}

export function UserProvider({ children }: { children: ReactNode }) {
  // 1. When the app loads, check if we saved a user in the browser previously
  const [user, setUserState] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('tradelingo_user');
    if (!savedUser) return null;
    
    const parsed = JSON.parse(savedUser);
    
    // Check if streak should reset (user hasn't logged in since yesterday)
    if (shouldResetStreak(parsed.lastActivityDate)) {
      // If yesterday was their last activity, increment streak. Otherwise, reset to 1.
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (parsed.lastActivityDate === yesterdayStr) {
        parsed.streakDays = (parsed.streakDays || 0) + 1;
      } else {
        parsed.streakDays = 1; // Reset to 1
      }
    }
    
    return parsed;
  });

  // 2. Whenever the user gets XP or logs in, save the updated profile to the browser
  useEffect(() => {
    if (user) {
      localStorage.setItem('tradelingo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tradelingo_user');
    }
  }, [user]);

  // Helper function to update user and update today's activity date
  const setUser = (newUser: User | null) => {
    if (newUser) {
      const today = new Date().toISOString().split('T')[0];
      newUser.lastActivityDate = today;
      newUser.streakDays = newUser.streakDays || 1;
    }
    setUserState(newUser);
  };

  // Function to update streak (called when user completes a lesson)
  const updateStreak = () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      // Only increment if we haven't updated streak today
      if (user.lastActivityDate !== today) {
        setUserState({
          ...user,
          streakDays: (user.streakDays || 1) + 1,
          lastActivityDate: today,
        });
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