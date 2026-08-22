import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function VocabularySection() {
  const sectionRef = useRef<HTMLElement>(null);

  const words = [
    { word: 'Lassitude', next: 'Next practice in 2 days', progress: '20%' },
    { word: 'Obstinate', next: 'Next practice in 2 days', progress: '30%' },
    { word: 'Alacrity', next: 'Next practice in 2 days', progress: '50%' },
    { word: 'Candid', next: 'Next practice in 2 days', progress: '60%' },
  ];

  useGSAP(() => {
    gsap.utils.toArray('.vocab-progress').forEach((bar: any, index) => {
      const targetWidth = bar.getAttribute('data-width');
      gsap.to(bar, {
        width: targetWidth,
        duration: 1,
        ease: 'power2.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
        }
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-24 overflow-hidden" style={{ background: 'var(--section-bg-2)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col items-center">

        {/* Header Content */}
        <div className="max-w-[700px] w-full text-center mb-6">
          <h3 className="font-space text-orange-500 text-sm font-bold tracking-[0.1em] uppercase mb-4">
            My Vocabulary
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-6">
            Your words, growing quietly in the background.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65]">
            Two honest states: still learning, and mastered. Nothing labelled weak or forgotten.
          </p>
        </div>

        {/* UI Mockup Container */}
        <div className="w-full max-w-[700px] mx-auto mt-16 bg-cream-card rounded-2xl border border-line shadow-2xl shadow-black/10 overflow-hidden transition-transform duration-300 hover:-translate-y-1">

          {/* Top Toggle */}
          <div className="flex border-b border-line p-4 sm:p-5 bg-cream gap-3">
            <button className="flex-1 py-3 sm:py-3.5 text-center rounded-xl bg-orange-500 text-white font-bold text-[15px] shadow-[0_2px_12px_rgba(249,115,22,0.35)] hover:bg-orange-400 transition-all">
              Learning
            </button>
            <button className="flex-1 py-3 sm:py-3.5 text-center rounded-xl bg-transparent text-ink-soft font-bold text-[15px] hover:text-ink hover:bg-line transition-colors">
              Mastered
            </button>
          </div>

          {/* List Area */}
          <div className="flex flex-col">
            {words.map((item, index) => (
              <div
                key={item.word}
                className={`flex justify-between items-center p-6 sm:px-8 sm:py-7 hover:bg-line transition-colors cursor-pointer ${
                  index !== words.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <div>
                  <h4 className="font-bricolage text-[20px] sm:text-[22px] font-bold text-ink uppercase mb-1 tracking-[-0.01em]">
                    {item.word}
                  </h4>
                  <p className="text-[14px] sm:text-[14.5px] text-ink-soft font-medium">
                    {item.next}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-[100px] sm:w-[140px] h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className="vocab-progress h-full bg-orange-500 rounded-full w-0"
                    data-width={item.progress}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
