import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useUIStore } from './store/useUIStore';
import { AppRouter } from './routes/AppRouter';
import { ToastContainer } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  const { initTheme } = useThemeStore();
  const { toasts, dismissToast } = useUIStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <ErrorBoundary>
      <AppRouter />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ErrorBoundary>
  );
}

export default App;
