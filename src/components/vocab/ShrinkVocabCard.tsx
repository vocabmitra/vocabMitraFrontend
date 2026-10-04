import type { VocabCard as VocabCardType } from '../../types';
import { BookmarkToggleButton } from './BookmarkToggleButton';

interface ShrinkVocabCardProps {
  vocabCard: VocabCardType;
  tag?: string;
  onClick?: () => void;
}

const PASTEL_THEMES = [
  {
    id: 'orange',
    tagBg: 'bg-[#ffedd5] text-[#ea580c]',
    shadowBlob: 'bg-[#f97316]/25',
    borderColor: 'border-[#ffedd5]',
    pillBg: 'bg-[#fff3e0] text-[#ea580c]',
  },
  {
    id: 'purple',
    tagBg: 'bg-[#f3e8ff] text-[#9333ea]',
    shadowBlob: 'bg-[#a855f7]/25',
    borderColor: 'border-[#f3e8ff]',
    pillBg: 'bg-[#faf5ff] text-[#9333ea]',
  },
  {
    id: 'blue',
    tagBg: 'bg-[#e0f2fe] text-[#0284c7]',
    shadowBlob: 'bg-[#38bdf8]/25',
    borderColor: 'border-[#e0f2fe]',
    pillBg: 'bg-[#f0f9ff] text-[#0284c7]',
  },
  {
    id: 'green',
    tagBg: 'bg-[#dcfce7] text-[#16a34a]',
    shadowBlob: 'bg-[#4ade80]/25',
    borderColor: 'border-[#dcfce7]',
    pillBg: 'bg-[#f0fdf4] text-[#16a34a]',
  },
  {
    id: 'yellow',
    tagBg: 'bg-[#fef9c3] text-[#ca8a04]',
    shadowBlob: 'bg-[#facc15]/25',
    borderColor: 'border-[#fef9c3]',
    pillBg: 'bg-[#fefce8] text-[#ca8a04]',
  },
];

export function ShrinkVocabCard({ vocabCard, tag, onClick }: ShrinkVocabCardProps) {
  const vocabObj = (vocabCard && (vocabCard as any).vocabResponse
    ? (vocabCard as any).vocabResponse
    : vocabCard && typeof (vocabCard as any).vocab === 'object'
      ? (vocabCard as any).vocab
      : vocabCard) as any;

  const wordTitle = vocabObj?.vocab || vocabObj?.word || 'WORD';
  const isBookmarked = Boolean(vocabCard?.isBookmarked ?? (vocabCard as any)?.bookmarked);

  // Hash theme selection based on word string
  const hash = wordTitle.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const theme = PASTEL_THEMES[hash % PASTEL_THEMES.length];

  // Derive default tag if not passed
  const displayTag = tag || `CUET 2024`;

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      tabIndex={0}
      role="button"
      className="group relative flex flex-col justify-between rounded-[22px] bg-[#fffcf8] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#f3e8d9] transition-all duration-300 hover:-translate-y-1 overflow-hidden min-h-[180px] cursor-pointer select-none"
    >
      {/* ── Top Row: Tag Pill Left & Bookmark Right ── */}
      <div className="flex items-center justify-between z-10 w-full">
        <span className={`px-3 py-1 rounded-full font-inter font-extrabold text-[11px] tracking-wide uppercase ${theme.tagBg}`}>
          {displayTag}
        </span>

        <div onClick={(e) => e.stopPropagation()}>
          {vocabObj?.id && (
            <BookmarkToggleButton
              vocabId={vocabObj.id}
              isBookmarked={isBookmarked}
              variant="ribbon"
            />
          )}
        </div>
      </div>

      {/* ── Center: Word Title ── */}
      <div className="my-4 text-center z-10 px-2">
        <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-[#0f172a] leading-tight tracking-tight">
          {wordTitle}
        </h3>
      </div>

      {/* ── Bottom Row: Tap to reveal button pill ── */}
      <div className="flex justify-center z-10">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-inter font-bold text-[12px] border border-black/5 shadow-2xs group-hover:scale-105 transition-transform duration-200 ${theme.pillBg}`}
        >
          <span className="text-[13px]">👆</span>
          <span>Tap to reveal</span>
          <span className="text-[13px]">→</span>
        </div>
      </div>

      {/* ── Bottom-Right Section: Color-Themed Shadow Blob ── */}
      <div
        className={`absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-40 transition-transform duration-500 group-hover:scale-125 ${theme.shadowBlob}`}
      />
    </div>
  );
}

// Re-export as ExamVocabCard for backwards compatibility if needed
export { ShrinkVocabCard as ExamVocabCard };
