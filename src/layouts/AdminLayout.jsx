import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { AdminHeader } from '../components/layout/Header';

const TITLES = {
  '/admin/shop': 'Cyber-Salon Dashboard',
  '/admin/global': 'Platform Control Center',
};

/**
 * AdminLayout
 * Wraps Shopkeeper / Global dashboard pages with a fixed Sidebar and a
 * localized sticky AdminHeader. Determines which nav-set and title to show
 * based on the current route segment (/admin/shop/* vs /admin/global/*).
 */
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
      <Sidebar variant={variant} />
      <main className="ml-64 min-h-screen">
        <AdminHeader
          title={title}
          avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJaH3ty0k1DIfjl-VY4GvzwGr_vgAtyMLzIeZDNTb6eri4mpdrE3GSEe4yldLBIDruIrIIdkmSfhUPTtuVmhEQCg43SibgJixBbedYgRgNuJ0KOXRqIvm3nElmEqdkKhZ_s3vrFzu2upHF3inkzMx5fkoOQIqpRgwwmfoPHbRbAOnL2pFo2yHzD_hULivANKwoMFErEenyvS-c4CitLoCU7GLQNWmU83HVIh33EiIZntF1MLMj98hOyEW7s2e-vAsSALdZZFNRiw"
        />
        <div className="p-container-margin space-y-section-gap">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
