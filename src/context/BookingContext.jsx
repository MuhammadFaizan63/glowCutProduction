import { createContext, useState, useCallback } from 'react';

export const BookingContext = createContext(null);

const initialBooking = {
  salon: null,
  services: [],
  stylist: null,
  date: null,
  timeSlot: null,
  paymentMethod: null,
  status: 'idle', // idle | confirmed | waiting | in_progress | completed | cancelled
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(initialBooking);
  const [bookingHistory, setBookingHistory] = useState([]);

  const setSalon = useCallback((salon) => {
    setBooking((prev) => ({ ...prev, salon }));
  }, []);

  const toggleService = useCallback((service) => {
    setBooking((prev) => {
      const exists = prev.services.find((s) => s.id === service.id);
      const services = exists
        ? prev.services.filter((s) => s.id !== service.id)
        : [...prev.services, service];
      return { ...prev, services };
    });
  }, []);

  const setStylist = useCallback((stylist) => {
    setBooking((prev) => ({ ...prev, stylist }));
  }, []);

  const setTimeSlot = useCallback((date, timeSlot) => {
    setBooking((prev) => ({ ...prev, date, timeSlot }));
  }, []);

  const setPaymentMethod = useCallback((paymentMethod) => {
    setBooking((prev) => ({ ...prev, paymentMethod }));
  }, []);

  const confirmBooking = useCallback(() => {
    setBooking((prev) => {
      const confirmed = { ...prev, status: 'confirmed', id: `BK-${Date.now()}` };
      setBookingHistory((history) => [confirmed, ...history]);
      return confirmed;
    });
  }, []);

  const updateStatus = useCallback((status) => {
    setBooking((prev) => ({ ...prev, status }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialBooking);
  }, []);

  const totalPrice = booking.services.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = booking.services.reduce((sum, s) => sum + (s.duration || 0), 0);

  const value = {
    booking,
    bookingHistory,
    setSalon,
    toggleService,
    setStylist,
    setTimeSlot,
    setPaymentMethod,
    confirmBooking,
    updateStatus,
    resetBooking,
    totalPrice,
    totalDuration,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
