import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { usePracticeStore } from '../../store/usePracticeStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { VocabCard } from '../../types';

interface PracticeSessionLauncherProps {
  cards: VocabCard[];
  /** Label suffix. e.g. "Bookmarked Words", "CUET Words", "Filtered Words" */
  label?: string;
  /** Extra tailwind classes for the button */
  className?: string;
  /** Extra tailwind classes for the icon */
  iconClassName?: string;
}

/**
 * A reusable CTA button that loads the given cards into the practice session
 * and navigates to /practice. Disabled when card list is empty.
 * Only visible when user is logged in.
 */
export function PracticeSessionLauncher({
  cards,
  label = 'Visible Words',
  className = '',
  iconClassName = '',
}: PracticeSessionLauncherProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const startSession = usePracticeStore((s) => s.startSession);

  if (!isAuthenticated) {
    return null;
  }

  const handleClick = () => {
    if (!isAuthenticated || cards.length === 0) return;
    startSession(cards);
    navigate('/practice');
  };

  const isDisabled = cards.length === 0;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={isDisabled ? 'No cards to practice' : `Practice ${cards.length} ${label}`}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer border-none shrink-0
        ${
          isDisabled
            ? 'bg-black/5 dark:bg-white/5 text-ink-soft/40 cursor-not-allowed'
            : 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0'
        } ${className}`}
      aria-label={`Practice ${cards.length} ${label}`}
    >
      <Zap size={15} className={isDisabled ? '' : (iconClassName || 'fill-white')} />
      Practice {cards.length > 0 ? `${cards.length} ` : ''}{label}
    </button>
  );
}
