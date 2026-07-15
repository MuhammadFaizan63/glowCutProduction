import React from 'react';
import { MdLanguage, MdShare } from 'react-icons/md';

const FOOTER_LINKS = [
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
  { label: 'Contact Us', to: '#' },
  { label: 'Careers', to: '#' },
];

/**
 * Footer
 * Matches the homepage footer: brand mark, copyright, link list, and
 * language/share utility icons. Constant across UserLayout pages.
 */
export default function Footer() {
  return (
    <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-white/5">
      <div className="flex flex-col items-center md:items-start gap-base">
        <div className="flex items-center gap-base">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-primary-container rounded-full" />
            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary-container">
            GlowCut
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant opacity-80 max-w-xs text-center md:text-left">
          © 2024 GlowCut Cyber-Chic Salons. All rights reserved.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-xl">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.to}
            className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex gap-md">
        <button
          aria-label="Language"
          className="text-on-surface-variant hover:text-primary-container transition-all"
        >
          <MdLanguage className="text-xl" />
        </button>
        <button
          aria-label="Share"
          className="text-on-surface-variant hover:text-primary-container transition-all"
        >
          <MdShare className="text-xl" />
        </button>
      </div>
    </footer>
  );
}
