import { useEffect } from 'react';
import { useVocabStore } from '../../store/useVocabStore';
import { MOCK_VOCAB_CARDS } from '../../api/mock/fixtures/vocabFixtures';
import type { UseCaseTag } from '../../types';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

/** Fake paginated response from mock data */
function getMockPage(
  cards: typeof MOCK_VOCAB_CARDS,
  page: number,
  size: number,
  q: string,
  filters: UseCaseTag[]
) {
  let filtered = cards;

  if (q) {
    const lq = q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.vocab.vocab.toLowerCase().includes(lq) ||
        c.vocab.meaning.toLowerCase().includes(lq)
    );
  }

  if (filters.length > 0) {
    filtered = filtered.filter((c) =>
      filters.some((f) => c.vocab.useCaseTag.includes(f))
    );
  }

  const start = page * size;
  const content = filtered.slice(start, start + size);
  return {
    content,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    size,
    number: page,
  };
}

/**
 * useVocabList — custom hook for the VocabPage.
 * Encapsulates fetch + filter + search + pagination.
 * Phase 3: uses mock data; Phase 5 will switch to real API via useVocabStore.fetchVocabs
 */
export function useVocabList() {
  const store = useVocabStore();

  // Simulate an async fetch from mock data whenever relevant state changes
  useEffect(() => {
    const result = getMockPage(
      MOCK_VOCAB_CARDS,
      store.page,
      store.pageSize,
      store.searchQuery,
      store.activeFilters
    );
    useVocabStore.setState({
      vocabList: result.content,
      totalCount: result.totalElements,
      totalPages: result.totalPages,
      isLoading: false,
      error: null,
    });
  }, [store.page, store.pageSize, store.searchQuery, store.activeFilters]);

  return {
    vocabList: store.vocabList,
    isLoading: store.isLoading,
    error: store.error,
    activeFilters: store.activeFilters,
    searchQuery: store.searchQuery,
    page: store.page,
    pageSize: store.pageSize ?? DEFAULT_PAGE_SIZE,
    totalCount: store.totalCount,
    totalPages: store.totalPages,
    setFilter: store.setFilter,
    clearFilters: store.clearFilters,
    setSearch: store.setSearch,
    setPage: store.setPage,
  };
}
