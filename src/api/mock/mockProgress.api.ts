import { mockRequest } from './mockClient';
import { UserWordProgress, Bookmark, Word } from '@/types';
import { wordsFixture } from './fixtures/words.fixtures';

// In-memory mock states for the session
let bookmarks: Bookmark[] = [];
let progressData: UserWordProgress[] = [];

export const mockProgressApi = {
  getBookmarks: (userId: string) => {
    return mockRequest<Word[]>(
      bookmarks
        .filter(b => b.userId === userId)
        .map(b => wordsFixture.find(w => w.id === b.wordId)!)
        .filter(Boolean)
    );
  },
  toggleBookmark: (userId: string, wordId: string) => {
    const exists = bookmarks.find(b => b.userId === userId && b.wordId === wordId);
    if (exists) {
      bookmarks = bookmarks.filter(b => b.id !== exists.id);
      return mockRequest<{ bookmarked: boolean }>({ bookmarked: false });
    } else {
      bookmarks.push({ id: `b_${Date.now()}`, userId, wordId, createdAt: new Date().toISOString() });
      return mockRequest<{ bookmarked: boolean }>({ bookmarked: true });
    }
  },
  checkBookmark: (userId: string, wordId: string) => {
    const exists = bookmarks.some(b => b.userId === userId && b.wordId === wordId);
    return mockRequest<{ bookmarked: boolean }>({ bookmarked: exists });
  },
  getProgress: (userId: string) => {
    return mockRequest<UserWordProgress[]>(progressData.filter(p => p.userId === userId));
  },
  updateProgress: (userId: string, wordId: string, status: 'new' | 'learning' | 'mastered') => {
    let p = progressData.find(p => p.userId === userId && p.wordId === wordId);
    if (p) {
      p.status = status;
      p.lastReviewed = new Date().toISOString();
      if (status === 'mastered') p.streak += 1;
    } else {
      p = {
        id: `p_${Date.now()}`,
        userId,
        wordId,
        status,
        streak: status === 'mastered' ? 1 : 0,
        lastReviewed: new Date().toISOString()
      };
      progressData.push(p);
    }
    return mockRequest<UserWordProgress>(p);
  }
};
