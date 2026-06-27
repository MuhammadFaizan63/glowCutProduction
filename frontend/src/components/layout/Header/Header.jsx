import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdSearch, MdMenu, MdClose, MdChat, MdNotifications } from 'react-icons/md';
import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';

const NAV_LINKS = [
  { label: 'Explore', to: '/' },
  { label: 'Stylists', to: '/salons/nearby' },
  { label: 'Services', to: '/salons/nearby' },
  { label: 'Offers', to: '/rewards/glow' },
];

/**
 * Header (TopNavBar)
 * Fixed, blurred glass nav bar matching the homepage. Stays constant across
 * UserLayout pages. Collapses nav links into a hamburger menu on mobile.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(255,95,31,0.1)]">
      <Link to="/" className="flex items-center gap-base">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary-container rounded-full" />
          <div className="w-2 h-2 bg-secondary rounded-full shadow-neon-emerald" />
        </div>
        <span className="font-headline-lg text-headline-lg font-bold text-primary-container tracking-tighter">
          GlowCut
        </span>
      </Link>

      <div className="hidden md:flex gap-xl">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `font-label-md text-label-md px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'text-primary-container border-b-2 border-primary-container pb-1'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-md">
        <button
          aria-label="Search"
          className="material-symbols-outlined text-on-surface-variant hover:text-primary-container active:scale-95 transition-all"
        >
          <MdSearch className="text-2xl" />
        </button>
        <Button
          size="sm"
          className="hidden sm:flex"
          onClick={() => navigate('/salons/nearby')}
        >
          Book Now
        </Button>
        <button
          aria-label="Toggle menu"
          className="md:hidden text-on-surface-variant"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/10 flex flex-col p-md gap-sm md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-2 py-3 rounded hover:bg-white/5"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

/**
 * AdminHeader
 * Localized sticky top bar for AdminLayout dashboards (Shopkeeper / Global).
 * Matches the admin "Top App Bar": page title, search field, chat/notification
 * icons with unread dot, and the logged-in user's avatar.
 */
export function AdminHeader({ title = 'Dashboard', avatarSrc, unreadChat = false }) {
  return (
    <header className="flex justify-between items-center w-full px-container-margin py-base bg-background/60 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary tracking-tighter">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-gutter">
        <div className="relative hidden lg:block">
          <input
            className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-4 w-64 transition-all duration-300"
            placeholder="Search data..."
            type="text"
          />
          <MdSearch className="absolute right-2 top-2 text-outline text-sm" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface hover:text-primary-container transition-colors relative">
            <MdChat className="text-xl" />
            {unreadChat && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
          <button className="text-on-surface hover:text-primary-container transition-colors">
            <MdNotifications className="text-xl" />
          </button>
          {avatarSrc && (
            <Avatar src={avatarSrc} size="sm" alt="Admin Avatar" />
          )}
        </div>
      </div>
    </header>
  );
}
