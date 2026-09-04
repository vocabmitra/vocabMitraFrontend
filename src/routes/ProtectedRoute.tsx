import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

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

  const token = storeToken || localStorage.getItem('vv-auth-token') || localStorage.getItem('AUTH_TOKEN_KEY');

  const isLoggedIn = Boolean(
    (token && token !== 'null' && token !== 'undefined') ||
    isAuthenticated ||
    user
  );

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
