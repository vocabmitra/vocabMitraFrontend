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
  variant?: 'default' | 'icon';
}

export function BookmarkToggleButton({ vocabId, isBookmarked: initialIsBookmarked, variant = 'default' }: BookmarkToggleButtonProps) {
  const requireAuth = useAuthGate();
  const updateVocabCard = useVocabStore((s) => s.updateVocabCard);
  const addToast = useUIStore((s) => s.addToast);
  
  const [loading, setLoading] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(initialIsBookmarked);

  // Keep in sync with props if parent updates
  useEffect(() => {
    setLocalBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    requireAuth(async () => {
      setLoading(true);
      const nextState = !localBookmarked;
      // Optimistic local UI update
      setLocalBookmarked(nextState);
      
      try {
        const resMessage = await vocabApi.toggleBookmark(vocabId);
        // Also update store
        updateVocabCard(vocabId, { isBookmarked: nextState });
        addToast(
          typeof resMessage === 'string' && resMessage.trim() ? resMessage : (nextState ? 'Bookmark is successfull' : 'Bookmark removed.'),
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

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${
          localBookmarked
            ? 'bg-orange-500/20 text-orange-500 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
            : 'bg-black/5 dark:bg-white/5 text-ink-soft opacity-70 hover:opacity-100 hover:text-orange-500 border-black/5 dark:border-white/10'
        } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
        aria-label={localBookmarked ? 'Remove bookmark' : 'Bookmark word'}
        title={localBookmarked ? 'Bookmarked' : 'Bookmark word'}
      >
        {localBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 font-inter font-bold text-sm rounded-full border transition-all duration-200 ${
        localBookmarked
          ? 'bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 dark:bg-orange-500 dark:text-white dark:border-orange-500 dark:shadow-[0_0_15px_rgba(249,115,22,0.3)]'
          : 'bg-black/5 text-ink border-black/10 hover:bg-black/10 hover:border-black/20 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20'
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
