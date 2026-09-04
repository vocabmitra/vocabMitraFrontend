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
  const token = localStorage.getItem('vv-auth-token') || localStorage.getItem('AUTH_TOKEN_KEY');
  const authState = useAuthStore.getState();
  const location = useLocation();

  const isLoggedIn = Boolean(
    (token && token !== 'null' && token !== 'undefined') ||
    authState.isAuthenticated ||
    authState.user
  );

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect Admin users away from user profile routes to /admin
  const roleUpper = authState.user?.role ? String(authState.user.role).toUpperCase() : '';
  const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'ROLE_ADMIN';

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
