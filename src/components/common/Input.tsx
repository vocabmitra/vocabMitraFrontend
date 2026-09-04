import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-[12px] font-bold text-ink-soft uppercase tracking-wider font-inter"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`w-full bg-cream text-ink border border-black/10 dark:border-white/10 rounded-xl py-3 text-[14px] font-inter font-medium outline-none transition-all focus:ring-2 focus:ring-orange-500/40 ${
              error ? 'border-red-500' : ''
            } ${icon ? 'pl-[40px]' : 'pl-4'} ${isPassword ? 'pr-[40px]' : 'pr-4'}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-[14px] top-1/2 -translate-y-1/2 text-ink-soft bg-transparent border-none cursor-pointer p-0"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[13px] text-[#FF5A5F] font-inter m-0" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-[13px] text-ink-soft font-inter m-0">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
