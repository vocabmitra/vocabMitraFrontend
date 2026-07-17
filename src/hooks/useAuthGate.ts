import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';

let pendingAction: (() => void) | null = null;

export const useAuthGate = () => {
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useUIStore();

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      pendingAction = action;
      openAuthModal('login');
    }
  };

  const executePendingAction = () => {
    if (pendingAction) {
      pendingAction();
      pendingAction = null;
    }
  };

  return { requireAuth, executePendingAction };
};
