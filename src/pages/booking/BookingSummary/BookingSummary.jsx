import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdPerson,
  MdStorefront,
  MdCalendarToday,
  MdAccountCircle,
  MdContentCut,
  MdAttachMoney,
  MdInfoOutline,
  MdWarning,
  MdSchedule,
} from 'react-icons/md';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';

export default function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = useBooking();

  // Robustly extract the Booking ID from React Router state, or fallback to the local context
  const bookingId = location.state?.bookingId || booking.createdBookings?.[0]?._id || booking.createdBookings?.[0]?.id;

  const [liveBooking, setLiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(bookingId);
        setLiveBooking(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary flex items-center justify-center animate-spin [animation-duration:8s]">
          <MdSchedule className="text-[32px] text-primary" />
        </div>
        <h2 className="mt-6 font-display-lg text-headline-lg text-white animate-pulse">Generating Receipt...</h2>
        <p className="text-on-surface-variant font-label-md mt-2">Retrieving booking confirmation</p>
      </main>
    );
  }

  if (error || !liveBooking) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="glass-card rounded-2xl p-xl max-w-lg text-center border-t-4 border-error">
          <MdWarning className="text-error text-6xl mx-auto mb-4" />
          <h2 className="font-headline-lg text-headline-lg text-white mb-2">Receipt Not Found</h2>
          <p className="text-on-surface-variant font-body-md mb-6">
            We couldn't retrieve your booking details. The session may have expired or the booking ID is invalid.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-surface-container-high text-white hover:bg-white/10 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            RETURN TO HOME
          </button>
        </div>
      </main>
    );
  }

  const clientName = liveBooking.customerId?.userName || liveBooking.customerId?.name || 'Guest';
  const salonName = liveBooking.salonId?.name || 'GlowCut Salon';
  const salonAddress = liveBooking.salonId?.address ? `${liveBooking.salonId.address.area || ''}, ${liveBooking.salonId.address.city || ''}` : 'Location available in-app';
  const stylistName = liveBooking.barberId?.name || 'Assigned Stylist';
  const stylistImage = liveBooking.barberId?.profileImage || 'https://via.placeholder.com/150?text=?';
  const serviceName = liveBooking.serviceId?.name || 'Grooming Service';
  
  const bookingDate = new Date(liveBooking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const timeSlot = liveBooking.startTime || 'Pending';
  
  const basePrice = liveBooking.price || 0;
  const discount = liveBooking.discount || 0;
  const finalAmount = liveBooking.finalAmount || (basePrice - discount);

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
        <img
          alt={salonName}
          className="w-full h-full object-cover opacity-60"
          src={liveBooking.salonId?.coverImage || liveBooking.salonId?.logo || "https://lh3.googleusercontent.com/aida-public/AB6AXuDs1l4S_8EO95Tp66DW511NJr98V2sN0njzQGzU4Eqf4cK8PLv3q-3qNfbEsReVRgksKeW7Yqt2sQEMwW4Y7Yl3BPHDiQd16YTFiJ_wlQdRA7-ExY8i04gt9XruVl6ZWtaakuBBUeIqiPNBymY8gp0iQBRUoLeZghPvFMUvO9zXRCp4ruJE0L-0naZRcXFiMEaTSveeAQ_0KA15k4Jsdz_JC4qMpbfJ3GR8aHAetQ7HkXVTtPzjiTNUrAnD7hjKj-Qc_kzkEuzRUH0"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-10 left-margin-mobile md:left-margin-desktop flex items-center gap-sm bg-secondary-container/90 backdrop-blur-md px-md py-sm rounded-full border border-secondary/30 shadow-neon-emerald">
          <MdPerson className="text-on-secondary-container" />
          <span className="font-label-md text-label-md text-on-secondary-container tracking-wider uppercase">
            {liveBooking.status === 'confirmed' ? 'Booking Confirmed' : liveBooking.status}
          </span>
        </div>
      </section>

      {/* Content Grid */}
      <div className="px-margin-mobile md:px-margin-desktop -mt-10 relative z-10 max-w-4xl mx-auto pb-xl">
        <div className="glass-panel edge-light p-lg md:p-xl rounded-2xl flex flex-col gap-lg shadow-2xl border-t-4 border-primary">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-white mb-xs">
                Digital Receipt
              </h2>
              <p className="text-on-surface-variant font-caption text-caption uppercase tracking-widest flex items-center gap-2">
                Order ID: <span className="text-primary font-bold">{liveBooking._id}</span>
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-white font-headline-md">{bookingDate}</p>
              <p className="text-secondary font-bold text-lg">{timeSlot}</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl py-4">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-caption font-caption text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MdStorefront className="text-primary" /> Salon
                </span>
                <p className="font-headline-md text-white text-lg">{salonName}</p>
                <p className="text-on-surface-variant text-sm">{salonAddress}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-caption font-caption text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MdAccountCircle className="text-primary" /> Stylist
                </span>
                <div className="flex items-center gap-3 bg-surface-container p-3 rounded-xl border border-white/5">
                  <img src={stylistImage} alt={stylistName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <p className="font-bold text-white">{stylistName}</p>
                    <p className="text-[10px] text-secondary uppercase tracking-wider">GlowCut Specialist</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-caption font-caption text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MdPerson className="text-primary" /> Customer
                </span>
                <p className="font-headline-md text-white text-lg">{clientName}</p>
                <p className="text-on-surface-variant text-sm">{liveBooking.customerId?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Right Column: Ledger */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-white/5 flex flex-col h-full">
              <h3 className="font-headline-md text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <MdContentCut className="text-primary" /> Service Ledger
              </h3>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold">{serviceName}</p>
                    <p className="text-on-surface-variant text-sm">{liveBooking.duration} mins</p>
                  </div>
                  <p className="text-white font-mono">PKR {basePrice.toLocaleString()}</p>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-secondary">
                    <p className="font-bold flex items-center gap-1"><MdInfoOutline /> Discount Applied</p>
                    <p className="font-mono">- PKR {discount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <p>Payment Method</p>
                  <p className="uppercase text-white font-bold">{liveBooking.paymentMethod}</p>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <p>Payment Status</p>
                  <p className={`uppercase font-bold ${liveBooking.paymentStatus === 'paid' ? 'text-secondary' : 'text-error'}`}>
                    {liveBooking.paymentStatus}
                  </p>
                </div>
                
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/10">
                  <p className="text-white font-headline-md">Total Amount</p>
                  <p className="text-primary font-display-lg text-3xl font-bold flex items-center gap-1">
                    <MdAttachMoney className="text-xl" />
                    {finalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button
              onClick={() => navigate('/booking/waiting-lounge', { state: { bookingId: liveBooking._id } })}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-secondary-container font-headline-md text-headline-md font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-neon-emerald"
            >
              PROCEED TO WAITING LOUNGE
            </button>
            <p className="text-center text-on-surface-variant text-xs uppercase tracking-widest flex items-center justify-center gap-1">
              <MdInfoOutline /> Proceed to the lounge to track your live queue status
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
