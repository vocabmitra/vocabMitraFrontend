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
  variant?: 'default' | 'icon' | 'puffy' | 'open-card' | 'ribbon' | 'reel';
  theme?: any;
}

export function BookmarkToggleButton({ vocabId, isBookmarked: initialIsBookmarked, variant = 'default', theme }: BookmarkToggleButtonProps) {
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

  if (variant === 'puffy') {
    const isCustomTheme = Boolean(theme?.iconFrom && theme?.iconTo);
    const iconClass = !isCustomTheme ? (theme?.text || 'text-[#ea580c]') : '';
    const bgClass = !isCustomTheme ? (theme?.iconBg || 'bg-gradient-to-br from-white to-[#ffdfbe]') : '';

    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-11 h-11 rounded-[14px] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.12)] dark:border dark:border-white/10 transition-transform duration-200 hover:scale-105 ${bgClass} ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
        style={
          isCustomTheme
            ? {
                background: `linear-gradient(135deg, ${theme.iconFrom}, ${theme.iconTo})`,
              }
            : undefined
        }
        aria-label={localBookmarked ? 'Remove bookmark' : 'Bookmark word'}
        title={localBookmarked ? 'Bookmarked' : 'Bookmark word'}
      >
        <Bookmark 
          size={20} 
          className={iconClass} 
          style={isCustomTheme ? { color: theme.text } : undefined}
          fill={localBookmarked ? "currentColor" : "none"} 
          strokeWidth={localBookmarked ? 2 : 2.5}
        />
      </button>
    );
  }

  if (variant === 'ribbon' || variant === 'reel') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`transition-all duration-300 hover:scale-105 ${
          localBookmarked
            ? 'p-1 cursor-pointer'
            : 'w-11 h-11 rounded-[14px] flex items-center justify-center bg-[#fff8f0] dark:bg-[#221c17] border border-[#ffedd5] dark:border-orange-500/20 shadow-[0_4px_12px_rgba(249,115,22,0.10),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] cursor-pointer'
        } ${loading ? 'opacity-50 cursor-wait' : ''}`}
        aria-label={localBookmarked ? 'Remove bookmark' : 'Bookmark word'}
        title={localBookmarked ? 'Bookmarked' : 'Bookmark word'}
      >
        <Bookmark
          size={localBookmarked ? 24 : 20}
          className="text-[#ea580c] dark:text-orange-400 transition-all duration-300"
          fill={localBookmarked ? '#ea580c' : 'none'}
          strokeWidth={localBookmarked ? 2 : 2.5}
        />
      </button>
    );
  }

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

  if (variant === 'open-card') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-[100px] font-inter font-bold text-[14px] transition-all duration-200 ${
          localBookmarked
            ? 'bg-[#fff7ed] dark:bg-orange-500/15 text-[#ea580c] dark:text-orange-400 border border-[#fed7aa] dark:border-orange-500/30 shadow-sm'
            : 'bg-white dark:bg-[#222226] text-[#334155] dark:text-[#f8fafc] border border-[#e2e8f0] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10'
        } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
        aria-label={localBookmarked ? 'Remove bookmark' : 'Bookmark word'}
      >
        <Bookmark size={18} strokeWidth={2.5} fill={localBookmarked ? "currentColor" : "none"} className={localBookmarked ? '' : 'text-[#64748b] dark:text-slate-400'} />
        {localBookmarked ? 'Bookmarked' : 'Bookmark'}
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
