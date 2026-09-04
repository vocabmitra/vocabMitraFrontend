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

// Response interceptor — handle global errors such as 403 Forbidden
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 403 Forbidden — immediately logout from anywhere and redirect to login page (/auth)
    if (status === 403) {
      try {
        useAuthStore.getState().logout();
      } catch (e) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('vv-auth-token');
        localStorage.removeItem('vv-auth-user');
      }
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    } else if (status === 401) {
      // 401 Unauthorized — clear stale auth token
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('vv-auth-token');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
