import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy, RotateCcw, Zap, BookOpen, AlertTriangle, Target } from 'lucide-react';
import { usePracticeStore } from '../store/usePracticeStore';
import { PracticeFlashcard } from '../components/vocab/PracticeFlashcard';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export default function PracticeSessionPage() {
  const navigate = useNavigate();
  const { session, endSession, restartSession } = usePracticeStore();

  // If someone hits this route directly without starting a session, kick them back
  useEffect(() => {
    if (!session.isActive && session.cards.length === 0) {
      navigate('/vocabulary', { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalCards = session.cards.length;
  const currentIndex = session.currentIndex;
  const isFinished = currentIndex >= totalCards;

  const { rememberedIds, forgotIds, startTime, endTime } = session.meta;
  const sessionDurationMs = startTime
    ? (endTime ?? Date.now()) - startTime
    : 0;

  // Progress percentage (0–100)
  const progressPercent = totalCards > 0 ? Math.min(100, (currentIndex / totalCards) * 100) : 0;

  const handleEndSession = () => {
    endSession();
    navigate(-1);
  };

  const handleStartOver = () => {
    restartSession();
  };

  // ── Completion Metrics ────────────────────────────────────────────────────
  const rememberedCount = rememberedIds.length;
  const forgotCount = forgotIds.length;
  const skippedCount = totalCards - rememberedCount - forgotCount;
  const accuracy = totalCards > 0 ? Math.round((rememberedCount / totalCards) * 100) : 0;

  const performanceLabel =
    accuracy >= 90
      ? { text: 'Outstanding! 🔥', color: 'text-[#27C93F]' }
      : accuracy >= 70
      ? { text: 'Great Work! 👏', color: 'text-[#E8734A]' }
      : accuracy >= 50
      ? { text: 'Keep Going! 💪', color: 'text-[#FBBF24]' }
      : { text: 'Keep Practicing! 📚', color: 'text-[#FC8181]' };

  return (
    <div className="min-h-screen bg-[#0F1219] flex flex-col items-center justify-center relative overflow-hidden">

      {/* ── Background Ambience ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square bg-[#E8734A]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square bg-[#5B7FDE]/8 rounded-full blur-[120px]" />
      </div>

      {/* ── Top Navigation ── */}
      <div className="absolute top-0 left-0 w-full p-5 flex justify-between items-center z-20">
        <div className="font-space font-bold text-white/40 tracking-widest text-[12px] uppercase">
          Practice Mode
        </div>
        <button
          onClick={handleEndSession}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors p-2 cursor-pointer bg-transparent border-none"
        >
          <span className="font-inter text-sm font-medium hidden sm:block">End Session</span>
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="z-10 w-full px-4 flex flex-col items-center">

        {!isFinished ? (
          <>
            {/* Progress Bar */}
            <div className="w-full max-w-[520px] mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-space text-[13px] font-bold text-white/40 tracking-[0.15em]">
                  {currentIndex + 1} / {totalCards}
                </span>
                <div className="flex items-center gap-3">
                  {rememberedCount > 0 && (
                    <span className="font-inter text-[12px] font-bold text-[#27C93F]">
                      ✓ {rememberedCount}
                    </span>
                  )}
                  {forgotCount > 0 && (
                    <span className="font-inter text-[12px] font-bold text-[#FC8181]">
                      ✗ {forgotCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E8734A] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <PracticeFlashcard
              key={`${session.cards[currentIndex]?.vocab.id}-${currentIndex}`}
              card={session.cards[currentIndex]}
            />
          </>
        ) : (
          // ── COMPLETION SCREEN ─────────────────────────────────────────────
          <div className="w-full max-w-[900px] flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 py-8 px-2">

            {/* ── LEFT: Trophy + Title + Performance ── */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 lg:w-[320px]">

              {/* Trophy */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-[#27C93F]/10 border-2 border-[#27C93F]/30 flex items-center justify-center">
                  <Trophy size={44} className="text-[#27C93F]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#27C93F]/15 blur-2xl animate-pulse" />
              </div>

              <h1 className="font-bricolage text-[40px] sm:text-[52px] font-extrabold text-white leading-tight mb-2">
                Session<br />Complete!
              </h1>
              <p className={`font-inter text-[22px] font-bold mb-6 ${performanceLabel.color}`}>
                {performanceLabel.text}
              </p>

              {/* Accuracy — big hero stat on the left */}
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={18} className="text-[#E8734A]" />
                  <span className="font-inter text-[11px] text-white/40 font-bold uppercase tracking-widest">Accuracy</span>
                </div>
                <span className="font-bricolage text-[64px] font-extrabold text-white leading-none">
                  {accuracy}<span className="text-[40px] text-white/60">%</span>
                </span>
                <span className="font-inter text-[13px] text-white/40 mt-2">
                  {totalCards} cards · {formatDuration(sessionDurationMs)}
                </span>
              </div>

              {/* Buttons — below hero stat on left */}
              <div className="w-full flex flex-col gap-3 mt-5">
                <button
                  onClick={handleStartOver}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white/10 border border-white/20 text-white font-bricolage text-[17px] font-bold hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw size={17} strokeWidth={2.5} />
                  Start Over
                </button>
                <button
                  onClick={handleEndSession}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#E8734A] text-white font-bricolage text-[17px] font-bold shadow-[0_8px_30px_rgba(232,115,74,0.3)] hover:bg-[#D4622E] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
                >
                  Back to App
                </button>
              </div>
            </div>

            {/* ── RIGHT: 2×2 Metric Cards ── */}
            <div className="flex-1 w-full grid grid-cols-2 gap-4 content-start">

              {/* Remembered */}
              <div className="bg-[#0E5F40]/40 border border-[#27C93F]/30 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] gap-2">
                <BookOpen size={24} className="text-[#27C93F]" />
                <span className="font-bricolage text-[54px] font-extrabold text-white leading-none">
                  {rememberedCount}
                </span>
                <span className="font-inter text-[12px] text-[#27C93F]/80 font-bold uppercase tracking-widest">
                  Remembered
                </span>
              </div>

              {/* Forgot */}
              <div className="bg-[#5C1A1A]/40 border border-[#FC8181]/30 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] gap-2">
                <AlertTriangle size={24} className="text-[#FC8181]" />
                <span className="font-bricolage text-[54px] font-extrabold text-white leading-none">
                  {forgotCount}
                </span>
                <span className="font-inter text-[12px] text-[#FC8181]/80 font-bold uppercase tracking-widest">
                  Forgot
                </span>
              </div>

              {/* Time Taken */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] gap-2">
                <Zap size={22} className="text-[#FBBF24]" />
                <span className="font-bricolage text-[40px] font-extrabold text-white leading-none">
                  {formatDuration(sessionDurationMs)}
                </span>
                <span className="font-inter text-[11px] text-white/40 font-bold uppercase tracking-widest">
                  Time Taken
                </span>
              </div>

              {/* Total Cards */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] gap-2">
                <span className="font-inter text-[11px] text-white/40 font-bold uppercase tracking-widest">Total Cards</span>
                <span className="font-bricolage text-[40px] font-extrabold text-white leading-none">
                  {totalCards}
                </span>
                {skippedCount > 0 && (
                  <span className="font-inter text-[11px] text-white/30">
                    {skippedCount} skipped
                  </span>
                )}
              </div>

              {/* Score Bar — spans full width */}
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-inter text-[12px] text-white/50 font-bold uppercase tracking-widest">Session Breakdown</span>
                  <span className="font-inter text-[12px] text-white/40">{rememberedCount + forgotCount} / {totalCards} answered</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                  {rememberedCount > 0 && (
                    <div
                      className="h-full bg-[#27C93F] rounded-l-full transition-all duration-700"
                      style={{ width: `${(rememberedCount / totalCards) * 100}%` }}
                    />
                  )}
                  {forgotCount > 0 && (
                    <div
                      className="h-full bg-[#FC8181] transition-all duration-700"
                      style={{ width: `${(forgotCount / totalCards) * 100}%` }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2.5">
                  <span className="flex items-center gap-1.5 font-inter text-[12px] text-[#27C93F] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                    Remembered
                  </span>
                  <span className="flex items-center gap-1.5 font-inter text-[12px] text-[#FC8181] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FC8181] inline-block" />
                    Forgot
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}

