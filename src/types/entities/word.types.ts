import { Category } from './category.types';

export interface Mnemonic {
  label: string; // e.g. 'Mnemonic'
  text: string;
}

export interface ExampleSentence {
  text: string;
  source?: string; // e.g. 'Example usage'
}

export interface Word {
  id: string;
  slug: string;
  term: string;
  phonetic?: string;
  meaning: string;
  partOfSpeech: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard';
  mnemonic?: Mnemonic;
  exampleUsage?: ExampleSentence;
}
