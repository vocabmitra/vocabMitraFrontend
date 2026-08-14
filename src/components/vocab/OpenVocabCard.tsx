import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { VocabCard as VocabCardType } from '../../types';
import { parseUseCaseTags } from '../../types';
import { MarkAsLearnedToggleButton } from './MarkAsLearnedToggleButton';
import { BookmarkToggleButton } from './BookmarkToggleButton';

interface OpenVocabCardProps {
  vocabCard: VocabCardType;
  isOpen: boolean;
  onClose: () => void;
}

export function OpenVocabCard({ vocabCard, isOpen, onClose }: OpenVocabCardProps) {
  const { vocab } = vocabCard;
  const tags = parseUseCaseTags(vocab.useCaseTag);
  const mainTag = tags[0]?.toLowerCase() || 'ink';
  const cardColor = `var(--${mainTag}, var(--ink))`;

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[color-mix(in_srgb,var(--cream)_80%,rgba(0,0,0,0.4))] backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Dictionary entry for ${vocab.vocab}`}
      style={{ '--card-color': cardColor } as React.CSSProperties}
    >
      <div
        className="relative w-full max-w-[680px] max-h-[90vh] flex flex-col rounded-[20px] bg-cream-card border-2 border-solid border-ink shadow-[8px_8px_0_var(--card-color)] animate-modal-in pt-[42px] px-[42px] pb-[36px]"
      >
        {/* Punch hole */}
        <div
          className="absolute top-5 left-5 w-4 h-4 rounded-full bg-cream border-2 border-solid border-ink shrink-0"
          aria-hidden="true"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 font-space text-[11px] font-bold text-ink flex items-center gap-1.5 bg-cream border-2 border-solid border-ink rounded-full py-1.5 px-3 cursor-pointer transition-all duration-200 ease-[var(--ease)] hover:bg-line hover:-translate-y-0.5"
          aria-label="Close entry"
          id="open-vocab-close"
        >
          close
          <X size={12} strokeWidth={2.4} />
        </button>

        {/* Content wrapper with scroll if too tall */}
        <div className="overflow-y-auto flex-1 mt-2.5 pr-2 custom-scrollbar">
          
          {/* Headword row */}
          <div className="flex items-center gap-3.5 flex-wrap mb-2.5 pl-8 pr-[60px]">
            <h2 className="font-bricolage text-[clamp(36px,5vw,50px)] font-bold text-ink m-0">
              {vocab.vocab}
            </h2>
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-space text-[12px] font-bold text-white rounded-full py-1 px-3"
                style={{ background: cardColor }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Type */}
          <div className="font-space text-sm text-ink-soft mb-6 pl-8">
            / {vocab.vocabType} /
          </div>

          {/* Meaning */}
          <div className="text-[19px] font-medium leading-[1.6] max-w-[48ch] mb-6 pl-8">
            {vocab.meaning}
          </div>

          {/* Mnemonic (Margin note style) */}
          {vocab.trick && (
            <div
              className="ml-8 mb-6 max-w-[50ch] bg-[color-mix(in_srgb,var(--card-color)_12%,var(--cream-card))] border-2 border-dashed border-[var(--card-color)] rounded-[14px] py-4 px-5"
            >
              <div className="font-space text-[11px] font-bold tracking-[0.05em] uppercase text-[var(--card-color)] mb-1.5">
                Memory Hook
              </div>
              <div className="font-inter font-semibold text-base text-ink leading-[1.5]">
                "{vocab.trick}"
              </div>
            </div>
          )}

          {/* Example */}
          {vocab.example && (
            <div className="ml-8 border-l-4 border-solid border-ink pl-4 text-[15px] text-ink-soft italic max-w-[50ch] mb-9">
              "{vocab.example}"
              <span className="block font-space not-italic text-[10.5px] font-bold tracking-[0.05em] uppercase mt-2 opacity-70">
                Example usage
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="h-0.5 bg-ink ml-8 mb-6 opacity-10" />

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-wrap ml-8">
            <MarkAsLearnedToggleButton
              vocabId={vocab.id}
              isLearned={vocabCard.isLearned}
            />
            <BookmarkToggleButton
              vocabId={vocab.id}
              isBookmarked={vocabCard.isBookmarked}
            />
            <div className="ml-auto">
              <a
                href={`https://www.merriam-webster.com/dictionary/${encodeURIComponent(vocab.vocab)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-ink-soft font-space transition-colors duration-150 no-underline hover:text-[var(--card-color)]"
              >
                <ExternalLink size={12} strokeWidth={2.5} />
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
