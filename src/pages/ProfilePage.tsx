import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { mockProgressApi } from '@/api/mock/mockProgress.api';
import { Word } from '@/types';
import { WordCard } from '@/components/word/WordCard';
import { Skeleton } from '@/components/common/Skeleton';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      mockProgressApi.getBookmarks(user.id)
        .then(setBookmarks)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-12 border-b border-hairline pb-8">
        <h1 className="font-fraunces text-4xl font-medium mb-2">My Vault</h1>
        <p className="text-text-secondary font-mono text-[12px] tracking-wider uppercase">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-secondary mb-4">
        Saved Words ({bookmarks.length})
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-hairline border border-hairline">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-bg p-5 md:p-6"><Skeleton className="h-24 w-full" /></div>
          ))
        ) : bookmarks.length > 0 ? (
          bookmarks.map(word => <WordCard key={word.id} word={word} />)
        ) : (
          <div className="bg-bg p-6 col-span-full text-text-secondary text-sm">
            You haven't saved any words yet. Browse the catalog to start building your vault.
          </div>
        )}
      </div>
    </div>
  );
};
