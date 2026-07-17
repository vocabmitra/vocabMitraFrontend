import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockWordsApi } from '@/api/mock/mockWords.api';
import { Word } from '@/types';
import { WordDetail } from '@/components/word/WordDetail';
import { Skeleton } from '@/components/common/Skeleton';
import { ArrowLeft } from 'lucide-react';

export const WordDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [word, setWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      mockWordsApi.getBySlug(slug)
        .then(setWord)
        .catch(() => setWord(null))
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!word) return <div className="text-center text-text-secondary py-20">Word not found.</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-mono text-[12px] uppercase tracking-wider mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Vault
      </Link>
      <WordDetail word={word} />
    </div>
  );
};
