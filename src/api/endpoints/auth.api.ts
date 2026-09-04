import axiosInstance from '../axiosInstance';
import type { SignupRequest, SignupResponse, AuthUser, ProfileResponse, LoginRequest, LoginResponse } from '../../types';
import { AUTH_USER_KEY } from '../../utils/constants';
import { useAuthStore } from '../../store/useAuthStore';

const AUTH_BASE = '/auth';
const USER_BASE = '/user';

function getAuthUserId(): string | number | null {
  const user = useAuthStore.getState()?.user;
  if (user?.id) return user.id;
  if ((user as any)?.userId) return (user as any).userId;

  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY) || localStorage.getItem('vv-auth-user');
    if (storedUser && storedUser !== 'undefined') {
      const parsed = JSON.parse(storedUser);
      if (parsed?.id) return parsed.id;
      if (parsed?.userId) return parsed.userId;
    }
  } catch (e) { /* ignore */ }
  return null;
}

export const authApi = {
  /**
   * Sign up a new user.
   * POST /auth/signup
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const res = await axiosInstance.post<SignupResponse>(`${AUTH_BASE}/signUp`, data);
    return res.data;
  },

  /**
   * Log in with username + password.
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosInstance.post<LoginResponse>(`${AUTH_BASE}/login`, data);
    return res.data;
  },

  /**
   * Get the current authenticated user's profile.
   * GET /user/profile?userId={id}
   */
  getProfile: async (userId?: number | string): Promise<ProfileResponse> => {
    const activeUserId = userId ?? getAuthUserId();
    console.log(`[authApi] Requesting GET /user/profile with userId:`, activeUserId);
    const res = await axiosInstance.get<any>(`${USER_BASE}/profile`, {
      params: activeUserId ? { userId: activeUserId } : {},
    });
    return res.data?.data ?? res.data;
  },

  /**
   * Update user profile fields (firstName, lastName, email).
   * PATCH /user/update
   */
  updateProfile: async (
    updates: { firstName?: string; lastName?: string; email?: string }
  ): Promise<ProfileResponse> => {
    console.log('[authApi] Requesting PATCH /user/update with payload:', updates);
    const res = await axiosInstance.patch<any>(`${USER_BASE}/update`, updates);
    return res.data?.data ?? res.data;
  },

  /**
   * Server-side logout
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await axiosInstance.post(`${AUTH_BASE}/logout`).catch(() => {
      // Swallow errors — local logout proceeds regardless
    });
  },
};
