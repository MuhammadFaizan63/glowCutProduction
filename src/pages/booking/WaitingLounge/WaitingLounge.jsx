import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdSchedule,
  MdVideogameAsset,
  MdQuiz,
  MdGridView,
  MdLeaderboard,
  MdChevronRight,
  MdTrendingUp,
  MdVisibility,
  MdFavorite,
  MdStorefront,
  MdContentCut,
  MdAttachMoney,
  MdWarning,
} from 'react-icons/md';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';

const GAMES = [
  {
    title: 'Barber Trivia',
    description: 'Test your style IQ and win loyalty points.',
    icon: MdQuiz,
    color: 'primary-container',
  },
  {
    title: 'Style Match-3',
    description: 'Connect tools to clear the board.',
    icon: MdGridView,
    color: 'secondary',
  },
];

const VIDEOS = [
  {
    title: 'Classic Fade Tutorial',
    views: '12.4K',
    likes: 892,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHghyCHZ8Mgjf-31cDlTgDu4Sd2pf7yDtBYS22C-P0eZsofUEoU177c4OdhLTd1KrQCdDywUSS32hTTlTLg7udD8NIaGkMOlvtkL7yMm9Wusl1e9CYmziljMZfRd68mjVHCqcchpUOIEjK-4XU6y7yV0xFc9obALf1uRUFo2syowoSaXlU8ez9BxjHBszG6lIofXkNq5BhclkcpwMY9LNN1gWgm09UHu_Y5Psn86k54j-47Q3Rod5DjHqCv6B8I3klGSK2Y5mC9lA',
  },
];

export default function WaitingLounge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = useBooking();
  
  // Robustly extract the Booking ID from React Router state, or fallback to the local context
  const bookingId = location.state?.bookingId || booking.createdBookings?.[0]?._id || booking.createdBookings?.[0]?.id;

  const [liveBooking, setLiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  // Poll the real booking status/queue position every 15s.
  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError(true);
      return;
    }
    
    let cancelled = false;

    const poll = async () => {
      try {
        const updated = await bookingService.getBookingStatus(bookingId);
        if (cancelled) return;
        setLiveBooking(updated);
        setLoading(false);
        
        if (updated.status === 'confirmed') {
          toast.success("It's your turn! Heading to live tracking...");
          setTimeout(() => navigate('/booking/live-tracking'), 1500);
        } else if (updated.status === 'cancelled' || updated.status === 'rejected') {
          toast.error('Your booking was cancelled by the salon.');
          navigate('/salons/nearby');
        }
      } catch (err) {
        if (!liveBooking) {
          setError(true);
          setLoading(false);
        }
        // If it fails but we already have liveBooking, just keep showing the last known state.
      }
    };

    poll(); // Initial fetch
    const interval = setInterval(poll, 15000); // 15-second polling
    
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [bookingId, navigate]);

  // Real-time countdown clock
  useEffect(() => {
    if (!liveBooking?.bookingDate || !liveBooking?.startTime) return;

    const [hours, minutes] = liveBooking.startTime.split(':');
    const targetDate = new Date(liveBooking.bookingDate);
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const updateCountdown = () => {
      if (liveBooking.status === 'in-progress') {
        setCountdownText('Service In Progress');
        return;
      }
      if (liveBooking.status === 'completed') {
        setCountdownText('Completed');
        return;
      }

      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdownText(`Your Turn in: ${h > 0 ? h + 'h ' : ''}${m}m ${s}s`);
      } else {
        setCountdownText('Your slot is ready! Please head to the chair.');
      }
    };

    updateCountdown(); // Initial call
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [liveBooking]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-secondary flex items-center justify-center animate-spin [animation-duration:8s]">
          <MdSchedule className="text-[32px] text-secondary" />
        </div>
        <h2 className="mt-6 font-display-lg text-headline-lg text-white animate-pulse">Syncing with Salon...</h2>
        <p className="text-on-surface-variant font-label-md mt-2">Retrieving your live queue status</p>
      </main>
    );
  }

  if (error || !liveBooking) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="glass-card rounded-2xl p-xl max-w-lg text-center border-t-4 border-error">
          <MdWarning className="text-error text-6xl mx-auto mb-4" />
          <h2 className="font-headline-lg text-headline-lg text-white mb-2">Booking Not Found</h2>
          <p className="text-on-surface-variant font-body-md mb-6">
            We couldn't retrieve your booking details. The session may have expired or the booking ID is invalid.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-surface-container-high text-white hover:bg-white/10 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            RETURN TO HOME
          </button>
        </div>
      </main>
    );
  }

  const stylistName = liveBooking?.barberId?.name || 'Your stylist';
  const stylistImage = liveBooking?.barberId?.profileImage || 'https://via.placeholder.com/150?text=?';
  const queuePosition = liveBooking?.queueNumber;
  const progressPercent = liveBooking?.status === 'confirmed' ? 100 : liveBooking?.status === 'pending' ? 30 : 60;
  const salonName = liveBooking?.salonId?.name || 'GlowCut Salon';
  const serviceName = liveBooking?.serviceId?.name || 'Grooming Service';
  const finalAmount = liveBooking?.finalAmount || liveBooking?.price || 0;

  return (
    <main className="relative z-10 pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto font-body-md">
      {/* Live Queue Status */}
      <section className="mb-xl">
        <div className="glass-card rounded-xl p-md md:p-xl flex flex-col md:flex-row items-center gap-xl border-t-2 border-secondary/30 shadow-2xl">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-sm mb-base text-secondary">
              <MdSchedule className="text-[20px]" />
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary shadow-neon-emerald">
                Live Queue Status
              </span>
            </div>
            
            <h1 className="font-display-lg text-display-lg mb-md text-white">
              {countdownText ? (
                <span className={countdownText.includes('ready') || countdownText.includes('Progress') ? 'text-primary drop-shadow-md' : 'text-secondary drop-shadow-md'}>
                  {countdownText}
                </span>
              ) : (
                <>Status: <span className="text-secondary capitalize drop-shadow-md">{liveBooking?.status || 'Pending'}</span></>
              )}
            </h1>
            
            <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden mb-base">
              <div
                className="h-full bg-secondary rounded-full relative shadow-neon-emerald transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 rounded-xl bg-surface-container-lowest/50 border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Salon</span>
                <span className="font-bold text-white flex items-center gap-1 text-sm"><MdStorefront className="text-primary"/> {salonName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Service</span>
                <span className="font-bold text-white flex items-center gap-1 text-sm"><MdContentCut className="text-primary"/> {serviceName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Total</span>
                <span className="font-bold text-white flex items-center gap-1 text-sm"><MdAttachMoney className="text-secondary"/> PKR {finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-white/10 pl-4">
                <span className="text-[10px] text-secondary uppercase tracking-widest">Token / Queue</span>
                <span className="font-display-lg text-secondary text-2xl leading-none">#{queuePosition || '--'}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-40 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <div className="flex items-center gap-md w-full md:w-auto bg-surface-container-low p-4 rounded-xl border border-white/5">
            <div className="relative">
              <img
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-secondary p-1 object-cover bg-surface-container shadow-neon-emerald"
                alt={stylistName}
                src={stylistImage}
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-secondary rounded-full border-2 border-surface animate-pulse" />
            </div>
            <div>
              <p className="text-on-surface-variant text-caption uppercase tracking-wider mb-xs">
                Assigned To
              </p>
              <p className="font-headline-md text-headline-md leading-tight text-white">{stylistName}</p>
              <p className="text-primary font-label-md text-label-md mt-xs italic">
                GlowCut Specialist
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Glow Entertainment (filler) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-lg text-headline-lg text-white">Quick Play Games</h2>
            <MdVideogameAsset className="text-primary-container text-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            {GAMES.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.title}
                  className="glass-card rounded-xl p-md group hover:bg-surface-container transition-all cursor-pointer border border-white/5"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform ${
                      game.color === 'secondary' ? 'bg-secondary/20' : 'bg-primary-container/20'
                    }`}
                  >
                    <Icon
                      className={`text-[28px] ${
                        game.color === 'secondary' ? 'text-secondary' : 'text-primary-container'
                      }`}
                    />
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-xs text-white">{game.title}</h3>
                  <p className="text-on-surface-variant text-caption mb-md leading-relaxed">{game.description}</p>
                  <button
                    onClick={() => toast('Mini-games coming soon!')}
                    className="w-full py-2 border border-white/10 rounded-lg font-label-md text-label-md hover:bg-white/10 transition-colors text-white"
                  >
                    Play Now
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-md glass-card rounded-xl p-md flex items-center justify-between opacity-60 cursor-not-allowed border border-white/5">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-white/5">
                <MdLeaderboard className="text-secondary" />
              </div>
              <div>
                <p className="font-label-md text-label-md text-white">Lounge Leaderboard</p>
                <p className="text-on-surface-variant text-caption">Coming soon</p>
              </div>
            </div>
            <MdChevronRight className="text-on-surface-variant" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-lg text-headline-lg text-white">Trending Styles</h2>
            <MdTrendingUp className="text-secondary text-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {Array.from({ length: 3 }).map((_, i) => {
              const video = VIDEOS[i % VIDEOS.length];
              return (
                <div
                  key={i}
                  className="relative group aspect-[9/16] rounded-xl overflow-hidden glass-card border border-white/10 cursor-pointer"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={video.title}
                    src={video.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  <div className="absolute bottom-0 p-sm w-full">
                    <p className="font-label-md text-label-md text-white line-clamp-2">
                      {video.title}
                    </p>
                    <div className="flex items-center gap-base mt-xs text-[10px] text-white/70">
                      <span className="flex items-center gap-xs">
                        <MdVisibility className="text-[12px]" /> {video.views}
                      </span>
                      <span className="flex items-center gap-xs">
                        <MdFavorite className="text-[12px]" /> {video.likes}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
