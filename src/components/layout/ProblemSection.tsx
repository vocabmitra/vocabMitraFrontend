export function ProblemSection() {
  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        
        {/* Left Content */}
        <div className="flex-1 max-w-[600px] w-full relative z-10">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-5">
            The Real Problem
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-7">
            You've seen the word before. You just can't recall what it means.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] opacity-90 max-w-[540px]">
            Definitions get memorised on Monday and disappear by Thursday. Not because you aren't working hard — because a plain definition gives your brain nothing to hold on to.
          </p>
        </div>

        {/* Right Content (Mock Card + Mascot) */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative pb-8 pr-2 sm:pr-8">
          <div className="relative w-full max-w-[460px] bg-cream-card rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[12px_12px_0_var(--ink)] p-7 sm:p-9 z-10 mx-auto lg:mx-0">
            <div className="mb-6">
              <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-ink mb-2 leading-none uppercase tracking-[-0.02em]">
                Lassitude
              </h3>
              <p className="text-ink-soft text-[16.5px] font-medium">
                Tiredness / lack of energy
              </p>
            </div>

            {/* Skeleton lines for fake content */}
            <div className="flex flex-col gap-3.5 mb-8 opacity-60">
              <div className="w-[85%] h-3 bg-line rounded-full" />
              <div className="w-[100%] h-3 bg-line rounded-full" />
              <div className="w-[60%] h-3 bg-line rounded-full" />
            </div>

            {/* Confusion Quote */}
            <div className="px-5 py-4 rounded-xl bg-upsc/10 border-2 border-upsc/30 border-dashed">
              <p className="text-upsc font-medium font-inter text-[14.5px] italic leading-snug">
                "Wait... was this tiredness or stubbornness..."
              </p>
            </div>

            {/* Overlapping Fox Image */}
            <img
              src="/images/fox_thinking.png"
              alt="Confused Fox Mascot"
              className="absolute -bottom-[45px] -right-[15px] sm:-right-[40px] w-[130px] sm:w-[170px] h-auto z-20 drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-300 origin-bottom animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
