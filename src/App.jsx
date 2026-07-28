import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { UserProvider } from './context/UserContext';

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
                background: 'rgba(30, 32, 27, 0.9)',
                color: '#EDE0D4',
                border: '1px solid rgba(124, 140, 61, 0.2)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#7C8C3D',
                  secondary: '#1E201B',
                },
              },
              error: {
                iconTheme: {
                  primary: '#D4866F',
                  secondary: '#1E201B',
                },
              },
            }}
          />
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
}
