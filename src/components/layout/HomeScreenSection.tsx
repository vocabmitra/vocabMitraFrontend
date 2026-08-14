import { Lightbulb } from 'lucide-react';

export function HomeScreenSection() {
  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden outline">
      <div className="vv-container flex flex-col items-center">

        {/* Header Content */}
        <div className="w-full max-w-[900px] text-left mb-16">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-4">
            Your Home Screen
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-6 max-w-[600px]">
            Everything you're learning, in one place.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65] max-w-[600px]">
            Not a wall of statistics. Just a clear answer to the only question that matters when you open the app: what should I learn or practice right now?
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="w-full max-w-[900px] bg-cream-card rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[16px_16px_0_var(--ink)] p-5 sm:p-8 flex flex-col gap-5 sm:gap-6 transition-transform duration-300 hover:-translate-y-1">

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-5 sm:gap-6">

            {/* Continue Learning Card */}
            <div className="bg-upsc rounded-[20px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-6 sm:p-8 flex flex-col justify-center">
              <h4 className="text-[11px] font-space text-white/80 tracking-widest uppercase font-bold mb-3">
                Continue Learning
              </h4>
              <h3 className="font-bricolage text-[26px] sm:text-[32px] text-white font-bold leading-[1.1] mb-2 tracking-[-0.01em]">
                8 words waiting from yesterday
              </h3>
              <p className="text-white/90 text-[15px] font-medium mb-6">
                Pick up where you stopped — starting with LASSITUDE.
              </p>
              <div className="w-full h-2 bg-ink/30 rounded-full overflow-hidden">
                <div className="w-[35%] h-full bg-white rounded-full" />
              </div>
            </div>

            {/* Today's Learning Card */}
            <div className="bg-white rounded-[20px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-6 sm:p-8 flex flex-col justify-center">
              <h4 className="text-[11px] font-space text-ink/50 tracking-widest uppercase font-bold mb-3">
                Today's Learning
              </h4>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bricolage text-[48px] font-extrabold text-ink leading-none">12</span>
              </div>
              <p className="text-[14px] text-ink-soft font-medium mb-6">
                new words met today
              </p>
              <div className="flex gap-4">
                <span className="text-[11px] font-space font-bold text-ink/40 uppercase tracking-wider">Alacrity</span>
                <span className="text-[11px] font-space font-bold text-ink/40 uppercase tracking-wider">Candid</span>
                <span className="text-[11px] font-space font-bold text-ink/40 uppercase tracking-wider">Obstinate</span>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5 sm:gap-6">

            {/* Next Practice Card */}
            <div className="bg-white rounded-[20px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] font-space text-ink/50 tracking-widest uppercase font-bold mb-3">
                  Next Practice
                </h4>
                <h3 className="font-bricolage text-[24px] font-bold text-ink leading-none mb-2">
                  15 cards ready
                </h3>
                <p className="text-[14.5px] text-ink-soft font-medium mb-8">
                  Scheduled for you &middot; 6 min
                </p>
              </div>
              <button className="w-full py-3.5 rounded-[12px] bg-ink text-white font-bold text-[15px] hover:bg-ink/80 transition-colors shadow-sm">
                Start practice
              </button>
            </div>

            {/* Word of the Day Card */}
            <div className="bg-[#FEF3C7] rounded-[20px] border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-6 sm:p-8 flex flex-col justify-center">
              <h4 className="text-[11px] font-space text-yellow-700/60 tracking-widest uppercase font-bold mb-3">
                Word of the Day
              </h4>
              <h3 className="font-bricolage text-[28px] font-bold text-ink uppercase tracking-[-0.02em] mb-1.5">
                Ephemeral
              </h3>
              <p className="text-[16px] text-ink-soft font-medium mb-5">
                Lasting for a very short time.
              </p>
              <div className="flex items-start gap-2.5">
                <Lightbulb size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="font-inter text-[16px] font-bold text-ink leading-snug">
                  "Ephemeral cheez, pal bhar ki mehmaan."
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
