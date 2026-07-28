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
  MdContentCut,
  MdSmartToy,
  MdVerified,
  MdSchedule,
  MdMonetizationOn,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import SalonCard from '../../../components/salon/SalonCard';
import EmptyState from '../../../components/ui/EmptyState';
import { useSalonList } from '../../../hooks/useSalon';
import * as salonService from '../../../services/salonService';

const FEATURES = [
  {
    icon: MdSmartToy,
    title: 'AI Style Analysis',
    description: 'Facial recognition & AI-driven cuts tailored to your bone structure.',
  },
  {
    icon: MdVerified,
    title: 'Premium Partners',
    description: 'Only the finest salons with verified master stylists make the cut.',
  },
  {
    icon: MdSchedule,
    title: 'Smart Queue',
    description: 'Real-time queue tracking so you never waste a minute waiting.',
  },
  {
    icon: MdMonetizationOn,
    title: 'Glow Rewards',
    description: 'Earn points on every visit and unlock exclusive premium perks.',
  },
];

const SERVICE_CATEGORIES = [
  { icon: MdContentCut, label: 'Haircuts', desc: 'Precision fades, tapers & classic cuts' },
  { icon: MdFace, label: 'Beard Grooming', desc: 'Straight-razor shaping & hot-towel finish' },
  { icon: MdBrush, label: 'Styling', desc: 'Pompadours, quiffs & textured looks' },
  { icon: MdSmartToy, label: 'AI Consult', desc: 'Facial scan matched to trending styles' },
];

const SVG_DECORATIVE = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ background: 'rgba(124,140,61,0.03)' }}>
    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
      <g key={v}>
        <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(124,140,61,0.06)" strokeWidth="0.3" />
        <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(124,140,61,0.06)" strokeWidth="0.3" />
      </g>
    ))}
    {[15, 30, 45, 60, 75].map((x) => [15, 30, 45, 60, 75].map((y) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="rgba(124,140,61,0.15)" />
    )))}
    <circle cx="50" cy="50" r="4" fill="rgba(124,140,61,0.2)" />
    <circle cx="50" cy="50" r="2" fill="#7C8C3D" style={{ filter: 'drop-shadow(0 0 4px #7C8C3D)' }} />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const navigate = useNavigate();
  const { salons, isLoading } = useSalonList();

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Hero */}
      <section className="relative min-h-[900px] flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-10" />
          <img
            alt="GlowCut Hero"
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.35]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhI_rdD-1rEadDmK0wGpCvLN23wW_J7UfHjVkIZs-puc1-CdiCsc2TcICgOgvF-_TsOBTZCU325mgE0ecYn6jbUt7dxLaOOuTM-OAMWRnnxW6TEG5LXvE8h6HMdo2vRoEmjwZ3A76_5yca49U3OQUphy2H43VsN7g_lPUtIEYFk5QhPOCggZjhUCqpHFrGO4uhfJ2iniAZZlawT2V4CfkvVK5LDYjf_GG9Wba0cBmmyrGWty0WfXtPLvZa-cy84Ma6CbNHvu-od4g"
          />
        </div>

        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
          {/* Left: branding + service categories */}
          <motion.div className="lg:col-span-7 space-y-lg" variants={itemVariants}>
            <span className="text-primary font-label-md text-label-md tracking-[0.2em] uppercase block">
              Precision Grooming — Karachi
            </span>
            <h1 className="font-display-lg text-display-lg md:text-[56px] md:leading-[64px] leading-tight text-on-surface">
              Your Style,{' '}
              <span className="text-primary">Perfected</span>
              <br />
              by Experts
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              AI-powered consultations, master barbers, and premium grooming products — 
              all in one place. Book your session in seconds.
            </p>

            {/* Quick Stats */}
            <div className="flex gap-xl flex-wrap">
              {[
                { value: '50+', label: 'Partner Salons' },
                { value: '200+', label: 'Expert Stylists' },
                { value: '15K+', label: 'Happy Clients' },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-display-lg text-display-lg text-primary">{stat.value}</span>
                  <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Service Category Pills */}
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">
                Browse Services
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                {SERVICE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <motion.button
                      key={cat.label}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/services')}
                      className="flex flex-col items-center gap-sm p-md rounded-xl bg-surface-container/50 backdrop-blur-sm border border-white/5 hover:border-primary/40 transition-all hover:bg-primary/5 text-center"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <Icon className="text-primary text-xl" />
                      </div>
                      <span className="font-label-md text-label-md text-on-surface">{cat.label}</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight">{cat.desc}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-sm flex-wrap">
              <button
                onClick={() => navigate('/salons/nearby')}
                className="px-xl py-md bg-primary text-on-primary rounded-xl font-bold text-sm shadow-warm hover:brightness-110 active:scale-95 transition-all"
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate('/ai/style-consultant')}
                className="px-xl py-md border border-primary/40 text-primary rounded-xl font-bold text-sm hover:bg-primary/10 active:scale-95 transition-all"
              >
                AI Style Analysis
              </button>
            </div>
          </motion.div>

          {/* Right: find-salon card */}
          <motion.div className="lg:col-span-5 lg:pt-lg" variants={itemVariants}>
            <Card variant="elevated" className="p-md w-full border-primary/10">
              <div className="flex items-center gap-sm mb-md">
                <MdMyLocation className="text-primary text-xl" />
                <h3 className="font-headline-md text-headline-md text-on-surface">Find Nearest Salon</h3>
              </div>

              <div className="relative mb-sm">
                <select
                  value={selectedArea}
                  onChange={(e) => { setSelectedArea(e.target.value); setSearchQuery(''); }}
                  className="w-full bg-surface-container border border-primary/30 rounded-xl px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface">Select an area in Karachi…</option>
                  {AREAS.map((a) => (
                    <option key={a} value={a} className="bg-surface">{a}</option>
                  ))}
                </select>
                <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
              </div>

              {selectedArea && (
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container border-0 border-b border-primary/30 focus:ring-0 focus:border-primary text-on-surface placeholder-on-surface-variant/40 font-body-md px-2 py-2 mb-md"
                  placeholder={`Search salons in ${selectedArea}…`}
                />
              )}

              <div className="relative h-28 rounded-xl overflow-hidden border border-primary/20 mb-md bg-surface-container-high">
                <SVG_DECORATIVE />
                {!selectedArea ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant gap-xs">
                    <MdLocationOn className="text-primary text-2xl" />
                    <p className="font-label-md text-label-md text-xs">Select an area to see salons</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary font-label-md text-sm bg-background/40">
                    <MdLocationOn className="mr-1" /> {selectedArea}
                  </div>
                )}
              </div>

              {selectedArea && filteredAreaSalons.length === 0 && (
                <p className="text-center text-on-surface-variant text-sm py-sm">
                  No salons found in {selectedArea}
                </p>
              )}
              {filteredAreaSalons.map((s) => {
                const salonId = s._id || s.id;
                const areaLabel = [s.address?.area, s.address?.city].filter(Boolean).join(', ');
                return (
                <motion.div
                  key={salonId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-sm rounded-xl bg-surface-container border border-white/5 hover:border-primary/30 transition-all mb-xs"
                >
                  <div className="flex-1">
                    <p className="font-label-md text-on-surface font-bold text-sm">{s.name}</p>
                    <p className="text-caption text-on-surface-variant flex items-center gap-xs">
                      <MdLocationOn className="text-xs" /> {areaLabel}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-xs ml-md">
                    <span className="flex items-center gap-xs text-primary font-bold text-xs">
                      <MdStar className="text-xs" />{(s.averageRating ?? 0).toFixed?.(1) ?? s.averageRating}
                    </span>
                    <button
                      onClick={() => navigate(`/salons/${salonId}`)}
                      className="text-[11px] px-sm py-xs bg-primary text-on-primary rounded-xl font-bold active:scale-95 transition-transform shadow-warm-sm"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );})}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop">
        <motion.div variants={itemVariants} className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg mb-xs text-on-surface">
            Why <span className="text-primary">GlowCut</span>
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
            The future of grooming, crafted for the modern gentleman.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} variant="filled" hoverable className="p-md">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-md">
                  <Icon className="text-primary text-2xl" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{f.title}</h3>
                <p className="text-on-surface-variant font-body-md text-sm">{f.description}</p>
              </Card>
            );
          })}
        </motion.div>
      </section>

      {/* Top-Rated Salons */}
      <motion.section variants={itemVariants} className="py-xl px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-xs text-on-surface">
              Top-Rated Salons in <span className="text-primary">Karachi</span>
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
                <div key={i} className="h-80 rounded-xl bg-surface-container animate-pulse" />
              ))
            : salons.slice(0, 3).map((salon) => <SalonCard key={salon.id} salon={salon} />)}
        </div>
      </motion.section>

      {/* AI Style Suggestion */}
      <motion.section variants={itemVariants} className="py-xl px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="relative rounded-3xl p-lg md:p-xl flex flex-col md:flex-row items-center gap-xl border border-primary/20 bg-gradient-to-br from-surface-container to-surface overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary shadow-warm-sm" />
          </div>

          <div className="relative z-10 w-full md:w-1/2">
            <span className="bg-primary/15 text-primary border border-primary/30 px-sm py-1 rounded-full font-label-md text-label-md inline-block mb-md">
              New AI Feature
            </span>
            <h2 className="font-headline-lg text-headline-lg mb-md text-on-surface">
              Find Your Perfect Look with <span className="text-primary">AI Analysis</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Our advanced AI-stylist scans your facial structure to recommend the trendiest
              haircuts and colors tailored specifically for you.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/ai/style-consultant')}>
              Try Now
            </Button>
          </div>

          <div className="relative z-10 w-full md:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-50" />
              <img
                alt="AI Style Scan"
                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-full border-4 border-primary/30 relative z-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7j4IQ_4nokO-YnnMoIu6CAZL9efSrHe-aoZRGYrov3sqgma3zJm6GX_v1IQHX87fa-MrdX3YJcWQKvZAf_GV0jrn8CVLN-3dXyFHCXab9EHGfDd2WTd_LVZMcBO3xfB7V1_ey4eOhTwGjgXhLs63ssYUesx_Srkcw6yNKTx2ugbv4Zcjhu3wkkupwq563OM02UFKYbmh-pCg7Yd5IRGU-ZFQ-TeDG2p_eKLUgt_ZUEAHQpVupfVuWXB9JDpNcoDdFLy4vqm4-XvU"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 -right-8 bg-surface-container border border-primary/30 p-md rounded-full shadow-warm"
              >
                <MdFace className="text-primary text-3xl" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 -left-8 bg-surface-container border border-primary/30 p-md rounded-full shadow-warm"
              >
                <MdBrush className="text-primary text-3xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Master Stylists — Bento */}
      <motion.section variants={itemVariants} className="py-xl px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-xl">
          <span className="text-primary font-label-md text-label-md tracking-[0.2em] uppercase mb-base block">
            Our Talent
          </span>
          <h2 className="font-display-lg text-display-lg mb-xs text-on-surface">
            Meet Our <span className="text-primary">Stylists</span>
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
            A collective of master barbers, colorists, and grooming specialists across Karachi's finest salons.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-md h-auto md:h-[700px]">
          {[
            { name: 'Ahmed R.', spec: 'Fade Master', img: 12, span: 'md:col-span-2 md:row-span-2' },
            { name: 'Bilal K.', spec: 'Beard Art.', img: 25, span: '' },
            { name: 'Zayan M.', spec: 'Color Pro', img: 33, span: '' },
            { name: 'Hamza S.', spec: 'Classic Cut', img: 42, span: 'md:col-span-2' },
            { name: 'Usman A.', spec: 'Scalp Spec.', img: 18, span: '' },
            { name: 'Faizan T.', spec: 'Design Exp.', img: 54, span: 'md:col-span-2 md:row-span-2' },
            { name: 'Rayan C.', spec: 'Texture Pro', img: 7, span: '' },
            { name: 'Taha H.', spec: 'Precision', img: 39, span: '' },
            { name: 'Ibrahim Q.', spec: 'Grooming', img: 61, span: '' },
            { name: 'Ayaan P.', spec: 'Style Icon', img: 15, span: '' },
          ].map((st, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl overflow-hidden relative group bg-surface-container border border-white/5 ${st.span}`}
            >
              <img
                src={`https://i.pravatar.cc/400?img=${st.img}`}
                alt={st.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-primary rounded-full shadow-warm-sm" />
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Available</span>
                </div>
                <h3 className="font-display-lg text-headline-md text-on-surface">{st.name}</h3>
                <p className="text-on-surface-variant text-sm">{st.spec}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-xl">
          <button
            onClick={() => navigate('/stylists')}
            className="px-xl py-md bg-primary text-on-primary rounded-xl font-bold shadow-warm hover:brightness-110 active:scale-95 transition-all flex items-center gap-sm"
          >
            View All Stylists <MdArrowForward />
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
