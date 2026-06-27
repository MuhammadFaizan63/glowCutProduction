import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AuthLayout
 * Clean, focused container for authentication pages (Signup). Matches the
 * onboarding screen: fixed full-bleed background image with an emerald
 * gradient overlay, a centered brand mark up top, and a minimal footer.
 * No global Header/Footer/BottomNav here — auth flows stay distraction-free.
 */
export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden antialiased bg-background text-on-background">
      {/* Background Hero */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="GlowCut salon ambience"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAUkalx7X5fzYogvyUrskGk6wEHJXzBTWX1Hy8cKKnbaPVoPCYJkH3pRnjwkQoyEP17L1gsVqIehiujRNOfA308V-LeU9tBOwHuDuIJs1edVI6zODmrRlRiQkotVegDyKxkcIPRYdjveLBVewQsH9NZjYiapk9-BlI2ccnDmEqLTVhh0Rq7LfhWZ8hDAu-eIeB__sDtbAaXdgfHwdIKzSImfpTnI_O_MNGxH1UGvPNSQM5E-P5Hr4f7svLoLxRq8zhnwheEWqoMD8"
        />
        <div className="absolute inset-0 emerald-overlay" />
      </div>

      <header className="fixed top-0 left-0 w-full flex justify-center items-center h-20 px-margin-mobile z-20">
        <h1 className="text-headline-md font-bold text-primary tracking-tight font-sora">
          GlowCut
        </h1>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-xl">
        <Outlet />
      </main>

      <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-surface-variant relative z-10">
        <div className="font-headline-md text-primary font-sora font-bold">GlowCut</div>
        <p className="font-caption text-caption text-on-tertiary-fixed-variant">
          © 2024 GlowCut Cyber-Chic Salon. All rights reserved.
        </p>
        <div className="flex gap-md">
          <a className="text-caption text-on-tertiary-fixed-variant hover:text-secondary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-caption text-on-tertiary-fixed-variant hover:text-secondary transition-colors" href="#">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
