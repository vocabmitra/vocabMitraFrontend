import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * useAuthGate — exact pattern from spec Section 6.
 *
 * Returns a `requireAuth` function that:
 * - Runs the action immediately if the user is authenticated
 * - Redirects to the /auth page if not
 *
 * Rule: browsing is always public.
 * Only bookmark and mark-as-learned go through requireAuth.
 */
export function useAuthGate() {
  const navigate = useNavigate();

  return function requireAuth(action: () => void) {
    const token = localStorage.getItem('vv-auth-token') || localStorage.getItem('AUTH_TOKEN_KEY');
    const authState = useAuthStore.getState();
    const isLoggedIn = Boolean((token && token !== 'null' && token !== 'undefined') || authState.isAuthenticated || authState.user);

    if (isLoggedIn) {
      action();
    } else {
      navigate('/auth');
    }
  };
}
