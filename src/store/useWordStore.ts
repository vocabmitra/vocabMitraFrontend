import { create } from 'zustand';
import { Word, Category } from '@/types';
import { mockWordsApi } from '@/api/mock/mockWords.api';
import { categoriesFixture } from '@/api/mock/fixtures/categories.fixtures';

interface WordState {
  words: Word[];
  categories: Category[];
  isLoading: boolean;
  activeCategory: string | null;
  searchQuery: string;
  fetchWords: (categorySlug?: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (categorySlug: string | null) => void;
}

export const useWordStore = create<WordState>((set) => ({
  words: [],
  categories: categoriesFixture,
  isLoading: false,
  activeCategory: null,
  searchQuery: '',
  fetchWords: async (categorySlug) => {
    set({ isLoading: true });
    try {
      const words = categorySlug 
        ? await mockWordsApi.getByCategory(categorySlug)
        : await mockWordsApi.getAll();
      set({ words, isLoading: false, activeCategory: categorySlug || null });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch words', error);
    }
  },
  setSearchQuery: async (query) => {
    set({ searchQuery: query, isLoading: true });
    if (!query) {
      const words = await mockWordsApi.getAll();
      set({ words, isLoading: false });
    } else {
      const words = await mockWordsApi.search(query);
      set({ words, isLoading: false });
    }
  },
  setActiveCategory: (categorySlug) => set({ activeCategory: categorySlug }),
}));
