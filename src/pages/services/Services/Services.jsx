import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdContentCut, MdFace, MdColorize, MdSpa, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import EmptyState from '../../../components/ui/EmptyState';
import * as salonService from '../../../services/salonService';

const CATEGORY_ICON = {
  Haircuts: MdContentCut,
  Grooming: MdFace,
  Color: MdColorize,
  Spa: MdSpa,
};
const CATEGORY_COLOR = ['primary', 'secondary', 'tertiary'];
const COLOR_MAP = {
  primary: { bg: 'bg-primary/10', text: 'text-primary-container', border: 'border-primary-container/30' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary', border: 'border-tertiary/30' },
};

/**
 * Services — platform-wide catalog browser (GET /api/services, a public
 * route). This is intentionally separate from the per-salon service picker
 * on SalonDetail: here we're browsing everything GlowCut partners offer, to
 * help a customer decide *which salon* to book, not finalize a booking.
 */
export default function Services() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const isGuest = userType === 'guest';
  const [guestBlockOpen, setGuestBlockOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    salonService
      .getServiceCatalog({ limit: 60 })
      .then((list) => setServices(Array.isArray(list) ? list : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const filtered = search
      ? services.filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()))
      : services;
    const map = {};
    filtered.forEach((s) => {
      const cat = s.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return Object.entries(map);
  }, [services, search]);

  const handleSelect = (service) => {
    if (isGuest) {
      setGuestBlockOpen(true);
      return;
    }
    const salonId = service.salon?._id || service.salon;
    if (!salonId) {
      toast.error('This service is not linked to a salon yet.');
      return;
    }
    navigate(`/salons/${salonId}`);
  };

  return (
    <main className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto">
      {/* Header */}
      <section className="mb-xl text-center pt-md">
        <h1 className="font-display-lg text-display-lg mb-xs">Services Menu</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Browse every service offered across GlowCut's partner salons — tap one to jump straight
          to that salon and book.
        </p>
        {isGuest && (
          <div className="mt-md inline-flex items-center gap-sm px-md py-sm bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 font-label-md">
            <span>⚠</span> You're browsing as a guest — tap any service to login and book
          </div>
        )}

        <div className="mt-lg max-w-md mx-auto relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary-container/50"
          />
        </div>
      </section>

      {loading ? (
        <div className="space-y-md">
          {[1, 2, 3].map((n) => <div key={n} className="h-32 glass-panel rounded-xl animate-pulse" />)}
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState
          icon={MdContentCut}
          title="No services found"
          description="No partner salon has published services matching your search yet."
        />
      ) : (
        grouped.map(([category, items], i) => {
          const color = CATEGORY_COLOR[i % CATEGORY_COLOR.length];
          const Icon = CATEGORY_ICON[category] || MdContentCut;
          const colors = COLOR_MAP[color];
          return (
            <section key={category} className="mb-xl">
              <div className={`flex items-center gap-sm mb-lg border-l-4 ${colors.border} pl-md`}>
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`${colors.text} text-2xl`} />
                </div>
                <h2 className={`font-headline-lg text-headline-lg ${colors.text}`}>{category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="glass-panel p-md rounded-xl flex justify-between items-start gap-md transition-all hover:border-primary-container/40"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-xs">
                        <h3 className="font-headline-md text-on-surface">{item.name}</h3>
                        <span className={`font-bold ${colors.text} ml-sm whitespace-nowrap`}>
                          PKR {(item.price ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md text-sm mb-sm">
                        {item.description || 'No description provided.'}
                      </p>
                      <span className="text-caption text-on-surface-variant/60">
                        ⏱ {item.duration ?? 0} mins
                        {item.salon?.name ? ` · ${item.salon.name}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelect(item)}
                      className="flex-shrink-0 px-md py-sm rounded-lg font-label-md font-bold transition-all active:scale-95 bg-primary-container text-on-primary shadow-neon-orange-sm hover:brightness-110"
                    >
                      View Salon
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </main>
  );
}
