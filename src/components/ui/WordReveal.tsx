import { useMemo } from 'react';

interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

export function WordReveal({ text, className = '', wordClassName = '' }: WordRevealProps) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block mr-[0.25em] ${wordClassName}`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
