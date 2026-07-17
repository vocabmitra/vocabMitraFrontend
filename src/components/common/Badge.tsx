import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center font-mono text-[10px] md:text-[13px] tracking-wider italic text-accent border border-accent rounded-[3px] px-2 py-0.5 ${className}`}>
      {children}
    </span>
  );
};
