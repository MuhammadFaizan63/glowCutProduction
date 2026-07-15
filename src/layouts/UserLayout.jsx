import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';

/**
 * UserLayout
 * Wraps every standard client-facing page with the global Header, Footer,
 * and MobileBottomNav (responsive). The Header is fixed (h-20), so page
 * content is pushed down with pt-20. Bottom padding on mobile prevents
 * content from being hidden behind the fixed bottom nav.
 */
export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
