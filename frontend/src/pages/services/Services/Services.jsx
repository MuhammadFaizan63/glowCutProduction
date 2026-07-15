import React, { useState, useContext } from 'react';
import { MdContentCut, MdFace, MdColorize, MdSpa } from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import toast from 'react-hot-toast';

const MENU = [
  {
    category: 'Haircuts',
    icon: MdContentCut,
    color: 'primary',
    items: [
      { id: 'svc-fade', name: 'Precision Fade', price: 'PKR 1,500', duration: '45 mins', desc: 'Digitally-precise fade tailored to your head shape. Includes wash and style.' },
      { id: 'svc-undercut', name: 'Cyber Undercut', price: 'PKR 2,200', duration: '60 mins', desc: 'Edgy geometric patterns etched with razor precision for a high-tech street look.' },
      { id: 'svc-classic', name: 'Classic Cut', price: 'PKR 800', duration: '30 mins', desc: 'Timeless scissor cut suitable for all hair types.' },
    ],
  },
  {
    category: 'Beard Grooming',
    icon: MdFace,
    color: 'secondary',
    items: [
      { id: 'svc-beard-trim', name: 'Beard Trim & Shape', price: 'PKR 500', duration: '20 mins', desc: 'Clean lines and precision edging for a sharp, defined beard.' },
      { id: 'svc-beard-full', name: 'Full Beard Sculpting', price: 'PKR 1,200', duration: '40 mins', desc: 'Complete beard grooming with hot towel treatment and natural oil finish.' },
    ],
  },
  {
    category: 'Facial Treatments',
    icon: MdSpa,
    color: 'tertiary',
    items: [
      { id: 'svc-detox', name: 'Neon Glow Scalp Detox', price: 'PKR 3,500', duration: '30 mins', desc: 'Ultrasonic treatment with bio-available nutrients to refresh stressed scalps.' },
      { id: 'svc-facial', name: 'Deep Pore Facial', price: 'PKR 2,800', duration: '50 mins', desc: 'Steam, extraction, and brightening mask for a fresh, polished complexion.' },
    ],
  },
  {
    category: 'Hair Coloring',
    icon: MdColorize,
    color: 'primary',
    items: [
      { id: 'svc-highlights', name: 'Neon Highlights', price: 'PKR 4,500', duration: '90 mins', desc: 'Bold, vivid accent streaks applied using low-damage nano-color technology.' },
      { id: 'svc-global', name: 'Global Color', price: 'PKR 6,000', duration: '120 mins', desc: 'Full head color transformation with professional Schwarzkopf formulations.' },
    ],
  },
];

const COLOR_MAP = {
  primary: { bg: 'bg-primary/10', text: 'text-primary-container', border: 'border-primary-container/30' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary', border: 'border-tertiary/30' },
};

export default function Services() {
  const { userType } = useContext(AuthContext);
  const isGuest = userType === 'guest';
  const [guestBlockOpen, setGuestBlockOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const handleSelect = (item) => {
    if (isGuest) {
      setGuestBlockOpen(true);
      return;
    }
    if (cart.find((c) => c.id === item.id)) {
      setCart((prev) => prev.filter((c) => c.id !== item.id));
      toast(`Removed ${item.name}`, { icon: '➖' });
    } else {
      setCart((prev) => [...prev, item]);
      toast.success(`Added ${item.name}!`);
    }
  };

  const totalPKR = cart.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/\D/g, ''), 10) || 0;
    return sum + num;
  }, 0);

  return (
    <main className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto">
      {/* Header */}
      <section className="mb-xl text-center pt-md">
        <h1 className="font-display-lg text-display-lg mb-xs">Services Menu</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Premium grooming services crafted for the discerning gentleman. Select your desired
          treatments and book your preferred stylist in one seamless flow.
        </p>
        {isGuest && (
          <div className="mt-md inline-flex items-center gap-sm px-md py-sm bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 font-label-md">
            <span>⚠</span> You're browsing as a guest — tap any service to login and book
          </div>
        )}
      </section>

      {/* Category Sections */}
      {MENU.map((section) => {
        const Icon = section.icon;
        const colors = COLOR_MAP[section.color] || COLOR_MAP.primary;
        return (
          <section key={section.category} className="mb-xl">
            <div className={`flex items-center gap-sm mb-lg border-l-4 ${colors.border} pl-md`}>
              <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <Icon className={`${colors.text} text-2xl`} />
              </div>
              <h2 className={`font-headline-lg text-headline-lg ${colors.text}`}>
                {section.category}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {section.items.map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`glass-panel p-md rounded-xl flex justify-between items-start gap-md transition-all ${
                      inCart ? `border-${section.color === 'primary' ? 'primary-container' : section.color} shadow-${section.color === 'secondary' ? 'neon-emerald' : 'neon-orange'}` : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-xs">
                        <h3 className="font-headline-md text-on-surface">{item.name}</h3>
                        <span className={`font-bold ${colors.text} ml-sm whitespace-nowrap`}>
                          {item.price}
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md text-sm mb-sm">
                        {item.desc}
                      </p>
                      <span className="text-caption text-on-surface-variant/60">
                        ⏱ {item.duration}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelect(item)}
                      className={`flex-shrink-0 px-md py-sm rounded-lg font-label-md font-bold transition-all active:scale-95 ${
                        inCart
                          ? 'bg-secondary/20 text-secondary border border-secondary'
                          : 'bg-primary-container text-on-primary shadow-neon-orange-sm hover:brightness-110'
                      }`}
                    >
                      {inCart ? '✓ Added' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Floating cart bar */}
      {cart.length > 0 && !isGuest && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 glass-panel px-xl py-md rounded-full border border-secondary/30 shadow-neon-emerald flex items-center gap-lg">
          <span className="text-secondary font-bold">
            {cart.length} service{cart.length > 1 ? 's' : ''} — PKR {totalPKR.toLocaleString()}
          </span>
          <button
            onClick={() => toast('Redirecting to Book...')}
            className="bg-secondary text-on-secondary px-lg py-sm rounded-full font-label-md font-bold active:scale-95"
          >
            Book Now
          </button>
        </div>
      )}

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </main>
  );
}
