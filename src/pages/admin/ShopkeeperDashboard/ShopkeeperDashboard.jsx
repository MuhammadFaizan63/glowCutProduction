import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  MdTrendingUp,
  MdEventNote,
  MdStar,
  MdStarHalf,
  MdChevronLeft,
  MdChevronRight,
  MdMoreVert,
  MdSend
} from 'react-icons/md'; // Fixed: Standard React Icons path back to /md

const BASE_URL = 'http://localhost:3000'; // Backend API Port according to guide

const INITIAL_CHAT_MESSAGES = [
  { id: 1, from: 'Faizan', initials: 'FM', side: 'left', text: "I'm 5 mins away, parking was a bit tight!" },
  { id: 2, system: true, text: 'Usman joined the chat' },
  { id: 3, from: 'Usman', initials: 'U', side: 'right', text: "No worries, we'll have your station ready!" },
];

export default function ShopkeeperDashboard() {
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Helper function for Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch Stats and Today's Schedule
  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();

      // 1. Fetch statistics
      setLoadingStats(true);
      const statsRes = await fetch(`${BASE_URL}/api/bookings/statistics`, { headers });
      if (statsRes.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
      setLoadingStats(false);

      // 2. Fetch Today's schedule bookings
      setLoadingSchedule(true);
      const scheduleRes = await fetch(`${BASE_URL}/api/bookings/today`, { headers });
      const scheduleData = await scheduleRes.json();
      if (scheduleData.success) {
        setSchedule(scheduleData.data || []);
      }
      setLoadingSchedule(false);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
      setLoadingStats(false);
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action: Check-in / Confirm Booking
  const handleCheckIn = async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error("Please login to proceed.");
        return;
      }

      if (res.status === 409) {
        toast.error(data.message || "Conflict: Barber is unavailable or slot overlapped.");
        return;
      }

      if (data.success) {
        toast.success('Client checked in successfully!');
        fetchData();
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error("API error while checking in.");
    }
  };

  // Action: Mark as Done / Complete Booking
  const handleMarkAsDone = async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentStatus: 'paid' })
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error("Please login to proceed.");
        return;
      }

      if (data.success) {
        toast.success('Booking marked as completed!');
        fetchData();
      } else {
        toast.error(data.message || "Could not complete booking.");
      }
    } catch (err) {
      console.error(err);
      toast.error("API error while completing booking.");
    }
  };

  // Send Message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgObj = {
      id: Date.now(),
      from: 'Usman (You)',
      initials: 'U',
      side: 'right',
      text: newMessage
    };

    setChatMessages(prev => [...prev, msgObj]);
    setNewMessage('');
  };

  return (
    <>
      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-6">
        {/* Daily Revenue Card */}
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
          {loadingStats ? (
            <div className="h-8 w-24 bg-surface-container-highest animate-pulse rounded" />
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary-container">
                ${stats?.todayRevenue || stats?.dailyRevenue || '1,248.50'}
              </span>
              <span className="text-outline text-xs mb-1">USD</span>
            </div>
          )}
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

        {/* Total Bookings Card */}
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-outline-variant text-[10px] uppercase font-bold tracking-widest">
              Total Bookings
            </span>
            <MdEventNote className="text-primary-container opacity-50" />
          </div>
          {loadingStats ? (
            <div className="h-8 w-16 bg-surface-container-highest animate-pulse rounded" />
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary-container">
                {stats?.totalBookings || '0'}
              </span>
              <span className="text-outline text-xs mb-1">Today</span>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between text-[10px] text-outline">
              <span>Target: 50</span>
              <span>{Math.min(100, Math.round(((stats?.totalBookings || 0) / 50) * 100))}%</span>
            </div>
            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-container shadow-neon-orange-sm transition-all duration-500" 
                style={{ width: `${Math.min(100, ((stats?.totalBookings || 0) / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Customer Ratings Card */}
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-outline-variant text-[10px] uppercase font-bold tracking-widest">
              Customer Ratings
            </span>
            <MdStar className="text-secondary opacity-50" />
          </div>
          {loadingStats ? (
            <div className="h-8 w-16 bg-surface-container-highest animate-pulse rounded" />
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary-container">
                {stats?.averageRating || '4.9'}
              </span>
              <span className="text-outline text-xs mb-1">Average</span>
            </div>
          )}
          <div className="mt-6 flex gap-1 text-secondary text-sm">
            <MdStar /> <MdStar /> <MdStar /> <MdStar /> <MdStarHalf />
          </div>
          <p className="text-[10px] text-outline mt-2 italic">
            Based on {stats?.totalReviews || '1,204'} reviews
          </p>
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
            {loadingSchedule ? (
              [1, 2].map((n) => (
                <div className="flex gap-4 animate-pulse" key={n}>
                  <div className="w-16 h-8 bg-surface-container-highest rounded" />
                  <div className="flex-1 glass-card p-4 rounded-xl h-24 bg-surface-container-highest" />
                </div>
              ))
            ) : schedule.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center text-outline">
                No bookings scheduled for today.
              </div>
            ) : (
              schedule.map((apt) => {
                const isActive = apt.status === 'confirmed' || apt.status === 'pending';
                const isCompleted = apt.status === 'completed';
                const isCancelled = apt.status === 'cancelled' || apt.status === 'rejected';

                return (
                  <div className={`flex gap-4 ${isCompleted || isCancelled ? 'opacity-40' : ''}`} key={apt._id || apt.id}>
                    <div className="w-16 pt-2 text-right">
                      <span className={`text-xs font-bold ${isActive ? 'text-primary-container' : 'text-outline'}`}>
                        {apt.startTime || '00:00'}
                      </span>
                    </div>
                    <div className={`relative pb-6 border-l-2 pl-6 flex-1 ${isActive ? 'border-primary-container' : 'border-outline-variant'}`}>
                      <div className={`absolute -left-[7px] top-3 w-3 h-3 rounded-full ${isActive ? 'bg-primary-container shadow-neon-orange' : 'bg-outline-variant'}`} />
                      
                      <div className={`glass-card p-4 rounded-xl w-full ${isActive ? 'border border-primary-container/30 bg-primary-container/5 ring-1 ring-primary-container/20 p-6' : isCompleted ? 'border-dashed' : ''}`}>
                        
                        {isActive ? (
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 flex-shrink-0">
                                <img
                                  alt={apt.customer?.name || 'Customer'}
                                  className="rounded-full w-full h-full object-cover"
                                  src={apt.customer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                                />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-primary">
                                  {apt.customer?.name || 'Walk-in Client'} ({apt.service?.name || 'Service'})
                                </h4>
                                <p className="text-sm text-primary-container/70">
                                  Wait time: {apt.estimatedWaitingMinutes || 'N/A'} mins • Specialist: {apt.barber?.name || 'Unassigned'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              {apt.status === 'pending' && (
                                <button
                                  onClick={() => handleCheckIn(apt._id)}
                                  className="bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-90 transition-all active:scale-95 shadow-neon-orange-sm"
                                >
                                  Check-In
                                </button>
                              )}
                              <button
                                onClick={() => handleMarkAsDone(apt._id)}
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
                                {apt.service?.name || 'Haircut'} - {apt.customer?.name || 'Client'}
                              </h4>
                              <p className="text-xs text-outline">
                                {isCompleted ? `Completed by ${apt.barber?.name || 'Staff'}` : isCancelled ? `Cancelled (${apt.cancelReason || 'No Reason'})` : 'Status: ' + apt.status}
                              </p>
                            </div>
                            {!isCompleted && !isCancelled && (
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
              })
            )}
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
              <span className="text-[10px] text-outline">{chatMessages.filter(m => !m.system).length} Active</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) =>
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
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                placeholder="Type a response..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-surface-container/50 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary-container"
              />
              <button
                type="submit"
                className="p-2 bg-primary-container text-on-primary-container rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-neon-orange-sm"
              >
                <MdSend className="text-xs" />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}