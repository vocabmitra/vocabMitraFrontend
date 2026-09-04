import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Layers } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VocabCard } from '../components/vocab/VocabCard';
import { OpenVocabCard } from '../components/vocab/OpenVocabCard';
import { CategoryBadge } from '../components/vocab/CategoryBadge';
import { VocabCardSkeleton } from '../components/common/Skeleton';
import { PracticeSessionLauncher } from '../components/vocab/PracticeSessionLauncher';
import { useVocabList } from '../features/vocab/useVocabList';
import { useAuthStore } from '../store/useAuthStore';
import { USE_CASE_TAGS } from '../types';
import type { UseCaseTag } from '../types';
import { useDebounce } from '../hooks/useDebounce';

export default function VocabPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(() => searchParams.get('q') ?? '');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(localSearch, 400);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    vocabList,
    isLoading,
    activeFilters,
    page,
    totalPages,
    totalCount,
    pageSize,
    setFilter,
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

          {/* Page header — dynamic title based on auth state */}
          <div className="mb-9">
            <h1 className="font-bricolage text-[clamp(28px,4vw,42px)] font-bold text-ink mb-2 tracking-[-0.02em]">
              {isAuthenticated ? 'My Vault' : 'Vocabularies'}
            </h1>
            <p className="text-[15px] text-ink-soft font-inter m-0">
              {totalCount.toLocaleString()} words. Filter by exam, search by meaning, or just browse.
            </p>
          </div>

          {/* ── Filters + Search bar ── */}
          <div className="mb-8 flex flex-col gap-4">
            {/* Search & Cards per page Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search Box */}
              <div
                className="flex items-center gap-2.5 p-[5px] border-2 border-solid border-ink rounded-full bg-cream-card transition-shadow duration-250 ease-[var(--ease)] w-full max-w-[520px] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ink)_15%,transparent)]"
              >
                <Search size={18} className="text-ink-soft ml-[14px] shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search words, meanings, mnemonics, or exam tags…"
                  aria-label="Search vocabulary"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] font-medium py-3 px-0 font-inter"
                  id="vocab-search-input"
                />
                {localSearch && (
                  <button
                    onClick={() => setLocalSearch('')}
                    className="text-ink py-2 px-3 bg-transparent border-none cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* Cards Per Page Dropdown */}
              <div className="flex items-center gap-2 font-space text-[12px] font-bold text-ink-soft shrink-0">
                <Layers size={14} className="text-ink-soft" />
                <span>Cards per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-cream-card text-ink font-space font-bold border-2 border-solid border-ink rounded-xl py-1.5 px-3 outline-none cursor-pointer text-[12px] transition-colors hover:border-orange-500"
                  aria-label="Select cards per page"
                >
                  {[9, 12, 18, 24, 36, 48].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
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

            {/* Tag filter bar + Practice CTA */}
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-space text-[11px] font-bold text-ink-soft tracking-[0.06em] uppercase mr-1 flex items-center gap-1">
                  <SlidersHorizontal size={12} strokeWidth={2.5} />
                  Filter
                </span>
                {USE_CASE_TAGS.map((tag) => (
                  <CategoryBadge
                    key={tag}
                    tag={tag as UseCaseTag}
                    active={activeFilters.includes(tag as UseCaseTag)}
                    onClick={() => setFilter(tag as UseCaseTag)}
                  />
                ))}
                {hasFilters && (
                  <button
                    onClick={() => { clearFilters(); setLocalSearch(''); }}
                    className="font-space font-bold text-[11px] tracking-[0.04em] text-ink bg-transparent border-2 border-solid border-ink rounded-full py-[3px] px-2.5 cursor-pointer transition-colors duration-200 ease-[var(--ease)] hover:bg-ink hover:text-cream"
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {/* Practice CTA — label changes with filters */}
              {!isLoading && vocabList.length > 0 && (
                <PracticeSessionLauncher
                  cards={vocabList}
                  label={hasFilters ? 'Filtered Words' : 'Current Page'}
                />
              )}
            </div>
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
