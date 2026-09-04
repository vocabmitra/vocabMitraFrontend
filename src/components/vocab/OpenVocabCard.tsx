import { useEffect } from 'react';
import { X, ExternalLink, Info } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { VocabCard as VocabCardType } from '../../types';
import { parseUseCaseTags } from '../../types';
import { MarkAsLearnedToggleButton } from './MarkAsLearnedToggleButton';
import { BookmarkToggleButton } from './BookmarkToggleButton';
import { AddToPracticeToggleButton } from './AddToPracticeToggleButton';
import { CategoryBadge } from './CategoryBadge';

interface OpenVocabCardProps {
  vocabCard: VocabCardType;
  isOpen: boolean;
  onClose: () => void;
}

const TAG_GLOW: Record<string, string> = {
  upsc: '249,115,22',
  ssc: '99,102,241',
  banking: '20,184,166',
  cat: '168,85,247',
  gre: '59,130,246',
  cuet: '236,72,153',
};

export function OpenVocabCard({ vocabCard, isOpen, onClose }: OpenVocabCardProps) {
  const vocab = (vocabCard && (vocabCard as any).vocabResponse
    ? (vocabCard as any).vocabResponse
    : vocabCard && typeof (vocabCard as any).vocab === 'object'
    ? (vocabCard as any).vocab
    : vocabCard) as any;
  const tags = parseUseCaseTags(vocab?.useCaseTag || '');
  const mainTag = tags[0]?.toLowerCase() || 'upsc';
  const rgb = TAG_GLOW[mainTag] || '249,115,22';

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md transition-all duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Dictionary entry for ${vocab.vocab}`}
    >
      <div
        className="relative w-full max-w-[680px] max-h-[90vh] flex flex-col rounded-3xl p-7 sm:p-10 bg-cream-card dark:bg-[#121212] text-ink dark:text-white border border-black/10 dark:border-white/10 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-modal-in overflow-hidden"
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex items-center gap-1.5 font-inter text-[12.5px] font-semibold text-ink-soft dark:text-neutral-300 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/10 rounded-full py-1.5 px-3.5 transition-all cursor-pointer"
          aria-label="Close entry"
          id="open-vocab-close"
        >
          Close
          <X size={14} strokeWidth={2.5} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 mt-1 pr-2 custom-scrollbar">

          {/* Headword row */}
          <div className="flex items-center gap-3.5 flex-wrap mb-2.5 sm:pr-[60px]">
            <h2 className="font-bricolage text-[clamp(32px,5vw,48px)] font-extrabold text-ink dark:text-white m-0 tracking-tight uppercase">
              {vocab.vocab}
            </h2>
            {tags.map((tag) => (
              <CategoryBadge key={tag} tag={tag} active />
            ))}
          </div>

          {/* Type */}
          <div className="font-space text-sm font-semibold text-ink-soft dark:text-neutral-400 mb-5">
            / {vocab.vocabType} /
          </div>

          {/* Meaning */}
          <div className="text-[18px] sm:text-[20px] font-medium text-ink dark:text-neutral-200 leading-[1.6] max-w-[50ch] mb-6">
            {vocab.meaning}
          </div>

          {/* Mnemonic — Memory Hook box */}
          {vocab.trick && (
            <div
              className="mb-6 max-w-[50ch] rounded-2xl p-5 bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 dark:border-orange-500/30"
            >
              <div
                className="font-inter text-xs font-bold tracking-wider uppercase mb-1.5 text-orange-600 dark:text-orange-400"
              >
                Memory Hook
              </div>
              <div className="font-inter font-semibold text-[15px] text-ink dark:text-white leading-relaxed">
                "{vocab.trick}"
              </div>
            </div>
          )}

          {/* Example */}
          {vocab.example && (
            <div
              className="pl-4 text-[15px] text-ink-soft dark:text-neutral-400 italic max-w-[50ch] mb-6 border-l-4 border-orange-500/40"
            >
              "{vocab.example}"
              <span className="block font-space not-italic text-[11px] font-bold tracking-wider uppercase mt-2 text-ink-soft/70 dark:text-neutral-500">
                Example usage
              </span>
            </div>
          )}

          {/* Usage Note / Message */}
          {vocab.message && (
            <div className="mb-6 max-w-[50ch] rounded-2xl p-4 bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 dark:border-blue-500/30">
              <div className="font-inter text-xs font-bold tracking-wider uppercase mb-1 text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Info size={14} /> Usage Note / Context
              </div>
              <div className="font-inter font-medium text-[14px] text-ink dark:text-neutral-200 leading-relaxed">
                {vocab.message}
              </div>
            </div>
          )}

          {/* Divider */}
          <div
            className="h-px mb-6 bg-black/10 dark:bg-white/10"
          />

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <MarkAsLearnedToggleButton
              vocabId={vocab.id}
              isLearned={Boolean(vocabCard?.isLearned ?? (vocabCard as any)?.learned)}
            />
            <BookmarkToggleButton
              vocabId={vocab.id}
              isBookmarked={Boolean(vocabCard?.isBookmarked ?? (vocabCard as any)?.bookmarked)}
            />
            <AddToPracticeToggleButton
              vocabId={vocab.id}
              addedToPractice={vocabCard.addedToPractice}
            />
            <div className="ml-auto">
              <a
                href={`https://www.merriam-webster.com/dictionary/${encodeURIComponent(vocab.vocab)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-ink-soft hover:text-ink dark:text-neutral-400 dark:hover:text-white font-space transition-colors no-underline"
              >
                <ExternalLink size={13} strokeWidth={2.5} />
                Merriam-Webster
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
