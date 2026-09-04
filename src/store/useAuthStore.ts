import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, ProfileResponse } from '../types';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../utils/constants';

interface AuthStore {
  user: AuthUser | null;
  profile: ProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setProfile: (profile: ProfileResponse) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        if (token && token !== 'undefined' && token !== 'null') {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        if (user && (user as any) !== 'undefined') {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(AUTH_USER_KEY);
        }
        set({ user, token, isAuthenticated: Boolean(token) });
      },

      setProfile: (profile) => {
        set((state) => ({
          profile,
          user: state.user
            ? {
                ...state.user,
                firstName: profile.firstName || state.user.firstName,
                lastName: profile.lastName || state.user.lastName,
                username: profile.username || state.user.username,
                email: profile.email || state.user.email,
              }
            : state.user,
        }));
      },

      logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem('vv-auth-token');
        localStorage.removeItem('vv-auth-user');
        set({ user: null, profile: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'vv-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);
