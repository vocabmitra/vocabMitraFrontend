import type { VocabCard as VocabCardType } from '../../types';
import { BookmarkToggleButton } from './BookmarkToggleButton';

interface VocabCardProps {
  vocabCard: VocabCardType;
  onClick: () => void;
}

const getCardTheme = (word: string) => {
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const themes = [
    { id: 'orange', bg: 'bg-[#fff6ef]', glow: 'from-[#ffdfbe]', border: 'border-[#f97316]', text: 'text-[#ea580c]', iconBg: 'bg-gradient-to-br from-white to-[#ffdfbe]' },
    { id: 'pink', bg: 'bg-[#fef5f7]', glow: 'from-[#fbcfe8]', border: 'border-[#f43f5e]', text: 'text-[#e11d48]', iconBg: 'bg-gradient-to-br from-white to-[#fbcfe8]' },
    { id: 'blue', bg: 'bg-[#f4faff]', glow: 'from-[#bfdbfe]', border: 'border-[#0ea5e9]', text: 'text-[#0284c7]', iconBg: 'bg-gradient-to-br from-white to-[#bfdbfe]' },
    { id: 'green', bg: 'bg-[#f2fdf7]', glow: 'from-[#bbf7d0]', border: 'border-[#22c55e]', text: 'text-[#16a34a]', iconBg: 'bg-gradient-to-br from-white to-[#bbf7d0]' },
    { id: 'purple', bg: 'bg-[#f8f5ff]', glow: 'from-[#ddd6fe]', border: 'border-[#a855f7]', text: 'text-[#9333ea]', iconBg: 'bg-gradient-to-br from-white to-[#ddd6fe]' },
  ];
  return themes[hash % themes.length];
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
      className={`group relative flex flex-col justify-between rounded-[20px] cursor-pointer ${theme.bg} p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden min-h-[220px] border border-black/5`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`Open entry for ${wordTitle}`}
    >
      {/* Soft Top-Right Glow */}
      <div className={`absolute top-0 right-0 w-[150px] h-[250px] bg-gradient-to-bl ${theme.glow} to-transparent opacity-60 rounded-tl-full pointer-events-none transition-transform duration-500 group-hover:scale-110`} />

      {/* Top Section: Title & Bookmark */}
      <div className="flex items-start justify-between relative z-10 gap-3">
        <div className="flex flex-col pr-1 pt-1">
          <h3 className="font-bricolage text-[20px] sm:text-[22px] font-bold text-[#0f172a] leading-tight tracking-tight uppercase">
            {wordTitle}
          </h3>
          <p className="font-inter text-[14px] text-[#475569] leading-snug mt-2 line-clamp-2 pr-4">
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
        <div className={`mt-5 bg-white/95 backdrop-blur-sm rounded-xl rounded-l-[4px] border-l-[5px] ${theme.border} py-3.5 px-4 shadow-sm relative z-10`}>
          <p className="font-inter text-[13px] text-[#475569] leading-relaxed">
            {exampleText}
          </p>
        </div>
      )}
    </div>
  );
}
