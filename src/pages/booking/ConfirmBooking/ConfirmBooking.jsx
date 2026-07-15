import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdArrowBack,
  MdContentCut,
  MdSchedule,
  MdInfo,
  MdHourglassEmpty,
  MdStar,
} from 'react-icons/md';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import ReviewCard from '../../../components/salon/ReviewCard';

const REVIEWS = [
  {
    author: 'Ahmed K.',
    rating: 5,
    timeAgo: '2 days ago',
    comment: 'Best fade in the city. The vibe at Modern Cuts PECHS is unmatched. Usman really knows his craft.',
  },
];

const TECH_FEE = 50;

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { booking, setTimeSlot, totalPrice, totalDuration, confirmBooking } = useBooking();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlotState] = useState(booking.timeSlot);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    bookingService.getAvailableTimeSlots(booking.salon?.id, 'today').then((data) => {
      setSlots(data);
      setLoadingSlots(false);
      if (!selectedSlot) {
        const firstAvailable = data.find((s) => s.status === 'available');
        if (firstAvailable) setSelectedSlotState(firstAvailable.time);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSlot = (time) => {
    setSelectedSlotState(time);
    setTimeSlot('Today', time);
  };

  const grandTotal = totalPrice + TECH_FEE;

  const handleProceed = async () => {
    if (!booking.salon) {
      toast.error('No salon selected — start from a salon page');
      navigate('/salons/nearby');
      return;
    }
    setSubmitting(true);
    try {
      await bookingService.createBooking({
        salonId: booking.salon.id,
        services: booking.services,
        timeSlot: selectedSlot,
      });
      confirmBooking();
      navigate('/booking/summary');
    } catch {
      toast.error('Something went wrong confirming your booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      {/* Focused Header */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-margin-desktop h-20 bg-surface/30 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 group text-on-surface-variant hover:text-primary transition-colors"
        >
          <MdArrowBack />
          <span className="font-label-md text-label-md">BACK</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-label-md text-label-md text-primary">
              {booking.services.length > 0 ? 'CONFIRMING BOOKING' : 'NO SERVICES YET'}
            </p>
            <p className="text-[10px] text-on-surface-variant">ELITE MEMBER</p>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        {/* Hero Gallery */}
        <section className="mb-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter h-[400px]">
            <div className="md:col-span-2 relative rounded-xl overflow-hidden group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Salon interior"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRwgRw9rJb1df1FSV7F08Kq__Y-Ue1DsjhgrcKemEgc_vjb4IWFzXFxer3GbLgvPjO1V5xyBduOBYE53DwSuI5g0Sep320kXD2fP8VnWhnArTCNwa-lez2bUG-FWgHvL28GG1po0RfmwWTdS7vwU4bv3XcMq2gQTs-nQuncMxcLhGI83alusMA5cMbfJX9Tdvdbl59gvK3ApFD26l_s8YRteG9CGhMFOvvCPA96A24ZaKq6dDoDE6k3XZJK-qqJugKtl1zkFx8eXo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h1 className="font-display-lg text-display-lg text-white">
                  {booking.salon?.name || 'Modern Cuts PECHS'}
                </h1>
                <p className="text-secondary font-label-md tracking-widest uppercase">
                  Premium Grooming Hub
                </p>
              </div>
            </div>
            <div className="hidden md:grid grid-rows-2 gap-gutter">
              <div className="rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Barber tools"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvQKMFcQw1WXbeXBctqHxtO9_Ep-crvjKTh1vCmDqUYXjS8Shr1YWb3W5rm0Ruu7EXutFlp1bRjfnik7qWrhfl5dyVmvcRSBi7qaFRWMUm6At1np0Re9SXjjMJxrNFbiG6zPIdVEynYtWNoJKwKUzYxndQ4bQxHxYwwo1tOchdDKEkFt9tlgMGNl289PjoTT3nfbqX2xCWYWEGbRIYHNm3VJ-N2FxS9R5FC1pe-0SksfIwO-hDQNw-4N6Qksie5pzdXiBi2KzemSI"
                />
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Salon waiting area"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqEYFeM-GZQbxXjJTCOoM-9vSsN4qlAR5rlHN5bgxNsTeFudO-Ky890abg8qdL7J4tQnziDXM2jmqI-AF8ioPYa5bnhO0E3OV9120OELtvF6DqXg-SI5G78dH3el4yLGdMQJFM4cpeIo4De3ymsr1k1bfuy5fqWeuFFCiVtiMZcfgxpfVbsy1n9QRfPC8609LzBqBm6hsZ-eSlO6-DCSWpOOqSamdnF6nLqnYkV8aFeLSNLY5yLeL2D3dwDceoiY3vgxgOJ8EKE4M"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-lg">
            {/* Selected Services */}
            <div>
              <h2 className="font-headline-md text-headline-md mb-md flex items-center gap-2">
                <MdContentCut className="text-primary" /> Selected Services
              </h2>
              {booking.services.length === 0 ? (
                <div className="glass-panel p-lg rounded-xl text-center text-on-surface-variant">
                  No services selected.{' '}
                  <button
                    onClick={() => navigate('/salons/nearby')}
                    className="text-primary underline"
                  >
                    Browse salons
                  </button>{' '}
                  to pick a service first.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {booking.services.map((service, i) => (
                    <div
                      key={service.id}
                      className={`glass-panel p-md rounded-xl flex justify-between items-center group ${
                        i % 2 === 1 ? 'border-l-4 border-secondary' : ''
                      }`}
                    >
                      <div>
                        <h3 className="font-headline-md text-body-lg text-white">
                          {service.name}
                        </h3>
                        <p className="text-on-surface-variant text-caption uppercase tracking-wider">
                          {booking.stylist?.name || 'Assigned Stylist'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${i % 2 === 1 ? 'text-secondary' : 'text-primary'}`}>
                          {service.duration} min
                        </p>
                        <p className="text-on-surface text-label-md">
                          PKR {service.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeslot Grid */}
            <div>
              <div className="flex justify-between items-end mb-md">
                <h2 className="font-headline-md text-headline-md flex items-center gap-2">
                  <MdSchedule className="text-secondary" /> Today's Schedule
                </h2>
                <span className="text-on-surface-variant font-label-md">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </span>
              </div>

              {loadingSlots ? (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg glass-panel animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.status === 'unavailable'}
                      onClick={() => handleSelectSlot(slot.time)}
                      className={`py-3 text-center rounded-lg font-bold transition-all ${
                        slot.status === 'unavailable'
                          ? 'glass-panel text-on-surface-variant opacity-40 cursor-not-allowed'
                          : selectedSlot === slot.time
                          ? 'bg-secondary-container/20 border-2 border-secondary text-secondary shadow-neon-emerald'
                          : 'glass-panel text-on-surface hover:border-secondary/40'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-4 text-secondary text-caption flex items-center gap-1">
                <MdInfo className="text-sm" /> Your selected slot is highlighted in emerald green.
              </p>
            </div>

            {/* Community Feedback */}
            <div>
              <h2 className="font-headline-md text-headline-md mb-md">Community Feedback</h2>
              <div className="space-y-gutter">
                {REVIEWS.map((review, i) => (
                  <ReviewCard key={i} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-md">
              {/* Slot Graphic */}
              <div className="glass-panel rounded-2xl overflow-hidden relative border-t-2 border-secondary/30">
                <div className="p-lg text-center relative z-10">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-dashed border-secondary flex items-center justify-center animate-spin [animation-duration:8s]">
                    <MdHourglassEmpty className="text-[40px] text-secondary" />
                  </div>
                  <h4 className="font-headline-md text-white">
                    {totalDuration > 0 ? `${totalDuration} Min Slot` : 'Select Services'}
                  </h4>
                  <p className="text-on-surface-variant text-caption">
                    Total Duration: {totalDuration} Minutes
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20 overflow-hidden">
                  <div className="w-1/2 h-full bg-secondary shadow-neon-emerald" />
                </div>
              </div>

              {/* Barber Profile */}
              <div className="glass-panel p-md rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                      alt="Stylist Usman"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE692VQepZnu8F3jFCB9IqV7KjGKicvqPVTSc14wMhSn9xWEXFrqNmmOk85428B-jLi-X1AdVs2fjeJxDVHm3MF9cV7K4nru8ziFmpu9ZE6ktNFDkItdqswXrB8cU8D_MvbfTnZP8PV4yc_zDLqigIxBzRSdG5R9KDib87_KVg9YPQPX8NG7tWHImJlo_l7wPSIOA7HnXbrVYs_0VIJXSH8SWq8TPCGjq24ShxY1gvw_Yl1Tt1wR5uy3i64c676XraF-uPUKqMeq4"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-secondary rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="font-label-md text-white">
                      {booking.stylist?.name || 'Usman'}
                    </h3>
                    <p className="text-caption text-primary uppercase font-bold tracking-tighter">
                      GlowCut Specialist
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MdStar className="text-primary text-[14px]" />
                      <span className="text-caption text-on-surface">4.9 (120+ Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total & CTA */}
              <div className="glass-panel p-lg rounded-2xl border-t-4 border-primary-container">
                <div className="space-y-2 mb-lg">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Service Total</span>
                    <span>PKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tech Fee</span>
                    <span>PKR {TECH_FEE}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary-container to-transparent my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-white">Total Amount</span>
                    <span className="font-display-lg text-primary text-3xl">
                      PKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={submitting || booking.services.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-secondary font-bold font-headline-md shadow-neon-emerald active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'PROCEED TO PAY'
                  )}
                </button>
                <p className="text-center text-[10px] text-on-surface-variant mt-4 uppercase tracking-[0.2em]">
                  Secure Encryption Enabled
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl px-6 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md border-t border-white/5 bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline-md text-headline-md font-bold text-primary-container tracking-tighter">
            GlowCut
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 GlowCut Cyber-Chic Salons. All rights reserved.
          </p>
        </div>
        <div className="flex gap-lg">
          <a className="text-on-surface-variant hover:text-secondary transition-colors text-body-md" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors text-body-md" href="#">
            Terms of Service
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors text-body-md" href="#">
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}
