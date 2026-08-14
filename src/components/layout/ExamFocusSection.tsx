import React from 'react';

const EXAMS = ['SSC', 'Banking', 'CUET', 'UPSC', 'Other Competitive Exams'];

export function ExamFocusSection() {
  return (
    <section className="w-full bg-cream py-20 border-y-2 border-ink">
      <div className="vv-container flex flex-col items-center justify-center">
        {/* Heading */}
        <h2 className="font-bricolage text-3xl md:text-[40px] font-bold text-ink text-center mb-5 leading-[1.1] tracking-[-0.02em]">
          Vocabulary that actually<br className="hidden md:block" /> matters for your exams.
        </h2>

        {/* Subheading */}
        <p className="text-ink-soft font-medium text-[15px] md:text-base text-center max-w-[700px] leading-relaxed mb-12">
          Every word, mnemonic and practice set is drawn from what genuinely appears in Indian competitive exam papers — not a random dictionary dump.
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-10">
          {EXAMS.map((exam, index) => (
            <React.Fragment key={exam}>
              {/* Separator Dot (except for first item) */}
              {index > 0 && (
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-upsc border-2 border-ink" />
              )}
              
              {/* Tag Pill */}
              <div className="px-5 py-2.5 rounded-full border-2 border-ink bg-cream-card shadow-[2px_2px_0_var(--ink)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--ink)]">
                <span className="text-ink text-sm md:text-[15px] font-bold tracking-wide">
                  {exam}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Footer text */}
        <p className="text-ink-soft text-[13px] md:text-sm text-center font-bold font-space uppercase tracking-[0.05em]">
          One-word substitutions, idioms, phrasal verbs and foreign words — all exam-weighted.
        </p>
      </div>
    </section>
  );
}
