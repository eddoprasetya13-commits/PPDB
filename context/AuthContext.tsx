import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { APP_CONFIG } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    const storedTime = localStorage.getItem('auth_time');

    if (storedUser && storedToken && storedTime) {
      const loginTime = parseInt(storedTime, 10);
      const hoursPassed = (Date.now() - loginTime) / (1000 * 60 * 60);

      if (hoursPassed < APP_CONFIG.TOKEN_EXPIRY_HOURS) {
        setUser(JSON.parse(storedUser));
      } else {
        // Token expired
        logout();
      }
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_time', Date.now().toString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_time');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
