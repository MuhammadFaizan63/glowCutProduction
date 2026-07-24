import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdStar, MdVerified, MdLocalOffer, MdShoppingBag, MdPeople } from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import EmptyState from '../../../components/ui/EmptyState';
import * as salonService from '../../../services/salonService';

const TABS = ['Active Stylists', 'Salon Products', 'Deals & Offers'];

/**
 * Stylists — platform-wide "browse specialists" page (GET /api/barbers/available).
 * The old "Salon Products" and "Deals & Offers" tabs had zero backend support
 * (no Product or Deal model/routes exist anywhere in the provided backend),
 * so rather than fake data for them, they now show an honest "coming soon"
 * empty state until that API exists.
 */
export default function Stylists() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const isGuest = userType === 'guest';
  const [activeTab, setActiveTab] = useState(0);
  const [guestBlockOpen, setGuestBlockOpen] = useState(false);

  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    salonService
      .getAvailableBarbers()
      .then((list) => setBarbers(Array.isArray(list) ? list : []))
      .catch(() => setBarbers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (barber) => {
    if (isGuest) {
      setGuestBlockOpen(true);
      return;
    }
    const salonId = barber.salonId?._id || barber.salonId;
    if (!salonId) {
      navigate('/salons/nearby');
      return;
    }
    navigate(`/salons/${salonId}`);
  };

  return (
    <main className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
      <section className="mb-xl text-center pt-md">
        <h1 className="font-display-lg text-display-lg mb-xs">Stylists, Products &amp; Offers</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Browse specialists currently available across GlowCut's partner salons.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-sm mb-xl pb-2 [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-shrink-0 px-lg py-sm rounded-full font-label-md font-bold transition-all ${
              activeTab === i
                ? 'bg-primary-container text-on-primary shadow-neon-orange'
                : 'glass-card text-on-surface-variant hover:bg-white/5'
            }`}
          >
            {i === 0 && <MdPeople className="inline mr-xs text-lg" />}
            {i === 1 && <MdShoppingBag className="inline mr-xs text-lg" />}
            {i === 2 && <MdLocalOffer className="inline mr-xs text-lg" />}
            {tab}
          </button>
        ))}
      </div>

      {/* ── Section 1: Active Stylists (real data) ── */}
      {activeTab === 0 && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[1, 2, 3].map((n) => <div key={n} className="h-64 glass-panel rounded-xl animate-pulse" />)}
          </div>
        ) : barbers.length === 0 ? (
          <EmptyState
            icon={MdPeople}
            title="No stylists available right now"
            description="Check back soon — salons update stylist availability throughout the day."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {barbers.map((stylist) => (
              <div key={stylist._id} className="glass-panel rounded-xl overflow-hidden hover:border-primary-container/40 transition-all group">
                <div className="relative h-48 bg-surface-container flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={stylist.name}
                    src={stylist.profileImage || 'https://via.placeholder.com/300x300?text=?'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute top-3 right-3 bg-secondary-container/90 backdrop-blur-md px-sm py-xs rounded-full flex items-center gap-xs border border-secondary/30">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="text-on-secondary-container font-label-md text-[11px] font-bold">AVAILABLE</span>
                  </div>
                </div>
                <div className="p-md">
                  <div className="flex items-start justify-between mb-xs">
                    <div>
                      <h3 className="font-headline-md text-on-surface flex items-center gap-xs">
                        {stylist.name}
                        <MdVerified className="text-secondary text-base" />
                      </h3>
                      <p className="text-primary-container font-label-md text-sm">
                        {stylist.experience ? `${stylist.experience} yrs experience` : 'GlowCut Specialist'}
                      </p>
                    </div>
                    <div className="flex items-center gap-xs bg-secondary/10 px-sm py-xs rounded-full">
                      <MdStar className="text-secondary text-sm" />
                      <span className="font-bold text-secondary">{stylist.rating ?? 0}</span>
                    </div>
                  </div>
                  {Array.isArray(stylist.services) && stylist.services.length > 0 && (
                    <div className="flex flex-wrap gap-xs mb-md">
                      {stylist.services.slice(0, 3).map((s) => (
                        <span key={s._id} className="text-[11px] bg-white/5 border border-white/10 px-sm py-xs rounded-full text-on-surface-variant">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleBook(stylist)}
                    className="w-full py-sm rounded-lg bg-secondary text-on-secondary font-label-md font-bold shadow-neon-emerald active:scale-95 transition-all"
                  >
                    View Salon &amp; Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Section 2: Salon Products (no backend support yet) ── */}
      {activeTab === 1 && (
        <EmptyState
          icon={MdShoppingBag}
          title="Product catalog coming soon"
          description="GlowCut's backend doesn't have a products/e-commerce API yet — this tab will populate once that's built."
        />
      )}

      {/* ── Section 3: Deals & Offers (no backend support yet) ── */}
      {activeTab === 2 && (
        <EmptyState
          icon={MdLocalOffer}
          title="Deals engine coming soon"
          description="There's no promotions/deals API in the backend yet — this tab will populate once that's built."
        />
      )}

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </main>
  );
}
