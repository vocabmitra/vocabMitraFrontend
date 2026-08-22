// vocab.types.ts
// Do NOT rename fields — these mirror confirmed backend DTOs.

export const VOCAB_TYPES = ['word', 'phrase', 'idiom'] as const;
export type VocabType = (typeof VOCAB_TYPES)[number]; // OPEN — placeholder until backend confirms

export const USE_CASE_TAGS = ['CAT', 'CUET', 'GRE', 'SSC', 'UPSC'] as const;
export type UseCaseTag = (typeof USE_CASE_TAGS)[number]; // OPEN — placeholder until backend confirms

/**
 * useCaseTag arrives from backend as ONE comma-separated string, e.g. "UPSC, GRE"
 * A vocab can belong to multiple categories.
 * ALWAYS parse through this helper; never split on "," inline inside a component.
 */
export function parseUseCaseTags(raw: string): UseCaseTag[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean) as UseCaseTag[];
}

export interface Vocab {
  id: number;
  vocab: string;
  vocabType: VocabType;
  useCaseTag: string;   // raw comma-separated string — parse before use
  trick: string;        // backend's name for the mnemonic — UI copy can say "Mnemonic"
  meaning: string;
  example: string;
  updatedAt: string;    // ISO string; this is last-EDITED, not created-at
}

export interface VocabCard {
  vocab: Vocab;
  isLearned: boolean;
  isBookmarked: boolean;
  addedToPractice?: boolean; // Optional for backward compatibility with existing mocks
}
