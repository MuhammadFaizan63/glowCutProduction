import apiClient, { simulateDelay } from './apiClient';

const MOCK_MODE = true; // Flip to false once the real auth API is live

export async function signup({ name, email, phone, method = 'email' }) {
  if (MOCK_MODE) {
    await simulateDelay(1000);
    return {
      id: `user-${Date.now()}`,
      name: name || 'New User',
      email,
      phone,
      method,
      role: 'customer',
      isGuest: false,
    };
  }
  const { data } = await apiClient.post('/auth/signup', { name, email, phone, method });
  return data.user;
}

export async function login({ email, password }) {
  if (MOCK_MODE) {
    await simulateDelay(900);
    return {
      id: `user-${Date.now()}`,
      name: email?.split('@')[0] || 'User',
      email,
      role: 'customer',
      isGuest: false,
    };
  }
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.user;
}

export async function loginWithGoogle() {
  if (MOCK_MODE) {
    await simulateDelay(1200);
    return {
      id: `google-user-${Date.now()}`,
      name: 'Google User',
      email: 'google.user@gmail.com',
      role: 'customer',
      isGuest: false,
      method: 'google',
    };
  }
  const { data } = await apiClient.post('/auth/google');
  return data.user;
}

export async function logout() {
  if (MOCK_MODE) {
    await simulateDelay(300);
    return true;
  }
  await apiClient.post('/auth/logout');
  return true;
}
