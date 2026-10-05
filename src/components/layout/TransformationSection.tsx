import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function TransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    tl.fromTo('.transform-before',
      { opacity: 0, x: -32 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }
    )
      .fromTo('.transform-pill',
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.3'
      )
      .fromTo('.transform-after',
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-transparent py-24 overflow-hidden" style={{ background: 'var(--section-bg-1)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col items-center">

        {/* Header */}
        <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] max-w-[800px] mx-auto text-center mb-16 sm:mb-24">
          From "I keep forgetting it"<br className="hidden sm:block" /> to "I actually remember it."
        </h2>

        {/* Before / After Flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-[1000px]">

          {/* BEFORE CARD */}
          <div className="transform-before opacity-0 w-full md:flex-1 max-w-[420px] bg-cream-card rounded-2xl border border-line shadow-[0_20px_50px_var(--line)] p-8 sm:p-10 flex flex-col justify-between min-h-[240px] transition-transform duration-300 hover:-translate-y-1">
            <div>
              <h4 className="font-space tracking-widest uppercase text-ink-soft opacity-70 text-[11px] font-bold mb-5">
                Before
              </h4>
              <p className="font-inter text-[18px] sm:text-[20px] font-bold text-ink/80 leading-snug mb-8">
                "I know this word... but I keep forgetting it."
              </p>
            </div>
            <div className="space-y-3 opacity-30">
              <div className="h-2 w-[85%] bg-line rounded-full" />
              <div className="h-2 w-[60%] bg-line rounded-full" />
            </div>
          </div>

          {/* CENTER VOCABMITRA PILL */}
          <div className="transform-pill opacity-0 flex flex-col items-center gap-4 shrink-0 py-4 md:py-0">
            <div className="px-6 py-3 bg-orange-500 text-white font-bricolage text-[18px] font-bold rounded-full shadow-[0_4px_24px_rgba(249,115,22,0.45)] rotate-[-3deg] hover:rotate-[3deg] transition-transform duration-300">
              VocabMitra
            </div>
            <p className="text-[11px] text-ink-soft font-space font-bold tracking-widest text-center uppercase leading-relaxed">
              Learn &rarr; Mnemonic &rarr;<br />
              Practice &rarr; Repeat
            </p>
          </div>

          {/* AFTER CARD */}
          <div
            className="transform-after opacity-0 w-full md:flex-1 max-w-[420px] rounded-2xl border shadow-[0_20px_50px_var(--line)] p-8 sm:p-10 flex flex-col justify-between min-h-[240px] transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: 'var(--cat-green-bg)',
              borderColor: 'var(--cat-green-border)',
            }}
          >
            <div>
              <h4
                className="font-space tracking-widest uppercase text-[11px] font-bold mb-5"
                style={{ color: 'var(--cat-green-text)' }}
              >
                After
              </h4>
              <p className="font-inter text-[22px] sm:text-[26px] font-bold text-ink leading-snug mb-8">
                "I actually remember it."
              </p>
            </div>
            <div className="space-y-3 opacity-60">
              <div className="h-2 w-[85%] rounded-full" style={{ background: 'var(--cat-green-border)' }} />
              <div className="h-2 w-[60%] rounded-full" style={{ background: 'var(--cat-green-border)' }} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
