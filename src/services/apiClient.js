import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.glowcut.app/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem('glowcut_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

/**
 * Simulates network latency for the prototype/demo phase, before a real
 * backend is wired up. Replace usages with direct apiClient calls once
 * live endpoints exist.
 */
export const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export default apiClient;
