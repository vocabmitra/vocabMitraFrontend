import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
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
  const { vocab } = vocabCard;
  const tags = parseUseCaseTags(vocab.useCaseTag);
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Dictionary entry for ${vocab.vocab}`}
    >
      <div
        className="relative w-full max-w-[680px] max-h-[90vh] flex flex-col rounded-2xl animate-modal-in"
        style={{
          background: 'rgba(18,18,18,0.85)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: `1px solid rgba(${rgb},0.20)`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(${rgb},0.08)`,
          paddingTop: '42px',
          paddingLeft: '42px',
          paddingRight: '42px',
          paddingBottom: '36px',
        }}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 font-inter text-[12px] font-medium text-neutral-400 cursor-pointer transition-all duration-200 hover:text-white rounded-lg py-1.5 px-3"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          aria-label="Close entry"
          id="open-vocab-close"
        >
          Close
          <X size={13} strokeWidth={2} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 mt-2.5 pr-2 custom-scrollbar">

          {/* Headword row */}
          <div className="flex items-center gap-3.5 flex-wrap mb-2.5 pl-8 pr-[60px]">
            <h2 className="font-bricolage text-[clamp(36px,5vw,50px)] font-bold text-white m-0">
              {vocab.vocab}
            </h2>
            {tags.map((tag) => (
              <CategoryBadge key={tag} tag={tag} active />
            ))}
          </div>

          {/* Type */}
          <div className="font-space text-sm text-neutral-600 mb-6 pl-8">
            / {vocab.vocabType} /
          </div>

          {/* Meaning */}
          <div className="text-[19px] font-medium text-neutral-200 leading-[1.6] max-w-[48ch] mb-6 pl-8">
            {vocab.meaning}
          </div>

          {/* Mnemonic — glassmorphic amber box */}
          {vocab.trick && (
            <div
              className="ml-8 mb-6 max-w-[50ch] rounded-xl py-4 px-5"
              style={{
                background: `rgba(${rgb},0.07)`,
                border: `1px solid rgba(${rgb},0.20)`,
              }}
            >
              <div
                className="font-inter text-xs font-semibold tracking-wide uppercase mb-1.5"
                style={{ color: `rgba(${rgb},0.9)` }}
              >
                Memory Hook
              </div>
              <div className="font-inter font-medium text-[15px] text-neutral-200 leading-relaxed">
                "{vocab.trick}"
              </div>
            </div>
          )}

          {/* Example */}
          {vocab.example && (
            <div
              className="ml-8 pl-4 text-[15px] text-neutral-500 italic max-w-[50ch] mb-9"
              style={{ borderLeft: `3px solid rgba(${rgb},0.35)` }}
            >
              "{vocab.example}"
              <span className="block font-space not-italic text-[10.5px] font-bold tracking-[0.05em] uppercase mt-2 text-neutral-700">
                Example usage
              </span>
            </div>
          )}

          {/* Divider */}
          <div
            className="h-px ml-8 mb-6"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />

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
            <AddToPracticeToggleButton
              vocabId={vocab.id}
              addedToPractice={vocabCard.addedToPractice}
            />
            <div className="ml-auto">
              <a
                href={`https://www.merriam-webster.com/dictionary/${encodeURIComponent(vocab.vocab)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-neutral-600 font-space transition-colors duration-150 no-underline hover:text-neutral-300"
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
