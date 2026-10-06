import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { useAuthGate } from '../../hooks/useAuthGate';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { useVocabStore } from '../../store/useVocabStore';
import { useUIStore } from '../../store/useUIStore';
import { logger } from '../../utils/logger';

interface AddToPracticeToggleButtonProps {
  vocabId: number;
  addedToPractice?: boolean;
}

export function AddToPracticeToggleButton({ vocabId, addedToPractice: initialAdded = false }: AddToPracticeToggleButtonProps) {
  const { updateVocabCard } = useVocabStore();
  const addToast = useUIStore((s) => s.addToast);

  const requireAuth = useAuthGate();
  const [loading, setLoading] = useState(false);
  const [localAdded, setLocalAdded] = useState(initialAdded);

  useEffect(() => {
    setLocalAdded(initialAdded);
  }, [initialAdded]);

  const handleToggle = () => {
    requireAuth(async () => {
      setLoading(true);
      const nextState = !localAdded;
      setLocalAdded(nextState);

      try {
        await vocabApi.togglePractice(vocabId);
        updateVocabCard(vocabId, { addedToPractice: nextState });
        addToast(
          localAdded ? 'Removed from practice queue.' : 'Added to practice queue! 💪',
          'success'
        );
      } catch (err) {
        setLocalAdded(!nextState);
        logger.error('Failed to toggle practice', err);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-inter text-sm font-bold transition-all duration-200 ${
        localAdded
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:border-indigo-600 dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
          : 'bg-black/5 text-ink border-black/10 hover:bg-black/10 hover:border-black/20 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20'
      } ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      aria-label={localAdded ? 'Remove from practice' : 'Add to practice'}
      aria-pressed={localAdded}
    >
      <Dumbbell
        size={16}
        strokeWidth={2.5}
        className={`transition-transform duration-300 ${localAdded ? 'rotate-12 scale-110' : ''}`}
      />
      {loading ? 'Saving…' : localAdded ? 'In Practice' : 'Add to Practice'}
    </button>
  );
}
