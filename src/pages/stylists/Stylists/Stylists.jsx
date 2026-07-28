import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdStar, MdVerified, MdLocalOffer, MdShoppingBag, MdPeople, MdAccessTime, MdArrowForward } from 'react-icons/md';
import { motion } from 'framer-motion';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import EmptyState from '../../../components/ui/EmptyState';
import Card from '../../../components/ui/Card';
import * as salonService from '../../../services/salonService';

const TABS = ['Active Stylists', 'Salon Products', 'Deals & Offers'];

const STYLIST_SHOWCASE = [
  { name: 'Ahmed R.', spec: 'Fade Master', img: 12, span: 'md:col-span-2 md:row-span-2' },
  { name: 'Bilal K.', spec: 'Beard Art.', img: 25, span: '' },
  { name: 'Zayan M.', spec: 'Color Pro', img: 33, span: 'md:col-span-2' },
  { name: 'Hamza S.', spec: 'Classic Cut', img: 42, span: '' },
  { name: 'Usman A.', spec: 'Scalp Spec.', img: 18, span: '' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
    <motion.main
      className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={itemVariants} className="mb-xl text-center pt-md">
        <span className="text-primary font-label-md text-label-md tracking-[0.2em] uppercase mb-base block">Our Talent</span>
        <h1 className="font-display-lg text-display-lg mb-xs text-on-surface">Meet Our <span className="text-primary">Stylists</span></h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          A collective of 15 master barbers, colorists, and grooming specialists across Karachi's finest salons.
        </p>
      </motion.section>

      {/* Featured Showcase — Bento Grid */}
      <motion.section variants={itemVariants} className="mb-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto min-h-[200px] md:min-h-0">
          {STYLIST_SHOWCASE.map((st, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl overflow-hidden relative group bg-surface-container border border-white/5 ${st.span}`}
            >
              <div className="w-full h-full">
                <img
                  src={`https://i.pravatar.cc/400?img=${st.img}`}
                  alt={st.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Gradient removed as per request */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-warm-sm" />
                  <span className="text-primary text-[9px] font-bold uppercase tracking-wider">Available</span>
                </div>
                <h3 className="font-label-md text-label-md text-on-surface leading-tight">{st.name}</h3>
                <p className="text-[10px] text-on-surface-variant">{st.spec}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Browse by Category */}
      <motion.div variants={itemVariants} className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg mb-lg text-on-surface">
          Browse by <span className="text-primary">Category</span>
        </h2>

        <div className="flex overflow-x-auto gap-sm pb-2 [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-shrink-0 px-lg py-sm rounded-full font-label-md font-bold transition-all ${
              activeTab === i
                ? 'bg-primary text-on-primary shadow-warm'
                : 'bg-surface-container border border-white/10 text-on-surface-variant hover:bg-white/5'
            }`}
          >
            {i === 0 && <MdPeople className="inline mr-xs text-lg" />}
            {i === 1 && <MdShoppingBag className="inline mr-xs text-lg" />}
            {i === 2 && <MdLocalOffer className="inline mr-xs text-lg" />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[1, 2, 3].map((n) => <div key={n} className="h-64 bg-surface-container rounded-xl animate-pulse" />)}
          </div>
        ) : barbers.length === 0 ? (
          <EmptyState
            icon={MdPeople}
            title="No stylists available right now"
            description="Check back soon — salons update stylist availability throughout the day."
          />
        ) : (
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {barbers.map((stylist) => (
              <motion.div
                key={stylist._id}
                variants={itemVariants}
                className="rounded-xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="relative h-48 bg-surface flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={stylist.name}
                    src={stylist.profileImage || 'https://via.placeholder.com/300x300?text=?'}
                  />
                  {/* Gradient removed as per request */}
                  <div className="absolute top-3 right-3 bg-primary/20 backdrop-blur-md px-sm py-xs rounded-full flex items-center gap-xs border border-primary/30">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-on-surface font-label-md text-[11px] font-bold">AVAILABLE</span>
                  </div>
                </div>
                <div className="p-md">
                  <div className="flex items-start justify-between mb-xs">
                    <div>
                      <h3 className="font-headline-md text-on-surface flex items-center gap-xs">
                        {stylist.name}
                        <MdVerified className="text-primary text-base" />
                      </h3>
                      <p className="text-primary font-label-md text-sm">
                        {stylist.experience ? `${stylist.experience} yrs experience` : 'GlowCut Specialist'}
                      </p>
                    </div>
                    <div className="flex items-center gap-xs bg-primary/15 px-sm py-xs rounded-full">
                      <MdStar className="text-primary text-sm" />
                      <span className="font-bold text-primary">{stylist.rating ?? 0}</span>
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
                    className="w-full py-sm rounded-xl bg-primary text-on-primary font-label-md font-bold shadow-warm-sm active:scale-95 transition-all"
                  >
                    View Salon &amp; Book
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      )}

      {activeTab === 1 && (
        <EmptyState
          icon={MdShoppingBag}
          title="Product catalog coming soon"
          description="GlowCut's backend doesn't have a products/e-commerce API yet — this tab will populate once that's built."
        />
      )}

      {activeTab === 2 && (
        <EmptyState
          icon={MdLocalOffer}
          title="Deals engine coming soon"
          description="There's no promotions/deals API in the backend yet — this tab will populate once that's built."
        />
      )}

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
      </motion.div>
    </motion.main>
  );
}
