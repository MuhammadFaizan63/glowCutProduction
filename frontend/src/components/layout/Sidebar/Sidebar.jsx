import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdCalendarMonth,
  MdPayments,
  MdContentCut,
  MdSettings,
  MdHelpOutline,
  MdLogout,
  MdGroup,
  MdCardMembership,
  MdConfirmationNumber,
} from 'react-icons/md';

const SHOPKEEPER_NAV = [
  { label: 'Appointments', to: '/admin/shop', icon: MdCalendarMonth },
  { label: 'Earnings', to: '/admin/shop/earnings', icon: MdPayments },
  { label: 'Services & Prices', to: '/admin/shop/services', icon: MdContentCut },
  { label: 'Shop Settings', to: '/admin/shop/settings', icon: MdSettings },
];

const GLOBAL_NAV = [
  { label: 'Appointments', to: '/admin/global', icon: MdCalendarMonth },
  { label: 'Earnings', to: '/admin/global/earnings', icon: MdPayments },
  { label: 'User Management', to: '/admin/global/users', icon: MdGroup },
  { label: 'Subscription Plans', to: '/admin/global/subscriptions', icon: MdCardMembership },
  { label: 'Support Tickets', to: '/admin/global/tickets', icon: MdConfirmationNumber },
  { label: 'Shop Settings', to: '/admin/global/settings', icon: MdSettings },
];

/**
 * Sidebar
 * Fixed left nav for AdminLayout. `variant` selects between the
 * Shopkeeper Dashboard nav set and the Global (platform) Dashboard nav set,
 * matching the two distinct admin screens in the prototype.
 */
export default function Sidebar({ variant = 'shopkeeper' }) {
  const isGlobal = variant === 'global';
  const navItems = isGlobal ? GLOBAL_NAV : SHOPKEEPER_NAV;

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-background/80 backdrop-blur-xl border-r border-white/10 flex flex-col py-lg px-md z-[60]">
      <div className="mb-section-gap px-4">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">
          GlowCut
        </h1>
        <p className="text-[10px] text-outline-variant tracking-widest uppercase mt-1">
          {isGlobal ? 'Platform Control' : 'Admin Station 01'}
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-2 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/5'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-highest/50'
              }`
            }
          >
            <Icon className="text-xl" />
            <span className="font-label-md text-label-md">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 space-y-2 border-t border-white/5 pt-4">
        <button className="w-full text-left flex items-center gap-3 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-container-highest/50 rounded-lg transition-colors duration-300">
          <MdHelpOutline className="text-xl" />
          <span className="font-label-md text-label-md">Help</span>
        </button>
        <button className="w-full text-left flex items-center gap-3 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-container-highest/50 rounded-lg transition-colors duration-300">
          <MdLogout className="text-xl" />
          <span className="font-label-md text-label-md">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
