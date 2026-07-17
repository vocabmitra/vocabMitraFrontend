import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="bg-surface border border-hairline p-4 rounded-sm shadow-lg flex items-center justify-between min-w-[300px]">
          <span className={`text-[13px] ${toast.type === 'error' ? 'text-mnemonic' : 'text-text-primary'}`}>
            {toast.message}
          </span>
          <button onClick={() => removeToast(toast.id)} className="text-text-secondary hover:text-text-primary">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
