import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdExplore, MdCalendarMonth, MdPerson } from 'react-icons/md';

const TABS = [
  { label: 'Explore', to: '/', icon: MdExplore },
  { label: 'Book', to: '/salons/nearby', icon: MdCalendarMonth },
  { label: 'Profile', to: '/profile', icon: MdPerson },
];

/**
 * MobileBottomNav
 * Heavily blurred glass bar with floating icons, mobile-only, matching the
 * homepage bottom nav. Active tab is highlighted in primary-container.
 */
export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-2xl border-t border-white/10 z-50 flex justify-around items-center px-md">
      {TABS.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-xs ${
              isActive ? 'text-primary-container' : 'text-on-surface-variant'
            }`
          }
        >
          <Icon className="text-2xl" />
          <span className="text-[10px] font-bold">{label}</span>
        </NavLink>
      ))}
    </div>
  );
}
