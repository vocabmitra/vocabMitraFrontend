import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor — attach Bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
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
