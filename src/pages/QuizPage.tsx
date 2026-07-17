import React, { useState, useEffect, useMemo } from 'react';
import { useWordStore } from '@/store/useWordStore';
import { Skeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';

export const QuizPage: React.FC = () => {
  const { words, isLoading, fetchWords } = useWordStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const currentWord = words[currentIndex];

  const options = useMemo(() => {
    if (!currentWord || words.length < 4) return [];
    const others = words.filter(w => w.id !== currentWord.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    return [currentWord, ...others].sort(() => 0.5 - Math.random());
  }, [currentWord, words]);

  if (isLoading) return <Skeleton className="h-64 w-full max-w-lg mx-auto" />;
  if (words.length < 4) return <div className="text-center py-20 text-text-secondary">Not enough words for a quiz.</div>;

  if (showResult) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-500">
        <h2 className="font-fraunces text-4xl md:text-5xl mb-6 text-text-primary">Quiz Completed!</h2>
        <p className="text-lg text-text-secondary mb-10 font-mono">You scored {score} out of {words.length}</p>
        <Button onClick={() => { setCurrentIndex(0); setScore(0); setShowResult(false); setSelectedAnswer(null); }}>
          Restart Quiz
        </Button>
      </div>
    );
  }

  const handleSelect = (wordId: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(wordId);
    if (wordId === currentWord.id) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentIndex === words.length - 1) {
        setShowResult(true);
      } else {
        setCurrentIndex(c => c + 1);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-8 animate-in fade-in duration-300">
      <div className="w-full max-w-lg">
        <div className="text-[12px] font-mono tracking-widest uppercase text-text-secondary mb-8 flex justify-between border-b border-hairline pb-4">
          <span>Question {currentIndex + 1} of {words.length}</span>
          <span>Score: {score}</span>
        </div>
        
        <h2 className="font-inter text-xl leading-relaxed text-center mb-10 text-text-primary">
          What is the word for: <br/>
          <span className="font-fraunces italic mt-2 inline-block">"{currentWord.meaning}"</span>
        </h2>
        
        <div className="flex flex-col gap-3">
          {options.map(opt => {
            const isSelected = selectedAnswer === opt.id;
            const isCorrect = opt.id === currentWord.id;
            let btnClass = 'border bg-bg hover:bg-surface text-center px-6 py-5 transition-colors font-fraunces text-2xl tracking-wide rounded-sm ';
            
            if (selectedAnswer) {
              if (isCorrect) btnClass += ' border-accent text-accent';
              else if (isSelected) btnClass += ' border-mnemonic text-mnemonic opacity-70';
              else btnClass += ' border-hairline opacity-50 text-text-secondary';
            } else {
              btnClass += ' border-hairline text-text-primary';
            }

            return (
              <button 
                key={opt.id} 
                className={btnClass}
                onClick={() => handleSelect(opt.id)}
                disabled={!!selectedAnswer}
              >
                {opt.term}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
