import axios from 'axios';

// Base URL of the backend API. Set VITE_API_BASE_URL in your .env file.
// Falls back to localhost for local development against the Qitmeer backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://glow-cut-product-complete-backend.vercel.app/api';

const ACCESS_TOKEN_KEY = 'glowcut_access_token';
const REFRESH_TOKEN_KEY = 'glowcut_refresh_token';

export const tokenStorage = {
  getAccessToken: () => window.localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  getRefreshToken: () => window.localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear: () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true, // allow backend refresh-token cookie (REFRESHtOKEN) to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically on every request
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handles 401s by attempting a silent refresh-token exchange once,
// then retries the original request. Also normalizes error messages
// so calling code can always read `error.message` / `error.response`.
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh-token`,
        { refreshToken: tokenStorage.getRefreshToken() },
        { withCredentials: true }
      )
      .then(({ data }) => {
        if (data?.accessToken) tokenStorage.setAccessToken(data.accessToken);
        if (data?.refreshToken) tokenStorage.setRefreshToken(data.refreshToken);
        return data?.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/register');

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        tokenStorage.clear();
      }
    }

    const message =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.data)
        ? Object.values(error.response.data.data[0] || {})[0]
        : null) ||
      error.message ||
      'Something went wrong. Please try again.';

    const normalizedError = new Error(message);
    normalizedError.response = error.response;
    normalizedError.status = status;
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
