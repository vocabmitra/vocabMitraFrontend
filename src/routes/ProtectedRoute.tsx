import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AUTH_TOKEN_KEY } from '../utils/constants';
import { isTokenExpired } from '../utils/jwt';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute — redirects to /auth if the user is not authenticated.
 * Stores the intended destination in location state so we can redirect back after login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const storeToken = useAuthStore((s) => s.token);
  const location = useLocation();

  const token = storeToken || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
  const hasValidToken = Boolean(token && token !== 'null' && token !== 'undefined' && token.trim() !== '');

  // Proactively fail closed if token has expired
  if (hasValidToken && isTokenExpired(token)) {
    useAuthStore.getState().logout();
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const isLoggedIn = hasValidToken && (isAuthenticated || Boolean(user));

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect Admin users away from user profile routes to /admin (if on /profile routes)
  const roleUpper = user?.role ? String(user.role).toUpperCase() : '';
  const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'ROLE_ADMIN';

  if (isAdmin && location.pathname.startsWith('/profile')) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
