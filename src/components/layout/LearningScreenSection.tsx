import { Lightbulb, Volume2, Search } from 'lucide-react';

export function LearningScreenSection() {
  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        
        {/* Left Content */}
        <div className="flex-1 max-w-[600px] w-full">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-5">
            The Learning Screen
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            One word. Everything you need to keep it.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] opacity-90 mb-8 max-w-[540px]">
            Meaning, mnemonic, a sentence you'd actually meet in a paper, and the words that travel with it. Search a word and it joins your learning system on its own — nothing to save, tag or file away.
          </p>

          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-upsc mt-2 shrink-0" />
              <span className="text-[16px] text-ink font-medium">Searched words are added automatically</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-upsc mt-2 shrink-0" />
              <span className="text-[16px] text-ink font-medium">Mnemonic sits beside the meaning, not buried under it</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-upsc mt-2 shrink-0" />
              <span className="text-[16px] text-ink font-medium">Synonyms and antonyms for the paper, not for show</span>
            </li>
          </ul>
        </div>

        {/* Right Content (App Window Mockup) */}
        <div className="flex-1 w-full flex justify-center lg:justify-end pb-8 pr-2 sm:pr-8">
          <div className="w-full max-w-[520px] bg-cream-card rounded-[20px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            
            {/* Window Header */}
            <div className="flex items-center px-4 py-3 border-b-2 border-ink bg-white">
              <div className="flex gap-1.5 w-[60px]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-ink/20" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-ink/20" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-ink/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 bg-cream px-4 py-1.5 rounded-full border border-ink/20 text-ink-soft">
                  <Search size={12} />
                  <span className="text-[11px] font-space tracking-wider uppercase font-bold">lassitude</span>
                </div>
              </div>
              <div className="w-[60px]" /> {/* Spacer to center search */}
            </div>

            {/* Window Body */}
            <div className="p-6 sm:p-8">
              
              {/* Word Title & Audio */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bricolage text-[32px] sm:text-[36px] font-bold text-ink leading-none uppercase tracking-[-0.02em]">
                  Lassitude
                </h3>
                <button className="p-2.5 rounded-full border-2 border-ink bg-white shadow-[2px_2px_0_var(--ink)] hover:translate-y-px hover:shadow-[1px_1px_0_var(--ink)] transition-all">
                  <Volume2 size={16} className="text-ink" />
                </button>
              </div>
              <p className="text-ink-soft italic text-[15px] mb-5">Noun</p>

              <p className="text-ink text-[17px] font-medium mb-7">
                Tiredness / lack of energy
              </p>

              {/* Mnemonic Box */}
              <div className="bg-[#FEF3C7] border-2 border-ink rounded-xl p-5 mb-7 shadow-[4px_4px_0_var(--ink)]">
                <div className="flex items-center gap-2 text-ink/60 font-space text-[11px] font-bold tracking-widest uppercase mb-3">
                  <Lightbulb size={14} className="text-yellow-600" />
                  Remember It
                </div>
                <p className="font-inter text-[18px] sm:text-[19px] font-bold text-ink leading-snug">
                  "Lassi pi ke nind aati hai."
                </p>
              </div>

              {/* Example */}
              <div className="mb-7">
                <h4 className="text-[11px] font-space tracking-widest text-ink/50 uppercase mb-2 font-bold">
                  Example
                </h4>
                <p className="text-[15.5px] italic text-ink font-medium leading-relaxed">
                  "After the long journey, he felt a deep sense of lassitude."
                </p>
              </div>

              {/* Synonyms & Antonyms */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[11px] font-space tracking-widest text-cat uppercase mb-2 font-bold">
                    Synonyms
                  </h4>
                  <p className="text-[14px] text-ink-soft font-medium leading-relaxed">
                    fatigue &middot; weariness &middot; lethargy
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] font-space tracking-widest text-cuet uppercase mb-2 font-bold">
                    Antonyms
                  </h4>
                  <p className="text-[14px] text-ink-soft font-medium leading-relaxed">
                    energy &middot; vitality
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
