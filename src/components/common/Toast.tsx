import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} />,
  info: <Info size={16} />,
};

function ToastCard({ toast, onDismiss }: ToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const colorMap: Record<ToastType, string> = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    info: 'text-upsc',
  };

  return (
    <div
      className={`flex items-start gap-3 bg-cream-card border border-line rounded-xl px-4 py-3 shadow-xl min-w-[280px] max-w-sm ${
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      role="alert"
      aria-live="polite"
    >
      <span className={`mt-0.5 flex-shrink-0 ${colorMap[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <p className="flex-1 text-sm text-ink font-inter m-0 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => {
          setLeaving(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 text-ink-soft bg-transparent border-none cursor-pointer hover:text-ink transition-colors p-0"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}
