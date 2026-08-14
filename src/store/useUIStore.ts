import { create } from 'zustand';
import type { ToastItem, ToastType } from '../components/common/Toast';

interface UIStore {
  // Auth modal state
  isAuthModalOpen: boolean;
  authModalOnSuccess: (() => void) | null;

  // Toast queue
  toasts: ToastItem[];

  // Auth modal actions
  openAuthModal: (opts?: { onSuccess?: () => void }) => void;
  closeAuthModal: () => void;

  // Toast actions
  addToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIStore>()((set) => ({
  isAuthModalOpen: false,
  authModalOnSuccess: null,
  toasts: [],

  openAuthModal: (opts) => {
    set({
      isAuthModalOpen: true,
      authModalOnSuccess: opts?.onSuccess ?? null,
    });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false, authModalOnSuccess: null });
  },

  addToast: (message, type = 'info') => {
    const id = `toast-${++toastIdCounter}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
