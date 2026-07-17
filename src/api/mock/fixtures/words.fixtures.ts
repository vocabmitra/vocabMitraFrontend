import { Word } from '@/types';
import { categoriesFixture } from './categories.fixtures';

export const wordsFixture: Word[] = [
  {
    id: 'w1',
    slug: 'alleviate',
    term: 'Alleviate',
    phonetic: '/əˈliːvieɪt/',
    meaning: 'To make suffering, deficiency, or a problem less severe.',
    partOfSpeech: 'verb',
    category: categoriesFixture.find(c => c.slug === 'upsc')!,
    difficulty: 'medium',
    mnemonic: {
      label: 'Mnemonic',
      text: '"Ali ne vaaty kr ke pain kam kr diya" — Ali turns down the valve, and the pain eases.',
    },
    exampleUsage: {
      text: 'The new policy is expected to alleviate congestion in the old quarter.',
      source: 'Example usage'
    }
  },
  {
    id: 'w2',
    slug: 'benevolent',
    term: 'Benevolent',
    phonetic: '/bəˈnevələnt/',
    meaning: 'Well meaning and kindly.',
    partOfSpeech: 'adjective',
    category: categoriesFixture.find(c => c.slug === 'upsc')!,
    difficulty: 'easy',
    exampleUsage: {
      text: 'A benevolent smile.',
      source: 'Example usage'
    }
  },
  {
    id: 'w3',
    slug: 'malevolent',
    term: 'Malevolent',
    phonetic: '/məˈlevələnt/',
    meaning: 'Having or showing a wish to do evil to others.',
    partOfSpeech: 'adjective',
    category: categoriesFixture.find(c => c.slug === 'upsc')!,
    difficulty: 'easy',
    exampleUsage: {
      text: 'The glint of dark, malevolent eyes.',
      source: 'Example usage'
    }
  },
  {
    id: 'w4',
    slug: 'scrutinize',
    term: 'Scrutinize',
    phonetic: '/ˈskruːtənaɪz/',
    meaning: 'Examine or inspect closely and thoroughly.',
    partOfSpeech: 'verb',
    category: categoriesFixture.find(c => c.slug === 'upsc')!,
    difficulty: 'medium',
    mnemonic: {
      label: 'Mnemonic',
      text: 'Screw + tiny + eyes = Looking at something tiny with screwed up eyes.',
    }
  },
  {
    id: 'w5',
    slug: 'magnanimous',
    term: 'Magnanimous',
    phonetic: '/maɡˈnanɪməs/',
    meaning: 'Very generous or forgiving, especially toward a rival or someone less powerful than oneself.',
    partOfSpeech: 'adjective',
    category: categoriesFixture.find(c => c.slug === 'upsc')!,
    difficulty: 'hard',
    mnemonic: {
      label: 'Mnemonic',
      text: 'Magnanimous -> Mega animous -> Large hearted.',
    },
    exampleUsage: {
      text: 'She should be magnanimous in victory.',
      source: 'Example usage'
    }
  },
  {
    id: 'w6',
    slug: 'ephemeral',
    term: 'Ephemeral',
    phonetic: '/ɪˈfem(ə)rəl/',
    meaning: 'Lasting for a very short time.',
    partOfSpeech: 'adjective',
    category: categoriesFixture.find(c => c.slug === 'cat')!,
    difficulty: 'medium',
    mnemonic: {
      label: 'Mnemonic',
      text: 'Sounds like e-funeral, life is short.',
    },
    exampleUsage: {
      text: 'Fashions are ephemeral.',
      source: 'Example usage'
    }
  },
  {
    id: 'w7',
    slug: 'ubiquitous',
    term: 'Ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    meaning: 'Present, appearing, or found everywhere.',
    partOfSpeech: 'adjective',
    category: categoriesFixture.find(c => c.slug === 'cat')!,
    difficulty: 'medium',
    mnemonic: {
      label: 'Mnemonic',
      text: 'Uber-quit-us -> Uber is found everywhere now.',
    },
    exampleUsage: {
      text: 'His ubiquitous influence was felt by all the family.',
      source: 'Example usage'
    }
  }
];
