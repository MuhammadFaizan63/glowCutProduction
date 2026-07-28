import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../../services/apiClient';
import EmptyState from '../../../components/ui/EmptyState';
import {
  MdTrendingUp,
  MdEventNote,
  MdStar,
  MdStarHalf,
  MdOutlineCheckCircle,
  MdSend,
  MdContentCut
} from 'react-icons/md';

// NOTE: the backend has no live-chat/messaging endpoints or sockets wired
// for this feature yet (src/config/socket.js exists but isn't used by any
// route in this codebase), so this panel stays a local, in-memory demo.
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchData = async () => {
    // Statistics
    setLoadingStats(true);
    try {
      const { data } = await apiClient.get('/bookings/statistics');
      if (data.success) setStats(data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load statistics.');
    } finally {
      setLoadingStats(false);
    }

    // Today's bookings
    setLoadingSchedule(true);
    try {
      const { data } = await apiClient.get('/bookings/today');
      setSchedule(data.data?.bookings || []);
    } catch (err) {
      toast.error(err.message || "Failed to load today's queue.");
      setSchedule([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [actioningId, setActioningId] = useState(null);

  const handleCheckIn = async (bookingId) => {
    if (actioningId) return;
    setActioningId(bookingId);
    try {
      const { data } = await apiClient.patch(`/bookings/${bookingId}/confirm`);
      if (data.success) {
        toast.success('Client checked in successfully!');
        fetchData();
      } else {
        toast.error(data.message || 'Check-in failed.');
      }
    } catch (err) {
      toast.error(err.message || 'Check-in failed.');
    } finally {
      setActioningId(null);
    }
  };

  const handleMarkAsDone = async (bookingId) => {
    if (actioningId) return;
    setActioningId(bookingId);
    try {
      const { data } = await apiClient.patch(`/bookings/${bookingId}/complete`, { paymentStatus: 'paid' });
      if (data.success) {
        toast.success('Booking marked as completed!');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to complete booking.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete booking.');
    } finally {
      setActioningId(null);
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
    <div className="p-lg max-w-7xl mx-auto space-y-xl text-on-surface md:ml-64 font-body-md">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-display-lg mb-xs">Command Center</h1>
        <p className="text-on-surface-variant text-label-md">Monitor real-time operations and daily targets.</p>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="p-lg rounded-xl glass-panel border-l-4 border-l-primary-container relative overflow-hidden group hover:shadow-neon-emerald transition-all">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <MdTrendingUp className="text-6xl text-primary" />
          </div>
          <p className="font-label-md text-caption uppercase tracking-widest text-on-surface-variant relative z-10">Total Revenue</p>
          {loadingStats ? <div className="h-10 w-24 bg-white/10 animate-pulse mt-2 rounded relative z-10" /> : (
            <h3 className="font-display-lg text-headline-lg text-white mt-xs relative z-10">PKR {stats?.totalRevenue?.toLocaleString() || '0'}</h3>
          )}
        </div>
        
        <div className="p-lg rounded-xl glass-panel border-l-4 border-l-secondary relative overflow-hidden group hover:shadow-neon-emerald transition-all">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <MdEventNote className="text-6xl text-secondary" />
          </div>
          <p className="font-label-md text-caption uppercase tracking-widest text-on-surface-variant relative z-10">Total Bookings</p>
          {loadingStats ? <div className="h-10 w-16 bg-white/10 animate-pulse mt-2 rounded relative z-10" /> : (
            <h3 className="font-display-lg text-headline-lg text-white mt-xs relative z-10">{stats?.totalBookings || '0'}</h3>
          )}
        </div>

        <div className="p-lg rounded-xl glass-panel border-l-4 border-l-primary relative overflow-hidden group hover:shadow-neon-emerald transition-all">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <MdOutlineCheckCircle className="text-6xl text-primary" />
          </div>
          <p className="font-label-md text-caption uppercase tracking-widest text-on-surface-variant relative z-10">Completed Services</p>
          {loadingStats ? <div className="h-10 w-16 bg-white/10 animate-pulse mt-2 rounded relative z-10" /> : (
            <h3 className="font-display-lg text-headline-lg text-white mt-xs relative z-10">{stats?.completed || '0'}</h3>
          )}
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Bookings Queue */}
        <section className="lg:col-span-8 space-y-md">
          <h3 className="font-headline-md text-headline-md text-white flex items-center gap-xs border-b border-white/10 pb-sm">
            <MdContentCut className="text-primary-container" /> Today's Terminal Queue
          </h3>
          <div className="space-y-sm">
            {loadingSchedule ? (
              [1,2,3].map(n => <div key={n} className="h-24 bg-white/5 animate-pulse rounded-xl" />)
            ) : !Array.isArray(schedule) || schedule.length === 0 ? (
              <EmptyState
                icon={MdEventNote}
                title="Queue is empty"
                description="Confirmed and pending bookings for today will securely sync here."
              />
            ) : (
              schedule.map((apt) => (
                <div key={apt._id} className="p-md glass-panel border border-white/5 rounded-xl flex justify-between items-center hover:border-primary-container/30 transition-colors group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center font-display-lg text-primary text-xl shadow-inner">
                      {apt.startTime?.split(':')[0]}
                    </div>
                    <div>
                      <h4 className="font-headline-md text-white text-lg group-hover:text-primary transition-colors">
                        {apt.customerId?.userName || apt.customerId?.name || apt.customer?.name || 'Walk-in Client'}
                      </h4>
                      <p className="text-caption text-on-surface-variant font-label-md">
                        {apt.serviceId?.name || apt.service?.name || 'Service'} • {apt.startTime || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-sm">
                    {apt.status === 'pending' && (
                      <button onClick={() => handleCheckIn(apt._id)} disabled={actioningId === apt._id} className="bg-primary text-on-primary text-xs px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-neon-emerald hover:scale-105 transition-all">
                        CONFIRM CHECK-IN
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => handleMarkAsDone(apt._id)} disabled={actioningId === apt._id} className="border border-secondary text-secondary text-xs px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/10 transition-colors">
                        MARK COMPLETE
                      </button>
                    )}
                    {apt.status === 'completed' && (
                      <span className="text-xs text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 font-bold flex items-center gap-1">
                        <MdOutlineCheckCircle /> FINISHED
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
          <div className="glass-panel border-white/10 rounded-xl flex flex-col h-[500px] overflow-hidden shadow-2xl">
            <div className="p-md border-b border-white/10 font-headline-md text-white bg-surface-container-lowest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-neon-emerald" /> 
              Secure Communications
            </div>
            
            <div className="flex-1 p-md overflow-y-auto space-y-md bg-gradient-to-b from-transparent to-surface-container-high/30 scrollbar-hide">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-2xl text-body-sm max-w-[85%] shadow-sm ${msg.side === 'right' ? 'bg-primary/20 border border-primary/30 ml-auto rounded-tr-none' : 'bg-surface-container-highest border border-white/5 rounded-tl-none'}`}>
                  <p className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${msg.side === 'right' ? 'text-primary' : 'text-secondary'}`}>
                    {msg.from || 'System'}
                  </p>
                  <p className="text-white/90">{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-md border-t border-white/10 flex gap-sm bg-surface-container-lowest">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Transmit message..." 
                className="flex-1 bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button type="submit" className="bg-primary text-on-primary w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-neon-emerald">
                <MdSend className="text-lg" />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}