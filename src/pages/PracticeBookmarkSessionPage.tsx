import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, RotateCcw, Zap, Check, X, Bookmark, Volume2, Lightbulb, PenLine, SkipForward } from 'lucide-react';
import { vocabApi } from '../api/endpoints/vocab.api';
import type { VocabCard as VocabCardType } from '../types';
import { BookmarkToggleButton } from '../components/vocab/BookmarkToggleButton';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PracticeBookmarkSessionPage() {
  const navigate = useNavigate();

  const [cards, setCards] = useState<VocabCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [rememberedCount, setRememberedCount] = useState(0);
  const [forgotCount, setForgotCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Card Flip and Animation States
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Swipe UP & Drag state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitioning, setTransitioning] = useState<'up' | 'down' | null>(null);

  const startYRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const isWheelLockedRef = useRef<boolean>(false);

  const loadBookmarkedCards = async () => {
    setIsLoading(true);
    try {
      const response = await vocabApi.getBookmarkedVocabs(0, 100);
      const fetchedCards = response.content || [];
      const shuffled = shuffleArray(fetchedCards);
      setCards(shuffled);
      setCurrentIndex(0);
      setRememberedCount(0);
      setForgotCount(0);
      setIsRevealed(false);
      setIsFlipping(false);
      setStartTime(Date.now());
      setEndTime(null);
    } catch (err) {
      console.error('Failed to load bookmarked cards for practice session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarkedCards();
  }, []);

  const totalCards = cards.length;
  const isFinished = currentIndex >= totalCards && totalCards > 0;
  const currentCard = cards[currentIndex];

  // Advance to next card with auto scroll-up animation
  const animateToNext = () => {
    if (transitioning) return;
    setTransitioning('up');
    setTimeout(() => {
      setIsRevealed(false);
      setIsFlipping(false);
      setDragY(0);
      setTransitioning(null);
      setCurrentIndex((prev) => {
        const nextIdx = prev + 1;
        if (nextIdx >= totalCards) {
          setEndTime(Date.now());
        }
        return nextIdx;
      });
    }, 220);
  };

  const handleNextSwipe = () => {
    animateToNext();
  };

  const handlePrevSwipe = () => {
    if (transitioning || currentIndex === 0) return;
    setTransitioning('down');
    setTimeout(() => {
      setIsRevealed(false);
      setIsFlipping(false);
      setDragY(0);
      setTransitioning(null);
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, 220);
  };

  // Remembered Action
  const handleRemembered = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard || transitioning) return;

    try {
      await vocabApi.toggleLearned(currentCard.vocab.id);
    } catch (err) {
      console.error('Failed to mark vocab as learned:', err);
    }

    setRememberedCount((prev) => prev + 1);
    animateToNext();
  };

  // Forgot Action
  const handleForgot = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard || transitioning) return;

    setForgotCount((prev) => prev + 1);
    animateToNext();
  };

  // Card Reveal toggle
  const handleRevealToggle = () => {
    if (hasDraggedRef.current || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setIsRevealed((prev) => !prev);
      setIsFlipping(false);
    }, 280);
  };

  // Audio Pronunciation
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentCard?.vocab?.vocab && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentCard.vocab.vocab);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Touch / Drag events
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
    if (currentIndex === 0 && diff > 0) {
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

    if (dragY < -60 || (velocity < -0.35 && dragY < -20)) {
      handleNextSwipe();
    } else if ((dragY > 60 || (velocity > 0.35 && dragY > 20)) && currentIndex > 0) {
      handlePrevSwipe();
    } else {
      setDragY(0);
    }
  };

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isWheelLockedRef.current || isFinished) return;
      if (e.deltaY > 30) {
        isWheelLockedRef.current = true;
        handleNextSwipe();
        setTimeout(() => {
          isWheelLockedRef.current = false;
        }, 450);
      } else if (e.deltaY < -30 && currentIndex > 0) {
        isWheelLockedRef.current = true;
        handlePrevSwipe();
        setTimeout(() => {
          isWheelLockedRef.current = false;
        }, 450);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, isFinished]);

  const progressPercentage = totalCards > 0
    ? Math.min(100, Math.max(0, ((currentIndex + 1) / totalCards) * 100))
    : 0;

  const sessionDurationMs = startTime
    ? (endTime ?? Date.now()) - startTime
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF2E7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
          <p className="font-inter font-bold text-sm text-[#0f172a]">Loading Bookmark Practice Queue...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF2E7] p-6">
        <div className="max-w-[420px] w-full bg-white rounded-3xl p-8 border border-black/5 shadow-md text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#ea580c]">
            <Bookmark size={32} fill="#ea580c" />
          </div>
          <h2 className="font-bricolage text-2xl font-bold text-[#0f172a]">No Bookmarked Words</h2>
          <p className="font-inter text-sm text-[#64748b]">
            You don't have any words saved in your bookmark queue right now. Save words from the Vocabulary dictionary to practice them here!
          </p>
          <button
            onClick={() => navigate('/vocabulary')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#ea580c] text-white font-bricolage font-bold text-[15px] shadow-sm hover:bg-[#c2410c] transition-all cursor-pointer"
          >
            Explore Vocabulary
          </button>
        </div>
      </div>
    );
  }

  // Animation values
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
    <div className="min-h-screen w-full flex items-stretch justify-center bg-[#1a1210]">

      {/* ── PHONE COLUMN FRAME ── */}
      <div className="relative w-full max-w-[420px] min-h-screen flex flex-col overflow-hidden bg-[#FAF2E7]">

        {/* ── Mountain Background Graphic ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[58%] pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <img
            src="/images/reel_bottom.png"
            alt="Scenery"
            className="w-full h-full object-cover object-bottom"
            style={{
              display: 'block',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 28%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 28%)',
            }}
          />
        </div>

        {/* ── Content Area ── */}
        <div className="relative z-10 flex flex-col flex-1">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 pt-6 pb-2 shrink-0">
            <button
              onClick={() => navigate('/profile/learned')}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#0f172a] bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors cursor-pointer border-none"
              aria-label="Exit Practice"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>

            <div className="text-center">
              <div className="font-bricolage text-[16px] font-bold">
                <span className="text-[#0f172a]">Bookmark</span>
                <span className="text-[#ea580c] ml-1">Practice</span>
              </div>
              <div className="font-inter text-[11px] text-[#64748b] font-medium">
                Flashcard Session
              </div>
            </div>

            <div className="font-inter text-[13px] font-bold text-[#0f172a] min-w-[45px] text-right">
              {Math.min(currentIndex + 1, totalCards)} / {totalCards}
            </div>
          </div>

          {/* ── Single Progress Bar ── */}
          <div className="px-5 pb-3 shrink-0">
            <div className="w-full h-[4px] bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f97316] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* ── Active Flashcard Session ── */}
          {!isFinished && currentCard ? (
            <div
              className="flex-1 flex flex-col px-4 pb-2 select-none"
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
              {/* 3D Flip Card */}
              <div className="w-full" style={{ perspective: '1000px' }}>
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
                    onClick={handleRevealToggle}
                  >
                    {/* Bookmark Ribbon */}
                    <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                      <BookmarkToggleButton
                        vocabId={currentCard.vocab.id}
                        isBookmarked={Boolean(currentCard.isBookmarked)}
                        variant="ribbon"
                      />
                    </div>

                    {/* Word Centered */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                      <h2 className="font-bricolage text-[38px] sm:text-[44px] font-bold text-[#0f172a] text-center leading-tight tracking-tight mb-7">
                        {currentCard.vocab.vocab}
                      </h2>

                      {/* Tap to reveal pill */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevealToggle();
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
                    onClick={handleRevealToggle}
                  >
                    {/* Bookmark Ribbon */}
                    <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                      <BookmarkToggleButton
                        vocabId={currentCard.vocab.id}
                        isBookmarked={Boolean(currentCard.isBookmarked)}
                        variant="ribbon"
                      />
                    </div>

                    <div className="p-6 pb-5 flex flex-col gap-3.5">
                      {/* Word Header + Audio */}
                      <div className="pr-10">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="font-bricolage text-[30px] font-bold text-[#0f172a] leading-tight">
                            {currentCard.vocab.vocab}
                          </h2>
                          <button
                            onClick={handlePlayAudio}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-[#0f172a] hover:bg-orange-50 hover:text-[#f97316] transition-colors shrink-0 cursor-pointer"
                            aria-label="Listen pronunciation"
                          >
                            <Volume2 size={15} strokeWidth={2.5} />
                          </button>
                        </div>
                        {currentCard.vocab.vocabType && (
                          <div className="font-inter text-[12px] text-[#64748b] mt-0.5">
                            ({currentCard.vocab.vocabType.toLowerCase()})
                          </div>
                        )}
                      </div>

                      {/* Meaning */}
                      <p className="font-inter text-[15px] text-[#1e293b] leading-relaxed font-medium">
                        {currentCard.vocab.meaning}
                      </p>

                      {/* Mnemonic */}
                      {currentCard.vocab.trick && (
                        <div className="rounded-[14px] bg-[#fff7ed] border border-[#ffedd5] p-3.5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#f97316] rounded-l-[14px]" />
                          <div className="flex gap-2.5">
                            <Lightbulb size={16} className="text-[#f97316] shrink-0 mt-0.5" strokeWidth={2.5} />
                            <div>
                              <div className="font-inter text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] mb-1">
                                Mnemonic
                              </div>
                              <p className="font-inter text-[13px] text-[#0f172a] leading-relaxed">
                                {currentCard.vocab.trick}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Example */}
                      {currentCard.vocab.example && (
                        <div className="rounded-[14px] bg-[#f0f7ff] border border-[#dbeafe] p-3.5">
                          <div className="flex gap-2.5">
                            <PenLine size={16} className="text-[#3b82f6] shrink-0 mt-0.5" strokeWidth={2.5} />
                            <div>
                              <div className="font-inter text-[10px] font-extrabold uppercase tracking-wider text-[#3b82f6] mb-1">
                                Example
                              </div>
                              <p className="font-inter text-[13px] text-[#0f172a] leading-relaxed">
                                {currentCard.vocab.example}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── REMEMBERED & FORGOT BUTTONS ON REVEALED CARD ── */}
                      <div className="grid grid-cols-2 gap-3 pt-2 mt-1 border-t border-black/5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={handleForgot}
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#f97316]/30 text-[#ea580c] font-bricolage text-[15px] font-bold hover:bg-[#fff7ed] shadow-xs active:scale-[0.97] transition-all cursor-pointer"
                        >
                          <X size={18} strokeWidth={2.5} />
                          Forgot
                        </button>

                        <button
                          onClick={handleRemembered}
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#16a34a] text-white font-bricolage text-[15px] font-bold shadow-[0_4px_12px_rgba(22,163,74,0.3)] hover:bg-[#15803d] active:scale-[0.97] transition-all cursor-pointer"
                        >
                          <Check size={18} strokeWidth={2.5} />
                          Remembered
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* ── Swipe Up Hint ── */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSwipe();
                }}
                className="flex flex-col items-center gap-1 py-4 mt-2 text-[#0f172a]/70 hover:text-[#0f172a] transition-all cursor-pointer bg-transparent border-none group"
                aria-label="Next word"
              >
                <svg
                  width="20"
                  height="20"
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
          ) : (
            /* ── COMPLETION SCREEN ── */
            <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8 gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full bg-[#16a34a]/15 border-2 border-[#16a34a]/40 flex items-center justify-center">
                  <Trophy size={34} className="text-[#16a34a]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#16a34a]/20 blur-2xl animate-pulse" />
              </div>

              {(() => {
                const skippedCount = Math.max(0, totalCards - (rememberedCount + forgotCount));
                const rememberedRatio = totalCards > 0 ? (rememberedCount / totalCards) * 100 : 0;
                const skippedRatio = totalCards > 0 ? (skippedCount / totalCards) * 100 : 0;

                let performanceLabel = { text: 'Great Learning Progress! 🔥', color: 'text-[#16a34a]' };
                if (rememberedRatio >= 80) {
                  performanceLabel = { text: 'Great Learning Progress! 🔥', color: 'text-[#16a34a]' };
                } else if (rememberedRatio >= 40) {
                  performanceLabel = { text: 'Good Progress! 👏', color: 'text-[#ea580c]' };
                } else if (skippedRatio >= 50) {
                  performanceLabel = { text: 'Session Skipped ⏭️', color: 'text-[#3b82f6]' };
                } else {
                  performanceLabel = { text: 'Keep Practicing! 📚', color: 'text-[#dc2626]' };
                }

                return (
                  <>
                    <div className="text-center">
                      <h1 className="font-bricolage text-[30px] font-extrabold text-[#0f172a] leading-tight mb-1">
                        Session Complete!
                      </h1>
                      <p className={`font-inter text-[15px] font-bold ${performanceLabel.color}`}>
                        {performanceLabel.text}
                      </p>
                    </div>

                    {/* Stats Grid: Remembered, Forgot, Skipped */}
                    <div className="w-full grid grid-cols-3 gap-2">
                      <div className="bg-white/80 backdrop-blur-md border border-[#16a34a]/30 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm">
                        <Check size={18} className="text-[#16a34a]" />
                        <span className="font-bricolage text-[24px] font-extrabold text-[#0f172a] leading-none">
                          {rememberedCount}
                        </span>
                        <span className="font-inter text-[9px] text-[#16a34a] font-bold uppercase tracking-wider text-center">
                          Remembered
                        </span>
                      </div>

                      <div className="bg-white/80 backdrop-blur-md border border-[#ea580c]/30 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm">
                        <X size={18} className="text-[#ea580c]" />
                        <span className="font-bricolage text-[24px] font-extrabold text-[#0f172a] leading-none">
                          {forgotCount}
                        </span>
                        <span className="font-inter text-[9px] text-[#ea580c] font-bold uppercase tracking-wider text-center">
                          Forgot
                        </span>
                      </div>

                      <div className="bg-white/80 backdrop-blur-md border border-[#3b82f6]/30 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm">
                        <SkipForward size={18} className="text-[#3b82f6]" />
                        <span className="font-bricolage text-[24px] font-extrabold text-[#0f172a] leading-none">
                          {skippedCount}
                        </span>
                        <span className="font-inter text-[9px] text-[#3b82f6] font-bold uppercase tracking-wider text-center">
                          Skipped
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Time Taken Stat */}
              <div className="w-full bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Zap size={18} className="text-[#FBBF24]" />
                  <span className="font-inter text-[12px] font-bold uppercase tracking-wider text-[#64748b]">
                    Time Taken
                  </span>
                </div>
                <span className="font-bricolage text-[22px] font-extrabold text-[#0f172a] leading-none">
                  {formatDuration(sessionDurationMs)}
                </span>
              </div>

              <div className="w-full flex flex-col gap-2.5 mt-1">
                <button
                  onClick={loadBookmarkedCards}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white/65 border border-black/10 text-[#0f172a] font-bricolage text-[15px] font-bold hover:bg-white/85 transition-all cursor-pointer"
                >
                  <RotateCcw size={16} strokeWidth={2.5} />
                  Practice Again
                </button>
                <button
                  onClick={() => navigate('/profile/learned')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#ea580c] text-white font-bricolage text-[15px] font-bold shadow-[0_8px_24px_rgba(249,115,22,0.3)] hover:bg-[#ea580c] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Back to Progress
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
