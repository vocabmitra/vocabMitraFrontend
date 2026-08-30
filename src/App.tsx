import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useUIStore } from './store/useUIStore';
import { AppRouter } from './routes/AppRouter';
import { ToastContainer } from './components/common/Toast';
import { AnimatedBackground } from './components/ui/AnimatedBackground';

function App() {
  const { initTheme } = useThemeStore();
  const { toasts, dismissToast } = useUIStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      <AppRouter />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default App;
