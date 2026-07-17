import React, { useState, useEffect } from 'react';
import { Word } from '@/types';
import { Badge } from '../common/Badge';
import { MnemonicNote } from './MnemonicNote';
import { ExampleQuote } from './ExampleQuote';
import { useAuthGate } from '@/hooks/useAuthGate';
import { mockProgressApi } from '@/api/mock/mockProgress.api';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';

interface WordDetailProps {
  word: Word;
}

export const WordDetail: React.FC<WordDetailProps> = ({ word }) => {
  const { requireAuth } = useAuthGate();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      mockProgressApi.checkBookmark(user.id, word.id).then(res => setIsBookmarked(res.bookmarked));
    } else {
      setIsBookmarked(false);
    }
  }, [user, word.id]);

  const handleSave = () => {
    requireAuth(async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await mockProgressApi.toggleBookmark(user.id, word.id);
        setIsBookmarked(res.bookmarked);
        addToast(res.bookmarked ? 'Saved to vault' : 'Removed from vault', 'success');
      } catch (error) {
        addToast('Failed to save bookmark', 'error');
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="border-t border-hairline pt-10">
      <div className="flex items-baseline gap-4 flex-wrap mb-1.5">
        <h1 className="font-fraunces text-5xl md:text-[56px] font-medium leading-none">{word.term}</h1>
        <Badge>{word.category.slug}</Badge>
      </div>
      
      <div className="font-mono text-base text-text-secondary mb-7">
        {word.phonetic} &nbsp;&middot;&nbsp; {word.partOfSpeech}
      </div>

      <div className="text-[19px] leading-[1.6] max-w-[46ch] mb-8 before:content-['1._'] before:text-text-secondary before:font-mono before:text-[15px]">
        {word.meaning}
      </div>

      {word.mnemonic && (
        <MnemonicNote label={word.mnemonic.label} text={word.mnemonic.text} />
      )}

      {word.exampleUsage && (
        <ExampleQuote text={word.exampleUsage.text} source={word.exampleUsage.source} />
      )}

      <div className="flex items-center gap-3 mt-10">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="font-mono text-[12px] tracking-[0.04em] bg-transparent border border-accent text-accent px-[18px] py-[10px] rounded-[3px] cursor-pointer hover:bg-accent hover:text-bg transition-colors disabled:opacity-50"
        >
          {isBookmarked ? '- remove from vault' : '+ save to my vault'}
        </button>
        {!user && <span className="text-[12px] text-text-secondary">Requires an account</span>}
      </div>
    </div>
  );
};
