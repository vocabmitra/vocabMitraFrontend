import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAuthApi } from '@/api/mock/mockAuth.api';
import { User } from '@/types';
import { normalizeError } from '@/utils/errorHandler';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await mockAuthApi.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw normalizeError(err);
        }
      },
      signup: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await mockAuthApi.signup(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw normalizeError(err);
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'vocab-vault-auth' }
  )
);
