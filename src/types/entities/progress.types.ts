export type ProgressStatus = 'new' | 'learning' | 'mastered';

export interface UserWordProgress {
  id: string;
  userId: string;
  wordId: string;
  status: ProgressStatus;
  streak: number;
  lastReviewed: string; // ISO date string
}

export interface Bookmark {
  id: string;
  userId: string;
  wordId: string;
  createdAt: string; // ISO date string
}

export interface WordOfDay {
  date: string; // YYYY-MM-DD
  wordId: string;
}
