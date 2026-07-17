import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWordStore } from '@/store/useWordStore';
import { WordCard } from '@/components/word/WordCard';
import { Skeleton } from '@/components/common/Skeleton';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { words, isLoading, fetchWords, categories } = useWordStore();

  useEffect(() => {
    if (slug) {
      fetchWords(slug);
    }
  }, [slug, fetchWords]);

  const categoryName = categories.find(c => c.slug === slug)?.name || slug;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-secondary mt-12 mb-4">
        Browse &middot; {categoryName}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-hairline border border-hairline">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg p-5 md:p-6"><Skeleton className="h-24 w-full" /></div>
          ))
        ) : words.length > 0 ? (
          words.map(word => <WordCard key={word.id} word={word} />)
        ) : (
          <div className="bg-bg p-6 col-span-full text-text-secondary">No words found in this category.</div>
        )}
      </div>
    </div>
  );
};
