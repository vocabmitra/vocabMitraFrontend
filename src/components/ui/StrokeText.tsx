import { useMemo } from 'react';

interface StrokeTextProps {
  text: string;
  className?: string;
  delay?: number;
  strokeWidth?: string | number;
}

export function StrokeText({ 
  text, 
  className = '', 
  strokeWidth = '2px'
}: StrokeTextProps) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className={className}>
      {words.map((word, wordIndex) => {
        const characters = Array.from(word);
        return (
          <span key={wordIndex}>
            <span className="stroke-text-wrapper relative inline-block">
              {/* Invisible HTML text to ensure perfect layout, sizing and wrapping */}
              <span className="opacity-0 pointer-events-none select-none">{word}</span>
              
              {/* SVG Overlay for stroke drawing animation */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                aria-hidden="true"
              >
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-transparent stroke-current"
                  style={{
                    strokeWidth,
                    fontFamily: 'inherit',
                    fontSize: '1em',
                    fontWeight: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                >
                  {characters.map((char, index) => (
                    <tspan
                      key={index}
                      className="stroke-char"
                      style={{
                        strokeDasharray: 500,
                        strokeDashoffset: 500,
                      }}
                    >
                      {char}
                    </tspan>
                  ))}
                </text>
              </svg>
              
              {/* Fill text */}
              <span className="stroke-fill absolute inset-0 w-full h-full text-current pointer-events-auto opacity-0">
                {word}
              </span>
            </span>
            {wordIndex < words.length - 1 && ' '}
          </span>
        );
      })}
    </span>
  );
}
