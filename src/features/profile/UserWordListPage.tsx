import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookOpen,
  Search,
  ArrowRight,
  ChevronDown,
  Filter,
  MessageSquare,
  PenTool,
  Link as LinkIcon,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { ShrinkVocabCard } from '../../components/vocab/ShrinkVocabCard';
import { VocabCard } from '../../components/vocab/VocabCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import { PracticeSessionLauncher } from '../../components/vocab/PracticeSessionLauncher';
import { vocabApi } from '../../api/endpoints/vocab.api';
import type { VocabCard as VocabCardType } from '../../types';

type Mode = 'learned' | 'bookmarked';

interface UserWordListPageProps {
  mode: Mode;
}

const SUB_TABS = [
  { id: 'vocabulary', title: 'Vocabulary', icon: BookOpen },
  { id: 'foreign-words', title: 'Foreign Words', icon: Globe },
  { id: 'idioms-and-phrases', title: 'Idioms & Phrases', icon: MessageSquare },
  { id: 'one-word-sub', title: 'One Word Sub.', icon: PenTool },
  { id: 'phrasal-verbs', title: 'Phrasal Verbs', icon: LinkIcon },
];

export default function UserWordListPage({ mode }: UserWordListPageProps) {
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [searchQuery, setSearchQuery] = useState('');
  const [rawCards, setRawCards] = useState<VocabCardType[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPage(0);
  }, [mode]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (mode === 'learned') {
          const res = await vocabApi.getLearnedVocabs(page, pageSize);
          setRawCards(res.content || []);
          setTotalPages(res.totalPages || 1);
        } else {
          const res = await vocabApi.getBookmarkedVocabs(page, pageSize);
          setRawCards(res.content || []);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error(`Failed to fetch ${mode} words`, err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [mode, page, pageSize, openCard]);

  // Filtering Logic
  const filteredCards = useMemo(() => {
    return rawCards.filter((card) => {
      // In bookmarked mode, strictly ensure card is bookmarked
      if (mode === 'bookmarked') {
        const isB = Boolean(card.isBookmarked ?? (card as any).bookmarked ?? true);
        if (!isB) return false;
      }

      // Year Filter matching
      if (selectedYear && selectedYear !== 'All Years') {
        const tagStr = (card.vocab.useCaseTag || '').toLowerCase();
        const yearStr = selectedYear.toLowerCase();
        const tagsStr = (card.vocab as any).tags ? String((card.vocab as any).tags).toLowerCase() : '';
        const combined = `${tagStr} ${tagsStr}`;

        if (combined.includes('202') || combined.includes('201')) {
          if (!combined.includes(yearStr)) return false;
        }
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (card.vocab.vocab || (card.vocab as any).word || '').toLowerCase().includes(q) ||
        (card.vocab.meaning || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const typeUpper = (card.vocab.vocabType || '').toUpperCase();
      if (activeTab === 'idioms-and-phrases' && typeUpper !== 'IDIOM' && typeUpper !== 'PHRASE') return false;
      if (activeTab === 'one-word-sub' && typeUpper !== 'WORD') return false;
      if (activeTab === 'phrasal-verbs' && typeUpper !== 'PHRASE') return false;
      if (activeTab === 'foreign-words' && typeUpper !== 'FOREIGN') return false;

      return true;
    });
  }, [rawCards, searchQuery, activeTab, selectedYear, mode]);

  return (
    <div className="w-full flex flex-col gap-6 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">
      {/* ─── SAVED WORDS / BOOKMARKED VIEW ─── */}
      {mode === 'bookmarked' ? (
        <div className="dash-element flex flex-col gap-6 w-full mt-4">
          {/* Header Title: SAVED WORDS with Red Bookmark Ribbon Icon */}
          <div className="flex items-center gap-3">
            <Bookmark size={30} className="text-[#ea580c]" fill="#ea580c" />
            <h1 className="font-bricolage text-3xl font-extrabold text-[#0f172a] dark:text-[#f8fafc] tracking-tight leading-tight m-0">
              SAVED WORDS
            </h1>
          </div>

          {/* Top Controls Row: Search, Reel Mode, Year Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full max-w-[500px]">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-ink-soft" />
              <input
                type="text"
                placeholder="Search words (e.g. obstinate, meticulous, ubiquitous...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 dark:bg-[#18181b] rounded-2xl py-3 pl-11 pr-10 font-inter text-[14px] text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8] dark:placeholder:text-ink-soft/70 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-[#f97316]/40 dark:focus:border-white/20 transition-all"
              />
              <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-ink-soft" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              {/* Practice Reel Launcher */}
              <PracticeSessionLauncher
                cards={filteredCards}
                label="Reel Mode"
              />

              {/* Year Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-white/90 dark:bg-[#18181b] border border-black/5 dark:border-white/10 rounded-2xl py-3 pl-4 pr-10 font-inter font-bold text-[14px] text-[#0f172a] dark:text-[#f8fafc] shadow-xs cursor-pointer focus:outline-none dark:hover:border-white/25"
                >
                  <option value="All Years" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">All Years</option>
                  <option value="2024" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2024</option>
                  <option value="2023" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2023</option>
                  <option value="2022" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2022</option>
                  <option value="2021" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2021</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#f8fafc] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sub-tabs Row */}
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {SUB_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl font-inter text-[14px] font-bold transition-all cursor-pointer border ${isActive
                      ? 'bg-[#fff3e0] dark:bg-orange-500/15 border-[#f97316]/30 dark:border-orange-500/30 text-[#ea580c] dark:text-orange-400 shadow-xs'
                      : 'bg-white/80 dark:bg-[#18181b] border-black/5 dark:border-white/10 text-[#64748b] dark:text-[#a1a1aa] hover:text-[#0f172a] dark:hover:text-[#f8fafc] hover:bg-white dark:hover:bg-white/5'
                    }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#ea580c] dark:text-orange-400' : 'text-[#64748b] dark:text-[#a1a1aa]'} />
                  {tab.title}
                </button>
              );
            })}
          </div>

          {/* Grid of ShrinkVocabCard components */}
          {isLoading ? (
            <div className="w-full bg-white/80 dark:bg-[#18181b] rounded-2xl p-16 text-center border border-black/5 dark:border-white/10 shadow-xs flex flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin text-[#f97316]" />
              <p className="font-inter text-xs text-[#64748b] dark:text-ink-soft">Loading saved words...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="w-full bg-white/80 dark:bg-[#18181b] rounded-2xl p-12 text-center border border-black/5 dark:border-white/10 shadow-xs flex flex-col items-center justify-center">
              <p className="font-inter text-[#64748b] dark:text-[#a1a1aa] mb-4">
                {searchQuery.trim()
                  ? `No saved words match "${searchQuery}".`
                  : 'You haven\'t bookmarked any words yet. Bookmark words to save them here!'}
              </p>
              <Link
                to="/vocabulary"
                className="inline-flex items-center gap-2 font-inter font-bold text-[14px] text-white bg-[#f97316] px-6 py-3 rounded-xl shadow-xs hover:bg-[#ea580c] transition-all"
              >
                Explore Vocabulary <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
              {filteredCards.map((card, idx) => {
                const yearNum = 2024 - (idx % 4);
                return (
                  <ShrinkVocabCard
                    key={card.vocab.id}
                    vocabCard={{ ...card, isBookmarked: true }}
                    tag={`CUET ${yearNum}`}
                    onClick={() => setOpenCard(card)}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ─── LEARNED WORDS VIEW ─── */
        <div className="dash-element flex flex-col gap-6 w-full mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-bricolage text-2xl font-bold text-ink dark:text-[#f8fafc] m-0 leading-tight">
                Learned Words
              </h1>
              <p className="font-inter text-[13px] text-ink-soft">
                Manage your learned vocabulary collection
              </p>
            </div>
          </div>

          {/* Grid of Learned Words */}
          {isLoading ? (
            <div className="w-full bg-cream-card dark:bg-[#18181b] rounded-2xl p-16 text-center border border-black/5 dark:border-white/10 shadow-xs flex flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin text-orange-500" />
              <p className="font-inter text-xs text-ink-soft">Loading learned words...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="w-full bg-cream-card dark:bg-[#18181b] rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/10 shadow-xs">
              <h2 className="font-bricolage text-[26px] font-bold text-ink dark:text-[#f8fafc] mb-2">
                You haven't marked any words as learned yet.
              </h2>
              <p className="font-inter text-[14px] text-ink-soft max-w-[420px] mb-6">
                Open any word from the Vocabulary page and click "Mark as learned".
              </p>
              <Link
                to="/vocabulary"
                className="inline-flex items-center gap-2 font-inter font-bold text-[14px] text-white bg-orange-500 px-6 py-3 rounded-xl shadow-xs hover:bg-orange-600 transition-all"
              >
                Explore Vocabulary <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {filteredCards.map((card) => (
                <VocabCard
                  key={card.vocab.id}
                  vocabCard={card}
                  onClick={() => setOpenCard(card)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Pagination Controls ─── */}
      {totalPages > 1 && (
        <div className="dash-element mt-6 flex justify-center items-center gap-4 font-inter text-[13px] font-bold">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
            className="font-inter font-bold text-[13px] text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not(:disabled):bg-[#f97316] hover:not(:disabled):text-white hover:not(:disabled):border-[#f97316] shadow-2xs"
          >
            Previous
          </button>
          <span className="text-[#64748b] dark:text-ink-soft px-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
            className="font-inter font-bold text-[13px] text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not(:disabled):bg-[#f97316] hover:not(:disabled):text-white hover:not(:disabled):border-[#f97316] shadow-2xs"
          >
            Next
          </button>
        </div>
      )}

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
