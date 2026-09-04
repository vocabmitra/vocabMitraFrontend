import { useState, useEffect, useMemo } from 'react';
import { BookOpen, MessageSquare, PenTool, Link as LinkIcon, Globe, Sparkles, Search, RefreshCw } from 'lucide-react';
import { VocabCard } from '../../components/vocab/VocabCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import type { VocabCard as VocabCardType } from '../../types';
import { vocabApi } from '../../api/endpoints/vocab.api';

const TABS = [
  { id: 'all', title: 'All CUET Words', icon: BookOpen, color: 'text-orange-500' },
  { id: 'previous-year-words', title: 'Previous-Year Words', icon: BookOpen, color: 'text-purple-500' },
  { id: 'idioms-and-phrases', title: 'Idioms & Phrases', icon: MessageSquare, color: 'text-green-500' },
  { id: 'one-word-substitution', title: 'One Word Substitution', icon: PenTool, color: 'text-blue-500' },
  { id: 'phrasal-verbs', title: 'Phrasal Verbs', icon: LinkIcon, color: 'text-teal-500' },
  { id: 'foreign-words', title: 'Foreign Words', icon: Globe, color: 'text-orange-500' },
];

export default function CuetFocusPage() {
  const [cards, setCards] = useState<VocabCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const loadCuetVocabs = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const response = await vocabApi.filterVocabByUseCaseTag('CUET', targetPage, pageSize, 'id');
      setCards(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      setPage(response.number ?? targetPage);
    } catch (error) {
      console.error('[CuetFocusPage] Failed to fetch CUET vocabs:', error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCuetVocabs(page);
  }, [page]);

  // Filter cards by search query & sub-tab
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.vocab.vocab.toLowerCase().includes(q) ||
        card.vocab.meaning.toLowerCase().includes(q) ||
        (card.vocab.trick && card.vocab.trick.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeTab === 'all' || activeTab === 'previous-year-words') return true;

      const typeUpper = (card.vocab.vocabType || '').toUpperCase();
      if (activeTab === 'idioms-and-phrases') return typeUpper === 'IDIOM' || typeUpper === 'PHRASE';
      if (activeTab === 'one-word-substitution') return typeUpper === 'WORD';
      if (activeTab === 'phrasal-verbs') return typeUpper === 'PHRASE';
      if (activeTab === 'foreign-words') return typeUpper === 'PHRASE' || typeUpper === 'FOREIGN';

      return true;
    });
  }, [cards, searchQuery, activeTab]);

  return (
    <div className="w-full flex flex-col gap-6 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">

      {/* ─── Global Top Header ─── */}
      <div className="dash-element flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-bricolage text-2xl font-bold text-ink m-0 leading-tight">
              CUET Focus Hub
            </h1>
            <p className="font-inter text-[13px] text-ink-soft">
              Master the exact vocabulary you need for the CUET exam ({totalElements} entries).
            </p>
          </div>
        </div>

        {/* Local Search Bar */}
        <div className="relative w-full max-w-[320px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft opacity-70" />
          <input 
            type="text" 
            placeholder="Search CUET words..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream-card rounded-xl py-2.5 pl-10 pr-4 font-inter text-[13px] text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      {/* ─── Top Navbar (Tabs) ─── */}
      <div className="dash-element w-full mt-2">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-inter text-[14px] font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-[0_4px_12px_rgba(249,115,22,0.15)]'
                    : 'bg-cream-card border-black/5 dark:border-white/5 dark:border-t-white/10 text-ink-soft hover:text-ink hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-orange-500' : 'text-ink-soft opacity-70'} />
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Content Loading / Empty / Grid ─── */}
      {isLoading ? (
        <div className="dash-element w-full bg-cream-card rounded-2xl p-16 text-center border border-black/5 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-orange-500" />
          <p className="font-inter text-xs text-ink-soft">Loading CUET vocabulary entries...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="dash-element w-full bg-cream-card rounded-2xl p-12 text-center border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm">
          <p className="font-inter text-ink-soft mb-2">
            {searchQuery.trim()
              ? `No CUET words found matching "${searchQuery}".`
              : 'No vocabulary entries found for CUET exam.'}
          </p>
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-orange-500 font-inter text-[13px] font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="dash-element grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {filteredCards.map((card) => (
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
