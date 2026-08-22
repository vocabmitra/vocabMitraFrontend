import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useAuthGate } from '../../hooks/useAuthGate';
import { useVocabStore } from '../../store/useVocabStore';
import { useUIStore } from '../../store/useUIStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { normalizeError } from '../../utils/errorHandler';

interface MarkAsLearnedToggleButtonProps {
  vocabId: number;
  isLearned: boolean;
}

export function MarkAsLearnedToggleButton({ vocabId, isLearned: initialIsLearned }: MarkAsLearnedToggleButtonProps) {
  const requireAuth = useAuthGate();
  const updateVocabCard = useVocabStore((s) => s.updateVocabCard);
  const addToast = useUIStore((s) => s.addToast);
  
  const [loading, setLoading] = useState(false);
  const [localLearned, setLocalLearned] = useState(initialIsLearned);

  useEffect(() => {
    setLocalLearned(initialIsLearned);
  }, [initialIsLearned]);

  const handleToggle = () => {
    requireAuth(async () => {
      setLoading(true);
      const nextState = !localLearned;
      setLocalLearned(nextState);

      try {
        await vocabApi.toggleLearned(vocabId);
        updateVocabCard(vocabId, { isLearned: nextState });
        addToast(
          localLearned ? 'Word marked as unlearned.' : 'Word marked as learned! 🧠',
          'success'
        );
      } catch (err) {
        setLocalLearned(!nextState);
        addToast(normalizeError(err).message, 'error');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 font-inter font-bold text-sm rounded-full border-2 border-solid border-ink transition-all duration-200 ease-[var(--ease)] ${
        localLearned
          ? 'bg-transparent text-ink hover:bg-line'
          : 'bg-transparent text-ink hover:bg-line disabled:hover:bg-transparent'
      } ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      aria-label={localLearned ? 'Mark as unlearned' : 'Mark as learned'}
      aria-pressed={localLearned}
    >
      {localLearned ? <CheckCircle2 size={16} /> : <BookOpen size={16} />}
      {loading ? 'Saving…' : localLearned ? 'Learned' : 'Mark as learned'}
    </button>
  );
}
