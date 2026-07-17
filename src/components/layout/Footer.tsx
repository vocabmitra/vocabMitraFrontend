import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 pt-8 border-t border-hairline text-center text-text-secondary text-sm">
      <p className="font-mono text-[11px] tracking-widest uppercase opacity-70">
        Vocabulary Vault &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};
