import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdLocationOn,
  MdArrowForward,
  MdStar,
  MdExpandMore,
  MdMyLocation,
  MdGroup,
  MdFace,
  MdBrush,
} from 'react-icons/md';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import SalonCard from '../../../components/salon/SalonCard';
import EmptyState from '../../../components/ui/EmptyState';
import { useSalonList } from '../../../hooks/useSalon';
import * as salonService from '../../../services/salonService';

/**
 * Minimal decorative SVG backdrop for the salon-finder card. The old version
 * plotted fake per-salon "queue token" and "wait time" numbers at fabricated
 * pixel coordinates — none of that exists in the Salon model, so this is now
 * pure background texture with no fabricated data points on it.
 */
function MapBackdropSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ background: 'rgba(255,255,255,0.02)' }}>
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
        </g>
      ))}
      {[15, 30, 45, 60, 75].map((x) => [15, 30, 45, 60, 75].map((y) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="rgba(255,255,255,0.15)" />
      )))}
      <circle cx="50" cy="50" r="4" fill="rgba(102,221,139,0.15)" />
      <circle cx="50" cy="50" r="2" fill="#66DD8B" style={{ filter: 'drop-shadow(0 0 4px #66DD8B)' }} />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { salons, isLoading } = useSalonList();

  // Area finder state — areas are derived from the real salons we already
  // have loaded (their actual `address.area`), not a hardcoded list.
  const [selectedArea, setSelectedArea] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const AREAS = useMemo(() => {
    const set = new Set();
    salons.forEach((s) => {
      if (s.address?.area) set.add(s.address.area);
    });
    return Array.from(set);
  }, [salons]);

  const filteredAreaSalons = useMemo(() => {
    if (!selectedArea) return [];
    return salons
      .filter((s) => s.address?.area === selectedArea)
      .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [salons, selectedArea, searchQuery]);

  // Real, currently-available stylists across all partner salons.
  const [stylists, setStylists] = useState([]);
  const [loadingStylists, setLoadingStylists] = useState(true);
  useEffect(() => {
    salonService
      .getAvailableBarbers()
      .then((list) => setStylists(Array.isArray(list) ? list.slice(0, 4) : []))
      .catch(() => setStylists([]))
      .finally(() => setLoadingStylists(false));
  }, []);

  return (
    <>
      {/* Hero Section with Map Integration */}
      <section className="relative min-h-[870px] flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img
            alt="GlowCut Hero"
            className="w-full h-full object-cover grayscale-[20%]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhI_rdD-1rEadDmK0wGpCvLN23wW_J7UfHjVkIZs-puc1-CdiCsc2TcICgOgvF-_TsOBTZCU325mgE0ecYn6jbUt7dxLaOOuTM-OAMWRnnxW6TEG5LXvE8h6HMdo2vRoEmjwZ3A76_5yca49U3OQUphy2H43VsN7g_lPUtIEYFk5QhPOCggZjhUCqpHFrGO4uhfJ2iniAZZlawT2V4CfkvVK5LDYjf_GG9Wba0cBmmyrGWty0WfXtPLvZa-cy84Ma6CbNHvu-od4g"
          />
        </div>

        <div className="relative z-20 max-w-2xl">
          <span className="text-secondary font-label-md text-label-md tracking-widest uppercase mb-base block">
            Precision Grooming
          </span>
          <h1 className="font-display-lg text-display-lg mb-md leading-tight text-white">
            Redefining the <span className="text-primary-container">Future</span> of Style
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-lg">
            Enter the elite circle of modern grooming. AI-powered consultations, master
            stylists, and a cyber-chic atmosphere await.
          </p>

          {/* ── Interactive Salon Finder ── */}
          <Card edgeLight className="p-md max-w-lg w-full">
            <div className="flex items-center gap-sm mb-md">
              <MdMyLocation className="text-primary-container text-xl" />
              <h3 className="font-headline-md text-headline-md">Find Nearest Salon</h3>
            </div>

            {/* Area Dropdown */}
            <div className="relative mb-sm">
              <select
                value={selectedArea}
                onChange={(e) => { setSelectedArea(e.target.value); setSearchQuery(''); }}
                className="w-full bg-white/5 border border-primary-container/40 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container appearance-none cursor-pointer"
              >
                <option value="" className="bg-surface">Select an area in Karachi…</option>
                {AREAS.map((a) => (
                  <option key={a} value={a} className="bg-surface">{a}</option>
                ))}
              </select>
              <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-container pointer-events-none" />
            </div>

            {/* Search within area */}
            {selectedArea && (
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border-0 border-b border-primary-container/40 focus:ring-0 focus:border-primary-container text-white placeholder-white/30 font-body-md px-2 py-2 mb-md"
                placeholder={`Search salons in ${selectedArea}…`}
              />
            )}

            {/* Decorative map backdrop (no fabricated per-salon pins) */}
            <div className="relative h-24 rounded-lg overflow-hidden border border-white/10 mb-md bg-surface-container-high">
              <MapBackdropSVG />
              {!selectedArea && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant gap-xs">
                  <MdLocationOn className="text-primary-container text-2xl" />
                  <p className="font-label-md text-label-md text-xs">Select an area to see salons</p>
                </div>
              )}
              {selectedArea && (
                <div className="absolute inset-0 flex items-center justify-center text-secondary font-label-md text-sm bg-background/40">
                  {selectedArea}
                </div>
              )}
            </div>

            {/* Salon result cards */}
            {selectedArea && filteredAreaSalons.length === 0 && (
              <p className="text-center text-on-surface-variant text-sm py-sm">
                No salons found in {selectedArea}
              </p>
            )}
            {filteredAreaSalons.map((s) => {
              const salonId = s._id || s.id;
              const areaLabel = [s.address?.area, s.address?.city].filter(Boolean).join(', ');
              return (
              <div
                key={salonId}
                className="flex items-center justify-between p-sm rounded-lg bg-white/5 border border-white/5 hover:border-primary-container/30 transition-all mb-xs"
              >
                <div className="flex-1">
                  <p className="font-label-md text-on-surface font-bold text-sm">{s.name}</p>
                  <p className="text-caption text-on-surface-variant flex items-center gap-xs">
                    <MdLocationOn className="text-xs" /> {areaLabel}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-xs ml-md">
                  <span className="flex items-center gap-xs text-secondary font-bold text-xs">
                    <MdStar className="text-xs" />{(s.averageRating ?? 0).toFixed?.(1) ?? s.averageRating}
                  </span>
                  <button
                    onClick={() => navigate(`/salons/${salonId}`)}
                    className="text-[11px] px-sm py-xs bg-primary-container text-on-primary rounded-lg font-bold active:scale-95 transition-transform shadow-neon-orange-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );})}
          </Card>
        </div>
      </section>

      {/* Top-Rated Salons */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-xs">
              Top-Rated Salons in <span className="text-secondary">Karachi</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Handpicked destinations for premium grooming.
            </p>
          </div>
          <Button
            variant="text"
            size="sm"
            icon={MdArrowForward}
            iconPosition="right"
            onClick={() => navigate('/salons/nearby')}
            className="!px-0 !py-0"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 rounded-xl glass-panel animate-pulse" />
              ))
            : salons.slice(0, 3).map((salon) => <SalonCard key={salon.id} salon={salon} />)}
        </div>
      </section>

      {/* AI Style Suggestion */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="relative glass-panel rounded-3xl p-lg md:p-xl flex flex-col md:flex-row items-center gap-xl border-white/5 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-secondary/40 to-transparent blur-sm" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-secondary shadow-[0_0_10px_#66dd8b]" />
          </div>

          <div className="relative z-10 w-full md:w-1/2">
            <span className="bg-secondary/10 text-secondary border border-secondary/20 px-sm py-1 rounded-full font-label-md text-label-md inline-block mb-md">
              New AI Feature
            </span>
            <h2 className="font-headline-lg text-headline-lg mb-md text-white">
              Find Your Perfect Look with <span className="text-secondary">AI Analysis</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Our advanced AI-stylist scans your facial structure to recommend the trendiest
              haircuts and colors tailored specifically for you.
            </p>
            <Button variant="secondary" size="lg" onClick={() => navigate('/ai/style-consultant')}>
              Try Now
            </Button>
          </div>

          <div className="relative z-10 w-full md:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl opacity-50" />
              <img
                alt="AI Style Scan"
                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-full border-4 border-secondary/30 relative z-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7j4IQ_4nokO-YnnMoIu6CAZL9efSrHe-aoZRGYrov3sqgma3zJm6GX_v1IQHX87fa-MrdX3YJcWQKvZAf_GV0jrn8CVLN-3dXyFHCXab9EHGfDd2WTd_LVZMcBO3xfB7V1_ey4eOhTwGjgXhLs63ssYUesx_Srkcw6yNKTx2ugbv4Zcjhu3wkkupwq563OM02UFKYbmh-pCg7Yd5IRGU-ZFQ-TeDG2p_eKLUgt_ZUEAHQpVupfVuWXB9JDpNcoDdFLy4vqm4-XvU"
              />
              <div className="absolute top-0 -right-8 glass-panel p-md rounded-full shadow-neon-orange border-primary-container/40 animate-bounce">
                <MdFace className="text-primary-container text-3xl" />
              </div>
              <div className="absolute bottom-8 -left-8 glass-panel p-md rounded-full shadow-neon-emerald border-secondary/40 animate-pulse">
                <MdBrush className="text-secondary text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Stylists */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg mb-xl text-center">
          Meet the <span className="text-primary-container">Master Stylists</span>
        </h2>
        {loadingStylists ? (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-md h-[800px] md:h-[600px]">
            {[1, 2, 3, 4].map((n) => <div key={n} className="glass-panel rounded-2xl animate-pulse" />)}
          </div>
        ) : stylists.length === 0 ? (
          <EmptyState
            icon={MdGroup}
            title="No stylists available right now"
            description="Check back soon — salons update stylist availability throughout the day."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-md h-[800px] md:h-[600px]">
            {stylists.map((stylist, i) => {
              const span = i === 0 ? 'tall' : i === 1 ? 'wide' : 'normal';
              return (
                <div
                  key={stylist._id}
                  className={`glass-panel rounded-2xl overflow-hidden relative group ${
                    span === 'tall' ? 'md:col-span-2 md:row-span-2' : span === 'wide' ? 'md:col-span-2' : ''
                  }`}
                >
                  <img
                    src={stylist.profileImage || 'https://via.placeholder.com/400x400?text=?'}
                    alt={stylist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className={`absolute bottom-0 inset-x-0 p-md bg-gradient-to-t from-background to-transparent ${
                      span === 'tall' ? 'p-lg' : ''
                    }`}
                  >
                    {stylist.isAvailable && (
                      <div className="flex items-center gap-xs mb-xs">
                        <div className="w-3 h-3 bg-secondary rounded-full" />
                        <span className="text-secondary font-label-md text-label-md">
                          Available Now
                        </span>
                      </div>
                    )}
                    <h3
                      className={`font-display-lg text-white ${
                        span === 'tall' ? 'text-headline-lg' : span === 'wide' ? 'text-headline-md' : 'text-label-md'
                      }`}
                    >
                      {stylist.name}
                    </h3>
                    <p className="text-on-surface-variant font-body-md text-sm">
                      {stylist.experience ? `${stylist.experience} yrs experience` : 'GlowCut Specialist'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
