import React, { useState, useEffect } from 'react';
import { useWordStore } from '@/store/useWordStore';
import { Skeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';
import { useSearchParams } from 'react-router-dom';

export const FlashcardsPage: React.FC = () => {
  const { words, isLoading, fetchWords } = useWordStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    fetchWords(category || undefined);
  }, [category, fetchWords]);

  if (isLoading) return <Skeleton className="h-[400px] w-full max-w-lg mx-auto" />;
  if (words.length === 0) return <div className="text-center py-20 text-text-secondary">No flashcards available.</div>;

  const currentWord = words[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <div 
        className="w-full max-w-lg h-[400px] bg-bg border border-hairline p-10 cursor-pointer relative flex flex-col justify-center transition-all duration-300 hover:border-accent group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute top-5 right-6 font-mono text-[11px] text-text-secondary tracking-widest uppercase">
          {currentIndex + 1} / {words.length}
        </div>
        
        {!isFlipped ? (
          <div className="text-center animate-in fade-in duration-300">
            <h2 className="font-fraunces text-5xl mb-4 text-text-primary">{currentWord.term}</h2>
            <div className="text-[15px] text-text-secondary font-mono tracking-wide">{currentWord.phonetic}</div>
          </div>
        ) : (
          <div className="flex flex-col justify-center animate-in fade-in duration-300">
            <p className="text-[20px] mb-8 text-center leading-[1.6] text-text-primary">{currentWord.meaning}</p>
            {currentWord.mnemonic && (
              <div className="text-[16px] italic text-text-secondary text-center font-fraunces relative">
                {currentWord.mnemonic.text}
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          Click to flip
        </div>
      </div>

      <div className="flex gap-4 mt-8 w-full max-w-lg justify-between">
        <Button variant="outline" onClick={handlePrev} className="w-[120px]">Previous</Button>
        <Button variant="primary" onClick={handleNext} className="w-[120px]">Next</Button>
      </div>
    </div>
  );
};
