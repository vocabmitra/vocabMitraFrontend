import { useState } from 'react';
import { Bookmark, BookOpen } from 'lucide-react';
import { VocabCard } from '../../components/vocab/VocabCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import { CategoryBadge } from '../../components/vocab/CategoryBadge';
import { MOCK_VOCAB_CARDS } from '../../api/mock/fixtures/vocabFixtures';
import type { VocabCard as VocabCardType, UseCaseTag } from '../../types';
import { parseUseCaseTags } from '../../types';

type Mode = 'learned' | 'bookmarked';

interface UserWordListPageProps {
  mode: Mode;
}

const MODE_META = {
  learned: {
    label: 'Learned Words',
    emptyMessage: "You haven't marked any words as learned yet.",
    emptyHint: 'Open any word from the Vocabulary page and click "Mark as learned".',
    icon: BookOpen,
  },
  bookmarked: {
    label: 'Bookmarked Words',
    emptyMessage: "You haven't bookmarked any words yet.",
    emptyHint: 'Open any word and click "Bookmark" to save it here.',
    icon: Bookmark,
  },
};

/**
 * Shared component for Bookmarked and Learned views.
 * Mode is passed as a prop — not two separate builds.
 * Static (non-interactive) bookmark/learned icon on cards.
 * Un-marking only happens inside OpenVocabCard, never from this list directly.
 */
export default function UserWordListPage({ mode }: UserWordListPageProps) {
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);
  const [activeFilters, setActiveFilters] = useState<UseCaseTag[]>([]);
  const meta = MODE_META[mode];
  const Icon = meta.icon;

  // Filter from mock — replace with API call in production
  let cards = mode === 'learned'
    ? MOCK_VOCAB_CARDS.filter((c) => c.isLearned)
    : MOCK_VOCAB_CARDS.filter((c) => c.isBookmarked);

  if (activeFilters.length > 0) {
    cards = cards.filter((c) =>
      activeFilters.some((f) => c.vocab.useCaseTag.includes(f))
    );
  }

  // Collect all tags present in this list
  const allTags = Array.from(
    new Set(
      MOCK_VOCAB_CARDS
        .filter((c) => mode === 'learned' ? c.isLearned : c.isBookmarked)
        .flatMap((c) => parseUseCaseTags(c.vocab.useCaseTag))
    )
  ) as UseCaseTag[];

  const toggleFilter = (tag: UseCaseTag) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-7">
        <Icon size={20} className="text-upsc" />
        <h1 className="font-bricolage text-2xl font-bold text-ink m-0">
          {meta.label}
        </h1>
        <span
          className="ml-auto font-space text-xs text-ink-soft bg-cream-card border border-solid border-line rounded-full py-0.5 px-2.5"
        >
          {cards.length} words
        </span>
      </div>

      {/* Tag filters (if multiple tags present) */}
      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <CategoryBadge
              key={tag}
              tag={tag}
              active={activeFilters.includes(tag)}
              onClick={() => toggleFilter(tag)}
            />
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              className="font-space text-[11px] text-ink-soft bg-transparent border border-solid border-line rounded-md py-[3px] px-2.5 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {cards.length === 0 ? (
        <div className="text-center py-20">
          <Icon size={40} className="text-line mb-4 mx-auto block" />
          <p className="font-bricolage text-lg font-semibold text-ink mb-2">
            {meta.emptyMessage}
          </p>
          <p className="text-sm text-ink-soft max-w-[36ch] mx-auto m-0">
            {meta.emptyHint}
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {cards.map((card) => (
            <VocabCard
              key={card.vocab.id}
              vocabCard={card}
              onClick={() => setOpenCard(card)}
            />
          ))}
        </div>
      )}

      {/* OpenVocabCard — un-marking happens here only */}
      {openCard && (
        <OpenVocabCard
          vocabCard={openCard}
          isOpen={!!openCard}
          onClose={() => setOpenCard(null)}
        />
      )}
    </div>
  );
}
