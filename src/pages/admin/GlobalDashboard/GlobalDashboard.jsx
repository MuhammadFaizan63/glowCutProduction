import React from 'react';
import {
  MdPersonAdd,
  MdStorefront,
  MdAccountBalanceWallet,
  MdPsychology,
  MdAdd,
  MdRemove,
  MdMyLocation,
  MdVerifiedUser,
  MdEventAvailable,
  MdWarning,
  MdUpdate,
  MdStar,
} from 'react-icons/md';

const METRICS = [
  {
    label: 'Total Active Users',
    value: '124.8k',
    icon: MdPersonAdd,
    color: 'primary',
    progress: 78,
    delta: '+12.5%',
    footnote: 'Global expansion trending up',
  },
  {
    label: 'Partner Saloons',
    value: '842',
    icon: MdStorefront,
    color: 'secondary',
    bars: [4, 6, 3, 8, 5, 7, 10],
    footnote: 'Karachi Metro Density Focus',
  },
  {
    label: 'Monthly Revenue',
    value: '9.2M',
    unit: 'PKR',
    icon: MdAccountBalanceWallet,
    color: 'primary',
    gradientBar: true,
    footnote: 'Record high this fiscal quarter',
  },
  {
    label: 'AI Feature Usage',
    value: '64%',
    icon: MdPsychology,
    color: 'secondary',
    ring: true,
    footnote: 'Predictive booking optimization',
  },
];

const ACTIVITY_LOG = [
  {
    icon: MdVerifiedUser,
    color: 'secondary',
    title: 'New Saloon Registered: ',
    highlight: 'Style Studio',
    subtitle: 'License verification complete • Clifton Branch',
    time: '2 mins ago',
    live: true,
  },
  {
    icon: MdEventAvailable,
    color: 'primary',
    title: 'Booking Confirmed: ',
    highlight: 'Faizan at Modern Cuts',
    subtitle: 'Service: Premium Fade + Beard Trim',
    time: '5 mins ago',
  },
  {
    icon: MdWarning,
    color: 'tertiary',
    title: 'Failed Transaction: User ID #99281',
    subtitle: 'Gateway response: Insufficient funds (Standard Chartered)',
    time: '14 mins ago',
    action: 'RESOLVE',
  },
  {
    icon: MdUpdate,
    color: 'secondary',
    title: 'System Update Deployed: v4.2.1-stable',
    subtitle: 'Improved latency for Karachi North servers',
    time: '45 mins ago',
  },
];

const TOP_PARTNERS = [
  { name: 'Urban Groomers', rating: 4.9, reviews: '1.2k' },
  { name: 'Modern Cuts PECHS', rating: 4.8, reviews: '980' },
  { name: 'The Chrome Lounge', rating: 4.7, reviews: '760' },
];

export default function GlobalDashboard() {
  return (
    <>
      {/* Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          const isSecondary = metric.color === 'secondary';
          return (
            <div
              key={metric.label}
              className="glass-panel p-md rounded-xl space-y-md relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 ${
                  isSecondary ? 'bg-secondary/10' : 'bg-primary/10'
                }`}
              />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-caption text-on-surface-variant uppercase tracking-widest">
                    {metric.label}
                  </p>
                  <h3
                    className={`font-display-lg text-headline-lg ${
                      isSecondary && !metric.ring ? 'text-secondary' : 'text-on-surface'
                    }`}
                  >
                    {metric.value} {metric.unit && <span className="text-caption">{metric.unit}</span>}
                  </h3>
                </div>
                <Icon
                  className={`p-1 rounded-lg text-xl ${
                    isSecondary ? 'text-secondary bg-secondary/10' : 'text-primary bg-primary/10'
                  }`}
                />
              </div>

              {metric.progress && (
                <div className="flex items-center gap-sm">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${metric.progress}%` }} />
                  </div>
                  <span className="text-caption text-primary">{metric.delta}</span>
                </div>
              )}

              {metric.bars && (
                <div className="h-10 flex items-end gap-1">
                  {metric.bars.map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-secondary rounded-t-sm"
                      style={{ height: `${h * 10}%`, opacity: 0.3 + (i / metric.bars.length) * 0.7 }}
                    />
                  ))}
                </div>
              )}

              {metric.gradientBar && (
                <div className="flex items-center gap-sm">
                  <div className="w-full h-8 bg-gradient-to-r from-transparent via-primary/20 to-primary/40 rounded-lg flex items-center justify-end pr-sm">
                    <span className="text-primary animate-pulse">↗</span>
                  </div>
                </div>
              )}

              {metric.ring && (
                <div className="flex justify-center">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6" />
                      <circle className="text-secondary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175" strokeDashoffset="60" strokeWidth="6" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                      STYLING
                    </span>
                  </div>
                </div>
              )}

              <p className="text-caption text-on-surface-variant opacity-50">{metric.footnote}</p>
            </div>
          );
        })}
      </section>

      {/* Density Map */}
      <section className="glass-panel rounded-2xl overflow-hidden h-[500px] relative">
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <img
            alt="Karachi Booking Density Heatmap"
            className="w-full h-full object-cover opacity-40 grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuQy6U4_NgOZhfy0K6CYfgHFsJ9AbkXuol5rwRArJ6IaiOWUuIyTy4c9hbEW66pVVf8bhQb3hxc1VfvV77SdS4aOpC5hwV1W0Y85iD-nACjClSvQ1K1Ik9BN7v4t-i7VLDQBCAt3ktyhwvh11Wos9yzl8_dC86mfJDqgh9bspmq2SciQg77P00Uc7ASECs2q0VgUeuuJRVQ9y0llclKDOP9zmwDrBEPSY1cTdC8Enjs8sGuDuuwiDnCOtNWuZ9hJK-OylzyNCSRc0"
          />
          <div className="absolute top-[40%] left-[30%] w-24 h-24 bg-primary/20 rounded-full animate-pulse flex items-center justify-center border border-primary/50">
            <div className="w-4 h-4 bg-primary rounded-full shadow-neon-orange" />
            <span className="absolute -top-6 bg-primary text-on-primary text-[10px] font-bold px-xs py-1 rounded whitespace-nowrap">
              GULSHAN
            </span>
          </div>
          <div
            className="absolute top-[60%] left-[60%] w-32 h-32 bg-secondary/20 rounded-full animate-pulse flex items-center justify-center border border-secondary/50"
            style={{ animationDelay: '1s' }}
          >
            <div className="w-4 h-4 bg-secondary rounded-full shadow-neon-emerald" />
            <span className="absolute -top-6 bg-secondary text-on-secondary text-[10px] font-bold px-xs py-1 rounded whitespace-nowrap">
              CLIFTON
            </span>
          </div>
          <div
            className="absolute top-[30%] left-[55%] w-16 h-16 bg-primary/20 rounded-full animate-pulse flex items-center justify-center border border-primary/50"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="w-2 h-2 bg-primary rounded-full shadow-neon-orange" />
            <span className="absolute -top-6 bg-primary text-on-primary text-[10px] font-bold px-xs py-1 rounded whitespace-nowrap">
              NAZIMABAD
            </span>
          </div>
        </div>

        <div className="absolute top-md left-md z-10 glass-panel p-md rounded-xl w-64 space-y-sm">
          <h4 className="font-headline-md text-label-md text-on-surface">Live Network Activity</h4>
          <div className="flex items-center justify-between text-caption">
            <span className="flex items-center gap-xs">
              <span className="w-2 h-2 bg-primary rounded-full" /> High Load
            </span>
            <span className="text-on-surface font-bold">142 Shops</span>
          </div>
          <div className="flex items-center justify-between text-caption">
            <span className="flex items-center gap-xs">
              <span className="w-2 h-2 bg-secondary rounded-full" /> Standard
            </span>
            <span className="text-on-surface font-bold">589 Shops</span>
          </div>
          <div className="pt-sm border-t border-white/10">
            <p className="text-[10px] text-on-surface-variant mb-xs">PEAK TIMES IN KARACHI</p>
            <div className="flex gap-1 h-8 items-end">
              {[20, 40, 60, 100, 50, 30].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-primary shadow-neon-orange-sm' : 'bg-secondary'}`}
                  style={{ height: `${h}%`, opacity: i === 3 ? 1 : 0.3 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-md right-md z-10 flex gap-sm">
          <button className="glass-panel p-xs rounded hover:bg-white/10 transition-colors">
            <MdAdd className="text-[20px]" />
          </button>
          <button className="glass-panel p-xs rounded hover:bg-white/10 transition-colors">
            <MdRemove className="text-[20px]" />
          </button>
          <button className="glass-panel p-xs rounded hover:bg-white/10 transition-colors">
            <MdMyLocation className="text-[20px]" />
          </button>
        </div>
      </section>

      {/* Logs & Lists */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-md pb-xl">
        {/* Recent Activities */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-md flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Activities</h3>
            <button className="text-primary font-label-md hover:underline">View System Audit</button>
          </div>
          <div className="space-y-sm">
            {ACTIVITY_LOG.map((log, i) => {
              const Icon = log.icon;
              const colorClass =
                log.color === 'secondary'
                  ? 'text-secondary bg-secondary/10 border-secondary/20'
                  : log.color === 'tertiary'
                  ? 'text-tertiary bg-tertiary/10 border-tertiary/20'
                  : 'text-primary bg-primary/10 border-primary/20';
              return (
                <div
                  key={i}
                  className="flex items-center gap-md p-sm rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 ${colorClass}`}>
                    <Icon className="text-[20px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-on-surface">
                      {log.title}
                      {log.highlight && (
                        <span className={log.color === 'secondary' ? 'text-secondary' : 'text-primary'}>
                          {log.highlight}
                        </span>
                      )}
                    </p>
                    <p className="text-caption text-on-surface-variant">{log.subtitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-caption text-on-surface-variant">{log.time}</p>
                    {log.live && (
                      <span className="text-[10px] text-secondary font-bold px-1 bg-secondary/10 rounded">
                        LIVE
                      </span>
                    )}
                    {log.action && (
                      <button className="text-[10px] text-primary font-bold px-1 hover:bg-primary/10 rounded transition-colors block">
                        {log.action}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass-panel rounded-2xl p-md space-y-md">
          <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface-variant">
            Top Performers
          </h3>
          <div className="space-y-md">
            {TOP_PARTNERS.map((partner) => (
              <div className="flex items-center gap-sm" key={partner.name}>
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary-container font-bold flex-shrink-0">
                  {partner.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-on-surface">{partner.name}</p>
                  <div className="flex items-center gap-xs">
                    <MdStar className="text-[14px] text-secondary" />
                    <span className="text-caption text-on-surface">
                      {partner.rating} ({partner.reviews})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
