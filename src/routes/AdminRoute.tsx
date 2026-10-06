import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AUTH_TOKEN_KEY } from '../utils/constants';
import { isTokenExpired, getJwtRole } from '../utils/jwt';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute — protects /admin page and routes.
 * Only permits access if the user is logged in AND has the verified ADMIN role.
 * Otherwise redirects to /auth (if not logged in) or / (if logged in as normal user).
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const storeToken = useAuthStore((s) => s.token);
  const token = storeToken || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  const hasValidToken = Boolean(token && token !== 'null' && token !== 'undefined' && token.trim() !== '');

  // If token is expired, clean session and redirect to /auth
  if (hasValidToken && isTokenExpired(token)) {
    useAuthStore.getState().logout();
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const isLoggedIn = hasValidToken && (isAuthenticated || Boolean(user));

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Cross-reference client store role with cryptographically signed token claims
  const tokenRole = getJwtRole(token);
  const userRole = user?.role ? String(user.role).toUpperCase() : '';

  // If the JWT contains a role, it MUST match ADMIN
  if (tokenRole && tokenRole.toUpperCase() !== 'ADMIN' && tokenRole.toUpperCase() !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  const resolvedRole = (tokenRole || userRole).toUpperCase();
  const isAdmin = resolvedRole === 'ADMIN' || resolvedRole === 'ROLE_ADMIN';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
