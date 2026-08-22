import type { VocabCard } from '../../../types';

export const MOCK_VOCAB_CARDS: VocabCard[] = [
  {
    vocab: {
      id: 1,
      vocab: 'Alleviate',
      vocabType: 'word',
      useCaseTag: 'UPSC, GRE',
      trick: '"Ali ne vaaty kr ke pain kam kr diya" — Ali turns down the valve, and the pain eases.',
      meaning: 'To make suffering, deficiency, or a problem less severe.',
      example: 'The new policy is expected to alleviate congestion in the old quarter.',
      updatedAt: '2026-07-01T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
    addedToPractice: true,
  },
  {
    vocab: {
      id: 2,
      vocab: 'Benevolent',
      vocabType: 'word',
      useCaseTag: 'UPSC',
      trick: '"Bene" (good) + "volent" (wish) — someone who wishes good things for others.',
      meaning: 'Well meaning and kindly; given to charitable acts.',
      example: 'A benevolent ruler who cared deeply for the welfare of his subjects.',
      updatedAt: '2026-07-02T10:00:00Z',
    },
    isLearned: true,
    isBookmarked: false,
    addedToPractice: true,
  },
  {
    vocab: {
      id: 3,
      vocab: 'Malevolent',
      vocabType: 'word',
      useCaseTag: 'UPSC',
      trick: '"Male" (bad) + "volent" (wish) — opposite of benevolent.',
      meaning: 'Having or showing a wish to do evil to others.',
      example: 'The villain cast a malevolent glare at those who opposed him.',
      updatedAt: '2026-07-03T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: true,
  },
  {
    vocab: {
      id: 4,
      vocab: 'Scrutinize',
      vocabType: 'word',
      useCaseTag: 'SSC, CAT',
      trick: '"Scrutiny" like CCTV — you watch everything very closely.',
      meaning: 'Examine or inspect closely and thoroughly.',
      example: 'The auditors will scrutinize every transaction from the past year.',
      updatedAt: '2026-07-04T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
  {
    vocab: {
      id: 5,
      vocab: 'Magnanimous',
      vocabType: 'word',
      useCaseTag: 'UPSC, GRE',
      trick: '"Magna" (great) + "animus" (spirit) — a great-spirited person is generous.',
      meaning: 'Very generous or forgiving, especially toward a rival.',
      example: 'The magnanimous champion shook hands with every competitor.',
      updatedAt: '2026-07-05T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
  {
    vocab: {
      id: 6,
      vocab: 'Audacious',
      vocabType: 'word',
      useCaseTag: 'GRE',
      trick: '"Audio" + "us" — someone who dares to shout even when the room is silent.',
      meaning: 'Showing a willingness to take surprisingly bold risks.',
      example: 'Her audacious plan to climb Everest solo stunned the climbing community.',
      updatedAt: '2026-07-06T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
  {
    vocab: {
      id: 7,
      vocab: 'Meticulous',
      vocabType: 'word',
      useCaseTag: 'CAT',
      trick: '"Meti" sounds like "metre" — someone who measures everything down to the millimetre.',
      meaning: 'Showing great attention to detail; very careful and precise.',
      example: 'Her meticulous notes made revision a pleasure rather than a chore.',
      updatedAt: '2026-07-07T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
  {
    vocab: {
      id: 8,
      vocab: 'Ephemeral',
      vocabType: 'word',
      useCaseTag: 'GRE, UPSC',
      trick: '"E-fame-ral" — internet fame is ephemeral, here today gone tomorrow.',
      meaning: 'Lasting for a very short time.',
      example: 'The cherry blossoms are ephemeral — they bloom for only a week each year.',
      updatedAt: '2026-07-08T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
  {
    vocab: {
      id: 9,
      vocab: 'Loquacious',
      vocabType: 'word',
      useCaseTag: 'GRE',
      trick: '"Loqua" sounds like "loquat" — and that fruit has a lot to say.',
      meaning: 'Tending to talk a great deal; talkative.',
      example: 'The loquacious professor could turn a two-minute answer into a two-hour lecture.',
      updatedAt: '2026-07-09T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
  {
    vocab: {
      id: 10,
      vocab: 'Pernicious',
      vocabType: 'word',
      useCaseTag: 'UPSC, GRE',
      trick: '"Per-nicious" — it\'s per-nasty, slowly creeping and deeply harmful.',
      meaning: 'Having a harmful effect, especially in a gradual or subtle way.',
      example: 'The pernicious influence of misinformation spread slowly through the community.',
      updatedAt: '2026-07-10T10:00:00Z',
    },
    isLearned: false,
    isBookmarked: false,
  },
];

/** Word of the Day — first UPSC-tagged item; stub until a dedicated backend endpoint exists */
export const MOCK_WORD_OF_THE_DAY: VocabCard = MOCK_VOCAB_CARDS[0];

/** Six-item preview for HomePage grid */
export const MOCK_PREVIEW_CARDS: VocabCard[] = MOCK_VOCAB_CARDS.slice(1, 7);
