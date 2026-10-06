import type { VocabCard as VocabCardType } from '../../types';
import { BookmarkToggleButton } from './BookmarkToggleButton';

interface VocabCardProps {
  vocabCard: VocabCardType;
  onClick: () => void;
}

const getCardTheme = (word: string) => {
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const themeIds = ['blue', 'pink', 'green', 'purple', 'orange'] as const;
  const id = themeIds[hash % themeIds.length];
  return {
    id,
    bg: `var(--vcard-${id}-bg)`,
    glow: `var(--vcard-${id}-glow)`,
    border: `var(--vcard-${id}-border)`,
    text: `var(--vcard-${id}-text)`,
    iconFrom: `var(--vcard-${id}-icon-from)`,
    iconTo: `var(--vcard-${id}-icon-to)`,
  };
};

export function VocabCard({ vocabCard, onClick }: VocabCardProps) {
  // Support vocabResponse envelope, wrapped VocabCard ({ vocab: {...} }) and direct Vocab object
  const vocabObj = (vocabCard && (vocabCard as any).vocabResponse
    ? (vocabCard as any).vocabResponse
    : vocabCard && typeof (vocabCard as any).vocab === 'object'
      ? (vocabCard as any).vocab
      : vocabCard) as any;

  const wordTitle = vocabObj?.vocab || vocabObj?.word || 'WORD';
  const meaningText = vocabObj?.meaning || 'No description available.';
  const isBookmarked = Boolean(vocabCard?.isBookmarked ?? (vocabCard as any)?.bookmarked);

  // Use example if available, fallback to trick or first synonym
  const exampleText = vocabObj?.example || vocabObj?.trick || vocabObj?.mnemonics || vocabObj?.synonyms?.[0];

  const theme = getCardTheme(wordTitle);

  return (
    <div
      className="group relative flex flex-col justify-between rounded-[20px] cursor-pointer p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden min-h-[220px] border"
      style={{
        background: theme.bg,
        borderColor: 'var(--vcard-card-border)',
      }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`Open entry for ${wordTitle}`}
    >
      {/* Soft Top-Right Glow */}
      <div
        className="absolute top-0 right-0 w-[160px] h-[260px] rounded-tl-full pointer-events-none transition-transform duration-500 group-hover:scale-110 opacity-70"
        style={{
          background: `radial-gradient(circle at top right, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Top Section: Title & Bookmark */}
      <div className="flex items-start justify-between relative z-10 gap-3">
        <div className="flex flex-col pr-1 pt-1">
          <h3 className="font-bricolage text-[20px] sm:text-[22px] font-bold text-ink leading-tight tracking-tight uppercase">
            {wordTitle}
          </h3>
          <p className="font-inter text-[14px] text-ink-soft leading-snug mt-2 line-clamp-2 pr-4">
            {meaningText}
          </p>
        </div>

        {/* Action icon: Bookmark only */}
        <div className="shrink-0 pt-0.5 pr-0.5">
          {vocabObj?.id && (
            <BookmarkToggleButton vocabId={vocabObj.id} isBookmarked={isBookmarked} variant="puffy" theme={theme} />
          )}
        </div>
      </div>

      {/* Example Sentence Box */}
      {exampleText && (
        <div
          className="mt-5 backdrop-blur-sm rounded-xl rounded-l-[4px] py-3.5 px-4 shadow-sm relative z-10 border"
          style={{
            background: 'var(--vcard-example-bg)',
            borderColor: 'var(--vcard-example-border)',
            borderLeftWidth: '5px',
            borderLeftColor: theme.border,
          }}
        >
          <p className="font-inter text-[13px] text-ink-soft leading-relaxed">
            {exampleText}
          </p>
        </div>
      )}
    </div>
  );
}
