import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  /** Maximum width class, defaults to 'max-w-2xl' */
  maxWidth?: string;
  /** Hide the default close button */
  hideCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'max-w-2xl',
  hideCloseButton = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus trap — move focus into modal when opened
  useEffect(() => {
    if (isOpen) {
      firstFocusableRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full ${maxWidth} bg-cream-card rounded-2xl shadow-2xl overflow-hidden border border-line animate-modal-in`}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            {title && (
              <h2 className="font-bricolage text-xl font-bold text-ink">
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-ink-soft hover:text-ink hover:bg-line transition-colors bg-transparent border-none cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto max-h-[85vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
}
