import { useState } from 'react';
import { Lightbulb, Timer, Infinity, Check, RotateCcw } from 'lucide-react';

export function PracticeSection() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        
        {/* Left Column: Text Content */}
        <div className="flex-1 w-full max-w-[600px]">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-5">
            Practice
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            Flip, recall, move on.<br />
            That's the whole loop.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] max-w-[540px] mb-8">
            Try to recall the meaning, reveal, and tell VocabMitra how it went. Choose <strong>Practice Again</strong> and the word quietly moves up the queue and returns sooner. You never touch the algorithm.
          </p>

          {/* Toggle UI */}
          <div className="flex p-1.5 bg-cream-card border-2 border-ink shadow-[4px_4px_0_var(--ink)] w-fit rounded-full">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-upsc text-white font-bold text-[15px] shadow-[2px_2px_0_var(--ink)]">
              <Timer size={16} />
              Timed
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-ink-soft font-bold text-[15px] hover:text-ink transition-colors">
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
              <div className="absolute inset-0 w-full h-full bg-cream-card rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] [backface-visibility:hidden] flex flex-col p-8 sm:p-10">
                
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
                  className="w-full py-4 rounded-xl bg-upsc text-white font-bold text-[18px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] hover:translate-y-px hover:shadow-[2px_2px_0_var(--ink)] transition-all active:translate-y-[4px] active:shadow-none"
                >
                  Reveal
                </button>
              </div>

              {/* Back Face (Revealed) */}
              <div className="absolute inset-0 w-full h-full bg-cream-card rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col p-8 sm:p-10">
                
                <div className="text-center mt-2 mb-auto">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#DCFCE7] text-green-800 border-2 border-ink font-space text-[11px] font-bold tracking-widest uppercase">
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
                  
                  <div className="w-full bg-[#FEF3C7] border-2 border-ink rounded-xl p-4 shadow-[4px_4px_0_var(--ink)] flex items-start gap-3 text-left">
                    <Lightbulb size={18} className="text-yellow-600 mt-0.5 shrink-0" />
                    <p className="font-inter text-[15px] font-bold text-ink leading-snug">
                      "Lassi pi ke nind aati hai."
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsRevealed(false)} // resets for demo
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#DCFCE7] text-green-900 font-bold text-[15px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] hover:translate-y-px hover:shadow-[2px_2px_0_var(--ink)] transition-all active:translate-y-[4px] active:shadow-none"
                  >
                    <Check size={18} strokeWidth={3} />
                    Learned
                  </button>
                  <button 
                    onClick={() => setIsRevealed(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-ink font-bold text-[15px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] hover:translate-y-px hover:shadow-[2px_2px_0_var(--ink)] transition-all active:translate-y-[4px] active:shadow-none"
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
