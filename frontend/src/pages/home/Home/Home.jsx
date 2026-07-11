import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdLocationOn,
  MdArrowForward,
  MdFace,
  MdBrush,
  MdStar,
  MdAccessTime,
  MdExpandMore,
  MdMyLocation,
} from 'react-icons/md';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import SalonCard from '../../../components/salon/SalonCard';
import { useSalonList } from '../../../hooks/useSalon';

/* ─── Area-based salon data ─────────────────────────────────────── */
const AREA_SALONS = {
  'Gulshan-e-Iqbal': [
    { id: 'gs-1', name: 'Royal Cuts Gulshan', rating: 4.8, address: 'Block 13-D, Gulshan-e-Iqbal', token: 14, waitMins: 15, pinX: 62, pinY: 38 },
    { id: 'gs-2', name: 'Urban Edge Studio', rating: 4.6, address: 'Block 6, University Road', token: 7, waitMins: 8, pinX: 48, pinY: 55 },
  ],
  Clifton: [
    { id: 'cl-1', name: 'Clifton Premium Salon', rating: 4.9, address: 'Block 5, Clifton', token: 3, waitMins: 5, pinX: 30, pinY: 65 },
    { id: 'cl-2', name: 'The Chrome Lounge', rating: 4.7, address: 'Khayaban-e-Iqbal, DHA', token: 21, waitMins: 22, pinX: 45, pinY: 72 },
  ],
  DHA: [
    { id: 'dha-1', name: 'Modern Cuts PECHS', rating: 4.8, address: 'Phase II, DHA', token: 9, waitMins: 12, pinX: 70, pinY: 60 },
    { id: 'dha-2', name: 'Blaze Barbershop DHA', rating: 4.5, address: 'Badar Commercial, DHA', token: 16, waitMins: 18, pinX: 80, pinY: 45 },
  ],
  'Gulistan-e-Johar': [
    { id: 'gj-1', name: 'Johar Cuts & Style', rating: 4.4, address: 'Johar Chowrangi', token: 2, waitMins: 3, pinX: 55, pinY: 25 },
  ],
  'North Nazimabad': [
    { id: 'nn-1', name: 'North Elite Barbers', rating: 4.6, address: 'Block L, North Nazimabad', token: 11, waitMins: 14, pinX: 35, pinY: 30 },
    { id: 'nn-2', name: 'Cyber Fade Studio', rating: 4.7, address: 'Block H, North Naz', token: 5, waitMins: 7, pinX: 22, pinY: 45 },
  ],
};
const AREAS = Object.keys(AREA_SALONS);

/** Glowing SVG dot-grid map with dynamic salon pins */
function SalonMapSVG({ salons, area }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Grid lines */}
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
        </g>
      ))}
      {/* Dot grid */}
      {[15,30,45,60,75].map(x => [15,30,45,60,75].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="rgba(255,255,255,0.15)" />
      )))}
      {/* Area label */}
      {area && (
        <text x="50" y="8" textAnchor="middle" fontSize="3.5" fill="rgba(255,181,156,0.6)" fontFamily="sans-serif">
          {area}
        </text>
      )}
      {/* Salon pins */}
      {salons.map((s, i) => (
        <g key={s.id}>
          {/* Glow ring */}
          <circle cx={s.pinX} cy={s.pinY} r="5" fill="rgba(255,95,31,0.1)" />
          {/* Pin dot */}
          <circle
            cx={s.pinX}
            cy={s.pinY}
            r="3"
            fill={i === 0 ? '#FF5F1F' : '#66DD8B'}
            style={{ filter: `drop-shadow(0 0 3px ${i === 0 ? '#FF5F1F' : '#66DD8B'})` }}
          />
          {/* Token badge */}
          <rect
            x={s.pinX - 6} y={s.pinY - 10}
            width="12" height="5"
            rx="2"
            fill="rgba(26,26,26,0.9)"
            stroke={i === 0 ? '#FF5F1F' : '#66DD8B'}
            strokeWidth="0.4"
          />
          <text
            x={s.pinX}
            y={s.pinY - 6.5}
            textAnchor="middle"
            fontSize="2.5"
            fill={i === 0 ? '#FF5F1F' : '#66DD8B'}
            fontFamily="sans-serif"
          >
            #{s.token}
          </text>
        </g>
      ))}
      {/* User pin */}
      {area && (
        <>
          <circle cx="50" cy="50" r="4" fill="rgba(102,221,139,0.15)" />
          <circle cx="50" cy="50" r="2" fill="#66DD8B" style={{ filter: 'drop-shadow(0 0 4px #66DD8B)' }} />
        </>
      )}
    </svg>
  );
}

const STYLISTS = [
  {
    id: 'stylist-alex',
    name: 'Alex Rivera',
    specialty: 'Precision Fades & Cyber Styles',
    available: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfEURGoBX6u2FxH0ViFpp6m9I4yUWWVROm4hxxd-RStmShbJSOc6i76hk9KXBCABbDfwUs83ITQ4t7ROIZA04CmXOPhMZe7VFGJwcK3nugKPqhF6tk5eDqactLzDxB-Iq1sjJjT1G6JoaT9T6GGEhNzWsvoEQ3XYml1xP1vWgrUGpufegj2M2X6dCyypK3aNWJC3Nuh980FvoSZ4ihtQywUP0H2atbZT4ncFoIdEpsoZBSY6HB6sqNRYG_qSpHfqDe9cOgmzJsWUU',
    span: 'tall',
  },
  {
    id: 'stylist-sarah',
    name: 'Sarah Chen',
    specialty: 'Advanced Neon Colorist',
    available: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOJYEj97tGGfjcBQ56_yp6CPxzV5CoddV_bju2C7fsrDwE9EolRUzGDYXVZyz8sdqQQsIdrv9gDCUbB8uURy8QOy-G-Vucukm2hEMQOjXtXKSTQcm5DuSuK1MyIBp2WuVrikB_ptlHau2108hufpJsMSBvkIO8La-5nb2PtoKBy7-IONEWyHtrYr_VlPQghigs0mGLcQghJCphXKQzdmuVPbrUXD7XCfOWLa_Nhbubooq7uKc7owc2UhKpM341H70pDkimC1ATycs',
    span: 'wide',
  },
  {
    id: 'stylist-marco',
    name: 'Marco Polo',
    specialty: 'Grooming Master',
    available: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRFTUXd8BHJ_8elWg88mSD1nBLauSSxe9FHBn9WSCffaoMpUuotdBeMVQuo2Al-_sBKFs__M-pysQgfQYWeWIuAi2oRA1RkCBR4GusgeL3Yu9MsUdYuVlo272BNaTNucZQBVuws9zJqfdiQ4EKE8j5Jiw00dPiIUhWBOKrNWepjBD1yjGih6sTXvdxNCtX_x4LJ73EJeUC2NDlIvfgf9wYA5qfrg2TJ32R8vqXg80d-c13fwFTmyS2Iu_eWz7uYwJ-J5KHSfK7gGk',
    span: 'normal',
  },
  {
    id: 'stylist-elena',
    name: 'Elena Vance',
    specialty: 'Avant-Garde Braider',
    available: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDveMX6Dm_8X0xz1P7clVK9YgPcVBbgUd24egKI1FcA8p_3sXht3oBWkj2GdQEjocF_DDRXyt17fmX6dhkUprO9CwSCDGwa1__v-Yp4ILO3XNvBP7iStzRjXBQ-upXkOKd9yE-yrxlJPrvcJVE-k89AG2mQH019pLpLZvbBwFnaL5u4S8dNLsFgoemss4Gfg-SWtiqvz9rl7FrDc6FCoyV-2F3teiArPRRVAW3xJwNCP8_H1868PDz2_rCaNh5NqAmwy3gi0yN13ZA',
    span: 'normal',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { salons, isLoading } = useSalonList();

  // Area finder state
  const [selectedArea, setSelectedArea] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreaSalons = useMemo(() => {
    if (!selectedArea) return [];
    return (AREA_SALONS[selectedArea] || []).filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedArea, searchQuery]);

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

            {/* SVG Map */}
            <div className="relative h-36 rounded-lg overflow-hidden border border-white/10 mb-md bg-surface-container-high">
              <SalonMapSVG salons={filteredAreaSalons} area={selectedArea} />
              {!selectedArea && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant gap-xs">
                  <MdLocationOn className="text-primary-container text-2xl" />
                  <p className="font-label-md text-label-md text-xs">Select an area to see pins</p>
                </div>
              )}
            </div>

            {/* Salon result cards */}
            {selectedArea && filteredAreaSalons.length === 0 && (
              <p className="text-center text-on-surface-variant text-sm py-sm">
                No salons found in {selectedArea}
              </p>
            )}
            {filteredAreaSalons.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-sm rounded-lg bg-white/5 border border-white/5 hover:border-primary-container/30 transition-all mb-xs"
              >
                <div className="flex-1">
                  <p className="font-label-md text-on-surface font-bold text-sm">{s.name}</p>
                  <p className="text-caption text-on-surface-variant flex items-center gap-xs">
                    <MdLocationOn className="text-xs" /> {s.address}
                  </p>
                  <p className="text-[11px] text-secondary mt-xs">
                    🎫 Active Token: #{s.token} &nbsp;·&nbsp; ⏱ Avg Wait: {s.waitMins} mins
                  </p>
                </div>
                <div className="flex flex-col items-end gap-xs ml-md">
                  <span className="flex items-center gap-xs text-secondary font-bold text-xs">
                    <MdStar className="text-xs" />{s.rating}
                  </span>
                  <button
                    onClick={() => navigate(`/salons/${s.id}`)}
                    className="text-[11px] px-sm py-xs bg-primary-container text-on-primary rounded-lg font-bold active:scale-95 transition-transform shadow-neon-orange-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
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
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-md h-[800px] md:h-[600px]">
          {STYLISTS.map((stylist) => (
            <div
              key={stylist.id}
              className={`glass-panel rounded-2xl overflow-hidden relative group ${
                stylist.span === 'tall'
                  ? 'md:col-span-2 md:row-span-2'
                  : stylist.span === 'wide'
                  ? 'md:col-span-2'
                  : ''
              }`}
            >
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                className={`absolute bottom-0 inset-x-0 p-md bg-gradient-to-t from-background to-transparent ${
                  stylist.span === 'tall' ? 'p-lg' : ''
                }`}
              >
                {stylist.available && (
                  <div className="flex items-center gap-xs mb-xs">
                    <div className="w-3 h-3 bg-secondary rounded-full" />
                    <span className="text-secondary font-label-md text-label-md">
                      Available Now
                    </span>
                  </div>
                )}
                <h3
                  className={`font-display-lg text-white ${
                    stylist.span === 'tall'
                      ? 'text-headline-lg'
                      : stylist.span === 'wide'
                      ? 'text-headline-md'
                      : 'text-label-md'
                  }`}
                >
                  {stylist.name}
                </h3>
                <p className="text-on-surface-variant font-body-md text-sm">
                  {stylist.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
