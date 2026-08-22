import { useState } from 'react';
import { Lightbulb, Timer, Infinity, Check, RotateCcw } from 'lucide-react';

export function PracticeSection() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="w-full py-24 overflow-hidden" style={{ background: 'var(--section-bg-1)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left Column: Text Content */}
        <div className="flex-1 w-full max-w-[600px]">
          <h3 className="font-space text-orange-500 text-sm font-bold tracking-[0.1em] uppercase mb-5">
            Practice
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            Flip, recall, move on.<br />
            That's the whole loop.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] max-w-[540px] mb-8">
            Try to recall the meaning, reveal, and tell VocabMitra how it went. Choose <strong className="text-ink">Practice Again</strong> and the word quietly moves up the queue and returns sooner. You never touch the algorithm.
          </p>

          {/* Mode Toggle */}
          <div className="flex p-1.5 bg-cream-card border border-line w-fit rounded-full">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white font-bold text-[15px] shadow-[0_2px_12px_rgba(249,115,22,0.4)]">
              <Timer size={16} />
              Timed
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-neutral-400 font-bold text-[15px] hover:text-neutral-200 transition-colors">
              <Infinity size={16} />
              Untimed
            </button>
          </div>
        </div>

        {/* Right Column: Flipping Card */}
        <div className="flex-1 w-full flex justify-center lg:justify-end pb-8 pr-2 sm:pr-8">

          <div className="relative w-full max-w-[420px] aspect-[4/4.5] sm:aspect-square perspective-[1500px]">

            {/* 3D Container */}
            <div
              className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
                isRevealed ? '[transform:rotateY(180deg)]' : ''
              }`}
            >

              {/* Front Face (Unrevealed) */}
              <div className="absolute inset-0 w-full h-full bg-cream-card rounded-2xl border border-line shadow-2xl shadow-black/10 [backface-visibility:hidden] flex flex-col p-8 sm:p-10">

                <div className="text-center mt-2 mb-auto">
                  <span className="font-space text-ink-soft font-bold tracking-widest text-[13px]">
                    00:08
                  </span>
                </div>

                <div className="text-center mb-auto">
                  <h3 className="font-bricolage text-[36px] sm:text-[42px] font-bold text-ink mb-3 leading-none uppercase tracking-[-0.02em]">
                    Lassitude
                  </h3>
                  <p className="text-ink-soft italic text-[17px]">
                    Think of the meaning...
                  </p>
                </div>

                <button
                  onClick={() => setIsRevealed(true)}
                  className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-[18px] border-none cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:bg-orange-400 hover:shadow-[0_6px_24px_rgba(249,115,22,0.5)] active:scale-[0.98] transition-all duration-200"
                >
                  Reveal
                </button>
              </div>

              {/* Back Face (Revealed) */}
              <div className="absolute inset-0 w-full h-full bg-cream-card rounded-2xl border border-line shadow-2xl shadow-black/10 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col p-8 sm:p-10">

                <div className="text-center mt-2 mb-auto">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-space text-[11px] font-bold tracking-widest uppercase">
                    Revealed
                  </span>
                </div>

                <div className="text-center mb-auto flex flex-col items-center">
                  <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-ink mb-1.5 leading-none uppercase tracking-[-0.02em]">
                    Lassitude
                  </h3>
                  <p className="text-ink-soft text-[16.5px] font-medium mb-6">
                    Tiredness / lack of energy
                  </p>

                  {/* Smart Feedback Box */}
                  <div className="w-full mb-8">
                    <div className="w-full rounded-xl p-4 flex items-start gap-3 text-left" style={{ background: 'var(--mnemonic-bg)', border: '1px solid var(--mnemonic-border)' }}>
                      <Lightbulb size={18} className="text-accent mt-0.5 shrink-0" />
                      <p className="font-inter text-[15px] font-semibold leading-snug" style={{ color: 'var(--mnemonic-text)' }}>
                        "Lassi pi ke nind aati hai."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsRevealed(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-[15px] border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <Check size={18} strokeWidth={3} />
                    Learned
                  </button>
                  <button
                    onClick={() => setIsRevealed(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-surface-2 text-ink-soft font-bold text-[15px] border border-line hover:bg-line active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <RotateCcw size={16} strokeWidth={2.5} />
                    Again
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
