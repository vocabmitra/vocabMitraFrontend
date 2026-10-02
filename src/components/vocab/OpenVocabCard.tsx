import { useEffect } from 'react';
import { X, ExternalLink, Info, Lightbulb, PenLine, Volume2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { VocabCard as VocabCardType } from '../../types';
import { parseUseCaseTags } from '../../types';
import { MarkAsLearnedToggleButton } from './MarkAsLearnedToggleButton';
import { BookmarkToggleButton } from './BookmarkToggleButton';
import { CategoryBadge } from './CategoryBadge';

interface OpenVocabCardProps {
  vocabCard: VocabCardType;
  isOpen: boolean;
  onClose: () => void;
}

export function OpenVocabCard({ vocabCard, isOpen, onClose }: OpenVocabCardProps) {
  const vocab = (vocabCard && (vocabCard as any).vocabResponse
    ? (vocabCard as any).vocabResponse
    : vocabCard && typeof (vocabCard as any).vocab === 'object'
      ? (vocabCard as any).vocab
      : vocabCard) as any;
  const tags = parseUseCaseTags(vocab?.useCaseTag || '');

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Dictionary entry for ${vocab.vocab}`}
    >
      <div
        className="relative w-full max-w-[700px] max-h-[95vh] flex flex-col rounded-[28px] p-8 sm:p-10 bg-[#fff9f2] text-[#0f172a] shadow-2xl animate-modal-in overflow-hidden border border-white/60"
      >
        {/* Soft background glows */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#ffedd5] to-transparent opacity-90 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[220px] h-[220px] bg-gradient-to-tl from-[#ffedd5] to-transparent opacity-70 rounded-tl-full pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-gradient-to-br from-white to-transparent opacity-60 rounded-br-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex items-center gap-1.5 font-inter text-[13px] font-semibold text-[#0f172a] bg-white/80 backdrop-blur-sm border border-[#fed7aa]/50 rounded-[100px] py-2 px-3.5 shadow-sm hover:bg-white transition-all cursor-pointer"
          aria-label="Close entry"
          id="open-vocab-close"
        >
          Close
          <X size={15} strokeWidth={2.5} />
        </button>

        {/* Scrollable content without visible scrollbar */}
        <div className="relative z-10 overflow-y-auto flex-1 mt-1 pr-1 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* Headword row */}
          <div className="flex items-center gap-3.5 flex-wrap mb-4 sm:pr-[60px]">
            <h2 className="font-bricolage text-[42px] sm:text-[52px] font-bold text-[#0f172a] m-0 tracking-tight uppercase leading-none">
              {vocab.vocab}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {tags.map((tag) => (
                <CategoryBadge key={tag} tag={tag} active />
              ))}
            </div>
          </div>

          {/* Type & Audio */}
          <div className="flex items-center gap-4 mb-6">
            <div className="font-inter text-[13px] font-bold tracking-widest text-[#64748b] uppercase">
              / {vocab.vocabType} /
            </div>
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-[#0f172a] hover:bg-gray-50 transition-colors border border-gray-100">
              <Volume2 size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Meaning */}
          <div className="text-[17.5px] sm:text-[19.5px] font-medium text-[#1e293b] leading-[1.5] max-w-[95%] mb-7">
            {vocab.meaning}
          </div>

          {/* Mnemonic — Memory Hook box */}
          {vocab.trick && (
            <div className="mb-6 max-w-[100%] rounded-[20px] p-5 sm:p-6 bg-gradient-to-r from-[#fff7ed] to-[#fffcf8] border border-[#ffedd5] shadow-[0_2px_10px_rgba(249,115,22,0.03)] relative overflow-hidden">
              {/* decorative left border curve */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#f97316]" />
              <div className="flex gap-3.5 relative z-10">
                <div className="mt-0.5">
                  <Lightbulb size={22} className="text-[#f97316] fill-[#f97316]/20" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-inter text-[11.5px] font-extrabold tracking-wider uppercase mb-1.5 text-[#ea580c]">
                    Memory Hook
                  </div>
                  <div className="font-inter font-bold text-[16.5px] text-[#0f172a] leading-relaxed">
                    "{vocab.trick}"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Example */}
          {vocab.example && (
            <div className="mb-8 max-w-[100%] rounded-[20px] p-5 sm:p-6 bg-[#f0f7ff] border border-[#e0f2fe] shadow-[0_2px_10px_rgba(14,165,233,0.03)] relative overflow-hidden">
              <div className="flex gap-3.5">
                <div className="mt-0.5">
                  <PenLine size={20} className="text-[#0284c7]" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-inter text-[11.5px] font-extrabold tracking-wider uppercase mb-1.5 text-[#0284c7]">
                    Example
                  </div>
                  <div className="font-inter font-medium text-[16.5px] text-[#0f172a] leading-relaxed">
                    {vocab.example}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Note / Message */}
          {vocab.message && (
            <div className="mb-5 max-w-[100%] rounded-[20px] p-2 sm:p-3 bg-purple-50 border border-purple-100 relative">
              <div className="flex items-center gap-2">
                <div className="mt-0.5">
                  <Info size={10} className="text-purple-600" strokeWidth={2.5} />
                </div>
                <div className="font-inter font-medium text-sm text-[#0f172a] leading-relaxed">
                  {vocab.message}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3.5 flex-wrap pt-2">
            <MarkAsLearnedToggleButton
              vocabId={vocab.id}
              isLearned={Boolean(vocabCard?.isLearned ?? (vocabCard as any)?.learned)}
              variant="open-card"
            />
            <BookmarkToggleButton
              vocabId={vocab.id}
              isBookmarked={Boolean(vocabCard?.isBookmarked ?? (vocabCard as any)?.bookmarked)}
              variant="open-card"
            />

            <div className="hidden sm:block w-px h-6 bg-[#cbd5e1] mx-1" />

            <div className="ml-auto w-full sm:w-auto mt-4 sm:mt-0">
              <a
                href={`https://www.merriam-webster.com/dictionary/${encodeURIComponent(vocab.vocab)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-end w-full gap-1.5 text-[14px] font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors no-underline"
              >
                <ExternalLink size={16} strokeWidth={2.5} />
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
