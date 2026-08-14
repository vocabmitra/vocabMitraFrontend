import axiosInstance from '../axiosInstance';
import type { SignupRequest, SignupResponse, AuthUser, ProfileResponse } from '../../types';
import type { ApiResponse } from '../../types';

// OPEN: confirm whether login is by username or email before finalizing
export interface LoginRequest {
  username: string; // STUB — may change to email per backend confirmation
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

const AUTH_BASE = '/auth';
const USER_BASE = '/user';

export const authApi = {
  /**
   * Sign up a new user.
   * POST /auth/signup
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    // DUMMY SIGNUP: Bypassing the backend for testing
    // TODO: REVERT THIS LATER
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000),
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  },

  /**
   * Log in with username + password.
   * POST /auth/login
   * OPEN: endpoint path and response shape to confirm with backend
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // DUMMY LOGIN: Bypassing the backend for testing profile dashboard
    // TODO: REVERT THIS LATER
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'dummy-jwt-token-12345',
          user: {
            id: 1,
            firstName: 'Demo',
            lastName: 'User',
            username: data.username || 'demo_user',
            email: 'demo@example.com',
          },
        });
      }, 500); // simulate network delay
    });
  },

  /**
   * Get the current authenticated user's profile.
   * GET /user/profile (or /auth/me — OPEN: confirm path)
   */
  getProfile: async (): Promise<ProfileResponse> => {
    // DUMMY PROFILE: Bypassing the backend for testing
    // TODO: REVERT THIS LATER
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 1,
            firstName: 'Demo',
            lastName: 'User',
            username: 'demo_user',
            email: 'demo@example.com',
          },
          stats: {
            totalLearned: 42,
            totalBookmarks: 15,
            currentStreak: 5,
          },
        });
      }, 300);
    });
  },

  /**
   * Server-side logout (if applicable — OPEN: confirm whether backend has a logout endpoint)
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await axiosInstance.post(`${AUTH_BASE}/logout`).catch(() => {
      // Swallow errors — local logout proceeds regardless
    });
  },
};
