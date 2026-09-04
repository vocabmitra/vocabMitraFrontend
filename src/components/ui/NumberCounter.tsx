import { useState, useEffect, useRef } from 'react';

interface NumberCounterProps {
  end: number;
  duration?: number;
  className?: string;
}

export function NumberCounter({ end, duration = 1500, className = '' }: NumberCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number;
          const updateCounter = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            
            if (progress < duration) {
              // Easing out function
              const easeOut = 1 - Math.pow(1 - progress / duration, 3);
              setCount(Math.floor(easeOut * end));
              requestAnimationFrame(updateCounter);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(updateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  );
}
