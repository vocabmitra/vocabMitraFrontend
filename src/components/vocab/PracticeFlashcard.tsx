import { useState, useEffect } from 'react';
import { Lightbulb, Check, RotateCcw } from 'lucide-react';
import type { VocabCard } from '../../types';
import { usePracticeStore } from '../../store/usePracticeStore';
import { useVocabStore } from '../../store/useVocabStore';

interface PracticeFlashcardProps {
  card: VocabCard;
}

export function PracticeFlashcard({ card }: PracticeFlashcardProps) {
  const { vocab } = card;
  const { settings, nextCard, moveCardToBack } = usePracticeStore();
  const { updateVocabCard } = useVocabStore();
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimitSeconds);

  // Reset state when card changes
  useEffect(() => {
    setIsRevealed(false);
    setTimeLeft(settings.timeLimitSeconds);
  }, [card, settings.timeLimitSeconds]);

  // Timer logic
  useEffect(() => {
    if (!settings.isTimed || isRevealed) return;

    if (timeLeft <= 0) {
      setIsRevealed(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [settings.isTimed, isRevealed, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLearned = () => {
    updateVocabCard(vocab.id, { isLearned: true, addedToPractice: false });
    nextCard();
  };

  const handleAgain = () => {
    moveCardToBack();
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-[4/5] perspective-1000">
      <div 
        className={`w-full h-full transition-transform duration-700 preserve-3d relative ${isRevealed ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* FRONT SIDE */}
        <div 
          className="absolute inset-0 backface-hidden bg-[#131722] rounded-[24px] border-2 border-white/10 shadow-2xl flex flex-col items-center justify-between p-10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Top: Timer */}
          <div className="h-8">
            {settings.isTimed && (
              <div className="font-space text-[14px] font-bold text-white/50 tracking-[0.15em]">
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Center: Word */}
          <div className="flex flex-col items-center text-center -mt-8">
            <h2 className="font-bricolage text-[42px] sm:text-[52px] font-extrabold text-white leading-tight uppercase tracking-tight mb-4">
              {vocab.vocab}
            </h2>
            <p className="font-inter text-[18px] text-white/60 italic font-medium">
              Think of the meaning...
            </p>
          </div>

          {/* Bottom: Reveal Button */}
          <button
            onClick={() => setIsRevealed(true)}
            className="w-full py-4 rounded-2xl bg-[#E8734A] text-white font-bricolage text-[20px] font-bold shadow-[0_8px_0_#C25732] hover:-translate-y-1 hover:shadow-[0_12px_0_#C25732] active:translate-y-2 active:shadow-[0_0px_0_#C25732] transition-all"
          >
            Reveal
          </button>
        </div>

        {/* BACK SIDE */}
        <div 
          className="absolute inset-0 backface-hidden bg-[#131722] rounded-[24px] border-2 border-white/10 shadow-2xl flex flex-col p-8 sm:p-10 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Top: Revealed Pill */}
          <div className="flex justify-center mb-6">
            <div className="px-5 py-1.5 rounded-full border border-[#27C93F] bg-[#27C93F]/10 font-space text-[12px] font-bold tracking-[0.1em] text-[#27C93F] uppercase">
              Revealed
            </div>
          </div>

          {/* Center: Word & Meaning */}
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="font-bricolage text-[36px] sm:text-[44px] font-extrabold text-white leading-tight uppercase tracking-tight mb-2">
              {vocab.vocab}
            </h2>
            <p className="font-inter text-[18px] text-white/70 font-medium">
              {vocab.meaning}
            </p>
          </div>

          {/* Mnemonic Hook */}
          {vocab.trick && (
            <div className="w-full bg-[#8C4323] rounded-2xl p-5 mb-auto flex items-start gap-4 shadow-inner border border-white/10">
              <Lightbulb size={24} className="text-[#FBBF24] shrink-0 mt-0.5" />
              <p className="font-inter text-[17px] font-bold text-white leading-snug">
                "{vocab.trick}"
              </p>
            </div>
          )}

          {/* Bottom: Actions */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={handleLearned}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0E5F40] border-2 border-[#1E8F63] text-white font-bricolage text-[18px] font-bold hover:bg-[#137A53] transition-colors"
            >
              <Check size={20} strokeWidth={3} />
              Learned
            </button>
            <button
              onClick={handleAgain}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1F2937] border-2 border-white/20 text-white font-bricolage text-[18px] font-bold hover:bg-[#374151] transition-colors"
            >
              <RotateCcw size={20} strokeWidth={2.5} />
              Again
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
