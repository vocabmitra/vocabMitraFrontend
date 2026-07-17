import React, { useEffect } from 'react';
import { useWordStore } from '@/store/useWordStore';
import { WordCard } from '@/components/word/WordCard';
import { WordDetail } from '@/components/word/WordDetail';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/common/Skeleton';

export const HomePage: React.FC = () => {
  const { words, isLoading, fetchWords, setSearchQuery } = useWordStore();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    } else {
      fetchWords();
    }
  }, [query, fetchWords, setSearchQuery]);

  const wordOfDay = words.length > 0 && !query ? words[0] : null;

  return (
    <div className="animate-in fade-in duration-500">
      {wordOfDay && (
        <div className="mb-20">
          <div className="font-mono text-[12px] tracking-[0.12em] uppercase text-text-secondary mb-[10px]">
            Word of the day &middot; {wordOfDay.category.slug.toUpperCase()}
          </div>
          <WordDetail word={wordOfDay} />
        </div>
      )}

      <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-secondary mt-12 mb-4">
        {query ? `Search results for "${query}"` : 'Browse Catalog'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-hairline border border-hairline">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg p-5 md:p-6"><Skeleton className="h-24 w-full" /></div>
          ))
        ) : words.length > 0 ? (
          words.map(word => <WordCard key={word.id} word={word} />)
        ) : (
          <div className="bg-bg p-6 col-span-full text-text-secondary">No words found.</div>
        )}
      </div>
    </div>
  );
};
