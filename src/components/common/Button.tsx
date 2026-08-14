import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  const baseClasses = "inline-flex items-center justify-center gap-2 font-inter font-bold transition-all duration-200 ease-[var(--ease)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-[22px] py-3 text-[14px]",
    lg: "px-7 py-[14px] text-[16px]",
  };

  const variantClasses = {
    primary: "rounded-full border-none bg-ink text-cream hover:bg-upsc hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:bg-ink",
    ghost: "rounded-full bg-transparent text-ink border-2 border-solid border-ink hover:bg-ink hover:text-cream disabled:hover:bg-transparent disabled:hover:text-ink",
    icon: "rounded-xl w-[38px] h-[38px] p-0 bg-cream-card border-2 border-solid border-ink text-ink hover:-translate-y-[2px] hover:shadow-[3px_3px_0_var(--ink)] disabled:hover:translate-y-0 disabled:hover:shadow-none",
  };

  const classes = [
    baseClasses,
    variant !== 'icon' ? sizeClasses[size] : '',
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="w-[18px] h-[18px] shrink-0 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
