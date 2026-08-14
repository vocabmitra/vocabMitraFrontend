import { create } from 'zustand';
import type { VocabCard, UseCaseTag } from '../types';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';
import { vocabApi } from '../api/endpoints/vocab.api';
import { normalizeError, type AppError } from '../utils/errorHandler';

interface VocabStore {
  vocabList: VocabCard[];
  isLoading: boolean;
  error: AppError | null;

  // Filters & search
  activeFilters: UseCaseTag[];
  searchQuery: string;

  // Pagination
  page: number;          // 0-indexed (Spring pagination)
  pageSize: number;
  totalCount: number;
  totalPages: number;

  // Actions
  fetchVocabs: () => Promise<void>;
  setFilter: (tag: UseCaseTag) => void;     // toggles a tag on/off (multi-select)
  clearFilters: () => void;
  setSearch: (q: string) => void;
  setPage: (page: number) => void;
  updateVocabCard: (vocabId: number, patch: Partial<Pick<VocabCard, 'isLearned' | 'isBookmarked'>>) => void;
}

export const useVocabStore = create<VocabStore>()((set, get) => ({
  vocabList: [],
  isLoading: false,
  error: null,

  activeFilters: [],
  searchQuery: '',

  page: 0,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,

  fetchVocabs: async () => {
    const { page, pageSize, activeFilters, searchQuery } = get();
    set({ isLoading: true, error: null });

    try {
      const res = await vocabApi.getVocabList({
        page,
        size: pageSize,
        q: searchQuery || undefined,
        tag: activeFilters.length > 0 ? activeFilters.join(',') : undefined,
      });
      set({
        vocabList: res.content,
        totalCount: res.totalElements,
        totalPages: res.totalPages,
        isLoading: false,
      });
    } catch (err) {
      set({ error: normalizeError(err), isLoading: false });
    }
  },

  setFilter: (tag) => {
    const { activeFilters } = get();
    const next = activeFilters.includes(tag)
      ? activeFilters.filter((t) => t !== tag)
      : [...activeFilters, tag];
    set({ activeFilters: next, page: 0 });
    // Caller is responsible for triggering fetchVocabs after state update
  },

  clearFilters: () => {
    set({ activeFilters: [], page: 0 });
  },

  setSearch: (q) => {
    set({ searchQuery: q, page: 0 });
  },

  setPage: (page) => {
    set({ page });
  },

  /** Optimistic local update after bookmark/learned toggle */
  updateVocabCard: (vocabId, patch) => {
    set((state) => ({
      vocabList: state.vocabList.map((vc) =>
        vc.vocab.id === vocabId ? { ...vc, ...patch } : vc
      ),
    }));
  },
}));
