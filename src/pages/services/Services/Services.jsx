import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdContentCut, MdFace, MdColorize, MdSpa, MdSearch, MdStar, MdAccessTime } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import EmptyState from '../../../components/ui/EmptyState';
import Card from '../../../components/ui/Card';
import * as salonService from '../../../services/salonService';

const CATEGORY_ICON = {
  Haircuts: MdContentCut,
  Grooming: MdFace,
  Color: MdColorize,
  Spa: MdSpa,
};

const FEATURED = [
  { tier: 'Basic', price: 'PKR 500', features: ['Standard Haircut', 'Neck Shave', 'Basic Styling'], popular: false },
  { tier: 'Premium', price: 'PKR 1,200', features: ['Precision Haircut', 'Beard Grooming', 'Hot Towel', 'Style Finish'], popular: true },
  { tier: 'VIP', price: 'PKR 2,500', features: ['Master Stylist', 'Full Grooming', 'Scalp Treatment', 'Premium Products', 'Priority Booking'], popular: false },
];

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
    <motion.main
      className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={itemVariants} className="mb-xl text-center pt-md">
        <h1 className="font-display-lg text-display-lg mb-xs text-on-surface">Services Menu</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Browse every service offered across GlowCut's partner salons — tap one to jump straight
          to that salon and book.
        </p>
        {isGuest && (
          <div className="mt-md inline-flex items-center gap-sm px-md py-sm bg-primary/10 border border-primary/30 rounded-full text-primary font-label-md">
            <span>ⓘ</span> You're browsing as a guest — tap any service to login and book
          </div>
        )}

        <div className="mt-lg max-w-md mx-auto relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-surface-container border border-white/10 rounded-full pl-11 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 placeholder-on-surface-variant/50"
          />
        </div>
      </motion.section>

      {/* Featured Pricing Cards */}
      <motion.section variants={itemVariants} className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg mb-lg text-center text-on-surface">
          Choose Your <span className="text-primary">Experience</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {FEATURED.map((tier) => (
            <Card
              key={tier.tier}
              variant={tier.popular ? 'elevated' : 'glass'}
              hoverable
              className={`p-lg text-center relative ${tier.popular ? 'border-primary/40' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{tier.tier}</h3>
              <div className="text-display-lg font-display-lg text-primary mb-md">{tier.price}</div>
              <ul className="space-y-sm mb-lg text-left">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-sm text-on-surface-variant text-sm">
                    <MdStar className="text-primary text-xs flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/salons/nearby')}
                className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${
                  tier.popular
                    ? 'bg-primary text-on-primary shadow-warm'
                    : 'bg-surface-container border border-primary/30 text-primary hover:bg-primary/10'
                }`}
              >
                Book {tier.tier}
              </button>
            </Card>
          ))}
        </div>
      </motion.section>

      {loading ? (
        <div className="space-y-md">
          {[1, 2, 3].map((n) => <div key={n} className="h-32 bg-surface-container rounded-xl animate-pulse" />)}
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState
          icon={MdContentCut}
          title="No services found"
          description="No partner salon has published services matching your search yet."
        />
      ) : (
        grouped.map(([category, items], i) => {
          const Icon = CATEGORY_ICON[category] || MdContentCut;
          return (
            <motion.section key={category} variants={itemVariants} className="mb-xl">
              <div className="flex items-center gap-sm mb-lg border-l-4 border-primary/40 pl-md">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Icon className="text-primary text-2xl" />
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">{category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -2 }}
                    className="p-md rounded-xl bg-surface-container border border-white/5 flex justify-between items-start gap-md transition-all hover:border-primary/30 hover:bg-surface-container-high"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-xs">
                        <h3 className="font-headline-md text-on-surface">{item.name}</h3>
                        <span className="font-bold text-primary ml-sm whitespace-nowrap">
                          PKR {(item.price ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md text-sm mb-sm">
                        {item.description || 'No description provided.'}
                      </p>
                      <div className="flex items-center gap-md text-caption text-on-surface-variant/60">
                        <span className="flex items-center gap-xs">
                          <MdAccessTime className="text-xs" /> {item.duration ?? 0} mins
                        </span>
                        {item.salon?.name && (
                          <span>· {item.salon.name}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelect(item)}
                      className="flex-shrink-0 px-md py-sm rounded-xl font-label-md font-bold transition-all active:scale-95 bg-primary text-on-primary shadow-warm-sm hover:shadow-warm"
                    >
                      View Salon
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })
      )}

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </motion.main>
  );
}
