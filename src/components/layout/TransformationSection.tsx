export function TransformationSection() {
  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col items-center">
        
        {/* Header Content */}
        <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] max-w-[800px] mx-auto text-center mb-16 sm:mb-24">
          From "I keep forgetting it"<br className="hidden sm:block" /> to "I actually remember it."
        </h2>

        {/* Before / After Flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-[1000px]">
          
          {/* BEFORE CARD */}
          <div className="w-full md:flex-1 max-w-[420px] bg-white rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] p-8 sm:p-10 flex flex-col justify-between min-h-[240px] transition-transform duration-300 hover:-translate-y-1">
            <div>
              <h4 className="font-space tracking-widest uppercase text-ink-soft text-[11px] font-bold mb-5">
                Before
              </h4>
              <p className="font-inter text-[18px] sm:text-[20px] font-bold text-ink/70 leading-snug mb-8">
                "I know this word... but I keep forgetting it."
              </p>
            </div>
            <div className="space-y-3 opacity-40">
              <div className="h-2 w-[85%] bg-ink/30 rounded-full" />
              <div className="h-2 w-[60%] bg-ink/30 rounded-full" />
            </div>
          </div>

          {/* CENTER VOCABMITRA PILL */}
          <div className="flex flex-col items-center gap-4 shrink-0 py-4 md:py-0">
            <div className="px-6 py-3 bg-upsc text-white font-bricolage text-[18px] font-bold rounded-full border-2 border-ink shadow-[4px_4px_0_var(--ink)] rotate-[-3deg] hover:rotate-[3deg] transition-transform duration-300">
              VocabMitra
            </div>
            <p className="text-[11px] text-ink-soft font-space font-bold tracking-widest text-center uppercase leading-relaxed">
              Learn &rarr; Mnemonic &rarr;<br />
              Practice &rarr; Repeat
            </p>
          </div>

          {/* AFTER CARD */}
          <div className="w-full md:flex-1 max-w-[420px] bg-[#DCFCE7] rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] p-8 sm:p-10 flex flex-col justify-between min-h-[240px] transition-transform duration-300 hover:-translate-y-1">
            <div>
              <h4 className="font-space tracking-widest uppercase text-green-700 text-[11px] font-bold mb-5">
                After
              </h4>
              <p className="font-inter text-[22px] sm:text-[26px] font-bold text-ink leading-snug mb-8">
                "I actually remember it."
              </p>
            </div>
            <div className="space-y-3 opacity-60">
              <div className="h-2 w-[85%] bg-green-700/30 rounded-full" />
              <div className="h-2 w-[60%] bg-green-700/30 rounded-full" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
