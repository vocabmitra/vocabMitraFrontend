import { useRef } from 'react';
import { Lightbulb, Volume2, Search } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { WordReveal } from '../ui/WordReveal';

export function LearningScreenSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    tl.fromTo('.learning-subtext-word',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.015, ease: 'power2.out' }
    );

    tl.fromTo('.learning-list-item',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo('.learning-window',
      { opacity: 0, y: 40, rotationX: 8 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: 'power3.out' },
      0.2
    );

    tl.fromTo('.learning-ui-item',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
      '-=0.4'
    );

    // Hover tilt
    if (cardRef.current && window.matchMedia('(min-width: 768px)').matches) {
      const card = cardRef.current;
      const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.025);
        yTo(y * -0.025);
      };

      const handleMouseLeave = () => { xTo(0); yTo(0); };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-24 overflow-hidden" style={{ perspective: '1200px', background: 'var(--section-bg-1)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left Content */}
        <div className="flex-1 max-w-[600px] w-full">
          <h3 className="font-space text-orange-500 text-sm font-bold tracking-[0.1em] uppercase mb-5">
            The Learning Screen
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            One word. Everything you need to keep it.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] opacity-90 mb-8 max-w-[540px]">
            <WordReveal
              text="Meaning, mnemonic, a sentence you'd actually meet in a paper, and the words that travel with it. Search a word and it joins your learning system on its own."
              wordClassName="learning-subtext-word opacity-0"
            />
          </p>

          <ul className="flex flex-col gap-4">
            {[
              'Searched words are added automatically',
              'Mnemonic sits beside the meaning, not buried under it',
              'Synonyms and antonyms for the paper, not for show',
            ].map((item) => (
              <li key={item} className="learning-list-item flex items-start gap-3 opacity-0">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                <span className="text-[16px] text-neutral-300 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Glassmorphic App Window */}
        <div className="flex-1 w-full flex justify-center lg:justify-end pb-8 pr-2 sm:pr-8">
          <div className="w-full max-w-[500px]">
            <div
              ref={cardRef}
              className="learning-window w-full rounded-2xl overflow-hidden opacity-0"
              style={{
                background: 'var(--glass-card-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--glass-card-border)',
                boxShadow: 'var(--glass-card-shadow)',
              }}
            >

              {/* Window chrome bar */}
              <div
                className="learning-ui-item flex items-center px-4 py-3 opacity-0"
                style={{ borderBottom: '1px solid var(--glass-header-border)', background: 'var(--glass-header-bg)' }}
              >
                <div className="flex gap-1.5 w-[60px]">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-neutral-400"
                    style={{ background: 'var(--glass-search-bg)', border: '1px solid var(--glass-search-border)' }}
                  >
                    <Search size={11} />
                    <span className="text-[11px] font-space tracking-wider uppercase font-semibold">lassitude</span>
                  </div>
                </div>
                <div className="w-[60px]" />
              </div>

              {/* Window body */}
              <div className="p-6 sm:p-8">

                {/* Word title */}
                <div className="learning-ui-item opacity-0 mb-1">
                  <h3 className="font-bricolage text-[32px] sm:text-[36px] font-bold leading-none uppercase tracking-[-0.02em]" style={{ color: 'var(--vocab-card-title)' }}>
                    Lassitude
                  </h3>
                </div>

                {/* Audio button */}
                <div className="learning-ui-item flex items-center gap-3 mb-7 opacity-0">
                  <button
                    className="p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ background: 'var(--glass-search-bg)', border: '1px solid var(--glass-search-border)' }}
                  >
                    <Volume2 size={15} className="text-neutral-300" />
                  </button>
                </div>

                {/* Part of speech */}
                <p className="learning-ui-item italic text-neutral-500 text-[14px] mb-4 opacity-0">Noun</p>

                {/* Meaning */}
                <p className="learning-ui-item text-neutral-200 text-[17px] font-medium mb-7 leading-relaxed opacity-0">
                  Tiredness / lack of energy
                </p>

                {/* Mnemonic — glassmorphic amber */}
                <div
                  className="learning-ui-item rounded-xl p-5 mb-7 opacity-0"
                  style={{
                    background: 'var(--mnemonic-bg)',
                    border: '1px solid var(--mnemonic-border)',
                  }}
                >
                  <div className="flex items-center gap-2 text-amber-400/60 font-space text-[10px] font-bold tracking-widest uppercase mb-2.5">
                    <Lightbulb size={13} className="text-amber-400" />
                    Remember It
                  </div>
                  <p className="font-inter text-[17px] font-semibold leading-snug" style={{ color: 'var(--mnemonic-text)' }}>
                    "Lassi pi ke nind aati hai."
                  </p>
                </div>

                {/* Example */}
                <div className="learning-ui-item mb-7 opacity-0">
                  <h4 className="text-[10px] font-space tracking-[0.12em] text-neutral-600 uppercase mb-2 font-bold">Example</h4>
                  <p className="text-[15px] italic text-neutral-400 font-medium leading-relaxed">
                    "After the long journey, he felt a deep sense of lassitude."
                  </p>
                </div>

                {/* Synonyms & Antonyms */}
                <div className="learning-ui-item grid grid-cols-2 gap-6 opacity-0">
                  <div>
                    <h4 className="text-[10px] font-space tracking-[0.12em] text-emerald-500/70 uppercase mb-2 font-bold">Synonyms</h4>
                    <p className="text-[14px] text-neutral-500 font-medium leading-relaxed">
                      fatigue · weariness · lethargy
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-space tracking-[0.12em] text-orange-500/70 uppercase mb-2 font-bold">Antonyms</h4>
                    <p className="text-[14px] text-neutral-500 font-medium leading-relaxed">
                      energy · vitality
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
