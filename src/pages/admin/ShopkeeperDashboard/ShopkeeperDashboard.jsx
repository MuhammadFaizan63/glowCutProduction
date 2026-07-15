import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  MdTrendingUp,
  MdEventNote,
  MdStar,
  MdStarHalf,
  MdChevronLeft,
  MdChevronRight,
  MdMoreVert,
} from 'react-icons/md';

const INITIAL_SCHEDULE = [
  {
    id: 'apt-1',
    time: '02:00 PM',
    client: 'Sarah L.',
    service: 'Standard Trim',
    staff: 'Zara',
    status: 'completed',
  },
  {
    id: 'apt-2',
    time: '03:30 PM',
    client: 'Faizan',
    service: 'Signature Haircut',
    staff: 'Usman',
    waitTime: '5 mins',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBIAprSPtAhG7v2er0inNuQDdPhy9ipOmyEQ-XG4PzNpZCpbaKpGxWa72uo-n0rp5fFJoiVq5iCvw4Mr2bW3AYywzyBuuZeyGPOArFKLi68u8BUc6rImjVqmJeaMc-wnWTVr9xdjf2Ov_F8x5a8m9JSG-Si6bHQxYxswhHERxb92ypDAcrEbHoeUn3yEpiBG0W4L6OPoyNDH16mljbgzkx7FliCX8pPenVzYVTjMxCr3p7XOBzdQ9JEUAI-zLNd12IRRzQOqsybtPE',
    status: 'active',
  },
  {
    id: 'apt-3',
    time: '04:45 PM',
    client: 'Jason K.',
    service: 'Beard Sculpting',
    staff: null,
    status: 'upcoming',
  },
];

const CHAT_MESSAGES = [
  { id: 1, from: 'Faizan', initials: 'FM', side: 'left', text: "I'm 5 mins away, parking was a bit tight!" },
  { id: 2, system: true, text: 'Usman joined the chat' },
  { id: 3, from: 'Usman', initials: 'U', side: 'right', text: "No worries, we'll have your station ready!" },
];

export default function ShopkeeperDashboard() {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

  const updateStatus = (id, status) => {
    setSchedule((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(status === 'active' ? 'Client checked in!' : 'Marked as done');
  };

  return (
    <>
      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="glass-card p-card-padding rounded-xl group transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-outline-variant text-[10px] uppercase font-bold tracking-widest">
              Daily Revenue
            </span>
            <div className="bg-secondary/10 text-secondary px-2 py-1 rounded text-[10px] flex items-center gap-1">
              <MdTrendingUp className="text-[12px]" />
              +12.4%
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-primary-container">$1,248.50</span>
            <span className="text-outline text-xs mb-1">USD</span>
          </div>
          <div className="mt-6 h-12 w-full flex items-end gap-1">
            {[40, 60, 50, 90, 70].map((h, i) => (
              <div
                key={i}
                className="w-full bg-primary-container/20 rounded-t-sm group-hover:bg-primary-container/40 transition-all"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-outline-variant text-[10px] uppercase font-bold tracking-widest">
              Total Bookings
            </span>
            <MdEventNote className="text-primary-container opacity-50" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-primary-container">42</span>
            <span className="text-outline text-xs mb-1">Confirmed</span>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between text-[10px] text-outline">
              <span>Target: 50</span>
              <span>84%</span>
            </div>
            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full w-[84%] bg-primary-container shadow-neon-orange-sm" />
            </div>
          </div>
        </div>

        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-outline-variant text-[10px] uppercase font-bold tracking-widest">
              Customer Ratings
            </span>
            <MdStar className="text-secondary opacity-50" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-primary-container">4.9</span>
            <span className="text-outline text-xs mb-1">Average</span>
          </div>
          <div className="mt-6 flex gap-1 text-secondary text-sm">
            <MdStar /> <MdStar /> <MdStar /> <MdStar /> <MdStarHalf />
          </div>
          <p className="text-[10px] text-outline mt-2 italic">Based on 1,204 reviews</p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Schedule Timeline */}
        <section className="lg:col-span-8 space-y-gutter">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary">Today's Schedule</h3>
            <div className="flex gap-2">
              <button className="p-2 glass-card hover:bg-surface-container transition-colors rounded-lg">
                <MdChevronLeft className="text-sm" />
              </button>
              <button className="p-2 glass-card hover:bg-surface-container transition-colors rounded-lg">
                <MdChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {schedule.map((apt) => {
              const isActive = apt.status === 'active';
              const isCompleted = apt.status === 'completed';
              return (
                <div className={`flex gap-4 ${isCompleted ? 'opacity-40' : ''}`} key={apt.id}>
                  <div className="w-16 pt-2 text-right">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-primary-container' : 'text-outline'
                      }`}
                    >
                      {apt.time}
                    </span>
                  </div>
                  <div
                    className={`relative pb-6 border-l-2 pl-6 flex-1 ${
                      isActive ? 'border-primary-container' : 'border-outline-variant'
                    }`}
                  >
                    <div
                      className={`absolute -left-[7px] top-3 w-3 h-3 rounded-full ${
                        isActive
                          ? 'bg-primary-container shadow-neon-orange'
                          : 'bg-outline-variant'
                      }`}
                    />
                    <div
                      className={`glass-card p-4 rounded-xl w-full ${
                        isActive
                          ? 'border border-primary-container/30 bg-primary-container/5 ring-1 ring-primary-container/20 p-6'
                          : isCompleted
                          ? 'border-dashed'
                          : ''
                      }`}
                    >
                      {isActive ? (
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 flex-shrink-0">
                              <img
                                alt={apt.client}
                                className="rounded-full w-full h-full object-cover"
                                src={apt.avatar}
                              />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-primary">
                                {apt.client} ({apt.service})
                              </h4>
                              <p className="text-sm text-primary-container/70">
                                Wait time: {apt.waitTime} • Specialist: {apt.staff}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => updateStatus(apt.id, 'checked-in')}
                              className="bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-90 transition-all active:scale-95 shadow-neon-orange-sm"
                            >
                              Check-In
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, 'completed')}
                              className="border border-primary-container text-primary-container font-label-md text-label-md px-6 py-2 rounded-full hover:bg-primary-container/10 transition-all active:scale-95"
                            >
                              Mark as Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-on-surface font-bold">
                              {apt.service} - {apt.client}
                            </h4>
                            <p className="text-xs text-outline">
                              {isCompleted ? `Completed by ${apt.staff}` : 'Staff Unassigned'}
                            </p>
                          </div>
                          {!isCompleted && (
                            <button className="text-outline hover:text-on-surface transition-colors">
                              <MdMoreVert />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-gutter">
          <div className="glass-card rounded-xl flex flex-col h-[400px]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse" />
                <h3 className="font-label-md text-label-md text-primary">Live Customer Support</h3>
              </div>
              <span className="text-[10px] text-outline">3 Active</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {CHAT_MESSAGES.map((msg) =>
                msg.system ? (
                  <div className="text-center" key={msg.id}>
                    <span className="text-[10px] text-outline bg-surface-container px-2 py-1 rounded-full italic">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`flex gap-3 ${msg.side === 'right' ? 'flex-row-reverse' : ''}`}
                    key={msg.id}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.side === 'right'
                          ? 'bg-primary-container/20 text-primary-container'
                          : 'bg-surface-container-highest'
                      }`}
                    >
                      <span className="text-[10px]">{msg.initials}</span>
                    </div>
                    <div
                      className={`p-3 rounded-b-xl max-w-[80%] ${
                        msg.side === 'right'
                          ? 'bg-primary-container/10 border border-primary-container/20 rounded-tl-xl'
                          : 'bg-surface-container rounded-tr-xl'
                      }`}
                    >
                      <p className="text-xs text-on-surface font-bold mb-1">{msg.from}</p>
                      <p className="text-xs text-on-surface-variant">{msg.text}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
