import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { useAuthStore } from '../store/useAuthStore';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const VocabPage = lazy(() => import('../pages/VocabPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const ProfileLayout = lazy(() => import('../components/layout/ProfileLayout'));
const DashboardView = lazy(() => import('../pages/profile/DashboardView'));
const UserWordListPage = lazy(() => import('../features/profile/UserWordListPage'));
const PracticeSessionPage = lazy(() => import('../pages/PracticeSessionPage'));
const PracticeTabView = lazy(() => import('../pages/profile/PracticeTabView').then(module => ({ default: module.PracticeTabView })));
const CuetFocusPage = lazy(() => import('../pages/profile/CuetFocusPage'));
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
  const user = useAuthStore((s) => s.user);
  const roleUpper = user?.role ? String(user.role).toUpperCase() : '';
  const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'ROLE_ADMIN';

  if (isAuthenticated) {
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

export function AppRouter() {
  return (
    <BrowserRouter>
      <BackgroundManager />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vocabulary" element={<VocabPage />} />

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
            <Route path="practice-queue" element={<PracticeTabView />} />
            <Route path="bookmarks" element={<UserWordListPage mode="bookmarked" />} />
            <Route path="learned" element={<UserWordListPage mode="learned" />} />
            <Route path="cuet-focus" element={<CuetFocusPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Protected route — Practice Session */}
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <PracticeSessionPage />
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
