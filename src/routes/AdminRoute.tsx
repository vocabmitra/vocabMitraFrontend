import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute — protects /admin page and routes.
 * Only permits access if the user is logged in AND has the ADMIN role.
 * Otherwise redirects to /auth (if not logged in) or / (if logged in as normal user).
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const token = localStorage.getItem('vv-auth-token') || localStorage.getItem('AUTH_TOKEN_KEY');
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  const isLoggedIn = Boolean(
    (token && token !== 'null' && token !== 'undefined') ||
    isAuthenticated ||
    user
  );

  const roleUpper = user?.role ? String(user.role).toUpperCase() : '';
  const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'ROLE_ADMIN';

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
