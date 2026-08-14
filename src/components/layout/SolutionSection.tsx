import { Lightbulb, ArrowRight } from 'lucide-react';

export function SolutionSection() {
  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col items-center">
        
        {/* Header Content */}
        <div className="max-w-[700px] w-full text-center mb-16">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-4">
            The VocabMitra Difference
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em]">
            We make difficult words memorable.
          </h2>
        </div>

        {/* Content Row */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-24">
          
          {/* Left Content (Mock Card) */}
          <div className="w-full max-w-[500px]">
            <div className="w-full bg-cream-card rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] p-7 sm:p-9 z-10 transition-transform duration-300 hover:-translate-y-1">
              
              {/* Card Header */}
              <div className="mb-6">
                <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-ink mb-1.5 leading-none uppercase tracking-[-0.02em]">
                  Lassitude
                </h3>
                <p className="text-ink-soft text-[15px] sm:text-[16px] font-medium">
                  Meaning &middot; Tiredness / lack of energy
                </p>
              </div>

              {/* Mnemonic Box */}
              <div className="bg-[#FEF3C7] border-2 border-ink rounded-xl p-5 mb-6 shadow-[4px_4px_0_var(--ink)]">
                <div className="flex items-center gap-2 text-ink/60 font-space text-[11px] font-bold tracking-widest uppercase mb-3">
                  <Lightbulb size={14} className="text-yellow-600" />
                  Mnemonic
                </div>
                <p className="font-inter text-[18px] sm:text-[20px] font-bold text-ink leading-snug">
                  Lassi pi ke nind aati hai.
                </p>
              </div>

              {/* Chips Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-ink bg-white shadow-[2px_2px_0_var(--ink)]">
                  <span className="text-[14px]">🥛</span>
                  <span className="text-ink font-bold text-[11px] font-space tracking-wider uppercase">Lassi</span>
                </div>
                
                <ArrowRight size={14} className="text-ink-soft/50" />
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-ink bg-[#DBEAFE] shadow-[2px_2px_0_var(--ink)]">
                  <span className="text-[14px]">😴</span>
                  <span className="text-ink font-bold text-[11px] font-space tracking-wider uppercase">Sleepy</span>
                </div>

                <ArrowRight size={14} className="text-ink-soft/50" />

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-ink bg-[#DCFCE7] shadow-[2px_2px_0_var(--ink)]">
                  <span className="text-[14px]">🤧</span>
                  <span className="text-ink font-bold text-[11px] font-space tracking-wider uppercase">Tired</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Content (Fox Mascot) */}
          <div className="w-full lg:w-auto flex justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <img
              src="/images/fox_idea.png"
              alt="Fox with an idea"
              className="w-[220px] sm:w-[280px] lg:w-[320px] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500 origin-bottom"
            />
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
