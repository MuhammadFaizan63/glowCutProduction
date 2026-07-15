import apiClient, { simulateDelay } from './apiClient';

const MOCK_MODE = true;

const MOCK_TIME_SLOTS = [
  { time: '2:00 PM', status: 'unavailable' },
  { time: '2:30 PM', status: 'unavailable' },
  { time: '3:00 PM', status: 'unavailable' },
  { time: '3:30 PM', status: 'available' },
  { time: '4:00 PM', status: 'available' },
  { time: '4:30 PM', status: 'available' },
  { time: '5:00 PM', status: 'available' },
  { time: '5:30 PM', status: 'available' },
  { time: '6:00 PM', status: 'available' },
  { time: '6:30 PM', status: 'available' },
];

export async function getAvailableTimeSlots(salonId, date) {
  if (MOCK_MODE) {
    await simulateDelay(600);
    return MOCK_TIME_SLOTS;
  }
  const { data } = await apiClient.get(`/salons/${salonId}/slots`, { params: { date } });
  return data;
}

export async function createBooking(bookingPayload) {
  if (MOCK_MODE) {
    await simulateDelay(1200);
    return {
      ...bookingPayload,
      id: `BK-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }
  const { data } = await apiClient.post('/bookings', bookingPayload);
  return data;
}

export async function getBookingStatus(bookingId) {
  if (MOCK_MODE) {
    await simulateDelay(500);
    return { id: bookingId, status: 'in_progress', etaMinutes: 12 };
  }
  const { data } = await apiClient.get(`/bookings/${bookingId}/status`);
  return data;
}

export async function processPayment(paymentPayload) {
  if (MOCK_MODE) {
    await simulateDelay(1500);
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      ...paymentPayload,
    };
  }
  const { data } = await apiClient.post('/payments', paymentPayload);
  return data;
}

export async function getBookingHistory(userId) {
  if (MOCK_MODE) {
    await simulateDelay(500);
    return [];
  }
  const { data } = await apiClient.get(`/users/${userId}/bookings`);
  return data;
}
