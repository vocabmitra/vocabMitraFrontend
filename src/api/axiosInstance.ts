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
    const url = config.url || '';
    const isPublicAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/signUp');

    if (isPublicAuthEndpoint) {
      return config;
    }

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
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle authentication expiry & global error flows
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Check if the 403 response is specifically a token expired/invalid message from mock/temp backends
    const errorData = error.response?.data;
    const errorMessage = typeof errorData === 'string'
      ? errorData
      : (errorData?.error || errorData?.message || '');
    const isTokenExpiredOn403 = status === 403 && typeof errorMessage === 'string' &&
      (errorMessage.toLowerCase().includes('token is invalid or expired') ||
       errorMessage.toLowerCase().includes('jwt expired') ||
       errorMessage.toLowerCase().includes('token expired'));

    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signUp');

    // 401 Unauthorized OR 403 token expiration: clean up auth state and redirect to /auth
    if ((status === 401 || isTokenExpiredOn403) && !isAuthRequest) {
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
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
