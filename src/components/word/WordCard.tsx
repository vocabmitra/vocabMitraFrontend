import React from 'react';
import { Word } from '@/types';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';

interface WordCardProps {
  word: Word;
}

export const WordCard: React.FC<WordCardProps> = ({ word }) => {
  return (
    <Link to={`/word/${word.slug}`} className="bg-bg p-5 md:p-6 block hover:bg-surface transition-colors cursor-pointer border border-transparent">
      <div className="font-fraunces text-xl font-medium mb-1">{word.term}</div>
      <div className="text-[13px] text-text-secondary mb-3 line-clamp-2">{word.meaning}</div>
      <Badge>{word.category.slug}</Badge>
    </Link>
  );
};
