import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { PageShell } from './components/layout/PageShell';
import { AuthModal } from './components/auth/AuthModal';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PageShell>
        <AppRouter />
      </PageShell>
      <AuthModal />
    </BrowserRouter>
  );
};

export default App;
