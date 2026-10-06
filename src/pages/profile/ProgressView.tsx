import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Search,
  Sparkles,
  X,
  Bookmark,
  Flame,
  CheckCircle2,
  Target,
} from 'lucide-react';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { authApi } from '../../api/endpoints/auth.api';
import { useAuthStore } from '../../store/useAuthStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import type { VocabCard as VocabCardType, ProfileResponse } from '../../types';
import { ShrinkVocabCard } from '../../components/vocab/ShrinkVocabCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import { logger } from '../../utils/logger';

function getRandomSample<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function ProgressView() {
  const navigate = useNavigate();
  const startSession = usePracticeStore((s) => s.startSession);
  const { profile: storeProfile, setProfile: setStoreProfile } = useAuthStore();
  const [userProfile, setUserProfile] = useState<ProfileResponse | null>(storeProfile);

  // Bookmarked state for Needs Revision & Metrics
  const [bookmarkedCards, setBookmarkedCards] = useState<VocabCardType[]>([]);
  const [totalBookmarked, setTotalBookmarked] = useState(0);
  const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(true);
  const [sampledRevisionCards, setSampledRevisionCards] = useState<VocabCardType[]>([]);

  // Learned state for Learned Words section & Metrics
  const [learnedCards, setLearnedCards] = useState<VocabCardType[]>([]);
  const [totalLearned, setTotalLearned] = useState(0);
  const [isLearnedLoading, setIsLearnedLoading] = useState(true);

  // Modal & Search
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);
  const [learnedSearch, setLearnedSearch] = useState('');

  // Fetch real profile data for streak
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const p = await authApi.getProfile();
        if (p) {
          setUserProfile(p);
          setStoreProfile(p);
        }
      } catch (err) {
        logger.error('Failed to fetch user profile:', err);
      }
    };
    fetchProfileData();
  }, [setStoreProfile]);

  // Fetch bookmarks & learned vocabs directly from backend API
  useEffect(() => {
    const fetchBookmarked = async () => {
      setIsBookmarkedLoading(true);
      try {
        const res = await vocabApi.getBookmarkedVocabs(0, 100);
        const list = res.content || [];
        setBookmarkedCards(list);
        setTotalBookmarked(res.totalElements ?? list.length);
        // Sample 3 random cards - different on each load
        setSampledRevisionCards(getRandomSample(list, Math.min(3, list.length)));
      } catch (err) {
        logger.error('Failed to fetch bookmarked vocabs for Progress:', err);
      } finally {
        setIsBookmarkedLoading(false);
      }
    };

    const fetchLearned = async () => {
      setIsLearnedLoading(true);
      try {
        const res = await vocabApi.getLearnedVocabs(0, 100);
        const list = res.content || [];
        setLearnedCards(list);
        setTotalLearned(res.totalElements ?? list.length);
      } catch (err) {
        logger.error('Failed to fetch learned vocabs for Progress:', err);
      } finally {
        setIsLearnedLoading(false);
      }
    };

    fetchBookmarked();
    fetchLearned();
  }, []);

  // Compute live dynamic metrics
  const streakCount = userProfile?.currentStreak ?? storeProfile?.currentStreak ?? 0;
  const totalTracked = totalLearned + totalBookmarked;
  const masteryRate = totalTracked > 0 ? Math.round((totalLearned / totalTracked) * 100) : 0;

  // Filter learned cards by search query
  const filteredLearnedCards = useMemo(() => {
    if (!learnedSearch.trim()) return learnedCards;
    const q = learnedSearch.toLowerCase().trim();
    return learnedCards.filter((c) => {
      const vocabText = (c.vocab?.vocab || (c.vocab as any)?.word || '').toLowerCase();
      const meaningText = (c.vocab?.meaning || '').toLowerCase();
      const tagText = (c.vocab?.useCaseTag || '').toLowerCase();
      return vocabText.includes(q) || meaningText.includes(q) || tagText.includes(q);
    });
  }, [learnedCards, learnedSearch]);

  // Handle Practice button: starts practice session from bookmarks
  const handleStartPractice = () => {
    if (bookmarkedCards.length > 0) {
      startSession(bookmarkedCards);
      navigate('/practice');
    } else {
      navigate('/profile/bookmarks');
    }
  };

  // Helper for subtitle of revision cards matching mockup
  const getRevisionBadge = (card: VocabCardType, idx: number) => {
    if (card.vocab?.useCaseTag) {
      return { dot: idx === 1 ? 'bg-amber-500' : 'bg-red-500', text: card.vocab.useCaseTag };
    }
    if (idx === 0) return { dot: 'bg-red-500', text: 'Missed twice' };
    if (idx === 1) return { dot: 'bg-amber-500', text: 'Due today' };
    return { dot: 'bg-red-500', text: 'Missed last time' };
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-16 max-w-[1100px] mx-auto pr-4 sm:pr-6 md:pr-8">
      
      {/* ─── Page Header ─── */}
      <div className="dash-element flex flex-col gap-1">
        <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-[#f8fafc] leading-tight tracking-tight m-0">
          Progress
        </h1>
        <p className="font-inter text-[14px] text-[#64748b] dark:text-ink-soft font-medium">
          Know what to revise. Know where to continue.
        </p>
      </div>

      {/* ─── SECTION 1: Needs Revision ─── */}
      <div className="dash-element w-full bg-gradient-to-br from-[#fff5f5] via-[#fff0f2] to-[#ffe4e6] dark:bg-none dark:bg-[#141416] rounded-3xl p-6 sm:p-7 border border-red-200/60 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] relative overflow-hidden">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-rose-500/15 border border-red-200 dark:border-rose-500/30 text-[#ef4444] dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bricolage text-2xl font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight m-0">
                Needs Revision
              </h2>
              <p className="font-inter text-[13px] text-[#64748b] dark:text-ink-soft font-medium mt-0.5">
                {bookmarkedCards.length > 0
                  ? `${Math.min(3, bookmarkedCards.length)} words need your attention today.`
                  : '0 words need your attention today.'}
              </p>
            </div>
          </div>

          <Link
            to="/profile/bookmarks"
            className="flex items-center gap-1.5 font-inter font-bold text-[13px] text-[#0f172a] dark:text-[#f8fafc] hover:text-[#ef4444] dark:hover:text-rose-400 transition-colors group no-underline shrink-0"
          >
            <span>View all</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Revision Cards & Practice Button Row */}
        {isBookmarkedLoading ? (
          <div className="w-full py-10 flex items-center justify-center gap-2 bg-white/60 dark:bg-[#18181b] rounded-2xl border border-red-100 dark:border-white/10">
            <RefreshCw size={18} className="animate-spin text-[#ef4444]" />
            <span className="font-inter text-xs text-[#64748b] dark:text-ink-soft">Loading revision words...</span>
          </div>
        ) : bookmarkedCards.length === 0 ? (
          <div className="w-full bg-white/70 dark:bg-[#18181b] backdrop-blur-sm rounded-2xl p-6 text-center border border-red-100 dark:border-white/10 flex flex-col items-center gap-2">
            <h4 className="font-bricolage text-lg font-bold text-[#0f172a] dark:text-[#f8fafc] m-0">All caught up!</h4>
            <p className="font-inter text-xs text-[#64748b] dark:text-ink-soft max-w-[380px] m-0">
              No bookmarked words pending revision right now. Bookmark words to practice them here!
            </p>
            <Link
              to="/vocabulary"
              className="mt-2 inline-flex items-center gap-1.5 font-inter font-bold text-[13px] text-white bg-[#ea580c] hover:bg-[#c2410c] px-4 py-2 rounded-xl transition-all no-underline"
            >
              Explore Vocabulary <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3.5">
            
            {/* 3 Random Bookmarked Vocabs (Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
              {sampledRevisionCards.map((card, idx) => {
                const badge = getRevisionBadge(card, idx);
                const wordTitle = card.vocab?.vocab || (card.vocab as any)?.word || 'Word';
                return (
                  <div
                    key={card.vocab.id}
                    onClick={() => setOpenCard(card)}
                    className="bg-white dark:bg-[#1f2023] rounded-2xl p-4 px-5 border border-black/5 dark:border-white/10 shadow-xs hover:shadow-md hover:border-red-200 dark:hover:border-rose-500/30 transition-all cursor-pointer flex flex-col justify-center min-w-[130px] group"
                  >
                    <span className="font-bricolage text-[18px] sm:text-[19px] font-bold text-[#0f172a] dark:text-[#f8fafc] group-hover:text-[#ef4444] dark:group-hover:text-rose-400 transition-colors capitalize leading-snug truncate">
                      {wordTitle}
                    </span>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${badge.dot}`} />
                      <span className="font-inter text-[12px] font-semibold text-[#64748b] dark:text-ink-soft truncate">
                        {badge.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Practice Button (Renamed from Review 3 words) */}
            <button
              onClick={handleStartPractice}
              className="shrink-0 bg-[#ea2b39] hover:bg-[#d61f2c] active:bg-[#b91c1c] text-white font-bricolage text-[15px] font-bold px-6 py-4 rounded-2xl shadow-[0_4px_16px_rgba(234,43,57,0.35)] hover:shadow-[0_6px_20px_rgba(234,43,57,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer border-none w-full lg:w-auto"
            >
              <RefreshCw size={17} strokeWidth={2.5} />
              <span>Practice</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>

          </div>
        )}

      </div>

      {/* ─── METRICS & STATS MATRIX (Between Section 1 & Section 2) ─── */}
      <div className="dash-element grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 w-full">
        {/* 1. Daily Streak */}
        <div className="bg-white/90 dark:bg-[#141416] backdrop-blur-sm rounded-2xl p-4 sm:p-4.5 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex items-center gap-3.5 transition-all hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-xl bg-[#ffedd5] dark:bg-orange-500/15 text-[#ea580c] dark:text-orange-400 border border-[#fed7aa]/50 dark:border-orange-500/20 flex items-center justify-center shrink-0">
            <Flame size={22} className="fill-[#ea580c] dark:fill-orange-400" />
          </div>
          <div className="min-w-0">
            <div className="font-bricolage text-[20px] sm:text-[22px] font-extrabold text-[#0f172a] dark:text-[#f8fafc] leading-none truncate">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </div>
            <div className="font-inter text-[12px] font-semibold text-[#64748b] dark:text-ink-soft mt-1 truncate">
              Daily Streak 🔥
            </div>
          </div>
        </div>

        {/* 2. Words Mastered */}
        <div className="bg-white/90 dark:bg-[#141416] backdrop-blur-sm rounded-2xl p-4 sm:p-4.5 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex items-center gap-3.5 transition-all hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-xl bg-[#dcfce7] dark:bg-emerald-500/15 text-[#16a34a] dark:text-emerald-400 border border-[#bbf7d0]/50 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-bricolage text-[20px] sm:text-[22px] font-extrabold text-[#0f172a] dark:text-[#f8fafc] leading-none truncate">
              {totalLearned}
            </div>
            <div className="font-inter text-[12px] font-semibold text-[#64748b] dark:text-ink-soft mt-1 truncate">
              Words Mastered
            </div>
          </div>
        </div>

        {/* 3. In Revision Queue */}
        <div className="bg-white/90 dark:bg-[#141416] backdrop-blur-sm rounded-2xl p-4 sm:p-4.5 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex items-center gap-3.5 transition-all hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-xl bg-[#fee2e2] dark:bg-rose-500/15 text-[#ef4444] dark:text-rose-400 border border-[#fecaca]/50 dark:border-rose-500/20 flex items-center justify-center shrink-0">
            <Bookmark size={22} className="fill-[#ef4444] dark:fill-rose-400" />
          </div>
          <div className="min-w-0">
            <div className="font-bricolage text-[20px] sm:text-[22px] font-extrabold text-[#0f172a] dark:text-[#f8fafc] leading-none truncate">
              {totalBookmarked}
            </div>
            <div className="font-inter text-[12px] font-semibold text-[#64748b] dark:text-ink-soft mt-1 truncate">
              In Revision Queue
            </div>
          </div>
        </div>

        {/* 4. Mastery Rate */}
        <div className="bg-white/90 dark:bg-[#141416] backdrop-blur-sm rounded-2xl p-4 sm:p-4.5 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex items-center gap-3.5 transition-all hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-xl bg-[#f3e8ff] dark:bg-purple-500/15 text-[#9333ea] dark:text-purple-400 border border-[#e9d5ff]/50 dark:border-purple-500/20 flex items-center justify-center shrink-0">
            <Target size={22} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-bricolage text-[20px] sm:text-[22px] font-extrabold text-[#0f172a] dark:text-[#f8fafc] leading-none truncate">
              {masteryRate}%
            </div>
            <div className="font-inter text-[12px] font-semibold text-[#64748b] dark:text-ink-soft mt-1 truncate">
              Mastery Rate
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: Learned Words ─── */}
      <div className="dash-element w-full bg-[#faf8f5] dark:bg-[#141416] rounded-3xl p-6 sm:p-7 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col gap-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-[#16a34a] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-bricolage text-2xl font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight m-0">
                  Learned Words
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-[#16a34a] dark:text-emerald-400 font-inter text-[11px] font-bold">
                  {totalLearned} Mastered
                </span>
              </div>
              <p className="font-inter text-[13px] text-[#64748b] dark:text-ink-soft font-medium mt-0.5">
                Vocabulary you have reviewed and marked as learned.
              </p>
            </div>
          </div>

          {/* Search bar inside Learned Words section */}
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-ink-soft pointer-events-none" />
            <input
              type="text"
              placeholder="Search learned words..."
              value={learnedSearch}
              onChange={(e) => setLearnedSearch(e.target.value)}
              className="w-full bg-white/90 dark:bg-[#18181b] rounded-2xl py-2.5 pl-10 pr-9 font-inter text-[13px] text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8] dark:placeholder:text-ink-soft/70 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:focus:border-white/20 transition-all"
            />
            {learnedSearch && (
              <button
                onClick={() => setLearnedSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-ink-soft hover:text-[#0f172a] dark:hover:text-[#f8fafc] p-0.5 bg-transparent border-none cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Content Area for Learned Words */}
        {isLearnedLoading ? (
          <div className="w-full py-16 bg-white/60 dark:bg-[#18181b] rounded-2xl border border-black/5 dark:border-white/10 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={22} className="animate-spin text-[#16a34a]" />
            <span className="font-inter text-xs text-[#64748b] dark:text-ink-soft">Loading learned vocabulary...</span>
          </div>
        ) : learnedCards.length === 0 ? (
          <div className="w-full bg-white/80 dark:bg-[#18181b] backdrop-blur-sm rounded-2xl p-8 text-center border border-black/5 dark:border-white/10 flex flex-col items-center gap-2.5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#16a34a] dark:text-emerald-400">
              <Sparkles size={24} />
            </div>
            <h4 className="font-bricolage text-lg font-bold text-[#0f172a] dark:text-[#f8fafc] m-0">No learned words yet</h4>
            <p className="font-inter text-xs text-[#64748b] dark:text-ink-soft max-w-[400px] m-0">
              Start a practice session from your Bookmarks or explore the vocabulary dictionary to mark words as learned!
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
              <Link
                to="/profile/bookmarks"
                className="font-inter font-bold text-[13px] text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl shadow-xs transition-all no-underline inline-flex items-center gap-1.5"
              >
                <Bookmark size={15} />
                View Bookmarks
              </Link>
              <Link
                to="/vocabulary"
                className="font-inter font-bold text-[13px] text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#27272a] hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 px-5 py-2.5 rounded-xl shadow-xs transition-all no-underline inline-flex items-center gap-1.5"
              >
                Explore Vocabulary
              </Link>
            </div>
          </div>
        ) : filteredLearnedCards.length === 0 ? (
          <div className="w-full bg-white/80 dark:bg-[#18181b] rounded-2xl p-8 text-center border border-black/5 dark:border-white/10 text-[#64748b] dark:text-ink-soft font-inter text-sm shadow-xs flex flex-col items-center gap-2">
            <p className="m-0">No learned words match "{learnedSearch}".</p>
            <button
              onClick={() => setLearnedSearch('')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline bg-transparent border-none cursor-pointer text-xs"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLearnedCards.map((card, idx) => {
              const yearNum = 2024 - (idx % 4);
              const tagLabel = card.vocab?.useCaseTag || `CUET ${yearNum}`;
              return (
                <ShrinkVocabCard
                  key={card.vocab.id}
                  vocabCard={{ ...card, isLearned: true }}
                  tag={tagLabel}
                  onClick={() => setOpenCard(card)}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* OpenVocabCard Modal */}
      {openCard && (
        <OpenVocabCard
          vocabCard={openCard}
          isOpen={!!openCard}
          onClose={() => setOpenCard(null)}
        />
      )}

    </div>
  );
}
