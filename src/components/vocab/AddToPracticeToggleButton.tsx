import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { useAuthGate } from '../../hooks/useAuthGate';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { useVocabStore } from '../../store/useVocabStore';
import { useUIStore } from '../../store/useUIStore';

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
        console.error('Failed to toggle practice', err);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-inter text-[14px] font-bold transition-all duration-200 active:scale-95
        ${
          localAdded
            ? 'bg-ink text-white border-ink shadow-[2px_2px_0_var(--ink)]'
            : 'bg-white text-ink border-ink/20 shadow-none hover:border-ink hover:shadow-[4px_4px_0_var(--ink)]'
        }
        ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
      `}
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
