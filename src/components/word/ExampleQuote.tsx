import React from 'react';

interface ExampleQuoteProps {
  text: string;
  source?: string;
}

export const ExampleQuote: React.FC<ExampleQuoteProps> = ({ text, source = 'Example usage' }) => {
  return (
    <div className="border-l border-hairline pl-4.5 text-[15px] text-text-secondary italic max-w-[50ch]">
      {text}
      {source && (
        <span className="block font-mono not-italic text-[11px] tracking-[0.06em] uppercase mt-2 opacity-70">
          {source}
        </span>
      )}
    </div>
  );
};
