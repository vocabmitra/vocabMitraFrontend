import { create } from 'zustand';
import type { VocabCard } from '../types';

// ── Session metadata tracked purely in frontend ──────────────────────────────
export interface PracticeSessionMeta {
  rememberedIds: number[];  // vocab IDs marked as Remembered
  forgotIds: number[];      // vocab IDs marked as Forgot
  revealedIds: number[];    // vocab IDs that were revealed/tapped
  startTime: number | null; // Date.now() when session started
  endTime: number | null;   // Date.now() when session ended
}

interface PracticeSessionState {
  isActive: boolean;
  cards: VocabCard[];
  currentIndex: number;
  meta: PracticeSessionMeta;
}

interface PracticeStore {
  // Session State
  session: PracticeSessionState;
  startSession: (cards: VocabCard[]) => void;
  restartSession: () => void;
  endSession: () => void;
  nextCard: () => void;
  prevCard: () => void;
  recordRemembered: (vocabId: number) => void;
  recordForgot: (vocabId: number) => void;
  recordRevealed: (vocabId: number) => void;
}

const EMPTY_META: PracticeSessionMeta = {
  rememberedIds: [],
  forgotIds: [],
  revealedIds: [],
  startTime: null,
  endTime: null,
};

function shuffleCards<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const usePracticeStore = create<PracticeStore>((set) => ({
  session: {
    isActive: false,
    cards: [],
    currentIndex: 0,
    meta: { ...EMPTY_META },
  },

  startSession: (cards) =>
    set({
      session: {
        isActive: true,
        cards: shuffleCards(cards),
        currentIndex: 0,
        meta: {
          ...EMPTY_META,
          startTime: Date.now(),
        },
      },
    }),

  // Restart session with a fresh shuffle of the cards from index 0
  restartSession: () =>
    set((state) => ({
      session: {
        ...state.session,
        isActive: true,
        cards: shuffleCards(state.session.cards),
        currentIndex: 0,
        meta: {
          ...EMPTY_META,
          startTime: Date.now(),
        },
      },
    })),

  endSession: () =>
    set((state) => ({
      session: {
        ...state.session,
        isActive: false,
        meta: {
          ...state.session.meta,
          endTime: Date.now(),
        },
      },
    })),

  nextCard: () =>
    set((state) => ({
      session: {
        ...state.session,
        currentIndex: state.session.currentIndex + 1,
      },
    })),

  prevCard: () =>
    set((state) => ({
      session: {
        ...state.session,
        currentIndex: Math.max(0, state.session.currentIndex - 1),
      },
    })),

  recordRemembered: (vocabId) =>
    set((state) => ({
      session: {
        ...state.session,
        meta: {
          ...state.session.meta,
          rememberedIds: [...state.session.meta.rememberedIds.filter((id) => id !== vocabId), vocabId],
          // Remove from forgot list if it was there
          forgotIds: state.session.meta.forgotIds.filter((id) => id !== vocabId),
        },
      },
    })),

  recordForgot: (vocabId) =>
    set((state) => ({
      session: {
        ...state.session,
        meta: {
          ...state.session.meta,
          forgotIds: [...state.session.meta.forgotIds.filter((id) => id !== vocabId), vocabId],
          // Remove from remembered list if it was there
          rememberedIds: state.session.meta.rememberedIds.filter((id) => id !== vocabId),
        },
      },
    })),

  recordRevealed: (vocabId) =>
    set((state) => ({
      session: {
        ...state.session,
        meta: {
          ...state.session.meta,
          revealedIds: state.session.meta.revealedIds.includes(vocabId)
            ? state.session.meta.revealedIds
            : [...state.session.meta.revealedIds, vocabId],
        },
      },
    })),
}));
