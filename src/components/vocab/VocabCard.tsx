import type { VocabCard as VocabCardType } from '../../types';
import { parseUseCaseTags } from '../../types';
import { BookOpen } from 'lucide-react';
import { BookmarkToggleButton } from './BookmarkToggleButton';
import { MarkAsLearnedToggleButton } from './MarkAsLearnedToggleButton';

interface VocabCardProps {
  vocabCard: VocabCardType;
  onClick: () => void;
}

export function VocabCard({ vocabCard, onClick }: VocabCardProps) {
  // Support vocabResponse envelope, wrapped VocabCard ({ vocab: {...} }) and direct Vocab object
  const vocabObj = (vocabCard && (vocabCard as any).vocabResponse
    ? (vocabCard as any).vocabResponse
    : vocabCard && typeof (vocabCard as any).vocab === 'object'
    ? (vocabCard as any).vocab
    : vocabCard) as any;

  const wordTitle = vocabObj?.vocab || vocabObj?.word || 'WORD';
  const meaningText = vocabObj?.meaning || 'No description available.';
  const typeText = vocabObj?.vocabType || 'WORD';
  const trickText = vocabObj?.trick || vocabObj?.mnemonics;

  const isBookmarked = Boolean(vocabCard?.isBookmarked ?? (vocabCard as any)?.bookmarked);
  const isLearned = Boolean(vocabCard?.isLearned ?? (vocabCard as any)?.learned);

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl cursor-pointer bg-cream-card border border-black/5 dark:border-white/5 dark:border-t-white/10 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`Open entry for ${wordTitle}`}
    >
      {/* Top Section: Big Title (Left) and Interactive Action Icons (Right) */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="font-bricolage text-[28px] font-bold text-ink leading-none tracking-tight uppercase">
          {wordTitle}
        </h3>

        {/* Action icons: Learned + Bookmark */}
        <div className="flex items-center gap-2 shrink-0">
          {vocabObj?.id && (
            <>
              <MarkAsLearnedToggleButton vocabId={vocabObj.id} isLearned={isLearned} variant="icon" />
              <BookmarkToggleButton vocabId={vocabObj.id} isBookmarked={isBookmarked} variant="icon" />
            </>
          )}
        </div>
      </div>

      {/* Subtitle / Meaning */}
      <p className="font-inter text-[14px] text-ink-soft leading-relaxed line-clamp-2 mb-6">
        {meaningText}
      </p>

      {/* Bottom Section: Pill Badges */}
      <div className="flex items-center gap-2.5 flex-wrap pt-2">
        <span className="font-inter text-[11px] font-bold text-ink-soft bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full px-4 py-1.5 uppercase tracking-wider">
          {typeText}
        </span>
        {trickText && (
          <span className="font-inter text-[11px] font-bold text-ink-soft bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full px-4 py-1.5 uppercase tracking-wider">
            {trickText}
          </span>
        )}
      </div>
    </div>
  );
}
