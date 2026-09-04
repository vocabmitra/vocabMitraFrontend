import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen, Search, Target, Flame, ArrowRight } from 'lucide-react';
import { VocabCard } from '../../components/vocab/VocabCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import { PracticeSessionLauncher } from '../../components/vocab/PracticeSessionLauncher';
import { vocabApi } from '../../api/endpoints/vocab.api';
import type { VocabCard as VocabCardType, UseCaseTag } from '../../types';
import { parseUseCaseTags } from '../../types';

type Mode = 'learned' | 'bookmarked';

interface UserWordListPageProps {
  mode: Mode;
}

const MODE_META = {
  learned: {
    label: 'Learned Words',
    emptyMessage: "You haven't marked any words as learned yet.",
    emptyHint: 'Open any word from the Vocabulary page and click "Mark as learned".',
    icon: BookOpen,
  },
  bookmarked: {
    label: 'Bookmarked Words',
    emptyMessage: "You haven't bookmarked any words yet.",
    emptyHint: 'Open any word and click "Bookmark" to save it here.',
    icon: Bookmark,
  },
};

export default function UserWordListPage({ mode }: UserWordListPageProps) {
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);
  const [activeFilters, setActiveFilters] = useState<UseCaseTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rawCards, setRawCards] = useState<VocabCardType[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const meta = MODE_META[mode];
  const Icon = meta.icon;

  useEffect(() => {
    setPage(0);
  }, [mode]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (mode === 'learned') {
          // Fetch paginated learned vocabs from GET /user/private/learnedVocabs?page=&size=
          const res = await vocabApi.getLearnedVocabs(page, pageSize);
          setRawCards(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        } else {
          // Fetch paginated bookmarked vocabs from GET /user/private/bookmarkedVocabs?page=&size=
          const res = await vocabApi.getBookmarkedVocabs(page, pageSize);
          setRawCards(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
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
  let cards = rawCards;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    cards = cards.filter(
      (c) =>
        (c.vocab.vocab || (c.vocab as any).word || '').toLowerCase().includes(q) ||
        (c.vocab.meaning || '').toLowerCase().includes(q)
    );
  }

  if (activeFilters.length > 0) {
    cards = cards.filter((c) =>
      activeFilters.some((f) => c.vocab.useCaseTag.includes(f))
    );
  }

  // Collect tags
  const allTags = useMemo(() => Array.from(
    new Set(
      rawCards.flatMap((c) => parseUseCaseTags(c.vocab.useCaseTag))
    )
  ) as UseCaseTag[], [rawCards]);

  const toggleFilter = (tag: UseCaseTag) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">
      
      {/* ─── Global Top Header ─── */}
      <div className="dash-element flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full mt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Icon size={24} />
          </div>
          <div>
            <h1 className="font-bricolage text-2xl font-bold text-ink m-0 leading-tight">
              {meta.label}
            </h1>
            <p className="font-inter text-[13px] text-ink-soft">
              Manage your vocabulary collection
            </p>
          </div>
        </div>

        {/* Local Search Bar + Practice CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full max-w-[280px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft opacity-70" />
            <input 
              type="text" 
              placeholder="Search saved words..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-card rounded-xl py-2.5 pl-10 pr-4 font-inter text-[13px] text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            />
          </div>
          <PracticeSessionLauncher
            cards={cards}
            label={activeFilters.length > 0 || searchQuery.trim() ? 'Filtered Words' : (mode === 'bookmarked' ? 'Bookmarked Words' : 'Learned Words')}
          />
        </div>
      </div>

      {/* ─── Row 1: Metrics ─── */}
      <div className="dash-element grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-4 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all cursor-default">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Bookmark size={22} className="fill-blue-500/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[12px] font-medium text-blue-500 mb-1">Total {mode === 'learned' ? 'Learned' : 'Saved'}</span>
            <span className="font-bricolage text-[24px] font-bold text-ink leading-none">{totalElements || rawCards.length}</span>
          </div>
        </div>

        <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-4 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all cursor-default">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Target size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[12px] font-medium text-purple-500 mb-1">Mastery Rate</span>
            <span className="font-bricolage text-[24px] font-bold text-ink leading-none">
              {rawCards.length > 0 ? '12%' : '0%'}
            </span>
          </div>
        </div>

        <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-4 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all cursor-default">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Flame size={22} className="fill-orange-500/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[12px] font-medium text-orange-500 mb-1">Pending Review</span>
            <span className="font-bricolage text-[24px] font-bold text-ink leading-none">
              {rawCards.length > 0 ? Math.max(0, rawCards.length - 2) : 0}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Category Filters ─── */}
      {rawCards.length > 0 && allTags.length > 0 && (
        <div className="dash-element w-full mt-2">
          <div className="flex items-center gap-2 font-inter text-[13px] font-bold text-ink-soft uppercase tracking-wider mb-4 px-2">
            Filter by Category
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-4 w-full">
            {allTags.map((tag) => {
              const isActive = activeFilters.includes(tag);
              return (
                <div 
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`rounded-2xl p-3 flex items-center justify-center gap-2 w-full border shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 dark:shadow-[0_4px_12px_rgba(249,115,22,0.15)]' 
                      : 'bg-cream-card border-black/5 dark:border-white/5 dark:border-t-white/10 text-ink hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <span className="font-inter text-[13px] font-semibold leading-tight text-center">
                    {tag.replace(/-/g, ' ').toUpperCase()}
                  </span>
                </div>
              )
            })}
            {activeFilters.length > 0 && (
              <div 
                onClick={() => setActiveFilters([])}
                className="rounded-2xl p-3 flex items-center justify-center gap-2 w-full border border-black/5 dark:border-white/5 bg-transparent text-ink-soft hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-all"
              >
                <span className="font-inter text-[13px] font-semibold leading-tight text-center">
                  Clear Filters
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Grid ─── */}
      {cards.length === 0 && rawCards.length > 0 ? (
        <div className="text-center py-20 bg-cream-card rounded-2xl border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <p className="font-inter text-ink-soft">No words match your filters or search.</p>
          <button 
            onClick={() => { setActiveFilters([]); setSearchQuery(''); }}
            className="mt-4 text-orange-500 font-inter font-medium hover:underline cursor-pointer bg-transparent border-none"
          >
            Clear all filters
          </button>
        </div>
      ) : rawCards.length === 0 ? (
        <div className="dash-element w-full bg-cream-card rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="w-24 h-24 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 border border-black/5 dark:border-white/10 shadow-inner relative">
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl animate-pulse" />
            <Icon size={40} className="text-orange-500 relative z-10" />
          </div>
          <h2 className="font-bricolage text-[28px] md:text-[32px] font-bold text-ink mb-3">
            {meta.emptyMessage}
          </h2>
          <p className="font-inter text-[15px] text-ink-soft max-w-[450px] mx-auto mb-8">
            {meta.emptyHint} Your collection awaits! Build a habit of saving words you want to practice later.
          </p>
          <Link
            to="/vocabulary"
            className="inline-flex items-center justify-center gap-2 font-inter font-semibold text-[15px] text-white bg-orange-500 hover:bg-orange-600 transition-colors px-8 py-4 rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:-translate-y-0.5"
          >
            Explore Vocabulary <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {cards.map((card) => (
            <VocabCard
              key={card.vocab.id}
              vocabCard={card}
              onClick={() => setOpenCard(card)}
            />
          ))}
        </div>
      )}

      {/* ─── Pagination Controls ─── */}
      {totalPages > 1 && (
        <div className="dash-element mt-6 flex justify-center items-center gap-4 font-inter text-[13px] font-bold">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
            className="font-inter font-bold text-[13px] text-ink bg-cream-card border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not(:disabled):bg-orange-500 hover:not(:disabled):text-white hover:not(:disabled):border-orange-500 shadow-sm"
          >
            Previous
          </button>
          <span className="text-ink-soft px-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
            className="font-inter font-bold text-[13px] text-ink bg-cream-card border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not(:disabled):bg-orange-500 hover:not(:disabled):text-white hover:not(:disabled):border-orange-500 shadow-sm"
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
