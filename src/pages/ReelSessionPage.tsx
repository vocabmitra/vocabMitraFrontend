import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, RotateCcw, Zap, Eye } from 'lucide-react';
import { usePracticeStore } from '../store/usePracticeStore';
import { ReelCard } from '../components/vocab/ReelCard';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export default function ReelSessionPage() {
  const navigate = useNavigate();
  const { session, endSession, restartSession } = usePracticeStore();

  useEffect(() => {
    if (!session.isActive && session.cards.length === 0) {
      navigate('/vocabulary', { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalCards = session.cards.length;
  const currentIndex = session.currentIndex;
  const isFinished = currentIndex >= totalCards;

  const { revealedIds = [], startTime, endTime } = session.meta;
  const sessionDurationMs = startTime
    ? (endTime ?? Date.now()) - startTime
    : 0;

  const handleEndSession = () => {
    endSession();
    navigate(-1);
  };

  const handleStartOver = () => {
    restartSession();
  };

  const revealedCount = revealedIds.length;
  const revealedRatio = totalCards > 0 ? (revealedCount / totalCards) * 100 : 0;

  const performanceLabel =
    revealedRatio >= 80
      ? { text: 'Great Learning Session! 🔥', color: 'text-[#27C93F]' }
      : revealedRatio >= 40
        ? { text: 'Good Progress! 👏', color: 'text-[#E8734A]' }
        : { text: 'Keep Practicing! 📚', color: 'text-[#f97316]' };

  // Calculate percentage for single continuous animated progress bar
  const progressPercentage = totalCards > 0
    ? Math.min(100, Math.max(0, ((currentIndex + 1) / totalCards) * 100))
    : 0;

  return (
    /*
     * Outer wrapper: dark neutral sides to frame the "phone" — like a phone mockup frame.
     * The phone column itself carries the warm gradient + mountain image.
     */
    <div className="min-h-screen w-full flex items-stretch justify-center bg-[#1a1210]">

      {/* ── PHONE COLUMN ── */}
      <div
        className="relative w-full max-w-[420px] min-h-screen flex flex-col overflow-hidden bg-[#FAF2E7]"
      >

        {/* ── Mountain image: pinned to the bottom, fills bottom ~58% of the phone column ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[58%] pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <img
            src="/images/reel_bottom.png"
            alt="Mountain scenery"
            className="w-full h-full object-cover object-bottom"
            style={{
              display: 'block',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 28%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 28%)',
            }}
          />
        </div>

        {/* ── All content sits above the image ── */}
        <div className="relative z-10 flex flex-col flex-1">

          {/* ── TOP HEADER ── */}
          <div className="flex items-center justify-between px-5 pt-6 pb-2 shrink-0">
            <button
              onClick={handleEndSession}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#0f172a] bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors cursor-pointer border-none"
              aria-label="Exit Reel Mode"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>

            <div className="text-center">
              <div className="font-bricolage text-[16px] font-bold">
                <span className="text-[#0f172a]">Vocab</span>
                <span className="text-[#f97316]">Vault</span>
              </div>
              <div className="font-inter text-[11px] text-[#64748b] font-medium">
                Reel Mode
              </div>
            </div>

            <div className="font-inter text-[13px] font-bold text-[#0f172a] min-w-[45px] text-right">
              {Math.min(currentIndex + 1, totalCards)} / {totalCards > 0 ? totalCards : '∞'}
            </div>
          </div>

          {/* ── SINGLE CONTINUOUS ANIMATED PROGRESS BAR ── */}
          <div className="px-5 pb-3 shrink-0">
            <div className="w-full h-[4px] bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f97316] rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* ── MAIN AREA ── */}
          {!isFinished ? (
            <ReelCard
              key={`reel-${currentIndex}`}
              card={session.cards[currentIndex]}
              index={currentIndex}
              total={totalCards}
            />
          ) : (
            /* ── COMPLETION SCREEN ── */
            <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8 gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">

              <div className="relative">
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-[#27C93F]/15 border-2 border-[#27C93F]/40 flex items-center justify-center">
                  <Trophy size={34} className="text-[#27C93F]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#27C93F]/15 blur-2xl animate-pulse" />
              </div>

              <div className="text-center">
                <h1 className="font-bricolage text-[32px] font-extrabold text-[#0f172a] leading-tight mb-1">
                  Session Complete!
                </h1>
                <p className={`font-inter text-[16px] font-bold ${performanceLabel.color}`}>
                  {performanceLabel.text}
                </p>
              </div>

              {/* ── REVEALED CARDS & TIME STATS ── */}
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-white/75 backdrop-blur-md border border-[#f97316]/25 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
                  <Eye size={20} className="text-[#f97316]" />
                  <span className="font-bricolage text-[28px] font-extrabold text-[#0f172a] leading-none">
                    {revealedCount} / {totalCards}
                  </span>
                  <span className="font-inter text-[10px] text-[#ea580c] font-bold uppercase tracking-wider">
                    Revealed
                  </span>
                </div>

                <div className="bg-white/75 backdrop-blur-md border border-black/10 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
                  <Zap size={20} className="text-[#FBBF24]" />
                  <span className="font-bricolage text-[26px] font-extrabold text-[#0f172a] leading-none">
                    {formatDuration(sessionDurationMs)}
                  </span>
                  <span className="font-inter text-[10px] text-[#64748b] font-bold uppercase tracking-wider">
                    Time
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5 mt-1">
                <button
                  onClick={handleStartOver}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white/65 border border-black/10 text-[#0f172a] font-bricolage text-[15px] font-bold hover:bg-white/85 transition-all cursor-pointer"
                >
                  <RotateCcw size={16} strokeWidth={2.5} />
                  Start Over
                </button>
                <button
                  onClick={handleEndSession}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#f97316] text-white font-bricolage text-[15px] font-bold shadow-[0_8px_24px_rgba(249,115,22,0.3)] hover:bg-[#ea580c] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Side panels (desktop only): just dark fill ── */}
    </div>
  );
}

// Re-export PracticeSessionPage for backwards compatibility if needed
export { ReelSessionPage as PracticeSessionPage };
