import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { useAuthStore } from '../store/useAuthStore';
import { AUTH_TOKEN_KEY } from '../utils/constants';
import { isTokenExpired, getJwtRole } from '../utils/jwt';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const VocabPage = lazy(() => import('../pages/VocabPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const ProfileLayout = lazy(() => import('../components/layout/ProfileLayout'));
const DashboardView = lazy(() => import('../pages/profile/DashboardView'));
const UserWordListPage = lazy(() => import('../features/profile/UserWordListPage'));
const ReelSessionPage = lazy(() => import('../pages/ReelSessionPage'));
const PracticeBookmarkSessionPage = lazy(() => import('../pages/PracticeBookmarkSessionPage'));
const ExamFocusPage = lazy(() => import('../pages/profile/ExamFocusPage'));
const ProgressView = lazy(() => import('../pages/profile/ProgressView'));
const SettingsPage = lazy(() => import('../pages/profile/SettingsPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--ink-soft)' }}>
        Loading…
      </div>
    </div>
  );
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeToken = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const token = storeToken || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
  const hasValidToken = Boolean(token && token !== 'null' && token !== 'undefined' && token.trim() !== '');

  // If token is expired, clean session and allow rendering the login/signup form
  if (hasValidToken && isTokenExpired(token)) {
    useAuthStore.getState().logout();
    return <>{children}</>;
  }

  const tokenRole = getJwtRole(token);
  const userRole = user?.role ? String(user.role).toUpperCase() : '';
  const resolvedRole = (tokenRole || userRole).toUpperCase();
  const isAdmin = resolvedRole === 'ADMIN' || resolvedRole === 'ROLE_ADMIN';

  if (isAuthenticated && hasValidToken) {
    return <Navigate to={isAdmin ? '/admin' : '/profile'} replace />;
  }
  return <>{children}</>;
}

function BackgroundManager() {
  const location = useLocation();
  // Only hide the animated background glow on profile/dashboard and practice routes
  if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/practice') || location.pathname.startsWith('/admin')) {
    return null;
  }
  return <AnimatedBackground />;
}

function NonAdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeToken = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const token = storeToken || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
  const hasValidToken = Boolean(token && token !== 'null' && token !== 'undefined' && token.trim() !== '');

  if (hasValidToken && isTokenExpired(token)) {
    useAuthStore.getState().logout();
    return <>{children}</>;
  }

  const tokenRole = getJwtRole(token);
  const userRole = user?.role ? String(user.role).toUpperCase() : '';
  const resolvedRole = (tokenRole || userRole).toUpperCase();
  const isAdmin = hasValidToken && isAuthenticated && (resolvedRole === 'ADMIN' || resolvedRole === 'ROLE_ADMIN');

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <BackgroundManager />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/vocabulary"
            element={
              <NonAdminRoute>
                <VocabPage />
              </NonAdminRoute>
            }
          />

          {/* Auth — redirect away if already logged in */}
          <Route
            path="/auth"
            element={
              <AuthRedirect>
                <AuthPage />
              </AuthRedirect>
            }
          />

          {/* Protected routes — profile section */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardView />} />
            <Route path="bookmarks" element={<UserWordListPage mode="bookmarked" />} />
            <Route path="learned" element={<ProgressView />} />
            <Route path="exam-focus" element={<ExamFocusPage />} />
            <Route path="cuet-focus" element={<Navigate to="/profile/exam-focus" replace />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Protected route — Practice Reel Session */}
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <ReelSessionPage />
              </ProtectedRoute>
            }
          />

          {/* Protected route — Practice Bookmark Session */}
          <Route
            path="/practice/bookmark"
            element={
              <ProtectedRoute>
                <PracticeBookmarkSessionPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Route — Admin Console */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
