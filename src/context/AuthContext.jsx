import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'glowcut_auth_user';

// 💡 Fallback assets kept clean (No hardcoded names, emails, or cities)
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export function AuthProvider({ children }) {
  const [userType, setUserType] = useState(null); // null | 'guest' | 'authenticated'
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Initialized as null until dynamic data arrives
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
      const response = await authService.login(credentials);
      
      // 💡 Extracting structural user data from backend schema safely
      const backendUser = response?.user || response;
      
      const nextProfile = {
        name: backendUser?.userName || 'User',
        email: backendUser?.email || credentials.email,
        phone: backendUser?.PhoneNumber || '',
        city: backendUser?.cities || '',
        avatar: backendUser?.avatar || DEFAULT_AVATAR,
        role: backendUser?.role || 'user', // 🔑 Directly mapping backend user role
        hasSalon: response?.hasSalon !== undefined ? response.hasSalon : false // 🔑 Tracking backend salon registration state
      };

      setUser(response);
      setUserType('authenticated');
      setProfile(nextProfile);
      persist(response, 'authenticated', nextProfile);
      return response;
    } finally {
      // ✅ Fixed the 'dangerously' syntax typo completely
      setIsLoading(false);
    }
  }, [persist]);

  const signup = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(payload);
      const backendUser = response?.user || response;

      const nextProfile = {
        name: backendUser?.userName || payload.userName || 'User',
        phone: backendUser?.PhoneNumber || payload.PhoneNumber || '',
        email: backendUser?.email || payload.email,
        avatar: DEFAULT_AVATAR,
        city: backendUser?.cities || payload.cities || '',
        role: backendUser?.role || 'user', // 🔑 Mapping backend role during registration context
        hasSalon: false // New users don't have a salon yet by default
      };
      
      setUser(response);
      setUserType('authenticated');
      setProfile(nextProfile);
      persist(response, 'authenticated', nextProfile);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  const loginAsGuest = useCallback(() => {
    const guest = { id: 'guest', userName: 'Guest', role: 'guest', isGuest: true };
    const guestProfile = {
      name: 'Guest',
      email: 'guest@glowcut.com',
      phone: '',
      city: '',
      avatar: DEFAULT_AVATAR,
      role: 'guest',
      hasSalon: false
    };
    setUser(guest);
    setUserType('guest');
    persist(guest, 'guest', guestProfile);
    return guest;
  }, [persist]);

  const continueAsGuest = loginAsGuest;

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
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
    setProfile(null);
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