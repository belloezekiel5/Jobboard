import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: string; companyName?: string }) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<User | void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jobboard_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('jobboard_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getCurrentUser();
      setUser(data.user);
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      localStorage.removeItem('jobboard_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('jobboard_token', data.token);
      setToken(data.token);
      setUser(data.user);
      success(`Welcome back, ${data.user.name}!`);
    } catch (err: any) {
      error(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (payload: { name: string; email: string; password: string; role: string; companyName?: string }) => {
    try {
      const data = await api.register(payload);
      localStorage.setItem('jobboard_token', data.token);
      setToken(data.token);
      setUser(data.user);
      success(`Account created! Welcome to JobBoard, ${data.user.name}.`);
    } catch (err: any) {
      error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const demoLogin = async (role: UserRole) => {
    try {
      setIsLoading(true);
      const data = await api.demoLogin(role);
      localStorage.setItem('jobboard_token', data.token);
      setToken(data.token);
      setUser(data.user);
      const roleLabel = role === 'job_seeker' ? 'Job Seeker' : role === 'employer' ? 'Employer' : 'Admin';
      success(`Switched to demo ${roleLabel} account (${data.user.name})`);
    } catch (err: any) {
      error(err.message || 'Demo login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jobboard_token');
    setToken(null);
    setUser(null);
    success('You have been logged out.');
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const data = await api.updateProfile(updates);
      setUser(data.user);
      success(data.message || 'Profile updated successfully!');
      return data.user;
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        refreshUser
      }}
    >
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
