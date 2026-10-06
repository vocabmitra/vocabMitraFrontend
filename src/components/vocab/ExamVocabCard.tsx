import type { VocabCard as VocabCardType } from '../../types';
import { BookmarkToggleButton } from './BookmarkToggleButton';

interface ExamVocabCardProps {
  vocabCard: VocabCardType;
  tag?: string;
  onClick?: () => void;
}

const PASTEL_THEMES = [
  {
    id: 'orange',
    tagBg: 'bg-[#ffedd5] text-[#ea580c] dark:bg-orange-500/15 dark:text-orange-400',
    shadowBlob: 'bg-[#f97316]/25 dark:bg-[#f97316]/15',
    borderColor: 'border-[#ffedd5] dark:border-orange-500/20',
    pillBg: 'bg-[#fff3e0] text-[#ea580c] dark:bg-orange-500/15 dark:text-orange-400',
  },
  {
    id: 'purple',
    tagBg: 'bg-[#f3e8ff] text-[#9333ea] dark:bg-purple-500/15 dark:text-purple-400',
    shadowBlob: 'bg-[#a855f7]/25 dark:bg-[#a855f7]/15',
    borderColor: 'border-[#f3e8ff] dark:border-purple-500/20',
    pillBg: 'bg-[#faf5ff] text-[#9333ea] dark:bg-purple-500/15 dark:text-purple-400',
  },
  {
    id: 'blue',
    tagBg: 'bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-500/15 dark:text-sky-400',
    shadowBlob: 'bg-[#38bdf8]/25 dark:bg-[#38bdf8]/15',
    borderColor: 'border-[#e0f2fe] dark:border-sky-500/20',
    pillBg: 'bg-[#f0f9ff] text-[#0284c7] dark:bg-sky-500/15 dark:text-sky-400',
  },
  {
    id: 'green',
    tagBg: 'bg-[#dcfce7] text-[#16a34a] dark:bg-emerald-500/15 dark:text-emerald-400',
    shadowBlob: 'bg-[#4ade80]/25 dark:bg-[#4ade80]/15',
    borderColor: 'border-[#dcfce7] dark:border-emerald-500/20',
    pillBg: 'bg-[#f0fdf4] text-[#16a34a] dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  {
    id: 'yellow',
    tagBg: 'bg-[#fef9c3] text-[#ca8a04] dark:bg-amber-500/15 dark:text-amber-400',
    shadowBlob: 'bg-[#facc15]/25 dark:bg-[#facc15]/15',
    borderColor: 'border-[#fef9c3] dark:border-amber-500/20',
    pillBg: 'bg-[#fefce8] text-[#ca8a04] dark:bg-amber-500/15 dark:text-amber-400',
  },
];

export function ExamVocabCard({ vocabCard, tag, onClick }: ExamVocabCardProps) {
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
      className="group relative flex flex-col justify-between rounded-[22px] bg-[#fffcf8] dark:bg-[#18181b] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-[#f3e8d9] dark:border-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden min-h-[180px] cursor-pointer select-none"
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
        <h3 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight tracking-tight">
          {wordTitle}
        </h3>
      </div>

      {/* ── Bottom Row: Tap to reveal button pill ── */}
      <div className="flex justify-center z-10">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-inter font-bold text-[12px] border border-black/5 dark:border-white/10 shadow-2xs group-hover:scale-105 transition-transform duration-200 ${theme.pillBg}`}
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
