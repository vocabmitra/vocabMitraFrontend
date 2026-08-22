import { useState } from 'react';

const CATEGORIES = [
  'Vocabulary',
  'One Word Substitution',
  'Idioms & Phrases',
  'Phrasal Verbs',
  'Foreign Words',
  'Mixed'
];

export function PracticeSystemSection() {
  const [activeCategory, setActiveCategory] = useState('Vocabulary');

  return (
    <section className="w-full bg-transparent py-24 overflow-hidden">
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left Column: Text */}
        <div className="flex-1 w-full max-w-[600px]">
          <h3 className="font-space text-orange-500 text-sm font-bold tracking-[0.1em] uppercase mb-5">
            One Practice System
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            Pick what you want to practice. We deal the cards.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] max-w-[540px]">
            Same clean flashcard flow, six kinds of content. Choose one &mdash; or Mixed, the way the paper actually comes at you &mdash; and VocabMitra shuffles a fresh set every time.
          </p>
        </div>

        {/* Right Column: Mock UI */}
        <div className="flex-1 w-full flex justify-center lg:justify-end pb-8 pr-2 sm:pr-8">

          {/* Main Card Container */}
          <div className="w-full max-w-[520px] bg-cream-card rounded-2xl border border-line shadow-2xl shadow-black/10 p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 transition-transform duration-300 hover:-translate-y-1">

            {/* Category Pills — toggle style */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold text-[13px] sm:text-[14px] border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                        : 'border-line text-ink-soft bg-transparent hover:border-line hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Inner Flashcard Area */}
            <div className="w-full bg-cream rounded-xl border border-line p-6 sm:p-8">

              <div className="flex justify-between items-center mb-8 pb-4 border-b border-line">
                <span className="text-ink-soft font-medium text-[14px]">
                  {activeCategory}
                </span>
                <span className="text-ink-soft font-medium text-[14px]">
                  {activeCategory === 'Vocabulary' ? '2,400 words' : '850 words'}
                </span>
              </div>

              <div className="mb-10">
                <h3 className="font-bricolage text-[32px] sm:text-[36px] font-bold text-ink mb-2 leading-none uppercase tracking-[-0.02em]">
                  {activeCategory === 'Vocabulary' ? 'Lassitude' : 'De Facto'}
                </h3>
                <p className="text-[15px] italic text-ink-soft">
                  Think of the meaning...
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-3">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-400 font-bold text-[12px] sm:text-[13px] rounded-lg border border-orange-500/20">
                  Random card 1 of 15
                </span>
                <span className="text-[13px] sm:text-[14px] text-ink-soft font-medium">
                  Auto-shuffled for you
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
