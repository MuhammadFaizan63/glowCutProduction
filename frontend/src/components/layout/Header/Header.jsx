import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdSearch, MdMenu, MdClose, MdChat, MdNotifications, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';
import AuthContext from '../../../context/AuthContext';

// Nav tabs differ per user type
const AUTH_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const GUEST_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant', guestWarning: true },
];

/**
 * Header — dual-state nav bar.
 * Authenticated: full nav + profile avatar (click → /profile).
 * Guest: restricted nav + "Login / Signup" CTA + generic icon placeholder.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { userType, profile, logout } = useContext(AuthContext);

  const isAuthenticated = userType === 'authenticated';
  const isGuest = userType === 'guest';
  const navLinks = isAuthenticated ? AUTH_NAV : GUEST_NAV;

  const handleGuestIconClick = () => {
    toast('Login to set up your profile', { icon: '👤' });
  };

  const handleLoginSignup = () => {
    logout(); // clear guest state → null → redirected to login by AuthGuard
    navigate('/auth/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(255,95,31,0.1)]">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-base flex-shrink-0">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary-container rounded-full" />
          <div className="w-2 h-2 bg-secondary rounded-full shadow-neon-emerald" />
        </div>
        <span className="font-headline-lg text-headline-lg font-bold text-primary-container tracking-tighter">
          GlowCut
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-lg">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `font-label-md text-label-md px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'text-primary-container border-b-2 border-primary-container'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              } ${link.guestWarning && isGuest ? 'opacity-60' : ''}`
            }
          >
            {link.label}
            {link.guestWarning && isGuest && (
              <span className="ml-1 text-[10px] text-yellow-400 align-super">⚠</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-sm flex-shrink-0">
        <button
          aria-label="Search"
          className="text-on-surface-variant hover:text-primary-container active:scale-95 transition-all"
        >
          <MdSearch className="text-2xl" />
        </button>

        {isAuthenticated ? (
          /* Authenticated: real profile avatar */
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-xs group"
            aria-label="Profile"
          >
            <Avatar
              src={profile?.avatar}
              alt={profile?.name || 'Profile'}
              size="sm"
              ring
              className="group-hover:shadow-neon-orange transition-all"
            />
          </button>
        ) : isGuest ? (
          /* Guest: login button + placeholder icon */
          <div className="flex items-center gap-sm">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoginSignup}
              className="hidden sm:flex"
            >
              Login / Signup
            </Button>
            <button
              onClick={handleGuestIconClick}
              className="w-8 h-8 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-on-surface-variant hover:border-white/30 transition-colors"
              aria-label="Guest profile"
            >
              <MdPerson className="text-lg" />
            </button>
          </div>
        ) : (
          /* Unauthenticated (shouldn't reach nav, but fallback) */
          <Button size="sm" onClick={() => navigate('/auth/login')}>
            Login
          </Button>
        )}

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="md:hidden text-on-surface-variant ml-xs"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/10 flex flex-col p-md gap-sm md:hidden z-50">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-2 py-3 rounded hover:bg-white/5"
            >
              {link.label}
            </NavLink>
          ))}
          {isGuest && (
            <button
              onClick={() => { setMobileOpen(false); handleLoginSignup(); }}
              className="mt-sm w-full py-sm bg-primary-container text-on-primary rounded-lg font-label-md font-bold"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

/**
 * AdminHeader — unchanged from before, kept as named export.
 */
export function AdminHeader({ title = 'Dashboard', avatarSrc, unreadChat = false }) {
  return (
    <header className="flex justify-between items-center w-full px-container-margin py-base bg-background/60 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary tracking-tighter">{title}</h2>
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
            {unreadChat && <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />}
          </button>
          <button className="text-on-surface hover:text-primary-container transition-colors">
            <MdNotifications className="text-xl" />
          </button>
          {avatarSrc && <Avatar src={avatarSrc} size="sm" alt="Admin Avatar" />}
        </div>
      </div>
    </header>
  );
}
