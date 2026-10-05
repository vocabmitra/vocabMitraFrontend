import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('[ErrorBoundary caught error]', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 text-[var(--color-text)]">
          <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              An unexpected error occurred. Please try reloading the page or return to the home screen.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-bg)] transition-colors cursor-pointer text-sm"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
