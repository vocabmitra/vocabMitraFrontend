import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useAuthGate } from '../../hooks/useAuthGate';
import { useVocabStore } from '../../store/useVocabStore';
import { useUIStore } from '../../store/useUIStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { normalizeError } from '../../utils/errorHandler';

interface MarkAsLearnedToggleButtonProps {
  vocabId: number;
  isLearned: boolean;
}

export function MarkAsLearnedToggleButton({ vocabId, isLearned }: MarkAsLearnedToggleButtonProps) {
  const requireAuth = useAuthGate();
  const updateVocabCard = useVocabStore((s) => s.updateVocabCard);
  const addToast = useUIStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    requireAuth(async () => {
      setLoading(true);
      try {
        await vocabApi.toggleLearned(vocabId);
        // Optimistic update
        updateVocabCard(vocabId, { isLearned: !isLearned });
        addToast(
          isLearned ? 'Removed from learned.' : 'Marked as learned! 🎉',
          'success'
        );
      } catch (err) {
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
        isLearned
          ? 'bg-upsc text-cream'
          : 'bg-transparent text-ink hover:bg-line disabled:hover:bg-transparent'
      } ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      aria-label={isLearned ? 'Mark as not learned' : 'Mark as learned'}
      aria-pressed={isLearned}
      id="mark-learned-toggle"
    >
      {isLearned ? <CheckCircle size={16} /> : <Circle size={16} />}
      {loading ? 'Saving…' : isLearned ? 'Learned' : 'Mark as learned'}
    </button>
  );
}
