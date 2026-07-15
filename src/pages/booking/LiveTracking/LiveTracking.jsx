import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdArrowBack, MdNotifications, MdPerson, MdCall, MdNearMe } from 'react-icons/md';
import BookingTimeline from '../../../components/booking/BookingTimeline';

const TOTAL_SECONDS = 8 * 60;

export default function LiveTracking() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      const timeout = setTimeout(() => navigate('/booking/payment-success'), 1500);
      return () => clearTimeout(timeout);
    }
  }, [secondsLeft, navigate]);

  const minutesLeft = Math.ceil(secondsLeft / 60);
  const progressPercent = Math.min(95, Math.max(5, 100 - (secondsLeft / TOTAL_SECONDS) * 100));

  const steps = useMemo(() => {
    if (minutesLeft > 5) {
      return [
        { title: 'Booking Confirmed', subtitle: 'Slot reserved', status: 'done' },
        { title: 'Stylist En Route', subtitle: `${minutesLeft} min away`, status: 'active' },
        { title: 'Arrived & Check-In', subtitle: 'Awaiting arrival', status: 'upcoming' },
      ];
    }
    if (minutesLeft > 0) {
      return [
        { title: 'Booking Confirmed', subtitle: 'Slot reserved', status: 'done' },
        { title: 'Stylist En Route', subtitle: 'Almost there', status: 'done' },
        { title: 'Arrived & Check-In', subtitle: `${minutesLeft} min away`, status: 'active' },
      ];
    }
    return [
      { title: 'Booking Confirmed', subtitle: 'Slot reserved', status: 'done' },
      { title: 'Stylist En Route', subtitle: 'Arrived', status: 'done' },
      { title: 'Arrived & Check-In', subtitle: 'You are checked in!', status: 'done' },
    ];
  }, [minutesLeft]);

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-surface/80 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <MdArrowBack className="text-primary" />
          </button>
          <span className="font-display-lg text-headline-md font-bold tracking-tighter text-primary">
            GlowCut
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:bg-white/5 transition-colors p-2 rounded-full text-on-surface-variant active:scale-95 duration-200">
            <MdNotifications />
          </button>
          <button className="hover:bg-white/5 transition-colors p-2 rounded-full text-on-surface-variant active:scale-95 duration-200">
            <MdPerson />
          </button>
        </div>
      </header>

      <main className="min-h-screen pt-16 pb-32 relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[100px]" />
        </div>

        {/* Map Section */}
        <section className="relative h-[460px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[#121212]">
            <img
              className="w-full h-full object-cover opacity-50 grayscale contrast-125"
              alt="Map of PECHS, Karachi"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsXNbE5T2ik9YEjd2lnQOvC24CTRwKmXsm-Bke0YC8wWaHm56NO9Opcb9gmhZ6nNfa0A7oHeBGOvgtkBpgSEWg8YaTEGiPABZBaIR1o4poMIBSajFR16xna5Us_PGZyql_r72RACV3Ecy9ylu8mUHwy_ym4e31-Gp-sm8w54pOz0dzV9-K8hcUaNJgIFMz-aP0W58OMUPHnVBOFAIQomhq7HJ6zI1VZo55J5zL1tSERl_rdue3AnTegvgv2Kubkfy8yz70QTkjseg"
            />
          </div>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-secondary/20 rounded-full animate-ping" />
              <div className="relative w-8 h-8 bg-secondary rounded-full shadow-[0_0_20px_rgba(102,221,139,0.8)] flex items-center justify-center border-2 border-white/20">
                <span className="material-symbols-outlined text-on-secondary text-sm">storefront</span>
              </div>
            </div>
          </div>
          <div
            className="absolute transition-all duration-1000"
            style={{ bottom: `${20 + progressPercent * 0.3}%`, left: `${33 + progressPercent * 0.15}%` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 bg-primary-container rounded-full shadow-[0_0_15px_rgba(255,95,31,0.9)] flex items-center justify-center border-2 border-white/30">
                <span
                  className="material-symbols-outlined text-white text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  navigation
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Status Card Content */}
        <section className="px-margin-mobile -mt-12 relative z-10 space-y-6">
          <div className="glass-edge backdrop-blur-2xl rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <span className="font-label-md text-primary tracking-[0.2em] mb-2">LIVE STATUS</span>
            <h1 className="font-display-lg text-white mb-1">
              {minutesLeft > 0 ? `${minutesLeft} Minutes to Go` : "You're Checked In!"}
            </h1>
            <p className="font-body-md text-on-surface-variant">
              {minutesLeft > 0 ? 'Estimated Wait Time' : 'Enjoy your visit'}
            </p>
            <div className="w-full h-1 bg-white/5 mt-6 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container shadow-[0_0_10px_rgba(255,95,31,0.8)] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Live Timeline */}
          <BookingTimeline steps={steps} />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pb-4">
            <button
              onClick={() => toast.success('Calling Usman K. ...')}
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl glass-edge text-on-surface-variant font-label-md hover:bg-white/5 transition-all active:scale-95 duration-200"
            >
              <MdCall className="text-sm" />
              Call Barber
            </button>
            <button
              onClick={() => toast('Opening directions...')}
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-primary-container text-white font-label-md shadow-[0_0_15px_rgba(255,95,31,0.5)] hover:brightness-110 transition-all active:scale-95 duration-200"
            >
              <MdNearMe className="text-sm" />
              Directions
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
