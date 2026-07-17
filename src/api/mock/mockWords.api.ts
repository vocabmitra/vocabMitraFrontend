import { mockRequest } from './mockClient';
import { wordsFixture } from './fixtures/words.fixtures';
import { Word } from '@/types';

export const mockWordsApi = {
  getAll: () => mockRequest<Word[]>(wordsFixture),
  getBySlug: (slug: string) => {
    const word = wordsFixture.find((w) => w.slug === slug);
    return word
      ? mockRequest<Word>(word)
      : mockRequest<Word>(null as unknown as Word, { fail: true });
  },
  getByCategory: (categorySlug: string) =>
    mockRequest<Word[]>(wordsFixture.filter((w) => w.category.slug === categorySlug)),
  search: (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results = wordsFixture.filter((w) =>
      w.term.toLowerCase().includes(lowerQuery) || w.meaning.toLowerCase().includes(lowerQuery)
    );
    return mockRequest<Word[]>(results);
  },
  getWordOfDay: () => mockRequest<Word>(wordsFixture[0])
};
