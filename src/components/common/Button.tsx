import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-sm font-mono text-[12px] tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase px-4 py-2';
  
  const variants = {
    primary: 'bg-accent text-bg hover:bg-opacity-90',
    outline: 'border border-accent text-accent hover:bg-accent hover:text-bg',
    ghost: 'text-text-secondary hover:text-accent',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
