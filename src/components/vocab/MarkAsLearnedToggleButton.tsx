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
  variant?: 'default' | 'icon';
}

export function MarkAsLearnedToggleButton({ vocabId, isLearned: initialIsLearned, variant = 'default' }: MarkAsLearnedToggleButtonProps) {
  const requireAuth = useAuthGate();
  const updateVocabCard = useVocabStore((s) => s.updateVocabCard);
  const addToast = useUIStore((s) => s.addToast);
  
  const [loading, setLoading] = useState(false);
  const [localLearned, setLocalLearned] = useState(initialIsLearned);

  useEffect(() => {
    setLocalLearned(initialIsLearned);
  }, [initialIsLearned]);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    requireAuth(async () => {
      setLoading(true);
      const nextState = !localLearned;
      setLocalLearned(nextState);

      try {
        const resMessage = await vocabApi.toggleLearned(vocabId);
        updateVocabCard(vocabId, { isLearned: nextState });
        addToast(
          typeof resMessage === 'string' && resMessage.trim() ? resMessage : (nextState ? 'Word marked as learned! 🧠' : 'Word marked as unlearned.'),
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

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${
          localLearned
            ? 'bg-green-500/20 text-green-500 border-green-500/40 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
            : 'bg-black/5 dark:bg-white/5 text-ink-soft opacity-70 hover:opacity-100 hover:text-green-500 border-black/5 dark:border-white/10'
        } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
        aria-label={localLearned ? 'Mark as unlearned' : 'Mark as learned'}
        title={localLearned ? 'Learned' : 'Mark as learned'}
      >
        {localLearned ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 font-inter font-bold text-sm rounded-full border transition-all duration-200 ${
        localLearned
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:text-white dark:border-emerald-600 dark:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          : 'bg-black/5 text-ink border-black/10 hover:bg-black/10 hover:border-black/20 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20'
      } ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      aria-label={localLearned ? 'Mark as unlearned' : 'Mark as learned'}
      aria-pressed={localLearned}
    >
      {localLearned ? <CheckCircle2 size={16} /> : <BookOpen size={16} />}
      {loading ? 'Saving…' : localLearned ? 'Learned' : 'Mark as learned'}
    </button>
  );
}
