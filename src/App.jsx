import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { UserProvider } from './context/UserContext';

/**
 * App
 * Root component: wires global providers (Auth, Booking, User) around the
 * route tree, plus the app-wide toast notifications (react-hot-toast) themed
 * to match the Cyber-Chic glass-panel aesthetic.
 */
export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BookingProvider>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(26, 26, 26, 0.9)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#66DD8B',
                  secondary: '#1A1A1A',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF5F1F',
                  secondary: '#1A1A1A',
                },
              },
            }}
          />
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
}
