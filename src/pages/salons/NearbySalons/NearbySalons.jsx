import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdMyLocation,
  MdAdd,
  MdRemove,
  MdGridView,
  MdFormatListBulleted,
  MdLocationOn,
  MdExpandMore,
} from 'react-icons/md';
import Loader from '../../../components/ui/Loader';
import { useSalonList } from '../../../hooks/useSalon';

const AVAILABILITY_OPTIONS = ['Next 2 hours', 'Today', 'Tomorrow'];
const RATING_OPTIONS = ['Any Rating', '4.0+ Stars', '4.5+ Stars'];

export default function NearbySalons() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get('area') || '';

  const { salons, isLoading, search } = useSalonList();
  const [view, setView] = useState('list'); // 'grid' | 'list'
  const [availability, setAvailability] = useState('Next 2 hours');
  const [minRating, setMinRating] = useState('4.0+ Stars');

  React.useEffect(() => {
    if (initialArea) search(initialArea);
  }, [initialArea, search]);

  const filteredSalons = useMemo(() => {
    if (minRating === 'Any Rating') return salons;
    const threshold = parseFloat(minRating);
    return salons.filter((s) => s.rating >= threshold);
  }, [salons, minRating]);

  return (
    <>
      {/* Interactive Map Section */}
      <section className="relative h-[450px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover grayscale opacity-60"
            alt="Map of salons near PECHS, Karachi"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_iLKBN1_usPfjJgFVSsazCMUP89fE4aHeqjxJKwh82zN4ZUo_xI064OKS4oF8okDtgq7BxA1iGyOVUfDP6S0L5b3hklhpBRE21zs0xZx0oz_3J71RlrtoiCod3SXnWdltrEHPvUffv9YXPbH0_hlq8D6lmJdzuva4MU-Lr2GeFR46_huGhoBt1be4fiwWQqB10SZfDuSF9w_VsOc1L9j9RbtPi5PHsLPMMFWhX6uuFMxIYnwr4FDyDxphXzGczC7wBfH99o4iEjk"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-surface/40" />

          <div className="absolute top-1/2 left-1/3 group cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="bg-primary-container text-white text-xs font-bold px-2 py-1 rounded-md mb-1 shadow-neon-orange">
                4.8 ★
              </div>
              <div className="w-4 h-4 bg-primary-container rounded-full border-2 border-white shadow-neon-orange animate-pulse" />
            </div>
          </div>
          <div className="absolute top-1/4 right-1/4 group cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="bg-secondary-container text-white text-xs font-bold px-2 py-1 rounded-md mb-1 shadow-neon-emerald">
                4.6 ★
              </div>
              <div className="w-4 h-4 bg-secondary-container rounded-full border-2 border-white shadow-neon-emerald" />
            </div>
          </div>
          <div className="absolute bottom-1/3 right-1/2 group cursor-pointer">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white/20 shadow-lg animate-ping" />
            <div className="absolute inset-0 w-6 h-6 bg-blue-600 rounded-full border-2 border-white" />
          </div>
        </div>

        <div className="absolute bottom-10 left-margin-mobile md:left-margin-desktop z-10 flex flex-col gap-sm">
          <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-primary-container hover:bg-white/10 transition-all">
            <MdMyLocation className="text-xl" />
          </button>
          <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-on-surface hover:bg-white/10 transition-all">
            <MdAdd className="text-xl" />
          </button>
          <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-on-surface hover:bg-white/10 transition-all">
            <MdRemove className="text-xl" />
          </button>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-margin-mobile md:px-margin-desktop -mt-16 relative z-20">
        <div className="glass-panel p-md rounded-2xl flex flex-wrap items-center gap-md border-white/5 shadow-2xl">
          <div className="flex-1 min-w-[200px]">
            <p className="font-label-md text-label-md text-on-surface-variant mb-3">
              Price Range (PKR)
            </p>
            <div className="relative h-2 bg-white/10 rounded-full">
              <div className="absolute h-full w-2/3 bg-primary-container rounded-full left-0 shadow-neon-orange" />
              <div className="absolute top-1/2 -translate-y-1/2 left-2/3 w-4 h-4 bg-white rounded-full border-2 border-primary-container cursor-pointer shadow-md" />
            </div>
            <div className="flex justify-between mt-2 text-caption text-on-surface-variant">
              <span>500</span>
              <span>5000+</span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden lg:block" />

          <div className="min-w-[140px]">
            <p className="font-label-md text-label-md text-on-surface-variant mb-2">Rating</p>
            <div className="relative">
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full bg-surface-container-high border-none text-on-surface rounded-lg py-2 px-3 font-body-md focus:ring-1 focus:ring-primary-container appearance-none"
              >
                {RATING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <MdExpandMore className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden lg:block" />

          <div className="flex-grow">
            <p className="font-label-md text-label-md text-on-surface-variant mb-2">Availability</p>
            <div className="flex flex-wrap gap-xs">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAvailability(opt)}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md border transition-all ${
                    availability === opt
                      ? 'bg-secondary-container text-on-secondary-container border-secondary-container shadow-neon-emerald'
                      : 'bg-white/5 text-on-surface-variant border-white/10 hover:border-primary-container'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary-container">
              Salons Near {initialArea || 'PECHS'}
            </h2>
            <p className="text-on-surface-variant font-body-md">
              {filteredSalons.length} premium grooming spots found in your area
            </p>
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${
                view === 'grid'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'glass-panel text-primary-container'
              }`}
            >
              <MdGridView className="text-xl" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${
                view === 'list'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'glass-panel text-primary-container'
              }`}
            >
              <MdFormatListBulleted className="text-xl" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-xl">
            <Loader variant="spinner" className="text-primary-container w-8 h-8" />
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-lg' : 'space-y-lg'}>
            {filteredSalons.map((salon) => (
              <div
                key={salon.id}
                className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row border-white/10 group hover:border-primary-container/50 transition-all duration-500"
              >
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={salon.name}
                    src={salon.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20" />
                  {salon.isOpenNow && (
                    <div className="absolute top-4 left-4 bg-secondary-container/90 backdrop-blur-md text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Open Now
                    </div>
                  )}
                </div>

                <div className="md:w-2/3 p-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-base">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                          {salon.name}
                        </h3>
                        <p className="flex items-center gap-xs text-on-surface-variant font-body-md">
                          <MdLocationOn className="text-primary-container text-lg" /> {salon.area}
                        </p>
                      </div>
                      <div className="bg-secondary-container/20 border border-secondary-container p-2 rounded-xl text-center">
                        <div className="text-secondary font-bold text-headline-md leading-tight">
                          {salon.rating}
                        </div>
                        <div className="text-[10px] text-secondary uppercase tracking-widest font-bold">
                          Rating
                        </div>
                      </div>
                    </div>

                    {salon.stylists && (
                      <div className="mt-lg">
                        <h4 className="font-label-md text-label-md text-primary-container uppercase tracking-wider mb-md">
                          Top Stylists Available Today
                        </h4>
                        <div className="flex flex-wrap gap-md">
                          {salon.stylists.map((stylist) => (
                            <div
                              key={stylist.id}
                              className="flex items-center gap-sm bg-white/5 p-2 pr-4 rounded-full border border-white/5 hover:border-secondary transition-all cursor-pointer"
                            >
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-secondary flex items-center justify-center text-xs font-bold text-secondary">
                                  {stylist.name[0]}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface" />
                              </div>
                              <div>
                                <p className="text-on-surface font-bold text-xs">{stylist.name}</p>
                                <p className="text-secondary text-[10px] font-medium">
                                  {stylist.nextSlot}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-lg pt-lg border-t border-white/5">
                    <div className="flex gap-lg">
                      <div className="flex flex-col">
                        <span className="text-caption text-on-surface-variant">
                          Haircut starts at
                        </span>
                        <span className="text-on-surface font-bold text-lg">
                          PKR {salon.startingPrice || 1500}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-caption text-on-surface-variant">Distance</span>
                        <span className="text-on-surface font-bold text-lg">
                          {salon.distanceKm} km
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/salons/${salon.id}`)}
                      className="bg-secondary-container text-on-secondary-container font-headline-md text-label-md px-xl py-4 rounded-xl font-extrabold active:scale-95 transition-all shadow-neon-emerald uppercase tracking-tighter"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
