import { useState, useRef, useEffect } from 'react';
import { Volume2, Lightbulb, PenLine } from 'lucide-react';
import type { VocabCard } from '../../types';
import { usePracticeStore } from '../../store/usePracticeStore';
import { BookmarkToggleButton } from './BookmarkToggleButton';

interface ReelCardProps {
  card: VocabCard;
  index: number;
  total: number;
}

export function ReelCard({ card, index }: ReelCardProps) {
  const { vocab } = card;
  const { nextCard, prevCard, recordRevealed } = usePracticeStore();

  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Reel swipe animation states
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitioning, setTransitioning] = useState<'up' | 'down' | null>(null);

  const startYRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const isWheelLockedRef = useRef<boolean>(false);

  // Toggle card front/back on tap
  const handleReveal = () => {
    if (hasDraggedRef.current || isFlipping) return;
    setIsFlipping(true);
    recordRevealed(vocab.id);
    setTimeout(() => {
      setIsRevealed((prev) => !prev);
      setIsFlipping(false);
    }, 280);
  };

  // Text to speech for word pronunciation
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && vocab.vocab) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocab.vocab);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning('up');
    setTimeout(() => {
      nextCard();
    }, 220);
  };

  const handlePrev = () => {
    if (transitioning || index === 0) return;
    setTransitioning('down');
    setTimeout(() => {
      prevCard();
    }, 220);
  };

  // Touch / Mouse Drag event handlers
  const handlePointerStart = (clientY: number) => {
    startYRef.current = clientY;
    startTimeRef.current = Date.now();
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (clientY: number) => {
    if (!isDragging) return;
    const diff = clientY - startYRef.current;
    if (Math.abs(diff) > 8) {
      hasDraggedRef.current = true;
    }

    // Resistance on dragging down when at card index 0
    if (index === 0 && diff > 0) {
      setDragY(diff * 0.3);
    } else {
      setDragY(diff);
    }
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const elapsed = Date.now() - startTimeRef.current;
    const velocity = dragY / Math.max(1, elapsed);

    // Swipe UP (next card)
    if (dragY < -60 || (velocity < -0.35 && dragY < -20)) {
      handleNext();
    }
    // Swipe DOWN (prev card)
    else if ((dragY > 60 || (velocity > 0.35 && dragY > 20)) && index > 0) {
      handlePrev();
    } else {
      // Snap back if threshold not met
      setDragY(0);
    }
  };

  // Mouse wheel & Keyboard navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isWheelLockedRef.current) return;

      if (e.deltaY > 30) {
        isWheelLockedRef.current = true;
        handleNext();
        setTimeout(() => {
          isWheelLockedRef.current = false;
        }, 450);
      } else if (e.deltaY < -30 && index > 0) {
        isWheelLockedRef.current = true;
        handlePrev();
        setTimeout(() => {
          isWheelLockedRef.current = false;
        }, 450);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        handleNext();
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index]);

  // Bold word helper inside example sentence
  const boldWord = (text: string, word: string) => {
    if (!text || !word) return <>{text}</>;
    const regex = new RegExp(`(${word})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? <strong key={i}>{part}</strong> : part
        )}
      </>
    );
  };

  // Compute translation coordinates and opacity for smooth animation
  let translateY = dragY;
  let opacity = 1;

  if (transitioning === 'up') {
    translateY = -450;
    opacity = 0;
  } else if (transitioning === 'down') {
    translateY = 450;
    opacity = 0;
  }

  return (
    <div
      className="flex flex-col px-4 pb-2 select-none"
      style={{
        transform: `translateY(${translateY}px) ${isDragging ? `rotate(${dragY * 0.02}deg)` : ''}`,
        opacity,
        transition: isDragging
          ? 'none'
          : 'transform 260ms cubic-bezier(0.25, 1, 0.5, 1), opacity 220ms ease-out',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={(e) => handlePointerStart(e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientY)}
      onMouseUp={handlePointerEnd}
      onMouseLeave={handlePointerEnd}
      onTouchStart={(e) => handlePointerStart(e.touches[0].clientY)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientY)}
      onTouchEnd={handlePointerEnd}
    >
      {/* ── 3D Flip Card ── */}
      <div
        className="w-full"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full transition-transform duration-[500ms] ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isRevealed ? 'rotateY(180deg)' : isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
            height: isRevealed ? 'auto' : '340px',
            minHeight: '320px',
          }}
        >
          {/* ── FRONT OF CARD ── */}
          <div
            className={`${
              isRevealed ? 'absolute inset-0 opacity-0 pointer-events-none' : 'relative w-full h-[340px]'
            } flex flex-col rounded-[24px] bg-[#fffaf5]/95 shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden cursor-pointer border border-white/60`}
            style={{ backfaceVisibility: 'hidden' }}
            onClick={handleReveal}
          >
            {/* Bookmark top-right */}
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
              <BookmarkToggleButton
                vocabId={vocab.id}
                isBookmarked={Boolean(card.isBookmarked)}
                variant="ribbon"
              />
            </div>

            {/* Word centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <h2 className="font-bricolage text-[38px] sm:text-[44px] font-bold text-[#0f172a] text-center leading-tight tracking-tight mb-7">
                {vocab.vocab}
              </h2>

              {/* Tap to reveal pill */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReveal();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[100px] bg-[#fff3e0] border border-[#f97316]/20 text-[#ea580c] font-inter font-bold text-[13px] cursor-pointer hover:bg-[#ffe8c7] transition-colors shadow-sm"
              >
                <span className="text-[16px]">👆</span>
                Tap to reveal
              </button>
            </div>
          </div>

          {/* ── BACK OF CARD (Revealed State) ── */}
          <div
            className={`${
              isRevealed ? 'relative w-full h-auto min-h-[340px]' : 'absolute inset-0 opacity-0 pointer-events-none'
            } flex flex-col rounded-[24px] bg-[#fffaf5]/95 shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-white/60 cursor-pointer`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            onClick={handleReveal}
          >
            {/* Bookmark top-right */}
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
              <BookmarkToggleButton
                vocabId={vocab.id}
                isBookmarked={Boolean(card.isBookmarked)}
                variant="ribbon"
              />
            </div>

            <div className="p-6 pb-5 flex flex-col gap-3.5">
              {/* Word + type + audio */}
              <div className="pr-10">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-bricolage text-[30px] font-bold text-[#0f172a] leading-tight">
                    {vocab.vocab}
                  </h2>
                  <button
                    onClick={handlePlayAudio}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-[#0f172a] hover:bg-orange-50 hover:text-[#f97316] transition-colors shrink-0 cursor-pointer"
                    aria-label="Listen pronunciation"
                  >
                    <Volume2 size={15} strokeWidth={2.5} />
                  </button>
                </div>
                {vocab.vocabType && (
                  <div className="font-inter text-[12px] text-[#64748b] mt-0.5">
                    ({vocab.vocabType.toLowerCase()})
                  </div>
                )}
              </div>

              {/* Meaning */}
              <p className="font-inter text-[15px] text-[#1e293b] leading-relaxed font-medium">
                {vocab.meaning}
              </p>

              {/* Mnemonic */}
              {vocab.trick && (
                <div className="rounded-[14px] bg-[#fff7ed] border border-[#ffedd5] p-3.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#f97316] rounded-l-[14px]" />
                  <div className="flex gap-2.5">
                    <Lightbulb size={16} className="text-[#f97316] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <div className="font-inter text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] mb-1">
                        Mnemonic
                      </div>
                      <p className="font-inter text-[13px] text-[#0f172a] leading-relaxed">
                        {vocab.trick}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Example */}
              {vocab.example && (
                <div className="rounded-[14px] bg-[#f0f7ff] border border-[#dbeafe] p-3.5">
                  <div className="flex gap-2.5">
                    <PenLine size={16} className="text-[#3b82f6] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <div className="font-inter text-[10px] font-extrabold uppercase tracking-wider text-[#3b82f6] mb-1">
                        Example
                      </div>
                      <p className="font-inter text-[13px] text-[#0f172a] leading-relaxed">
                        {boldWord(vocab.example, vocab.vocab)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SWIPE UP HINT — click triggers vertical transition ── */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="flex flex-col items-center gap-1 py-5 mt-2 text-white/85 hover:text-white transition-all cursor-pointer bg-transparent border-none group"
        aria-label="Next word"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:-translate-y-1 transition-transform"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span className="font-inter text-[12px] font-semibold tracking-wide">Swipe up for next word</span>
      </button>
    </div>
  );
}
