import { useRef } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    tl.fromTo('.solution-highlight-bg',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo('.solution-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo('.solution-card-item',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo('.solution-callout',
      { opacity: 0, scale: 0.9, x: (i) => i % 2 === 0 ? 30 : -30 },
      { opacity: 1, scale: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.2)' },
      '-=0.2'
    );

    tl.to('.solution-arrow-mask',
      { strokeDashoffset: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
      '-=0.5'
    );

    tl.to('.solution-arrow-head',
      { opacity: 1, duration: 0.2, stagger: 0.15 },
      '-=0.3'
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-transparent py-24 overflow-hidden">
      <div className="vv-container flex flex-col items-center">

        {/* Header Content */}
        <div className="max-w-4xl w-full text-center">
          <h3 className="font-space text-orange-500 text-sm font-bold tracking-[0.1em] uppercase mb-4">
            The VocabMitra Difference
          </h3>
          <h2 className="font-bricolage text-[clamp(30px,4.5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em]">
            We make difficult words{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 px-1">memorable</span>
              <span className="solution-highlight-bg absolute top-[0.4em] bottom-0 left-0 right-0 -z-0 bg-orange-500/25 origin-left scale-x-0 rounded-sm -skew-x-12" />
            </span>.
          </h2>
        </div>

        {/* Content Row */}
        <div className="w-full flex justify-center relative mt-10 md:mt-20 px-4 md:px-0">

          <div className="relative w-full max-w-[500px] z-10">

            {/* Callout 1 (Top Left) -> Definition */}
            <div className="solution-callout absolute top-[30px] right-[100%] mr-6 xl:mr-12 w-[180px] text-right opacity-0 z-20 hidden md:block">
              <div className="font-bricolage text-ink font-bold text-lg mb-1">1. Clear Meaning</div>
              <p className="text-ink-soft text-[13px] ml-auto">No confusing jargon. Just what you need for the exam.</p>

              {/* Dotted Curly Arrow */}
              <svg className="absolute top-[14px] left-[100%] w-[120px] h-[80px] text-orange-500 overflow-visible pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <mask id="mask-arrow-1">
                  <path d="M 10,0 C 60,0 60,52 100,52" stroke="white" strokeWidth="6" fill="none" className="solution-arrow-mask" strokeDasharray="200" strokeDashoffset="200" />
                </mask>
                <path d="M 10,0 C 60,0 60,52 100,52" strokeDasharray="6 6" mask="url(#mask-arrow-1)" />
                <polyline points="90,42 100,52 90,62" className="solution-arrow-head opacity-0" />
              </svg>
            </div>

            {/* Callout 2 (Right Middle) -> Mnemonic */}
            <div className="solution-callout absolute top-[120px] left-[100%] ml-6 xl:ml-12 w-[180px] text-left opacity-0 z-20 hidden md:block">
              <div className="font-bricolage text-ink font-bold text-lg mb-1">2. Memory Hook</div>
              <p className="text-ink-soft text-[13px]">Relatable Hinglish mnemonics to lock it in your brain instantly.</p>

              {/* Dotted Curly Arrow */}
              <svg className="absolute top-[14px] right-[100%] w-[120px] h-[50px] text-orange-500 overflow-visible pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <mask id="mask-arrow-2">
                  <path d="M 110,0 C 60,0 60,16 20,16" stroke="white" strokeWidth="6" fill="none" className="solution-arrow-mask" strokeDasharray="200" strokeDashoffset="200" />
                </mask>
                <path d="M 110,0 C 60,0 60,16 20,16" strokeDasharray="6 6" mask="url(#mask-arrow-2)" />
                <polyline points="30,6 20,16 30,26" className="solution-arrow-head opacity-0" />
              </svg>
            </div>

            {/* Callout 3 (Bottom Left) -> Visuals */}
            <div className="solution-callout absolute top-[240px] right-[100%] mr-6 xl:mr-12 w-[180px] text-right opacity-0 z-20 hidden md:block">
              <div className="font-bricolage text-ink font-bold text-lg mb-1">3. Visual Breakdown</div>
              <p className="text-ink-soft text-[13px] ml-auto">Emoji-based visual cues that trigger the meaning effortlessly.</p>

              {/* Dotted Curly Arrow */}
              <svg className="absolute top-[14px] left-[100%] w-[120px] h-[50px] text-orange-500 overflow-visible pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <mask id="mask-arrow-3">
                  <path d="M 10,0 C 60,0 60,6 100,6" stroke="white" strokeWidth="6" fill="none" className="solution-arrow-mask" strokeDasharray="200" strokeDashoffset="200" />
                </mask>
                <path d="M 10,0 C 60,0 60,6 100,6" strokeDasharray="6 6" mask="url(#mask-arrow-3)" />
                <polyline points="90,-4 100,6 90,16" className="solution-arrow-head opacity-0" />
              </svg>
            </div>

            {/* Callout 4 (Bottom Right) -> Example */}
            <div className="solution-callout absolute top-[300px] left-[100%] ml-6 xl:ml-12 w-[180px] text-left opacity-0 z-20 hidden md:block">
              <div className="font-bricolage text-ink font-bold text-lg mb-1">4. Exam Example</div>
              <p className="text-ink-soft text-[13px]">See exactly how the word appears in real test sentences.</p>

              {/* Dotted Curly Arrow */}
              <svg className="absolute top-[14px] right-[100%] w-[120px] h-[50px] text-orange-500 overflow-visible pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <mask id="mask-arrow-4">
                  <path d="M 110,10 C 60,10 60,6 20,6" stroke="white" strokeWidth="6" fill="none" className="solution-arrow-mask" strokeDasharray="200" strokeDashoffset="200" />
                </mask>
                <path d="M 110,10 C 60,10 60,6 20,6" strokeDasharray="6 6" mask="url(#mask-arrow-4)" />
                <polyline points="30,-4 20,6 30,16" className="solution-arrow-head opacity-0" />
              </svg>
            </div>

            {/* Center Mock Card */}
            <div className="solution-card w-full bg-cream-card rounded-2xl border border-line shadow-[0_32px_64px_rgba(0,0,0,0.15)] p-7 sm:p-9 relative z-10 opacity-0">

              {/* Card Header (Definition) */}
              <div className="solution-card-item mb-6">
                <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-ink mb-1.5 leading-none uppercase tracking-[-0.02em]">
                  Lassitude
                </h3>
                <p className="text-ink-soft text-[15px] sm:text-[16px] font-medium">
                  Meaning · Tiredness / lack of energy
                </p>
              </div>

              {/* Mnemonic Box */}
              <div className="solution-card-item bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 text-amber-400/70 font-space text-[11px] font-bold tracking-widest uppercase mb-3">
                  <Lightbulb size={14} className="text-amber-400" />
                  Mnemonic
                </div>
                <p className="font-inter text-[18px] sm:text-[20px] font-bold text-ink leading-snug">
                  Lassi pi ke nind aati hai.
                </p>
              </div>

              {/* Chips Row (Visual Breakdown) */}
              <div className="solution-card-item flex flex-wrap items-center gap-2 sm:gap-3 mb-7">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface-2">
                  <span className="text-[14px]">🥛</span>
                  <span className="text-ink font-bold text-[11px] font-space tracking-wider uppercase">Lassi</span>
                </div>
                <ArrowRight size={14} className="text-ink-soft" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface-2">
                  <span className="text-[14px]">😴</span>
                  <span className="text-ink font-bold text-[11px] font-space tracking-wider uppercase">Sleepy</span>
                </div>
                <ArrowRight size={14} className="text-ink-soft" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface-2">
                  <span className="text-[14px]">🥱</span>
                  <span className="text-ink font-bold text-[11px] font-space tracking-wider uppercase">Tired</span>
                </div>
              </div>

              {/* Example Box */}
              <div className="solution-card-item border-l-2 border-line pl-4 py-1">
                <p className="text-ink-soft font-inter text-[15px] italic leading-relaxed">
                  "After the long exam, a feeling of lassitude washed over her."
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
