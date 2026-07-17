import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../common/Toast';
import { useThemeStore } from '@/store/useThemeStore';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="max-w-[760px] mx-auto px-6 pt-12 pb-20 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
