import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import { AdminHeader } from '../components/layout/Header';

const TITLES = {
  '/admin/shop': 'Command Center',
  '/admin/global': 'Platform Control Center',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const isGlobal = pathname.startsWith('/admin/global');
  const variant = isGlobal ? 'global' : 'shopkeeper';

  const matchedTitle = Object.entries(TITLES).find(([prefix]) =>
    pathname.startsWith(prefix)
  );
  const title = matchedTitle ? matchedTitle[1] : 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:block fixed left-0 top-0 z-40">
        <Sidebar variant={variant} />
      </aside>
      <main className="lg:ml-64 min-h-screen">
        <AdminHeader
          title={title}
          avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJaH3ty0k1DIfjl-VY4GvzwGr_vgAtyMLzIeZDNTb6eri4mpdrE3GSEe4yldLBIDruIrIIdkmSfhUPTtuVmhEQCg43SibgJixBbedYgRgNuJ0KOXRqIvm3nElmEqdkKhZ_s3vrFzu2upHF3inkzMx5fkoOQIqpRgwwmfoPHbRbAOnL2pFo2yHzD_hULivANKwoMFErEenyvS-c4CitLoCU7GLQNWmU83HVIh33EiIZntF1MLMj98hOyEW7s2e-vAsSALdZZFNRiw"
        />
        <motion.div
          className="p-margin-mobile md:p-container-margin space-y-section-gap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
