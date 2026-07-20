import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  MdEventAvailable, 
  MdCheckCircleOutline, 
  MdHighlightOff, 
  MdDoneAll, 
  MdContentPaste,
  MdAttachMoney,
  MdTrendingUp,
  MdAccessTime,
  MdRefresh
} from 'react-icons/md';

const BASE_URL = 'https://glow-cut-product-complete-backend.vercel.app';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const getSalonId = () => localStorage.getItem('salonId') || '';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 1. Fetch Salon Specific Bookings
  const fetchBookings = async () => {
    const salonId = getSalonId();
    if (!salonId) {
      toast.error("Salon branch reference missing.");
      return;
    }
    setLoading(true);
    try {
      const url = filterStatus === 'all' 
        ? `${BASE_URL}/api/bookings/salon/${salonId}`
        : `${BASE_URL}/api/bookings/filter?salonId=${salonId}&status=${filterStatus}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.bookings || []);
      } else {
        toast.error(data.message || "Failed to fetch bookings.");
      }
    } catch (err) {
      toast.error("Database communication failure.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Dashboard Metrics / Stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/statistics`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filterStatus]);

  // 3. Status State Modifications (PATCH endpoints)
  const handleStatusChange = async (id, action) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${id}/${action}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: action === 'reject' ? JSON.stringify({ cancelReason: "Rejected by salon manager" }) : null
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Booking status updated to ${action}!`);
        fetchBookings();
        fetchStats();
      } else {
        toast.error(data.message || "Operation rejected.");
      }
    } catch (err) {
      toast.error("Network synchronization mismatch.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return styles[status] || 'bg-slate-500/10 text-slate-400 border-white/10';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 text-white ml-64">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Live Booking Board</h2>
          <p className="text-xs text-slate-400 mt-1">Manage real-time walk-ins, online appointments, and client workflows.</p>
        </div>
        <button onClick={() => { fetchBookings(); fetchStats(); }} className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
          <MdRefresh className="text-lg animate-spin-slow" />
        </button>
      </div>

      {/* Aggregate Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Bookings</p>
            <h3 className="text-xl font-bold mt-1 text-white">{stats.totalBookings}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><MdContentPaste className="text-xl" /></div>
        </div>

        <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Gross Revenue</p>
            <h3 className="text-xl font-bold mt-1 text-emerald-400">Rs. {stats.totalRevenue}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><MdAttachMoney className="text-xl" /></div>
        </div>

        <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
            <h3 className="text-xl font-bold mt-1 text-amber-400">{stats.pending}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg"><MdAccessTime className="text-xl" /></div>
        </div>

        <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Completed Sessions</p>
            <h3 className="text-xl font-bold mt-1 text-emerald-500">{stats.completed}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg"><MdTrendingUp className="text-xl" /></div>
        </div>
      </div>

      {/* Filters Segment */}
      <div className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto text-xs font-semibold">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-2 rounded-lg transition-all capitalize border ${filterStatus === tab ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Live Booking Pipeline Grid */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map(n => <div key={n} className="h-24 bg-white/5 animate-pulse rounded-xl" />)
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white/5 rounded-xl border border-white/5 text-xs">
            No session allocations matches the active status filter.
          </div>
        ) : (
          bookings.map((item) => (
            <div key={item._id} className="p-4 bg-slate-800/20 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Queue Display Badge */}
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-orange-400 uppercase font-bold tracking-tight">Queue</span>
                  <span className="text-lg font-extrabold text-white leading-none mt-0.5">#{item.queueNumber}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{item.customerId?.userName || "Walk-In Client"}</h4>
                    <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide font-medium">{item.bookingType}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                    <span><strong>Barber:</strong> {item.barberId?.name || 'Any'}</span>
                    <span><strong>Service:</strong> {item.serviceId?.name || 'Haircut'}</span>
                    <span><strong>Timing:</strong> {new Date(item.bookingDate).toLocaleDateString()} • {item.startTime} - {item.endTime}</span>
                  </div>
                  {item.notes && <p className="text-[11px] text-amber-500/90 italic">Notes: "{item.notes}"</p>}
                </div>
              </div>

              {/* Billing and Operations Actions Control */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Final Amount</p>
                  <p className="text-sm font-black text-emerald-400">Rs. {item.finalAmount}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${item.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    [{item.paymentStatus}] via {item.paymentMethod}
                  </span>
                </div>

                {/* Dashboard Operations Buttons matching explicit controllers */}
                <div className="flex gap-1.5">
                  {item.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusChange(item._id, 'confirm')} className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-lg transition-all" title="Confirm Booking">
                        <MdCheckCircleOutline className="text-base" />
                      </button>
                      <button onClick={() => handleStatusChange(item._id, 'reject')} className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-lg transition-all" title="Reject Booking">
                        <MdHighlightOff className="text-base" />
                      </button>
                    </>
                  )}

                  {item.status === 'confirmed' && (
                    <button onClick={() => handleStatusChange(item._id, 'complete')} className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-lg transition-all text-xs font-bold flex items-center gap-1" title="Mark Completed">
                      <MdDoneAll className="text-sm" /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}