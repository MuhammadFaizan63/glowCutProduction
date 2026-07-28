import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <motion.main
        className="flex-1 pt-20 pb-20 md:pb-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
