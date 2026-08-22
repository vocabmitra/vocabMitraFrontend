import { create } from 'zustand';
import type { VocabCard } from '../types';

export interface PracticeSettings {
  isTimed: boolean;
  timeLimitSeconds: number;
}

interface PracticeSessionState {
  isActive: boolean;
  cards: VocabCard[];
  currentIndex: number;
}

interface PracticeStore {
  // Practice Queue (selected in the dashboard)
  practiceQueue: VocabCard[];
  setPracticeQueue: (cards: VocabCard[]) => void;
  
  // Settings
  settings: PracticeSettings;
  updateSettings: (settings: Partial<PracticeSettings>) => void;
  
  // Session State
  session: PracticeSessionState;
  startSession: (cards: VocabCard[]) => void;
  endSession: () => void;
  nextCard: () => void;
  moveCardToBack: () => void;
}

export const usePracticeStore = create<PracticeStore>((set) => ({
  practiceQueue: [],
  setPracticeQueue: (cards) => set({ practiceQueue: cards }),
  
  settings: {
    isTimed: true,
    timeLimitSeconds: 10,
  },
  updateSettings: (newSettings) => 
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    
  session: {
    isActive: false,
    cards: [],
    currentIndex: 0,
  },
  
  startSession: (cards) => set({
    session: {
      isActive: true,
      cards: [...cards], // Clone to avoid mutating the original queue reference
      currentIndex: 0,
    }
  }),
  
  endSession: () => set({
    session: {
      isActive: false,
      cards: [],
      currentIndex: 0,
    }
  }),
  
  nextCard: () => set((state) => ({
    session: {
      ...state.session,
      currentIndex: state.session.currentIndex + 1,
    }
  })),
  
  // "Again" logic: Move current card to the end of the array, but don't increment index
  moveCardToBack: () => set((state) => {
    const { cards, currentIndex } = state.session;
    const currentCard = cards[currentIndex];
    
    // Create new array: everything up to current (already processed), 
    // current (being skipped for now), rest of cards, and then current appended at the end.
    // Wait, simpler: just push the current card to the end of the array.
    // We also need to move the index forward so we show the next card.
    const newCards = [...cards];
    newCards.push(currentCard);
    
    return {
      session: {
        ...state.session,
        cards: newCards,
        currentIndex: currentIndex + 1,
      }
    };
  }),
}));
