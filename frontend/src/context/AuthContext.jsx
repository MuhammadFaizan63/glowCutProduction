import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'glowcut_auth_user';

const DEFAULT_PROFILE = {
  name: 'Muhammad Faizan',
  phone: '03001234567',
  email: 'faizan@theglowcut.com',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  city: 'Karachi',
};

/**
 * AuthProvider
 * Manages three distinct user states:
 *   - null          → unauthenticated, see Login gate only
 *   - 'guest'       → browse-only, booking blocked
 *   - 'authenticated' → full access
 */
export function AuthProvider({ children }) {
  const [userType, setUserType] = useState(null); // null | 'guest' | 'authenticated'
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate on mount
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || parsed);
        setUserType(parsed.userType || (parsed.isGuest ? 'guest' : 'authenticated'));
        if (parsed.profile) setProfile(parsed.profile);
      }
    } catch (err) {
      console.error('Auth rehydration failed', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((nextUser, nextType, nextProfile) => {
    try {
      window.sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: nextUser, userType: nextType, profile: nextProfile })
      );
    } catch (err) {
      console.error('Auth persist failed', err);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.login(credentials);
      const nextProfile = {
        ...DEFAULT_PROFILE,
        name: loggedIn.name || DEFAULT_PROFILE.name,
        email: credentials.email || DEFAULT_PROFILE.email,
      };
      setUser(loggedIn);
      setUserType('authenticated');
      setProfile(nextProfile);
      persist(loggedIn, 'authenticated', nextProfile);
      return loggedIn;
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  const signup = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signup(payload);
      const nextProfile = {
        name: payload.name || DEFAULT_PROFILE.name,
        phone: payload.phone || DEFAULT_PROFILE.phone,
        email: payload.email || DEFAULT_PROFILE.email,
        avatar: DEFAULT_PROFILE.avatar,
        city: payload.city || DEFAULT_PROFILE.city,
      };
      setUser(newUser);
      setUserType('authenticated');
      setProfile(nextProfile);
      persist(newUser, 'authenticated', nextProfile);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  // alias kept for backward compat with existing Signup page
  const loginAsGuest = useCallback(() => {
    const guest = { id: 'guest', name: 'Guest', role: 'guest', isGuest: true };
    setUser(guest);
    setUserType('guest');
    persist(guest, 'guest', DEFAULT_PROFILE);
    return guest;
  }, [persist]);

  const continueAsGuest = loginAsGuest;

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      // re-persist with updated profile
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(AUTH_STORAGE_KEY) || '{}');
        window.sessionStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ ...stored, profile: next })
        );
      } catch {}
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserType(null);
    setProfile(DEFAULT_PROFILE);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const isAuthenticated = userType === 'authenticated';
  const isGuest = userType === 'guest';

  const value = {
    user,
    userType,
    isAuthenticated,
    isGuest,
    isLoading,
    profile,
    login,
    signup,
    loginAsGuest,
    continueAsGuest,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
