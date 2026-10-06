import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AUTH_TOKEN_KEY } from '../utils/constants';

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
    const authState = useAuthStore.getState();
    const token = authState.token || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
    const hasValidToken = Boolean(token && token !== 'null' && token !== 'undefined' && token.trim() !== '');
    const isLoggedIn = hasValidToken && (authState.isAuthenticated || Boolean(authState.user));

    if (isLoggedIn) {
      action();
    } else {
      navigate('/auth');
    }
  };
}
