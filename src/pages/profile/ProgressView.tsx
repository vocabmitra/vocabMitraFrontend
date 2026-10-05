import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Search,
  Flame,
  Target,
  Bookmark,
} from 'lucide-react';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { authApi } from '../../api/endpoints/auth.api';
import { useAuthStore } from '../../store/useAuthStore';
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
  const { profile: storeProfile, setProfile: setStoreProfile } = useAuthStore();
  const [userProfile, setUserProfile] = useState<ProfileResponse | null>(storeProfile);

  // Bookmarked state for Needs Revision
  const [bookmarkedCards, setBookmarkedCards] = useState<VocabCardType[]>([]);
  const [totalBookmarked, setTotalBookmarked] = useState(0);
  const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(true);

  // Learned state for Learned Words section
  const [learnedCards, setLearnedCards] = useState<VocabCardType[]>([]);
  const [totalLearned, setTotalLearned] = useState(0);
  const [isLearnedLoading, setIsLearnedLoading] = useState(true);

  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);
  const [learnedSearch, setLearnedSearch] = useState('');

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

    const fetchBookmarked = async () => {
      setIsBookmarkedLoading(true);
      try {
        const res = await vocabApi.getBookmarkedVocabs(0, 50);
        const list = res.content || [];
        setBookmarkedCards(list);
        setTotalBookmarked(res.totalElements || list.length);
      } catch (err) {
        logger.error('Failed to fetch bookmarked vocabs for Progress:', err);
      } finally {
        setIsBookmarkedLoading(false);
      }
    };

    const fetchLearned = async () => {
      setIsLearnedLoading(true);
      try {
        const res = await vocabApi.getLearnedVocabs(0, 50);
        const list = res.content || [];
        setLearnedCards(list);
        setTotalLearned(res.totalElements || list.length);
      } catch (err) {
        logger.error('Failed to fetch learned vocabs for Progress:', err);
      } finally {
        setIsLearnedLoading(false);
      }
    };

    fetchProfileData();
    fetchBookmarked();
    fetchLearned();
  }, [setStoreProfile]);

  // Calculate mastery rate
  const totalTracked = totalLearned + totalBookmarked;
  const masteryRate = totalTracked > 0 ? Math.round((totalLearned / totalTracked) * 100) : 0;

  // 3 to 4 random bookmarked cards picked from the list
  const sampledRevisionCards = useMemo(() => {
    if (bookmarkedCards.length === 0) return [];
    return getRandomSample(bookmarkedCards, Math.min(3, bookmarkedCards.length));
  }, [bookmarkedCards]);

  // Filter learned cards by search query
  const filteredLearnedCards = useMemo(() => {
    if (!learnedSearch.trim()) return learnedCards;
    const q = learnedSearch.toLowerCase().trim();
    return learnedCards.filter(
      (c) =>
        c.vocab.vocab.toLowerCase().includes(q) ||
        c.vocab.meaning.toLowerCase().includes(q)
    );
  }, [learnedCards, learnedSearch]);

  const handleStartPractice = () => {
    navigate('/practice/bookmark');
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-12 max-w-[1100px] mx-auto pr-4 sm:pr-6 md:pr-8">
      
      {/* ─── Page Header ─── */}
      <div className="dash-element flex flex-col gap-0.5">
        <h1 className="font-bricolage text-2xl sm:text-3xl font-extrabold text-[#0f172a] leading-tight tracking-tight m-0">
          Progress
        </h1>
        <p className="font-inter text-[13px] text-[#64748b] font-medium">
          Know what to revise. Know where to continue.
        </p>
      </div>

      {/* ─── SECTION 1: Needs Revision (Compact Card) ─── */}
      <div className="dash-element w-full bg-gradient-to-br from-[#fff5f5] via-[#fff0f2] to-[#ffe4e6] rounded-2xl p-5 sm:p-6 border border-red-200/60 shadow-xs relative overflow-hidden">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 text-[#ef4444] flex items-center justify-center shrink-0">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-[#0f172a] leading-tight m-0">
                Needs Revision
              </h2>
              <p className="font-inter text-[12px] text-[#64748b] font-medium mt-0.5">
                {totalBookmarked === 1
                  ? '1 word needs your attention today.'
                  : `${totalBookmarked} words need your attention today.`}
              </p>
            </div>
          </div>

          <Link
            to="/profile/bookmarks"
            className="flex items-center gap-1 font-inter font-bold text-[13px] text-[#ef4444] hover:text-[#dc2626] transition-colors group no-underline shrink-0"
          >
            <span>View all</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards & Practice Button Row */}
        {isBookmarkedLoading ? (
          <div className="w-full py-6 flex items-center justify-center gap-2 bg-white/60 rounded-xl border border-red-100">
            <RefreshCw size={16} className="animate-spin text-[#ef4444]" />
            <span className="font-inter text-xs text-[#64748b]">Loading revision queue...</span>
          </div>
        ) : bookmarkedCards.length === 0 ? (
          <div className="w-full bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-red-100 flex flex-col items-center gap-1">
            <CheckCircle2 size={22} className="text-[#16a34a]" />
            <h4 className="font-bricolage text-base font-bold text-[#0f172a] m-0">All caught up!</h4>
            <p className="font-inter text-xs text-[#64748b] max-w-[360px]">
              No bookmarked words pending revision right now.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* 3 to 4 Random Bookmarked Vocabs (Compact Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 flex-1 w-full">
              {sampledRevisionCards.map((card) => {
                const tagLabel = card.vocab.useCaseTag || card.vocab.vocabType || 'CUET';
                return (
                  <div
                    key={card.vocab.id}
                    onClick={() => setOpenCard(card)}
                    className="bg-white/95 rounded-xl p-3 px-4 border border-red-100 shadow-2xs hover:shadow-xs hover:border-red-300 transition-all cursor-pointer flex flex-col justify-center gap-1 group"
                  >
                    <span className="font-bricolage text-[16px] font-bold text-[#0f172a] group-hover:text-[#ef4444] transition-colors capitalize leading-tight truncate">
                      {card.vocab.vocab}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                      <span className="font-inter text-[11px] font-semibold text-[#64748b] truncate">
                        {tagLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Red Action Button (Compact) */}
            <button
              onClick={handleStartPractice}
              className="shrink-0 bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white font-bricolage text-[14px] font-bold px-5 py-3 rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_18px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer border-none w-full md:w-auto"
            >
              <RefreshCw size={16} strokeWidth={2.5} />
              <span>Practice vocabs</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>

          </div>
        )}

      </div>

      {/* ─── METRICS & STREAK ROW (Between Section 1 & Section 2) ─── */}
      <div className="dash-element grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Current Streak */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-black/5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0">
            <Flame size={18} className="fill-[#ea580c]" />
          </div>
          <div>
            <div className="font-bricolage text-[18px] font-extrabold text-[#0f172a] leading-none">
              {userProfile?.currentStreak ?? 0} {(userProfile?.currentStreak ?? 0) === 1 ? 'Day' : 'Days'}
            </div>
            <div className="font-inter text-[11px] font-semibold text-[#64748b] mt-0.5">
              Daily Streak 🔥
            </div>
          </div>
        </div>

        {/* Words Mastered */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-black/5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="font-bricolage text-[18px] font-extrabold text-[#0f172a] leading-none">
              {totalLearned}
            </div>
            <div className="font-inter text-[11px] font-semibold text-[#64748b] mt-0.5">
              Words Mastered
            </div>
          </div>
        </div>

        {/* Pending Revision */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-black/5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#fee2e2] text-[#ef4444] flex items-center justify-center shrink-0">
            <Bookmark size={18} className="fill-[#ef4444]" />
          </div>
          <div>
            <div className="font-bricolage text-[18px] font-extrabold text-[#0f172a] leading-none">
              {totalBookmarked}
            </div>
            <div className="font-inter text-[11px] font-semibold text-[#64748b] mt-0.5">
              In Revision Queue
            </div>
          </div>
        </div>

        {/* Vocab Mastery Rate */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-black/5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center shrink-0">
            <Target size={18} />
          </div>
          <div>
            <div className="font-bricolage text-[18px] font-extrabold text-[#0f172a] leading-none">
              {masteryRate}%
            </div>
            <div className="font-inter text-[11px] font-semibold text-[#64748b] mt-0.5">
              Mastery Rate
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: Learned Words (Compact Card) ─── */}
      <div className="dash-element w-full bg-gradient-to-br from-[#f0fdf4] via-[#f7fee7] to-[#ecfdf5] rounded-2xl p-5 sm:p-6 border border-emerald-200/60 shadow-xs relative overflow-hidden flex flex-col gap-4">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-[#16a34a] flex items-center justify-center shrink-0">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bricolage text-xl sm:text-2xl font-bold text-[#0f172a] leading-tight m-0">
                  Learned Words
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-[#16a34a] font-inter text-[11px] font-bold">
                  {totalLearned} Mastered
                </span>
              </div>
              <p className="font-inter text-[12px] text-[#64748b] font-medium mt-0.5">
                Vocabulary you have reviewed and remembered.
              </p>
            </div>
          </div>

          {/* Search bar inside Learned Words section */}
          {learnedCards.length > 0 && (
            <div className="relative w-full sm:w-auto min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search learned words..."
                value={learnedSearch}
                onChange={(e) => setLearnedSearch(e.target.value)}
                className="w-full bg-white/90 rounded-xl py-1.5 pl-8 pr-3 font-inter text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] border border-black/5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 transition-all"
              />
            </div>
          )}
        </div>

        {/* Content Area for Learned Words */}
        {isLearnedLoading ? (
          <div className="w-full py-8 bg-white/60 rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-[#16a34a]" />
            <span className="font-inter text-xs text-[#64748b]">Loading learned vocabulary...</span>
          </div>
        ) : learnedCards.length === 0 ? (
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-100 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#16a34a]">
              <Sparkles size={20} />
            </div>
            <h4 className="font-bricolage text-base font-bold text-[#0f172a] m-0">No learned words yet</h4>
            <p className="font-inter text-xs text-[#64748b] max-w-[360px]">
              Start a practice session from your Bookmarks or Reel Mode to mark words as learned!
            </p>
            <button
              onClick={handleStartPractice}
              className="mt-1 font-inter font-bold text-[13px] text-white bg-[#16a34a] hover:bg-[#15803d] px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer border-none"
            >
              Start Bookmark Practice
            </button>
          </div>
        ) : filteredLearnedCards.length === 0 ? (
          <div className="w-full bg-white/80 rounded-xl p-4 text-center border border-emerald-100 text-[#64748b] font-inter text-xs">
            No learned words match "{learnedSearch}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredLearnedCards.slice(0, 6).map((card) => {
              const tagLabel = card.vocab.useCaseTag || card.vocab.vocabType || 'CUET';
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
