import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  MdTrendingUp,
  MdEventNote,
  MdStar,
  MdStarHalf,
  MdOutlineCheckCircle,
  MdSend
} from 'react-icons/md';

const BASE_URL = 'https://glow-cut-product-complete-backend.vercel.app';

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
  
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();

      // Fetch Statistics
      setLoadingStats(true);
      const statsRes = await fetch(`${BASE_URL}/api/bookings/statistics`, { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
      setLoadingStats(false);

      // Fetch Today's Bookings
      setLoadingSchedule(true);
      const scheduleRes = await fetch(`${BASE_URL}/api/bookings/today`, { headers });
      const scheduleData = await scheduleRes.json();

      if (scheduleData.success && scheduleData.data) {
        // Backend returns: { bookings: [...], pagination: {...} } inside data
        const bookingsList = scheduleData.data.bookings || (Array.isArray(scheduleData.data) ? scheduleData.data : []);
        setSchedule(bookingsList);
      } else {
        setSchedule([]);
      }
      setLoadingSchedule(false);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
      setSchedule([]);
      setLoadingStats(false);
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (res.status === 409) {
        toast.error(data.message || "Barber unavailable or slot overlapped.");
        return;
      }

      if (data.success) {
        toast.success('Client checked in successfully!');
        fetchData();
      } else {
        toast.error(data.message || "Check-in failed.");
      }
    } catch (err) {
      toast.error("API error during check-in.");
    }
  };

  const handleMarkAsDone = async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentStatus: 'paid' })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Booking marked as completed!');
        fetchData();
      } else {
        toast.error(data.message || "Failed to complete booking.");
      }
    } catch (err) {
      toast.error("API error while completing booking.");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, {
      id: Date.now(),
      from: 'Usman (You)',
      initials: 'U',
      side: 'right',
      text: newMessage
    }]);
    setNewMessage('');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 text-white ml-64">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-800/50 border border-white/5">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Revenue</p>
          {loadingStats ? <div className="h-8 w-24 bg-white/10 animate-pulse mt-2 rounded" /> : (
            <h3 className="text-3xl font-bold mt-2">${stats?.totalRevenue || '0.00'}</h3>
          )}
        </div>
        <div className="p-6 rounded-xl bg-slate-800/50 border border-white/5">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Bookings</p>
          {loadingStats ? <div className="h-8 w-16 bg-white/10 animate-pulse mt-2 rounded" /> : (
            <h3 className="text-3xl font-bold mt-2">{stats?.totalBookings || '0'}</h3>
          )}
        </div>
        <div className="p-6 rounded-xl bg-slate-800/50 border border-white/5">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Completed Bookings</p>
          {loadingStats ? <div className="h-8 w-16 bg-white/10 animate-pulse mt-2 rounded" /> : (
            <h3 className="text-3xl font-bold mt-2">{stats?.completed || '0'}</h3>
          )}
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookings Queue */}
        <section className="lg:col-span-8 space-y-4">
          <h3 className="text-xl font-bold">Today's Queue</h3>
          <div className="space-y-4">
            {loadingSchedule ? (
              <div className="h-24 bg-white/5 animate-pulse rounded-xl" />
            ) : !Array.isArray(schedule) || schedule.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-white/5 rounded-xl border border-white/5">
                No active appointments for today.
              </div>
            ) : (
              schedule.map((apt) => (
                <div key={apt._id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">
                      {apt.customerId?.userName || apt.customerId?.name || apt.customer?.name || 'Walk-in Client'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {apt.serviceId?.name || apt.service?.name || 'Service'} • Start: {apt.startTime || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <button onClick={() => handleCheckIn(apt._id)} className="bg-orange-500 text-xs px-4 py-2 rounded-full font-bold">
                        Confirm Check-In
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => handleMarkAsDone(apt._id)} className="border border-orange-500 text-orange-400 text-xs px-4 py-2 rounded-full font-bold">
                        Mark Completed
                      </button>
                    )}
                    {apt.status === 'completed' && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Finished
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Support Chat */}
        <aside className="lg:col-span-4">
          <div className="bg-slate-800/40 border border-white/5 rounded-xl flex flex-col h-[400px]">
            <div className="p-4 border-b border-white/5 text-sm font-bold">Live Support Chat</div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-2.5 rounded-xl text-xs max-w-[85%] ${msg.side === 'right' ? 'bg-orange-500/10 border border-orange-500/20 ml-auto' : 'bg-white/5 border border-white/5'}`}>
                  <p className="text-[10px] font-bold text-orange-400 mb-0.5">{msg.from || 'System'}</p>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-2 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Reply..." 
                className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="bg-orange-500 px-3 rounded-lg text-xs font-bold"><MdSend /></button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}