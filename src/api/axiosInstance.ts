import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY, API_TIMEOUT } from '../utils/constants';
import { useAuthStore } from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Request interceptor — attach Bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
    
    if (!token || token === 'null' || token === 'undefined') {
      try {
        const storeToken = useAuthStore.getState()?.token;
        if (storeToken) token = storeToken;
      } catch (e) { /* ignore */ }
    }

    if (!token || token === 'null' || token === 'undefined') {
      try {
        const persisted = localStorage.getItem('vv-auth');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          if (parsed?.state?.token) token = parsed.state.token;
        }
      } catch (e) { /* ignore */ }
    }

    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — let errors propagate; normalizeError handles them in hooks
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 — clear stale auth data to prevent infinite re-auth loops
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      // Note: do NOT redirect here — let the auth store / ProtectedRoute handle navigation
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
