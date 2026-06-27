import { createContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'glowcut_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hydrate session on first load (simulates checking a persisted session)
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Failed to hydrate auth session', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (nextUser) => {
    try {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } catch (err) {
      console.error('Failed to persist auth session', err);
    }
  };

  const signup = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signup(payload);
      setUser(newUser);
      setIsAuthenticated(true);
      persist(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      persist(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    const guestUser = { id: 'guest', name: 'Guest', role: 'guest', isGuest: true };
    setUser(guestUser);
    setIsAuthenticated(true);
    persist(guestUser);
    return guestUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    signup,
    login,
    logout,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
