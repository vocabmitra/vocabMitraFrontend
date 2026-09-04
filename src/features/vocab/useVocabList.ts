import { useEffect } from 'react';
import { useVocabStore } from '../../store/useVocabStore';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

/**
 * useVocabList — custom hook for the VocabPage.
 * Encapsulates fetch + filter + search + pagination.
 */
export function useVocabList() {
  const store = useVocabStore();

  // Trigger an async fetch via API whenever relevant state changes
  useEffect(() => {
    store.fetchVocabs();
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
    setPageSize: store.setPageSize,
  };
}
