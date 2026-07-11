import React, { useState, useContext } from 'react';
import { MdStar, MdVerified, MdLocalOffer, MdShoppingBag, MdPeople } from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import toast from 'react-hot-toast';

const ACTIVE_STYLISTS = [
  {
    id: 'st-umer',
    name: 'Umer Ustad',
    title: 'Fade Master',
    rating: 4.9,
    reviews: 312,
    slots: ['3:00 PM', '5:30 PM', '7:00 PM'],
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsLpEtK2nspMtqZ8-eiJmxab5w48-j-06oss6R9E2W_KgPfWcbanZqysEtSQoqBJdm6qohZDh-eOILbvNukxNyV2kliByTTLCF4iVhx9fzorykM-MxWr_qUSqZtehx7a3cCmQ2TwNPuupqTLOPIf3vWyISiHzsrMmhSUYd1Rd7YbXWAcboNf73X8TNkHP6Wu13ePE6V16AIjGrwB94l-rRD2zFbq4VCOfK69fginVtp_LLXBK3l1yd2bpOLlroPFz25xkOv_jNDqM',
    specialties: ['Skin Fade', 'Taper', 'Line-Up'],
  },
  {
    id: 'st-sajid',
    name: 'Sajid Bhai',
    title: 'Beard Specialist',
    rating: 4.8,
    reviews: 218,
    slots: ['2:00 PM', '4:00 PM'],
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb-09FEBqZV_QEb-8HceaNERsrkaAlpOPWO3LbxPCCQA2E_TipMygejrUY0VW4xTSGokEcAfnynEAeoMWx-N_TMEpY2SiesfUtsTI7eqKykzQliuwPAskwnF488MeEN3bhwDnPtqumk1saJ_DgqNR5lIX9TE6wQ0GzTotL7gW6XQLsp9HA9WCG0AFwCyt7H90IkIZ7A1vHcAaoiqCH2nKFDQXOslY-NPrg-E9Uhxtpy3bBSFcaEVnOridpH6D0Z6dK9fdLz7nCTzs',
    specialties: ['Beard Sculpt', 'Hot Towel', 'Coloring'],
  },
  {
    id: 'st-hassan',
    name: 'Hassan Pro',
    title: 'Color & Style Expert',
    rating: 4.7,
    reviews: 150,
    slots: [],
    available: false,
    nextSlot: 'Tomorrow 11 AM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmjhpN1EUB0JmilErngGbIbrQ3R6Hu8WKeEfWOI-L-RTifBsqvwtrsPDauhR_i5lG2RbzWpXna_ai8Y6Hq2Bkmqpm9XXAEE2VmvhCrBRySU0WdaFG1oseXapuAbvuZpDajDmSKcgWGS-NZ050wabuWSbELLmpiDckZOcwgGIj9R1OD6EYHxcHjLhauW5Z33USFBNZ56hu35RgihrSSa9lFbgWDqSe6b54ydmmLb9Z_f0iiColKGVYoazAV-E3P5JuKcpFdOumga-E',
    specialties: ['Highlights', 'Global Color', 'Keratin'],
  },
];

const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Matte Clay Wax',
    brand: 'GlowCut Pro',
    price: 'PKR 850',
    desc: 'Strong hold, low shine. Perfect for textured and fade styles.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9tM_yjJrVx1sfvOXA-jdDQDBqXrnQVikMErFei4m9yBCxw6vP7IBkQw9d-K2BQweH3rL9Bg2obOua2FCnRzvTG9pjGGksFKqwVR4qa9fkPgbUPBBxWSGyixF96vrJ3zpW6bzIFG4Fk0FPDHaQmIUDQ80bVnb83AkB8IQDu2VXzPjjrrdKsD50Z5A7DUZ558eEfqkwXPdih5T8Zad3wTy_RgBRIj9of_cWOX-_UBsa8A1pnLMTYvbtpkHelIGLKkRBfbTU43tGTfo',
  },
  {
    id: 'prod-2',
    name: 'Argan Gold Hair Oil',
    brand: 'Moroccan Luxe',
    price: 'PKR 1,200',
    desc: 'Nourishing blend of argan and jojoba oils for shine and moisture.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9tM_yjJrVx1sfvOXA-jdDQDBqXrnQVikMErFei4m9yBCxw6vP7IBkQw9d-K2BQweH3rL9Bg2obOua2FCnRzvTG9pjGGksFKqwVR4qa9fkPgbUPBBxWSGyixF96vrJ3zpW6bzIFG4Fk0FPDHaQmIUDQ80bVnb83AkB8IQDu2VXzPjjrrdKsD50Z5A7DUZ558eEfqkwXPdih5T8Zad3wTy_RgBRIj9of_cWOX-_UBsa8A1pnLMTYvbtpkHelIGLKkRBfbTU43tGTfo',
  },
  {
    id: 'prod-3',
    name: 'Beard Growth Tonic',
    brand: 'GlowCut Pro',
    price: 'PKR 650',
    desc: 'Biotin-infused serum to stimulate healthy beard growth and reduce patchiness.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9tM_yjJrVx1sfvOXA-jdDQDBqXrnQVikMErFei4m9yBCxw6vP7IBkQw9d-K2BQweH3rL9Bg2obOua2FCnRzvTG9pjGGksFKqwVR4qa9fkPgbUPBBxWSGyixF96vrJ3zpW6bzIFG4Fk0FPDHaQmIUDQ80bVnb83AkB8IQDu2VXzPjjrrdKsD50Z5A7DUZ558eEfqkwXPdih5T8Zad3wTy_RgBRIj9of_cWOX-_UBsa8A1pnLMTYvbtpkHelIGLKkRBfbTU43tGTfo',
  },
];

const DEALS = [
  {
    id: 'deal-1',
    label: '🔥 Friday Special',
    title: 'Haircut + Oiling Combo',
    price: 'PKR 800',
    originalPrice: 'PKR 1,400',
    desc: 'Every Friday only. Includes classic cut, hot oil treatment, and style.',
    badge: 'Save 43%',
    color: 'primary',
    expires: 'Every Friday',
  },
  {
    id: 'deal-2',
    label: '⚡ Flash Deal',
    title: 'Beard Sculpt + Facial',
    price: 'PKR 1,500',
    originalPrice: 'PKR 2,600',
    desc: '48-hour limited offer. Full beard grooming plus deep-pore facial treatment.',
    badge: 'Save 42%',
    color: 'secondary',
    expires: 'Today only',
  },
  {
    id: 'deal-3',
    label: '👑 Gold Members',
    title: 'Full Grooming Package',
    price: 'PKR 2,999',
    originalPrice: 'PKR 4,800',
    desc: 'Fade + beard + facial + scalp treatment. Exclusive to Gold tier members.',
    badge: 'Members Only',
    color: 'tertiary',
    expires: 'Always active',
  },
];

const TABS = ['Active Stylists', 'Salon Products', 'Deals & Offers'];

export default function Stylists() {
  const { userType } = useContext(AuthContext);
  const isGuest = userType === 'guest';
  const [activeTab, setActiveTab] = useState(0);
  const [guestBlockOpen, setGuestBlockOpen] = useState(false);

  const handleBook = (name) => {
    if (isGuest) { setGuestBlockOpen(true); return; }
    toast.success(`Booking slot with ${name}...`);
  };

  const handleAddToCart = (product) => {
    if (isGuest) { setGuestBlockOpen(true); return; }
    toast.success(`${product.name} added to cart!`);
  };

  const handleClaimDeal = (deal) => {
    if (isGuest) { setGuestBlockOpen(true); return; }
    toast.success(`Deal claimed: ${deal.title}!`);
  };

  return (
    <main className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
      <section className="mb-xl text-center pt-md">
        <h1 className="font-display-lg text-display-lg mb-xs">Stylists, Products & Offers</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Browse our master stylists, premium grooming products, and exclusive deals — all in one place.
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

      {/* ── Section 1: Active Stylists ── */}
      {activeTab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {ACTIVE_STYLISTS.map((stylist) => (
            <div key={stylist.id} className="glass-panel rounded-xl overflow-hidden hover:border-primary-container/40 transition-all group">
              <div className="relative h-48">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={stylist.name} src={stylist.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                {stylist.available ? (
                  <div className="absolute top-3 right-3 bg-secondary-container/90 backdrop-blur-md px-sm py-xs rounded-full flex items-center gap-xs border border-secondary/30">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="text-on-secondary-container font-label-md text-[11px] font-bold">AVAILABLE</span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-md px-sm py-xs rounded-full border border-white/10">
                    <span className="text-on-surface-variant font-label-md text-[11px]">{stylist.nextSlot}</span>
                  </div>
                )}
              </div>
              <div className="p-md">
                <div className="flex items-start justify-between mb-xs">
                  <div>
                    <h3 className="font-headline-md text-on-surface flex items-center gap-xs">
                      {stylist.name}
                      <MdVerified className="text-secondary text-base" />
                    </h3>
                    <p className="text-primary-container font-label-md text-sm">{stylist.title}</p>
                  </div>
                  <div className="flex items-center gap-xs bg-secondary/10 px-sm py-xs rounded-full">
                    <MdStar className="text-secondary text-sm" />
                    <span className="font-bold text-secondary">{stylist.rating}</span>
                    <span className="text-caption text-on-surface-variant">({stylist.reviews})</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-xs mb-md">
                  {stylist.specialties.map((s) => (
                    <span key={s} className="text-[11px] bg-white/5 border border-white/10 px-sm py-xs rounded-full text-on-surface-variant">
                      {s}
                    </span>
                  ))}
                </div>
                {stylist.available && stylist.slots.length > 0 && (
                  <div className="flex flex-wrap gap-xs mb-md">
                    {stylist.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleBook(stylist.name)}
                        className="text-[12px] px-sm py-xs rounded-lg border border-primary-container/40 text-primary-container hover:bg-primary-container/10 transition-colors"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleBook(stylist.name)}
                  disabled={!stylist.available}
                  className="w-full py-sm rounded-lg bg-secondary text-on-secondary font-label-md font-bold shadow-neon-emerald active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {stylist.available ? 'Book This Stylist' : 'Unavailable Today'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Section 2: Salon Products ── */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="glass-panel rounded-xl overflow-hidden group hover:border-secondary/30 transition-all">
              <div className="h-48 bg-surface-container relative overflow-hidden">
                <img className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500" alt={product.name} src={product.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute top-3 left-3 bg-primary-container/20 border border-primary-container/30 text-primary-container text-[11px] font-bold px-sm py-xs rounded-full">
                  {product.brand}
                </span>
              </div>
              <div className="p-md">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-headline-md text-on-surface">{product.name}</h3>
                  <span className="text-secondary font-bold whitespace-nowrap ml-sm">{product.price}</span>
                </div>
                <p className="text-on-surface-variant font-body-md text-sm mb-md">{product.desc}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-sm rounded-lg bg-primary-container text-on-primary font-label-md font-bold shadow-neon-orange-sm active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Section 3: Active Deals ── */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {DEALS.map((deal) => {
            const isGold = deal.color === 'tertiary';
            return (
              <div
                key={deal.id}
                className={`glass-panel rounded-2xl p-lg relative overflow-hidden border ${
                  deal.color === 'primary'
                    ? 'border-primary-container/30'
                    : deal.color === 'secondary'
                    ? 'border-secondary/30'
                    : 'border-tertiary/30'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 ${
                  deal.color === 'primary' ? 'bg-primary/15' : deal.color === 'secondary' ? 'bg-secondary/15' : 'bg-tertiary/15'
                }`} />

                <div className="flex justify-between items-start mb-md relative z-10">
                  <span className={`font-label-md text-[11px] font-bold uppercase tracking-widest ${
                    deal.color === 'primary' ? 'text-primary-container' : deal.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
                  }`}>
                    {deal.label}
                  </span>
                  <span className="bg-error/20 text-error text-[11px] font-bold px-sm py-xs rounded-full border border-error/30">
                    {deal.badge}
                  </span>
                </div>

                <h3 className="font-headline-lg text-headline-md text-on-surface mb-xs relative z-10">
                  {deal.title}
                </h3>
                <p className="text-on-surface-variant font-body-md text-sm mb-md relative z-10">
                  {deal.desc}
                </p>

                <div className="flex items-end gap-sm mb-lg relative z-10">
                  <span className={`font-display-lg text-headline-lg font-bold ${
                    deal.color === 'primary' ? 'text-primary-container' : deal.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
                  }`}>
                    {deal.price}
                  </span>
                  <span className="line-through text-on-surface-variant font-body-md mb-1">
                    {deal.originalPrice}
                  </span>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <span className="text-caption text-on-surface-variant">⏰ {deal.expires}</span>
                  <button
                    onClick={() => handleClaimDeal(deal)}
                    className={`px-lg py-sm rounded-xl font-label-md font-bold active:scale-95 transition-all ${
                      deal.color === 'primary'
                        ? 'bg-primary-container text-on-primary shadow-neon-orange-sm'
                        : deal.color === 'secondary'
                        ? 'bg-secondary text-on-secondary shadow-neon-emerald'
                        : 'border border-tertiary text-tertiary hover:bg-tertiary/10'
                    }`}
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </main>
  );
}
