import type { VocabCard as VocabCardType } from '../../types';
import { parseUseCaseTags } from '../../types';
import { CategoryBadge } from './CategoryBadge';

interface VocabCardProps {
  vocabCard: VocabCardType;
  onClick: () => void;
}

export function VocabCard({ vocabCard, onClick }: VocabCardProps) {
  const { vocab } = vocabCard;
  const tags = parseUseCaseTags(vocab.useCaseTag);
  
  // Use the first tag to determine the card's accent color (for the spine and shadow)
  const mainTag = tags[0]?.toLowerCase() || 'ink';
  const cardColor = `var(--${mainTag}, var(--ink))`;

  return (
    <div
      className="group relative overflow-hidden cursor-pointer bg-cream-card border-2 border-solid border-ink rounded-2xl pt-[22px] px-5 pb-5 transition-all duration-300 ease-[var(--ease)] shadow-[5px_5px_0_var(--card-color)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:-rotate-1 hover:shadow-[8px_8px_0_var(--card-color)]"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`Open entry for ${vocab.vocab}`}
      style={{ '--card-color': cardColor } as React.CSSProperties}
    >
      {/* Spine */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[7px]"
        style={{ background: cardColor }}
      />

      <div className="font-bricolage text-[21px] font-bold mb-1.5 ml-2 text-ink transition-colors duration-250 ease-[var(--ease)]">
        {vocab.vocab}
      </div>
      
      <div className="text-[13.5px] text-ink-soft mb-3 ml-2 leading-[1.4] line-clamp-2">
        {vocab.meaning}
      </div>
      
      <div className="ml-2 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <CategoryBadge key={tag} tag={tag} active />
        ))}
      </div>
    </div>
  );
}
