import { create } from 'zustand';
import type { VocabCard } from '../types';

// ── Session metadata tracked purely in frontend ──────────────────────────────
export interface PracticeSessionMeta {
  rememberedIds: number[];  // vocab IDs marked as Remembered
  forgotIds: number[];      // vocab IDs marked as Forgot
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
  recordRemembered: (vocabId: number) => void;
  recordForgot: (vocabId: number) => void;
}

const EMPTY_META: PracticeSessionMeta = {
  rememberedIds: [],
  forgotIds: [],
  startTime: null,
  endTime: null,
};

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
        cards: [...cards],
        currentIndex: 0,
        meta: {
          ...EMPTY_META,
          startTime: Date.now(),
        },
      },
    }),

  // Restart the exact same card set from index 0, resetting all meta
  restartSession: () =>
    set((state) => ({
      session: {
        ...state.session,
        isActive: true,
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
}));
