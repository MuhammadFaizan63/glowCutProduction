import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdVerified, MdArrowBack, MdArrowForward, MdLocationOn, MdGroup, MdContentCut } from 'react-icons/md';
import toast from 'react-hot-toast';
import ServiceCard from '../../../components/salon/ServiceCard';
import BarberCard from '../../../components/salon/BarberCard';
import ReviewCard from '../../../components/salon/ReviewCard';
import Loader from '../../../components/ui/Loader';
import { useSalon } from '../../../hooks/useSalon';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';

const SERVICE_CATEGORIES = [
  {
    category: 'Haircuts',
    items: [
      {
        id: 'svc-precision-fade',
        name: 'Precision Fade',
        price: 'PKR 1,500',
        priceValue: 1500,
        description: 'A sharp, digitally-precise fade tailored to your head shape. Includes wash and style.',
        duration: '45 mins',
      },
      {
        id: 'svc-cyber-undercut',
        name: 'Cyber-Undercut',
        price: 'PKR 2,200',
        priceValue: 2200,
        description: 'Edgy geometric patterns etched with razor precision for a high-tech street look.',
        duration: '60 mins',
      },
    ],
  },
  {
    category: 'Cyber-Treatments',
    items: [
      {
        id: 'svc-scalp-detox',
        name: 'Neon Glow Scalp Detox',
        price: 'PKR 3,500',
        priceValue: 3500,
        description: 'Ultrasonic treatment with bio-available nutrients to refresh stressed scalps.',
        duration: '30 mins',
      },
    ],
  },
];

const STYLISTS = [
  {
    id: 'stylist-usman',
    name: 'Usman K.',
    specialty: 'Fade Specialist',
    rating: 4.9,
    reviewCount: 120,
    available: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsLpEtK2nspMtqZ8-eiJmxab5w48-j-06oss6R9E2W_KgPfWcbanZqysEtSQoqBJdm6qohZDh-eOILbvNukxNyV2kliByTTLCF4iVhx9fzorykM-MxWr_qUSqZtehx7a3cCmQ2TwNPuupqTLOPIf3vWyISiHzsrMmhSUYd1Rd7YbXWAcboNf73X8TNkHP6Wu13ePE6V16AIjGrwB94l-rRD2zFbq4VCOfK69fginVtp_LLXBK3l1yd2bpOLlroPFz25xkOv_jNDqM',
  },
  {
    id: 'stylist-zara',
    name: 'Zara',
    specialty: 'Color & Style',
    rating: 4.8,
    reviewCount: 85,
    available: false,
    nextSlot: '2PM',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDb-09FEBqZV_QEb-8HceaNERsrkaAlpOPWO3LbxPCCQA2E_TipMygejrUY0VW4xTSGokEcAfnynEAeoMWx-N_TMEpY2SiesfUtsTI7eqKykzQliuwPAskwnF488MeEN3bhwDnPtqumk1saJ_DgqNR5lIX9TE6wQ0GzTotL7gW6XQLsp9HA9WCG0AFwCyt7H90IkIZ7A1vHcAaoiqCH2nKFDQXOslY-NPrg-E9Uhxtpy3bBSFcaEVnOridpH6D0Z6dK9fdLz7nCTzs',
  },
];

const REVIEWS = [
  {
    author: 'Ahmed K.',
    rating: 5,
    timeAgo: '2 days ago',
    comment: 'Best fade in the city. The vibe at Modern Cuts PECHS is unmatched. Usman really knows his craft.',
  },
  {
    author: 'Bilal R.',
    rating: 4,
    timeAgo: '1 week ago',
    comment: 'Loved the cyber-chic atmosphere. Scalp detox left my hair feeling amazing.',
  },
];

const DATES = [
  { label: 'Today', day: '24' },
  { label: 'Tue', day: '25' },
  { label: 'Wed', day: '26' },
];

export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { salon, isLoading } = useSalon(id);
  const { booking, setSalon, toggleService, setTimeSlot, totalPrice } = useBooking();

  const [selectedDate, setSelectedDate] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(true);

  useEffect(() => {
    if (salon) setSalon(salon);
  }, [salon, setSalon]);

  useEffect(() => {
    setSlotsLoading(true);
    bookingService.getAvailableTimeSlots(id, DATES[selectedDate].label).then((data) => {
      setSlots(data);
      const firstAvailable = data.find((s) => s.status === 'available');
      setSelectedSlot(firstAvailable?.time || null);
      setSlotsLoading(false);
    });
  }, [id, selectedDate]);

  const handleConfirm = () => {
    if (booking.services.length === 0) {
      toast.error('Select at least one service first');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please pick an available time slot');
      return;
    }
    setTimeSlot(DATES[selectedDate].label, selectedSlot);
    navigate('/booking/confirm');
  };

  if (isLoading || !salon) {
    return <Loader variant="full" label="Loading Salon" />;
  }

  const techFee = 0;
  const grandTotal = totalPrice + techFee;

  return (
    <main className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs text-on-surface-variant font-caption text-caption mb-md opacity-70">
        <span>Search</span>
        <span>›</span>
        <span>{salon.area?.split(',')[0]}</span>
        <span>›</span>
        <span className="text-secondary">{salon.name}</span>
      </nav>

      {/* Hero */}
      <section className="relative h-[500px] rounded-xl overflow-hidden mb-xl border border-white/10">
        <img className="w-full h-full object-cover" alt={salon.name} src={salon.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-lg left-lg">
          <h1 className="font-display-lg text-display-lg text-white mb-xs">{salon.name}</h1>
          <p className="text-secondary font-label-md flex items-center gap-xs">
            <MdVerified /> Premium Cyber-Grooming Destination
          </p>
        </div>
        <div className="absolute bottom-lg right-lg flex gap-sm">
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-all">
            <MdArrowBack />
          </button>
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-all">
            <MdArrowForward />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-xl">
          {/* Services Menu */}
          <section>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-lg text-headline-lg flex items-center gap-sm">
                <MdContentCut className="text-primary-container" /> Services Menu
              </h2>
            </div>
            <div className="space-y-lg">
              {SERVICE_CATEGORIES.map((cat) => (
                <div key={cat.category}>
                  <h3 className="font-headline-md text-headline-md text-secondary mb-md border-l-4 border-secondary pl-md">
                    {cat.category}
                  </h3>
                  <div className="grid grid-cols-1 gap-md">
                    {cat.items.map((service) => {
                      const isSelected = booking.services.some((s) => s.id === service.id);
                      return (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          selected={isSelected}
                          onSelect={() =>
                            toggleService({
                              id: service.id,
                              name: service.name,
                              price: service.priceValue,
                              duration: parseInt(service.duration, 10),
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stylists */}
          <section>
            <h2 className="font-headline-lg text-headline-lg mb-lg flex items-center gap-sm">
              <MdGroup className="text-primary-container" /> Master Stylists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {STYLISTS.map((stylist) => (
                <BarberCard key={stylist.id} barber={stylist} />
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="font-headline-md text-headline-md mb-md">Community Feedback</h2>
            <div className="space-y-gutter">
              {REVIEWS.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Book */}
        <aside className="lg:col-span-4 sticky top-24 space-y-lg">
          <div className="glass-panel p-lg rounded-xl border-primary-container/20">
            <h3 className="font-headline-md text-headline-md text-white mb-lg">Quick Book</h3>

            <div className="mb-lg">
              <label className="font-label-md text-label-md block mb-sm text-on-surface-variant">
                Select Date
              </label>
              <div className="grid grid-cols-3 gap-xs">
                {DATES.map((d, i) => (
                  <button
                    key={d.label}
                    onClick={() => setSelectedDate(i)}
                    className={`py-md rounded-lg text-center flex flex-col items-center transition-colors ${
                      selectedDate === i
                        ? 'bg-secondary text-on-secondary shadow-neon-emerald'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-caption text-caption uppercase opacity-80">{d.label}</span>
                    <span className="font-bold text-headline-md">{d.day}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-xl">
              <label className="font-label-md text-label-md block mb-sm text-on-surface-variant">
                Available Times
              </label>
              {slotsLoading ? (
                <div className="grid grid-cols-3 gap-xs">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-xs">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.status === 'unavailable'}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-sm rounded-lg text-caption font-label-md transition-colors border ${
                        slot.status === 'unavailable'
                          ? 'border-white/5 text-on-surface-variant opacity-30 cursor-not-allowed'
                          : selectedSlot === slot.time
                          ? 'border-secondary bg-secondary/10 text-secondary shadow-neon-emerald'
                          : 'border-white/10 hover:border-secondary'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-lg mb-lg">
              {booking.services.length === 0 ? (
                <p className="text-on-surface-variant text-sm italic">No services selected yet.</p>
              ) : (
                booking.services.map((s) => (
                  <div key={s.id} className="flex justify-between items-center mb-xs">
                    <span className="text-on-surface-variant font-body-md">{s.name}</span>
                    <span className="text-white font-bold">PKR {s.price.toLocaleString()}</span>
                  </div>
                ))
              )}
              <div className="flex justify-between items-center mb-md mt-xs">
                <span className="text-on-surface-variant font-body-md">Tech Fee</span>
                <span className="text-white font-bold">PKR {techFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-headline-md text-headline-md">Total</span>
                <span className="font-display-lg text-headline-lg text-primary-container">
                  PKR {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-secondary text-on-secondary font-bold py-md rounded-lg font-label-md text-label-md tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-neon-emerald"
            >
              CONFIRM BOOKING
            </button>
          </div>

          <div className="glass-panel p-md rounded-xl">
            <h4 className="font-label-md text-label-md text-secondary mb-sm uppercase tracking-wider">
              Location
            </h4>
            <p className="text-on-surface-variant font-body-md mb-md flex items-center gap-xs">
              <MdLocationOn /> {salon.area}
            </p>
            <div className="w-full h-32 bg-surface-container-high rounded-lg overflow-hidden relative">
              <img
                className="w-full h-full object-cover grayscale brightness-50"
                alt="Map location"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpgynpW5r3FztPxvFPuus4DGDxsjr6_uE1RCHttTgLeudziQeArtt8aMMGr8ZVQsPmA2NiLJNJ3yQ_0w_ldZSyftZQ_gtiYUVuPDk210cTeUCa-NgTdRT4OlYgSCM-z-sDBvxvyHRLRRwqdf0wfXdWpVIh_ccb7lryZsQcU9wVvtdq1gQYDcYgLx08hBEMVjbxSv4fomgUgoPK6Lkv6qzKubzVSJAdG7Q-Vdr6nbQdXjYM-gKupplx3YyFDpm45GFgdHpiDfdO-cc"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <MdLocationOn className="text-secondary text-4xl" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
