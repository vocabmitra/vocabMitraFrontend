import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    // Animate mock card in
    tl.fromTo('.problem-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Fox mascot peeks in
    tl.fromTo('.problem-fox',
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
      '-=0.5'
    );

    // Highlight animation
    tl.fromTo('.problem-highlight-bg',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    ).to('.problem-highlight-text',
      { color: '#fff', duration: 0.2 },
      '-=0.4'
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-24 overflow-hidden" style={{ background: 'var(--section-bg-2)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left Content */}
        <div className="flex-1 max-w-[600px] w-full relative z-10">
          <h3 className="font-space text-orange-500 text-sm font-bold tracking-[0.1em] uppercase mb-5">
            The Real Problem
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            You've seen the word before. You just can't recall what it means.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] opacity-90 max-w-[540px]">
            Definitions get memorised on Monday and disappear by Thursday. Not because you aren't working hard — because a plain definition gives your brain{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="problem-highlight-text relative z-10 px-1 transition-colors duration-200">nothing to hold on to</span>
              <span className="problem-highlight-bg absolute top-[0.1em] bottom-[-0.1em] left-0 right-0 -z-0 bg-orange-500/80 origin-left scale-x-0 rounded-sm -rotate-1" />
            </span>.
          </p>
        </div>

        {/* Right Content (Mock Card) */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative pb-8 pr-2 sm:pr-8">
          <div className="problem-card relative w-full max-w-[460px] bg-cream-card rounded-2xl border border-line shadow-2xl shadow-black/20 p-7 sm:p-9 z-10 mx-auto lg:mx-0 opacity-0">
            <div className="mb-6">
              <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-ink mb-2 leading-none uppercase tracking-[-0.02em]">
                Lassitude
              </h3>
              <p className="text-ink-soft text-[16.5px] font-medium">
                Tiredness / lack of energy
              </p>
            </div>

            {/* Skeleton lines */}
            <div className="flex flex-col gap-3.5 mb-8 opacity-60">
              <div className="w-[85%] h-2.5 bg-line rounded-full" />
              <div className="w-[100%] h-2.5 bg-line rounded-full" />
              <div className="w-[60%] h-2.5 bg-line rounded-full" />
            </div>

            {/* Confusion Quote */}
            <div className="px-5 py-4 rounded-xl bg-orange-500/8 border border-orange-500/20">
              <p className="text-accent font-medium font-inter text-[14.5px] italic leading-snug">
                "Wait... was this tiredness or stubbornness..."
              </p>
            </div>

            {/* Overlapping Fox Image */}
            <img
              src="/images/fox_thinking.png"
              alt="Confused Fox Mascot"
              className="problem-fox absolute -bottom-[45px] -right-[15px] sm:-right-[40px] w-[130px] sm:w-[170px] h-auto z-20 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-300 origin-bottom opacity-0"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
