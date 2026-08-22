import type { VocabCard as VocabCardType } from '../../types';
import { parseUseCaseTags } from '../../types';

interface VocabCardProps {
  vocabCard: VocabCardType;
  onClick: () => void;
}

// Tag → RGB for glow + badge tint
const TAG_RGB: Record<string, string> = {
  upsc:    '249,115,22',
  ssc:     '99,102,241',
  banking: '20,184,166',
  cat:     '168,85,247',
  gre:     '59,130,246',
  cuet:    '236,72,153',
};

export function VocabCard({ vocabCard, onClick }: VocabCardProps) {
  const { vocab } = vocabCard;
  const tags = parseUseCaseTags(vocab.useCaseTag);
  const mainTag = tags[0]?.toLowerCase() || 'upsc';
  const rgb = TAG_RGB[mainTag] || '249,115,22';

  return (
    <div
      className="group relative flex flex-col rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 bg-cream-card border border-line p-[22px] shadow-[0_2px_12px_var(--line)] hover:shadow-[0_8px_24px_var(--line)]"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`Open entry for ${vocab.vocab}`}
    >
      {/* Corner radial glow — tag color, bottom-right */}
      <div
        className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-300 opacity-[0.15] group-hover:opacity-[0.25]"
        style={{
          background: `radial-gradient(circle, rgb(${rgb}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Hover border brightening */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.25)` }}
      />

      <div className="relative z-10 flex flex-col h-full gap-3">

        {/* Tag badge */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 font-space text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: `rgba(${rgb},0.12)`,
              color: `rgb(${rgb})`,
              border: `1px solid rgba(${rgb},0.25)`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: `rgb(${rgb})` }}
            />
            {tags[0]?.toUpperCase() || 'VOCAB'}
          </span>

          {/* Arrow — reveals on hover */}
          <span className="opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-ink-soft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        {/* Word */}
        <h3 className="font-bricolage text-[23px] font-bold text-ink leading-tight tracking-[-0.01em] mt-1">
          {vocab.vocab}
        </h3>

        {/* Meaning */}
        <p className="font-inter text-[13px] text-ink-soft leading-[1.65] line-clamp-2">
          {vocab.meaning}
        </p>

        {/* Skeleton bars at bottom */}
        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-line">
          <div className="h-[2px] w-[72%] rounded-full bg-line" />
          <div className="h-[2px] w-[50%] rounded-full bg-line" />
        </div>

      </div>
    </div>
  );
}
