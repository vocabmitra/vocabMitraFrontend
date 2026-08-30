import axiosInstance from '../axiosInstance';
import type { SignupRequest, SignupResponse, AuthUser, ProfileResponse, LoginRequest, LoginResponse } from '../../types';
import type { ApiResponse } from '../../types';

const AUTH_BASE = '/auth';
const USER_BASE = '/user';

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
   * GET /user/profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const res = await axiosInstance.get<ProfileResponse>(`${USER_BASE}/profile`);
    return res.data;
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
