import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuthGate } from '../../hooks/useAuthGate';
import { useVocabStore } from '../../store/useVocabStore';
import { useUIStore } from '../../store/useUIStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { normalizeError } from '../../utils/errorHandler';

interface BookmarkToggleButtonProps {
  vocabId: number;
  isBookmarked: boolean;
}

export function BookmarkToggleButton({ vocabId, isBookmarked: initialIsBookmarked }: BookmarkToggleButtonProps) {
  const requireAuth = useAuthGate();
  const updateVocabCard = useVocabStore((s) => s.updateVocabCard);
  const addToast = useUIStore((s) => s.addToast);
  
  const [loading, setLoading] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(initialIsBookmarked);

  // Keep in sync with props if parent updates
  useEffect(() => {
    setLocalBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const handleToggle = () => {
    requireAuth(async () => {
      setLoading(true);
      const nextState = !localBookmarked;
      // Optimistic local UI update
      setLocalBookmarked(nextState);
      
      try {
        await vocabApi.toggleBookmark(vocabId);
        // Also update store
        updateVocabCard(vocabId, { isBookmarked: nextState });
        addToast(
          localBookmarked ? 'Bookmark removed.' : 'Word bookmarked! 🔖',
          'success'
        );
      } catch (err) {
        // Revert on error
        setLocalBookmarked(!nextState);
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
        localBookmarked
          ? 'bg-ink text-cream'
          : 'bg-transparent text-ink hover:bg-line disabled:hover:bg-transparent'
      } ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      aria-label={localBookmarked ? 'Remove bookmark' : 'Bookmark this word'}
      aria-pressed={localBookmarked}
      id="bookmark-toggle"
    >
      {localBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {loading ? 'Saving…' : localBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
