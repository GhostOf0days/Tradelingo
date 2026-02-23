import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type User = {
  email: string;
  displayName: string;
  experiencePoints: number;
};

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  // 1. When the app loads, check if we saved a user in the browser previously
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('tradelingo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Whenever the user gets XP or logs in, save the updated profile to the browser
  useEffect(() => {
    if (user) {
      localStorage.setItem('tradelingo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tradelingo_user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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