import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import type { VocabCard } from '../../types';
import { usePracticeStore } from '../../store/usePracticeStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { logger } from '../../utils/logger';

interface PracticeFlashcardProps {
  card: VocabCard;
}

export function PracticeFlashcard({ card }: PracticeFlashcardProps) {
  const { vocab, isLearned } = card;
  const { nextCard, recordRemembered, recordForgot } = usePracticeStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isActing, setIsActing] = useState(false);

  const flipCard = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  // Remember: mark as learned if not already, then move to next card
  const handleRemember = async () => {
    if (isActing) return;
    setIsActing(true);
    recordRemembered(vocab.id);
    try {
      // Only call the API if the card isn't already learned
      if (!isLearned) {
        await vocabApi.toggleLearned(vocab.id);
      }
    } catch (err) {
      logger.error('[PracticeFlashcard] Failed to mark as learned:', err);
    } finally {
      setIsActing(false);
      nextCard();
    }
  };

  // Forgot: unlearn if currently learned, then move to next card
  const handleForgot = async () => {
    if (isActing) return;
    setIsActing(true);
    recordForgot(vocab.id);
    try {
      // Only call the API if the card is currently learned (to toggle it back)
      if (isLearned) {
        await vocabApi.toggleLearned(vocab.id);
      }
    } catch (err) {
      logger.error('[PracticeFlashcard] Failed to toggle learned state:', err);
    } finally {
      setIsActing(false);
      nextCard();
    }
  };

  return (
    <div className="relative w-full max-w-[520px] mx-auto" style={{ perspective: '1200px' }}>
      {/* ── Card Flip Container ── */}
      <div
        className="relative transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '380px',
        }}
      >
        {/* ── FRONT SIDE ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between rounded-[28px] border-2 border-white/10 bg-[#131722] shadow-2xl p-10 cursor-pointer select-none"
          style={{ backfaceVisibility: 'hidden' }}
          onClick={flipCard}
          role="button"
          tabIndex={0}
          aria-label={`Flash card for ${vocab.vocab}. Click to reveal meaning.`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') flipCard(); }}
        >
          {/* Top spacer */}
          <div className="h-8" />

          {/* Word */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bricolage text-[48px] sm:text-[58px] font-extrabold text-white leading-tight uppercase tracking-tight mb-4">
              {vocab.vocab}
            </h2>
            <p className="font-inter text-[15px] text-white/40 italic font-medium">
              Tap to reveal meaning
            </p>
          </div>

          {/* Bottom tap hint */}
          <div className="flex items-center gap-2 text-white/20">
            <div className="w-8 h-[2px] bg-white/20 rounded-full" />
            <span className="font-inter text-[11px] font-bold uppercase tracking-widest">
              Click card
            </span>
            <div className="w-8 h-[2px] bg-white/20 rounded-full" />
          </div>
        </div>

        {/* ── BACK SIDE ── */}
        <div
          className="absolute inset-0 flex flex-col rounded-[28px] border-2 border-white/10 bg-[#131722] shadow-2xl p-8 sm:p-10"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Revealed pill */}
          <div className="flex justify-center mb-5">
            <div className="px-5 py-1.5 rounded-full border border-[#27C93F]/50 bg-[#27C93F]/10 font-space text-[11px] font-bold tracking-[0.1em] text-[#27C93F] uppercase">
              Revealed
            </div>
          </div>

          {/* Word + Meaning */}
          <div className="flex flex-col items-center text-center mb-5 flex-1">
            <h2 className="font-bricolage text-[34px] sm:text-[40px] font-extrabold text-white leading-tight uppercase tracking-tight mb-3">
              {vocab.vocab}
            </h2>
            <p className="font-inter text-[17px] text-white/75 font-medium leading-relaxed">
              {vocab.meaning}
            </p>
            {vocab.example && (
              <p className="font-inter text-[13px] text-white/40 italic mt-3 leading-relaxed">
                "{vocab.example}"
              </p>
            )}
          </div>

          {/* Memory Hook */}
          {vocab.trick && (
            <div className="w-full bg-[#8C4323]/60 rounded-2xl px-5 py-3.5 mb-6 flex items-start gap-3 border border-white/10">
              <Lightbulb size={18} className="text-[#FBBF24] shrink-0 mt-0.5" />
              <p className="font-inter text-[14px] font-bold text-white/90 leading-snug">
                "{vocab.trick}"
              </p>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleRemember}
              disabled={isActing}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0E5F40] border-2 border-[#1E8F63] text-white font-bricolage text-[18px] font-bold hover:bg-[#137A53] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="I remembered this word"
            >
              ✓ Remember
            </button>
            <button
              onClick={handleForgot}
              disabled={isActing}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#5C1A1A] border-2 border-[#9B2C2C] text-[#FC8181] font-bricolage text-[18px] font-bold hover:bg-[#7B1F1F] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="I forgot this word"
            >
              ✗ Forgot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
