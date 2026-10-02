import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VocabCard } from '../components/vocab/VocabCard';
import { OpenVocabCard } from '../components/vocab/OpenVocabCard';
import { VocabCardSkeleton } from '../components/common/Skeleton';
import { PracticeSessionLauncher } from '../components/vocab/PracticeSessionLauncher';
import { useVocabList } from '../features/vocab/useVocabList';
import { useDebounce } from '../hooks/useDebounce';

export default function VocabPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(() => searchParams.get('q') ?? '');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(localSearch, 400);

  const {
    vocabList,
    isLoading,
    activeFilters,
    page,
    totalPages,
    pageSize,
    clearFilters,
    setSearch,
    setPage,
    setPageSize,
  } = useVocabList();

  // Sync debounced search to store + URL
  useEffect(() => {
    setSearch(debouncedSearch);
    setSearchParams(
      (prev) => {
        if (debouncedSearch) { prev.set('q', debouncedSearch); }
        else { prev.delete('q'); }
        return prev;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearch, setSearchParams]);

  // URL ?word= on initial load — open modal if ?word= present in URL
  useEffect(() => {
    const wordId = searchParams.get('word');
    if (!wordId) return;
    const id = Number(wordId);
    const found = vocabList.find((vc) => vc.vocab.id === id);
    if (found && !openCardId) setOpenCardId(found.vocab.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabList]);

  const hasFilters = activeFilters.length > 0 || localSearch.trim().length > 0;

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] bg-transparent">
        <div className="vv-container pt-5 px-7 pb-20">

          {/* ── Header & Search Area ── */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search & Cards per page Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              {/* Sleek Search Box */}
              <div
                className="flex items-center gap-2.5 px-4 py-3 border border-[#cbd5e1] rounded-[100px] bg-white transition-all duration-200 ease-in-out flex-1 w-full focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus-within:border-[#94a3b8]"
              >
                <Search size={18} className="text-[#94a3b8] shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search words, meanings, mnemonics, or exam tags…"
                  aria-label="Search vocabulary"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[#0f172a] text-[14px] font-medium py-0 px-0 font-inter placeholder:text-[#94a3b8] placeholder:font-normal min-w-0"
                  id="vocab-search-input"
                />
                {localSearch && (
                  <button
                    onClick={() => setLocalSearch('')}
                    className="text-[#64748b] hover:text-[#0f172a] bg-transparent border-none cursor-pointer p-0 shrink-0 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* Sleek Cards Per Page Dropdown */}
              <div className="flex items-center gap-3 font-inter text-[13.5px] font-semibold text-[#334155] shrink-0 sm:ml-1">
                <span className="tracking-wide">Cards per page:</span>
                <div className="relative flex items-center">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="appearance-none bg-white text-[#0f172a] font-inter font-bold border border-[#cbd5e1] rounded-[14px] py-2 pl-4 pr-10 outline-none cursor-pointer text-[14px] transition-all hover:border-[#94a3b8] hover:shadow-sm"
                    aria-label="Select cards per page"
                  >
                    {[9, 12, 18, 24, 36, 48].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 text-[#0f172a] pointer-events-none" strokeWidth={3} />
                </div>
              </div>

              {/* Reel Mode / Practice */}
              {!isLoading && vocabList.length > 0 && (
                <PracticeSessionLauncher
                  cards={vocabList}
                  label="Reel Mode"
                  className="sm:ml-1 !bg-[#fff1f2] !text-[#e11d48] hover:!bg-[#ffe4e6] !border border-[#fecdd3] !px-4 !py-2 !rounded-[14px] font-inter !text-[13.5px] !shadow-none tracking-wide"
                />
              )}
            </div>

            {/* Active search notice */}
            {localSearch.trim() && (
              <div className="text-[13px] font-inter text-ink-soft flex items-center gap-2">
                <span>Showing search results matching &ldquo;<strong className="text-ink">{localSearch}</strong>&rdquo;</span>
                <button
                  onClick={() => setLocalSearch('')}
                  className="text-orange-500 hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* ── Results grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              {Array.from({ length: pageSize }).map((_, i) => (
                <VocabCardSkeleton key={i} />
              ))}
            </div>
          ) : vocabList.length === 0 ? (
            <div className="text-center py-20 text-ink-soft font-space font-bold text-sm">
              <div className="text-[40px] mb-4">🔍</div>
              <div>No words found.</div>
              {hasFilters && (
                <button
                  onClick={() => { clearFilters(); setLocalSearch(''); }}
                  className="mt-4 text-ink bg-transparent border-none text-[13px] cursor-pointer underline font-inherit p-0"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              {vocabList.map((card, idx) => {
                const cardId = card?.vocab?.id ?? (card as any)?.id ?? idx;
                return (
                  <VocabCard
                    key={cardId}
                    vocabCard={card}
                    onClick={() => setOpenCardId(cardId)}
                  />
                );
              })}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4 font-space text-[13px] font-bold">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="font-space font-bold text-[12px] tracking-[0.05em] uppercase text-ink bg-transparent border-2 border-solid border-ink rounded-full py-2 px-[18px] cursor-pointer transition-colors duration-200 ease-[var(--ease)] disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):bg-ink hover:not(:disabled):text-cream"
              >
                Previous
              </button>
              <span className="text-ink-soft">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="font-space font-bold text-[12px] tracking-[0.05em] uppercase text-ink bg-transparent border-2 border-solid border-ink rounded-full py-2 px-[18px] cursor-pointer transition-colors duration-200 ease-[var(--ease)] disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):bg-ink hover:not(:disabled):text-cream"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── Modal ── */}
      {openCardId && (
        <OpenVocabCard
          vocabCard={vocabList.find(c => (c?.vocab?.id ?? (c as any)?.id) === openCardId)!}
          isOpen={!!openCardId}
          onClose={() => {
            setOpenCardId(null);
            setSearchParams((prev) => { prev.delete('word'); return prev; }, { replace: true });
          }}
        />
      )}
    </>
  );
}
