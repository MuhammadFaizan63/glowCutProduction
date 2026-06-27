import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdStorefront, MdCalendarToday, MdAccountCircle, MdTimer, MdCheck } from 'react-icons/md';
import { useBooking } from '../../../hooks/useBooking';

const PROCESS_STEPS = [
  { title: 'Check-In', subtitle: 'Completed at 3:15 PM', status: 'done' },
  { title: 'Consultation', subtitle: 'Style profile updated', status: 'done' },
  { title: 'Haircut', subtitle: 'In Progress...', status: 'active' },
  { title: 'Styling', subtitle: 'Awaiting previous step', status: 'upcoming' },
];

function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export default function BookingSummary() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const [secondsLeft, setSecondsLeft] = useState(29 * 60 + 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const clientName = 'Faizan';
  const salonName = booking.salon?.name || 'Modern Cuts PECHS';
  const slotLabel = booking.timeSlot
    ? `${booking.date || 'Today'}, ${booking.timeSlot}`
    : 'Today, 3:30 PM - 4:30 PM';

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[409px] md:h-[512px] w-full overflow-hidden">
        <img
          alt={salonName}
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs1l4S_8EO95Tp66DW511NJr98V2sN0njzQGzU4Eqf4cK8PLv3q-3qNfbEsReVRgksKeW7Yqt2sQEMwW4Y7Yl3BPHDiQd16YTFiJ_wlQdRA7-ExY8i04gt9XruVl6ZWtaakuBBUeIqiPNBymY8gp0iQBRUoLeZghPvFMUvO9zXRCp4ruJE0L-0naZRcXFiMEaTSveeAQ_0KA15k4Jsdz_JC4qMpbfJ3GR8aHAetQ7HkXVTtPzjiTNUrAnD7hjKj-Qc_kzkEuzRUH0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-md right-margin-mobile md:right-margin-desktop flex items-center gap-sm bg-secondary-container/90 backdrop-blur-md px-md py-sm rounded-full border border-secondary/30 shadow-[0_0_20px_rgba(102,221,139,0.3)]">
          <MdPerson className="text-on-secondary-container" />
          <span className="font-label-md text-label-md text-on-secondary-container tracking-wider">
            BOOKED!
          </span>
        </div>
      </section>

      {/* Content Grid */}
      <div className="px-margin-mobile md:px-margin-desktop -mt-xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-xl pb-xl">
        {/* Booking Summary Card */}
        <div className="lg:col-span-7">
          <div className="glass-panel edge-light p-lg rounded-xl flex flex-col gap-lg h-full">
            <header>
              <h2 className="font-headline-lg text-headline-lg text-primary-container mb-xs">
                Booking Summary
              </h2>
              <div className="h-1 w-20 bg-primary-container rounded-full shadow-neon-orange" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-xs">
                <span className="text-caption font-caption text-on-surface-variant/60 uppercase tracking-widest">
                  Salon
                </span>
                <div className="flex items-center gap-sm">
                  <MdStorefront className="text-primary" />
                  <p className="font-headline-md text-headline-md text-on-surface">{salonName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <span className="text-caption font-caption text-on-surface-variant/60 uppercase tracking-widest">
                  Slot
                </span>
                <div className="flex items-center gap-sm">
                  <MdCalendarToday className="text-primary" />
                  <p className="font-headline-md text-headline-md text-on-surface">{slotLabel}</p>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <span className="text-caption font-caption text-on-surface-variant/60 uppercase tracking-widest">
                  Client
                </span>
                <div className="flex items-center gap-sm">
                  <MdAccountCircle className="text-primary" />
                  <p className="font-headline-md text-headline-md text-on-surface">{clientName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <span className="text-caption font-caption text-on-surface-variant/60 uppercase tracking-widest">
                  Arrival In
                </span>
                <div className="flex items-center gap-sm text-secondary">
                  <MdTimer />
                  <p className="font-headline-md text-headline-md font-bold tracking-widest">
                    {formatCountdown(secondsLeft)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-lg border-t border-white/5 flex flex-col gap-md">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Ready for your Haircut, {clientName}?
              </h3>
              <button
                onClick={() => navigate('/booking/waiting-lounge')}
                className="w-full py-md rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-secondary-container font-headline-md text-headline-md font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-neon-emerald"
              >
                PROCEED TO CONFIRM
              </button>
            </div>
          </div>
        </div>

        {/* Process Tracker */}
        <div className="lg:col-span-5">
          <div className="glass-panel edge-light p-lg rounded-xl h-full">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xl">Process</h2>
            <div className="flex flex-col gap-xl relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10" />
              {PROCESS_STEPS.map((step, i) => (
                <div className="flex items-center gap-lg relative z-10" key={i}>
                  {step.status === 'done' && (
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shadow-neon-emerald flex-shrink-0">
                      <MdCheck className="text-on-secondary-container text-[18px]" />
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="w-8 h-8 rounded-full border-2 border-secondary bg-background flex items-center justify-center shadow-[0_0_15px_rgba(102,221,139,0.6)] flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    </div>
                  )}
                  {step.status === 'upcoming' && (
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-surface-container-low flex-shrink-0" />
                  )}
                  <div>
                    <p
                      className={`font-headline-md text-headline-md ${
                        step.status === 'done'
                          ? 'text-secondary'
                          : step.status === 'active'
                          ? 'text-on-surface'
                          : 'text-on-surface-variant/40'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-caption font-caption ${
                        step.status === 'done'
                          ? 'text-on-surface-variant/60'
                          : step.status === 'active'
                          ? 'text-secondary/80'
                          : 'text-on-surface-variant/20'
                      }`}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
