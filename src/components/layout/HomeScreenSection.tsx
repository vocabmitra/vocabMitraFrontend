import { useRef } from 'react';
import { Lightbulb, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NumberCounter } from '../ui/NumberCounter';
import { WordReveal } from '../ui/WordReveal';

// Shared glass style utility
const glass = {
  background: 'var(--glass-card-bg)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid var(--glass-card-border)',
  boxShadow: 'var(--glass-card-shadow)',
} as React.CSSProperties;

export function HomeScreenSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    tl.fromTo('.home-subtext-word',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.015, ease: 'power2.out' }
    );

    tl.fromTo('.home-dashboard',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.2
    );

    tl.fromTo('.home-dash-card',
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' },
      '-=0.4'
    );

    // Hover tilt on dashboard
    if (dashboardRef.current && window.matchMedia('(min-width: 768px)').matches) {
      const dashboard = dashboardRef.current;
      const xTo = gsap.quickTo(dashboard, 'rotationY', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(dashboard, 'rotationX', { duration: 0.6, ease: 'power3' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = dashboard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.012);
        yTo(y * -0.012);
      };

      const handleMouseLeave = () => { xTo(0); yTo(0); };

      dashboard.addEventListener('mousemove', handleMouseMove);
      dashboard.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        dashboard.removeEventListener('mousemove', handleMouseMove);
        dashboard.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-24 overflow-hidden" >
      <div className="vv-container flex flex-col items-center">

        {/* Header */}
        <div className="w-full max-w-[900px] text-left mb-16">

          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-6">
            Everything you're learning, in one place.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65]">
            <WordReveal
              text="Not a wall of statistics. Just a clear answer to the only question that matters when you open the app: what should I learn or practice right now?"
              wordClassName="home-subtext-word opacity-0"
            />
          </p>
        </div>

        {/* Glassmorphic Dashboard */}
        <div
          ref={dashboardRef}
          className="home-dashboard w-full max-w-[900px] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 opacity-0 border border-line"
          style={{
            background: 'var(--cream-card)',
            boxShadow: 'var(--glass-card-shadow)',
          }}
        >

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4">

            {/* Continue Learning — styled to match profile Continue Learning banner */}
            <div
              className="home-dash-card rounded-xl p-6 sm:p-7 flex flex-col justify-between opacity-0 min-h-[180px] border"
              style={{
                background: 'var(--cat-peach-bg)',
                borderColor: 'var(--cat-peach-border)',
              }}
            >
              <div>
                <h4 className="text-[11px] font-space text-cat-peach-text tracking-[0.14em] uppercase font-bold mb-4">
                  Continue Learning
                </h4>
                <h3 className="font-bricolage text-[26px] sm:text-[30px] text-ink font-bold leading-[1.1] mb-2 tracking-[-0.01em]">
                  <NumberCounter end={8} /> words waiting from yesterday
                </h3>
                <p className="text-ink-soft text-[14px] font-medium">
                  Starting with LASSITUDE
                </p>
              </div>
              {/* Progress bar */}
              <div className="mt-5">
                <div className="w-full h-[4px] rounded-full" style={{ background: 'var(--line)' }}>
                  <div className="h-full w-[35%] rounded-full bg-orange-500" />
                </div>
              </div>
            </div>

            {/* Today's Learning — clean glass/card */}
            <div className="home-dash-card rounded-xl p-6 sm:p-7 flex flex-col justify-center opacity-0" style={glass}>
              <h4 className="text-[10px] font-space text-ink-soft tracking-[0.14em] uppercase font-bold mb-4">
                Today's Learning
              </h4>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bricolage text-[52px] font-extrabold text-ink leading-none">
                  <NumberCounter end={12} duration={2000} />
                </span>
              </div>
              <p className="text-[14px] text-ink-soft font-medium mb-5">new words met today</p>
              <div className="flex gap-3">
                {['Alacrity', 'Candid', 'Obstinate'].map(w => (
                  <span key={w} className="text-[10px] font-space font-bold text-ink-soft uppercase tracking-wider">{w}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4">

            {/* Next Practice */}
            <div className="home-dash-card rounded-xl p-6 sm:p-7 flex flex-col justify-between opacity-0 min-h-[180px]" style={glass}>
              <div>
                <h4 className="text-[10px] font-space text-ink-soft tracking-[0.14em] uppercase font-bold mb-4">
                  Next Practice
                </h4>
                <h3 className="font-bricolage text-[24px] font-bold text-ink leading-none mb-1.5">
                  <NumberCounter end={15} /> cards ready
                </h3>
                <p className="text-[14px] text-ink-soft font-medium">Scheduled · 6 min</p>
              </div>
              <button
                className="w-full py-3 rounded-xl text-ink text-[14px] font-bold font-inter transition-all duration-200 hover:opacity-90 active:scale-[0.98] border border-line"
                style={{
                  background: 'var(--surface-2)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap size={14} className="text-orange-500" />
                  Start practice
                </span>
              </button>
            </div>

            {/* Word of the Day — matching mnemonic tokens */}
            <div
              className="home-dash-card rounded-xl p-6 sm:p-7 flex flex-col justify-center opacity-0 border"
              style={{
                background: 'var(--mnemonic-bg)',
                borderColor: 'var(--mnemonic-border)',
              }}
            >
              <h4 className="text-[10px] font-space tracking-[0.14em] uppercase font-bold mb-4" style={{ color: 'var(--mnemonic-label)' }}>
                Word of the Day
              </h4>
              <h3 className="font-bricolage text-[26px] font-bold text-ink uppercase tracking-[-0.02em] mb-1.5">
                Ephemeral
              </h3>
              <p className="text-[15px] text-ink-soft font-medium mb-5">
                Lasting for a very short time.
              </p>
              <div className="flex items-start gap-2.5">
                <Lightbulb size={15} style={{ color: 'var(--accent)' }} className="shrink-0 mt-0.5" />
                <p className="font-inter text-[15px] font-semibold leading-snug" style={{ color: 'var(--mnemonic-text)' }}>
                  "Ephemeral cheez, pal bhar ki mehmaan."
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
