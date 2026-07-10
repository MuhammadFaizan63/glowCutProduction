import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'react-icons/md';

const TOTAL_WAIT_SECONDS = 12 * 60;

const VIDEOS = [
  {
    title: 'Classic Fade Tutorial',
    views: '12.4K',
    likes: 892,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHghyCHZ8Mgjf-31cDlTgDu4Sd2pf7yDtBYS22C-P0eZsofUEoU177c4OdhLTd1KrQCdDywUSS32hTTlTLg7udD8NIaGkMOlvtkL7yMm9Wusl1e9CYmziljMZfRd68mjVHCqcchpUOIEjK-4XU6y7yV0xFc9obALf1uRUFo2syowoSaXlU8ez9BxjHBszG6lIofXkNq5BhclkcpwMY9LNN1gWgm09UHu_Y5Psn86k54j-47Q3Rod5DjHqCv6B8I3klGSK2Y5mC9lA',
  },
];

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

export default function WaitingLounge() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_WAIT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      toast.success("It's your turn! Heading to live tracking...");
      const timeout = setTimeout(() => navigate('/booking/live-tracking'), 1500);
      return () => clearTimeout(timeout);
    }
  }, [secondsLeft, navigate]);

  const minutesLeft = Math.ceil(secondsLeft / 60);
  const progressPercent = Math.max(
    5,
    100 - (secondsLeft / TOTAL_WAIT_SECONDS) * 100
  );

  return (
    <main className="relative z-10 pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
      {/* Live Queue Status */}
      <section className="mb-xl">
        <div className="glass-card rounded-xl p-md md:p-xl flex flex-col md:flex-row items-center gap-xl">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-sm mb-base text-secondary">
              <MdSchedule className="text-[20px]" />
              <span className="font-label-md text-label-md uppercase tracking-widest">
                Live Queue Status
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg mb-md">
              Your Turn in: <span className="text-secondary">{minutesLeft} Minutes</span>
            </h1>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-base">
              <div
                className="h-full bg-secondary-container rounded-full relative shadow-neon-emerald transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <p className="font-body-md text-body-md flex items-center gap-xs">
                Current Stylist: <span className="text-on-surface font-bold">Usman K.</span>
              </p>
              <span className="text-caption font-caption opacity-60">
                Estimated:{' '}
                {new Date(Date.now() + secondsLeft * 1000).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="hidden lg:block w-px h-32 bg-white/10" />

          <div className="flex items-center gap-md">
            <div className="relative">
              <img
                className="w-24 h-24 rounded-full border-2 border-secondary-container p-1 object-cover"
                alt="Usman K."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqWA6m7hqOVa_6jq3WSfuJN00Gwoi20ycefl1zkQ7754x7WD-vlib_vVp-TvO_VA2jdLVLYAbTy6O3-C8sVKVozUzcB78VFXHIBMpgJkYjB3WMoRgrv6BIDIuimgBnodVu0vl1oaCENe0uAVdjL92tCPQaMEq-_m0o1Tg-x327MUlMfsYuNO7PuGgBwHDlXiKVE5yu8XFOhzQgWlnsdsNhy9bOuRMp2Y-2iilKAap6YN2e7nS9auLlsdGibrT0LBkVO7VAkWNUbSM"
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-secondary-container rounded-full border-2 border-surface" />
            </div>
            <div>
              <p className="text-on-surface-variant text-caption uppercase tracking-wider mb-xs">
                Next Up
              </p>
              <p className="font-headline-md text-headline-md leading-none">Usman K.</p>
              <p className="text-secondary font-label-md text-label-md mt-xs italic">
                Master Stylist
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Glow Entertainment */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Quick Play Games */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-lg text-headline-lg">Quick Play Games</h2>
            <MdVideogameAsset className="text-primary-container text-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            {GAMES.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.title}
                  className="glass-card rounded-xl p-md group hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform ${
                      game.color === 'secondary' ? 'bg-secondary-container/20' : 'bg-primary-container/20'
                    }`}
                  >
                    <Icon
                      className={`text-[28px] ${
                        game.color === 'secondary' ? 'text-secondary' : 'text-primary-container'
                      }`}
                    />
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-xs">{game.title}</h3>
                  <p className="text-on-surface-variant text-caption mb-md">{game.description}</p>
                  <button
                    onClick={() => toast('Mini-games coming soon!')}
                    className="w-full py-xs border border-white/20 rounded-lg font-label-md text-label-md hover:bg-white/10 transition-colors"
                  >
                    Play Now
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-md glass-card rounded-xl p-md flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-white/5">
                <MdLeaderboard className="text-secondary" />
              </div>
              <div>
                <p className="font-label-md text-label-md">Current Rank</p>
                <p className="text-on-surface-variant text-caption">#12 in the Lounge</p>
              </div>
            </div>
            <MdChevronRight className="text-on-surface-variant" />
          </div>
        </div>

        {/* Trending Styles */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-lg text-headline-lg">Trending Styles</h2>
            <MdTrendingUp className="text-secondary text-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {Array.from({ length: 3 }).map((_, i) => {
              const video = VIDEOS[i % VIDEOS.length];
              return (
                <div
                  key={i}
                  className="relative group aspect-[9/16] rounded-xl overflow-hidden glass-card border-0 cursor-pointer"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={video.title}
                    src={video.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
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
