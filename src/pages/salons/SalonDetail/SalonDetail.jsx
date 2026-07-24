import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdVerified, MdArrowBack, MdArrowForward, MdLocationOn, MdGroup, MdContentCut } from 'react-icons/md';
import toast from 'react-hot-toast';
import ServiceCard from '../../../components/salon/ServiceCard';
import BarberCard from '../../../components/salon/BarberCard';
import ReviewCard from '../../../components/salon/ReviewCard';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import { useSalon } from '../../../hooks/useSalon';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import * as salonService from '../../../services/salonService';

// Next 3 calendar days, used for the Quick Book date picker.
const buildDates = () => {
  const days = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: String(d.getDate()),
      iso: d.toISOString().split('T')[0],
    });
  }
  return days;
};

export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { salon, isLoading } = useSalon(id);
  const { booking, setSalon, toggleService, setStylist, setTimeSlot, totalPrice } = useBooking();

  const [dates] = useState(buildDates);
  const [selectedDate, setSelectedDate] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [barbers, setBarbers] = useState([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (salon) setSalon(salon);
  }, [salon, setSalon]);

  // Real services for this salon
  useEffect(() => {
    if (!id) return;
    setLoadingServices(true);
    salonService
      .getSalonServices(id)
      .then((list) => setServices(Array.isArray(list) ? list : []))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, [id]);

  // Real barbers for this salon
  useEffect(() => {
    if (!id) return;
    setLoadingBarbers(true);
    salonService
      .getSalonBarbers(id)
      .then((list) => setBarbers(Array.isArray(list) ? list : []))
      .catch(() => setBarbers([]))
      .finally(() => setLoadingBarbers(false));
  }, [id]);

  // Reviews for the currently selected stylist (backend reviews are
  // per-barber, not per-salon — see review.routes.js).
  useEffect(() => {
    const barberId = booking.stylist?._id || booking.stylist?.id;
    if (!barberId) {
      setReviews([]);
      return;
    }
    setLoadingReviews(true);
    salonService
      .getBarberReviews(barberId)
      .then((list) => setReviews(Array.isArray(list) ? list : []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [booking.stylist]);

  // Real time-slot availability, scoped to the selected stylist once chosen.
  useEffect(() => {
    if (!id) return;
    setSlotsLoading(true);
    const barberId = booking.stylist?._id || booking.stylist?.id;
    bookingService.getAvailableTimeSlots(id, barberId, dates[selectedDate].iso).then((data) => {
      setSlots(data);
      const firstAvailable = data.find((s) => s.status === 'available');
      setSelectedSlot(firstAvailable?.time || null);
      setSlotsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedDate, booking.stylist]);

  const handleConfirm = () => {
    if (booking.services.length === 0) {
      toast.error('Select at least one service first');
      return;
    }
    if (!booking.stylist) {
      toast.error('Please choose a stylist');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please pick an available time slot');
      return;
    }
    setTimeSlot(dates[selectedDate].iso, selectedSlot, dates[selectedDate].label);
    navigate('/booking/confirm');
  };

  if (isLoading || !salon) {
    return <Loader variant="full" label="Loading Salon" />;
  }

  const salonId = salon._id || salon.id;
  const areaLabel = salon.address
    ? [salon.address.area, salon.address.city].filter(Boolean).join(', ')
    : salon.area || 'Location unavailable';
  const heroImage = salon.coverImage || salon.logo || salon.image || 'https://via.placeholder.com/1200x600?text=GlowCut';

  const techFee = 0;
  const grandTotal = totalPrice + techFee;

  return (
    <main className="pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs text-on-surface-variant font-caption text-caption mb-md opacity-70">
        <span>Search</span>
        <span>›</span>
        <span>{areaLabel.split(',')[0]}</span>
        <span>›</span>
        <span className="text-secondary">{salon.name}</span>
      </nav>

      {/* Hero */}
      <section className="relative h-[500px] rounded-xl overflow-hidden mb-xl border border-white/10">
        <img className="w-full h-full object-cover" alt={salon.name} src={heroImage} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-lg left-lg">
          <h1 className="font-display-lg text-display-lg text-white mb-xs">{salon.name}</h1>
          <p className="text-secondary font-label-md flex items-center gap-xs">
            <MdVerified /> {salon.isVerified ? 'Verified GlowCut Partner' : 'Premium Cyber-Grooming Destination'}
          </p>
        </div>
        <div className="absolute bottom-lg right-lg flex gap-sm">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-all">
            <MdArrowBack />
          </button>
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-all">
            <MdArrowForward />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-xl">
          {/* Services Menu */}
          <section>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-lg text-headline-lg flex items-center gap-sm">
                <MdContentCut className="text-primary-container" /> Services Menu
              </h2>
            </div>
            {loadingServices ? (
              <div className="grid grid-cols-1 gap-md">
                {[1, 2, 3].map((n) => <div key={n} className="h-24 glass-panel rounded-xl animate-pulse" />)}
              </div>
            ) : services.length === 0 ? (
              <EmptyState
                icon={MdContentCut}
                title="No services listed yet"
                description="This salon hasn't published its service menu yet — check back soon."
              />
            ) : (
              <div className="grid grid-cols-1 gap-md">
                {services.map((service) => {
                  const serviceId = service._id || service.id;
                  const isSelected = booking.services.some((s) => (s._id || s.id) === serviceId);
                  return (
                    <ServiceCard
                      key={serviceId}
                      service={{
                        name: service.name,
                        price: `PKR ${(service.price ?? 0).toLocaleString()}`,
                        description: service.description,
                        duration: `${service.duration ?? 0} mins`,
                      }}
                      selected={isSelected}
                      onSelect={() =>
                        toggleService({
                          _id: serviceId,
                          id: serviceId,
                          name: service.name,
                          price: service.price ?? 0,
                          duration: service.duration ?? 0,
                        })
                      }
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Stylists */}
          <section>
            <h2 className="font-headline-lg text-headline-lg mb-lg flex items-center gap-sm">
              <MdGroup className="text-primary-container" /> Master Stylists
            </h2>
            {loadingBarbers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {[1, 2].map((n) => <div key={n} className="h-32 glass-panel rounded-xl animate-pulse" />)}
              </div>
            ) : barbers.length === 0 ? (
              <EmptyState
                icon={MdGroup}
                title="No stylists on staff yet"
                description="This salon hasn't added any specialists yet — check back soon."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {barbers.map((barber) => {
                  const barberId = barber._id || barber.id;
                  const isSelected = (booking.stylist?._id || booking.stylist?.id) === barberId;
                  return (
                    <div key={barberId} className={isSelected ? 'ring-2 ring-secondary rounded-xl' : ''}>
                      <BarberCard
                        barber={{
                          name: barber.name,
                          specialty: barber.description || 'GlowCut Specialist',
                          rating: barber.rating ?? 0,
                          reviewCount: barber.reviewCount ?? 0,
                          image: barber.profileImage || 'https://via.placeholder.com/150?text=?',
                          available: barber.isAvailable && barber.status === 'active',
                          nextSlot: barber.startTime,
                        }}
                        onClick={() => setStylist(barber)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h2 className="font-headline-md text-headline-md mb-md">Community Feedback</h2>
            {!booking.stylist ? (
              <EmptyState
                title="Pick a stylist to see their reviews"
                description="Reviews are tied to individual specialists — select one above."
              />
            ) : loadingReviews ? (
              <div className="space-y-gutter">
                {[1, 2].map((n) => <div key={n} className="h-20 glass-panel rounded-xl animate-pulse" />)}
              </div>
            ) : reviews.length === 0 ? (
              <EmptyState title="No reviews yet" description={`Be the first to review ${booking.stylist.name}.`} />
            ) : (
              <div className="space-y-gutter">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={{
                      author: review.user?.userName || review.user?.name || 'GlowCut Customer',
                      rating: review.rating,
                      timeAgo: new Date(review.createdAt).toLocaleDateString(),
                      comment: review.comment || 'No comment left.',
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Quick Book */}
        <aside className="lg:col-span-4 sticky top-24 space-y-lg">
          <div className="glass-panel p-lg rounded-xl border-primary-container/20">
            <h3 className="font-headline-md text-headline-md text-white mb-lg">Quick Book</h3>

            <div className="mb-lg">
              <label className="font-label-md text-label-md block mb-sm text-on-surface-variant">
                Select Date
              </label>
              <div className="grid grid-cols-3 gap-xs">
                {dates.map((d, i) => (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(i)}
                    className={`py-md rounded-lg text-center flex flex-col items-center transition-colors ${
                      selectedDate === i
                        ? 'bg-secondary text-on-secondary shadow-neon-emerald'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-caption text-caption uppercase opacity-80">{d.label}</span>
                    <span className="font-bold text-headline-md">{d.day}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-xl">
              <label className="font-label-md text-label-md block mb-sm text-on-surface-variant">
                Available Times {booking.stylist ? `for ${booking.stylist.name}` : '(pick a stylist first)'}
              </label>
              {slotsLoading ? (
                <div className="grid grid-cols-3 gap-xs">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-xs">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.status === 'unavailable'}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-sm rounded-lg text-caption font-label-md transition-colors border ${
                        slot.status === 'unavailable'
                          ? 'border-white/5 text-on-surface-variant opacity-30 cursor-not-allowed'
                          : selectedSlot === slot.time
                          ? 'border-secondary bg-secondary/10 text-secondary shadow-neon-emerald'
                          : 'border-white/10 hover:border-secondary'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-lg mb-lg">
              {booking.services.length === 0 ? (
                <p className="text-on-surface-variant text-sm italic">No services selected yet.</p>
              ) : (
                booking.services.map((s) => (
                  <div key={s._id || s.id} className="flex justify-between items-center mb-xs">
                    <span className="text-on-surface-variant font-body-md">{s.name}</span>
                    <span className="text-white font-bold">PKR {(s.price ?? 0).toLocaleString()}</span>
                  </div>
                ))
              )}
              <div className="flex justify-between items-center mb-md mt-xs">
                <span className="text-on-surface-variant font-body-md">Tech Fee</span>
                <span className="text-white font-bold">PKR {techFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-headline-md text-headline-md">Total</span>
                <span className="font-display-lg text-headline-lg text-primary-container">
                  PKR {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-secondary text-on-secondary font-bold py-md rounded-lg font-label-md text-label-md tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-neon-emerald"
            >
              CONFIRM BOOKING
            </button>
          </div>

          <div className="glass-panel p-md rounded-xl">
            <h4 className="font-label-md text-label-md text-secondary mb-sm uppercase tracking-wider">
              Location
            </h4>
            <p className="text-on-surface-variant font-body-md mb-md flex items-center gap-xs">
              <MdLocationOn /> {areaLabel}
            </p>
            <div className="w-full h-32 bg-surface-container-high rounded-lg overflow-hidden relative flex items-center justify-center">
              <MdLocationOn className="text-secondary text-4xl" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
