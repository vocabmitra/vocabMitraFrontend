export function CtaSection() {
  return (
    <section className="w-full bg-cream py-24 sm:py-32 border-t-2 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">
        
        {/* Left Column: Text */}
        <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-bricolage text-[clamp(40px,6vw,64px)] font-extrabold text-ink leading-[1.05] tracking-[-0.03em] mb-6">
            Build a vocabulary you actually remember.
          </h2>
          <p className="text-[18px] sm:text-[20px] text-ink-soft font-medium leading-[1.6] max-w-[480px] mb-10">
            Start with one word today. VocabMitra will keep it alive until exam day.
          </p>
          <button className="inline-flex items-center justify-center px-10 py-4 sm:py-5 bg-upsc text-white font-bold text-[18px] sm:text-[20px] rounded-full border-2 border-ink shadow-[6px_6px_0_var(--ink)] hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)] active:translate-y-px active:shadow-[2px_2px_0_var(--ink)] transition-all">
            Get Started
          </button>
        </div>

        {/* Right Column: Mascot Image */}
        <div className="w-full md:w-[40%] flex justify-center md:justify-end">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
            <img 
              src="/images/fox_confidence.png" 
              alt="Confident Fox Mascot" 
              className="w-full h-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] reveal transform transition-all duration-1000 translate-y-8 opacity-0 [&.is-visible]:translate-y-0 [&.is-visible]:opacity-100"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
