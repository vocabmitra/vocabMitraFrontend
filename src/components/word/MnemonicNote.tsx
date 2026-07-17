import React from 'react';

interface MnemonicNoteProps {
  label?: string;
  text: string;
}

export const MnemonicNote: React.FC<MnemonicNoteProps> = ({ label = 'Mnemonic', text }) => {
  return (
    <div className="relative pl-5 mb-8 max-w-[50ch] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-mnemonic">
      <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-mnemonic mb-1.5">
        {label}
      </div>
      <div className="font-fraunces italic text-[18px] text-text-primary leading-[1.5]">
        {text}
      </div>
    </div>
  );
};
