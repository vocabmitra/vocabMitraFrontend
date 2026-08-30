import { useState, useMemo } from 'react';
import { BookOpen, MessageSquare, PenTool, Link as LinkIcon, Globe, Sparkles, Search } from 'lucide-react';
import { VocabCard } from '../../components/vocab/VocabCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import type { VocabCard as VocabCardType } from '../../types';

const TABS = [
  { id: 'previous-year-words', title: 'Previous-Year Words', icon: BookOpen, color: 'text-purple-500' },
  { id: 'idioms-and-phrases', title: 'Idioms & Phrases', icon: MessageSquare, color: 'text-green-500' },
  { id: 'one-word-substitution', title: 'One Word Substitution', icon: PenTool, color: 'text-blue-500' },
  { id: 'phrasal-verbs', title: 'Phrasal Verbs', icon: LinkIcon, color: 'text-teal-500' },
  { id: 'foreign-words', title: 'Foreign Words', icon: Globe, color: 'text-orange-500' },
];

const MOCK_WORDS_BY_CATEGORY: Record<string, { vocab: string; meaning: string; trick?: string; vocabType?: 'word' | 'phrase' | 'idiom' }[]> = {
  'previous-year-words': [
    { vocab: 'ALACRITY', meaning: 'Brisk and cheerful readiness; eager willingness', trick: 'A-LACK-RITY', vocabType: 'word' },
    { vocab: 'CANDID', meaning: 'Truthful and straightforward; frank and honest', trick: 'CAN-DID', vocabType: 'word' },
    { vocab: 'OBSTINATE', meaning: 'Stubbornly refusing to change one\'s opinion or chosen course', trick: 'OB-STIN-ATE', vocabType: 'word' },
    { vocab: 'EPHEMERAL', meaning: 'Lasting for a very short time; fleeting and transient', trick: 'E-PHEM-ERAL', vocabType: 'word' },
    { vocab: 'LACONIC', meaning: 'Using very few words; concise to the point of seeming rude', trick: 'LACK-ONIC', vocabType: 'word' },
    { vocab: 'UBIQUITOUS', meaning: 'Present, appearing, or found everywhere at once', trick: 'YOU-BIQUITOUS', vocabType: 'word' },
    { vocab: 'PERSPICACIOUS', meaning: 'Having a ready insight into and understanding of things', trick: 'PER-SPICE', vocabType: 'word' },
    { vocab: 'MAGNANIMOUS', meaning: 'Generous or forgiving, especially toward a rival or less powerful person', trick: 'BIG-HEART', vocabType: 'word' },
  ],
  'idioms-and-phrases': [
    { vocab: 'BURN THE MIDNIGHT OIL', meaning: 'To work or study late into the night', trick: 'NIGHT OIL', vocabType: 'idiom' },
    { vocab: 'BITE THE BULLET', meaning: 'To face a difficult situation with courage and fortitude', trick: 'COURAGE', vocabType: 'idiom' },
    { vocab: 'BREAK THE ICE', meaning: 'To make people feel more comfortable in a social setting', trick: 'SOCIAL ICE', vocabType: 'idiom' },
    { vocab: 'BLESSING IN DISGUISE', meaning: 'A good thing that initially seemed bad or unfortunate', trick: 'DISGUISE', vocabType: 'idiom' },
  ],
  'one-word-substitution': [
    { vocab: 'ALTRUIST', meaning: 'A person unselfishly concerned for or devoted to the welfare of others', trick: 'ALL-TRUE', vocabType: 'word' },
    { vocab: 'OMNIPRESENT', meaning: 'Widely or constantly encountered; present everywhere', trick: 'EVERYWHERE', vocabType: 'word' },
    { vocab: 'POLYGLOT', meaning: 'A person who knows and is able to use several languages', trick: 'MANY-LANGS', vocabType: 'word' },
    { vocab: 'SOLILOQUY', meaning: 'An act of speaking one\'s thoughts aloud when by oneself', trick: 'SOLO-TALK', vocabType: 'word' },
  ],
  'phrasal-verbs': [
    { vocab: 'CALL OFF', meaning: 'To cancel an event, agreement, or planned activity', trick: 'CANCEL', vocabType: 'phrase' },
    { vocab: 'LOOK INTO', meaning: 'To investigate or examine the facts about a situation', trick: 'INVESTIGATE', vocabType: 'phrase' },
    { vocab: 'CARRY ON', meaning: 'To continue an activity or task despite difficulties', trick: 'CONTINUE', vocabType: 'phrase' },
    { vocab: 'GIVE UP', meaning: 'To stop making an effort; surrender or abandon hope', trick: 'SURRENDER', vocabType: 'phrase' },
  ],
  'foreign-words': [
    { vocab: 'BON VOYAGE', meaning: 'Used to express good wishes to someone about to set off on a journey', trick: 'GOOD TRIP', vocabType: 'phrase' },
    { vocab: 'STATUS QUO', meaning: 'The existing state of affairs, especially regarding social or political issues', trick: 'CURRENT STATE', vocabType: 'phrase' },
    { vocab: 'DE FACTO', meaning: 'In fact, whether by right or not; existing in reality', trick: 'IN REALITY', vocabType: 'phrase' },
    { vocab: 'AD HOC', meaning: 'Created or done for a particular purpose only as necessary', trick: 'PURPOSEFUL', vocabType: 'phrase' },
  ]
};

// Helper to generate mock data matching backend DTO
const generateMockWords = (category: string): VocabCardType[] => {
  const items = MOCK_WORDS_BY_CATEGORY[category] || MOCK_WORDS_BY_CATEGORY['previous-year-words'];
  return items.map((item, i) => ({
    vocab: {
      id: i + 1,
      vocab: item.vocab,
      vocabType: item.vocabType || 'word',
      useCaseTag: category,
      trick: item.trick || 'MNEMONIC',
      meaning: item.meaning,
      example: `Example sentence for ${item.vocab}.`,
      updatedAt: new Date().toISOString()
    },
    isLearned: i % 3 === 0,
    isBookmarked: i % 2 === 0
  }));
};

export default function CuetFocusPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);

  // Generate mock data based on the active tab
  const mockCards = useMemo(() => generateMockWords(activeTab), [activeTab]);

  // Filter cards by search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return mockCards;
    const q = searchQuery.toLowerCase();
    return mockCards.filter(
      (c) => c.vocab.vocab.toLowerCase().includes(q) || c.vocab.meaning.toLowerCase().includes(q)
    );
  }, [mockCards, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">

      {/* ─── Global Top Header ─── */}
      <div className="dash-element flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-bricolage text-2xl font-bold text-ink m-0 leading-tight">
              CUET Focus Hub
            </h1>
            <p className="font-inter text-[13px] text-ink-soft">
              Master the exact vocabulary you need for the CUET exam.
            </p>
          </div>
        </div>

        {/* Local Search Bar */}
        <div className="relative w-full max-w-[320px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft opacity-70" />
          <input 
            type="text" 
            placeholder="Search CUET words..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream-card rounded-xl py-2.5 pl-10 pr-4 font-inter text-[13px] text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      {/* ─── Top Navbar (Tabs) ─── */}
      <div className="dash-element w-full mt-2">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-inter text-[14px] font-semibold transition-all cursor-pointer border ${isActive
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-[0_4px_12px_rgba(249,115,22,0.15)]'
                    : 'bg-cream-card border-black/5 dark:border-white/5 dark:border-t-white/10 text-ink-soft hover:text-ink hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
                  }`}
              >
                <Icon size={16} className={isActive ? 'text-orange-500' : 'text-ink-soft opacity-70'} />
                {tab.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Grid ─── */}
      {filteredCards.length === 0 ? (
        <div className="dash-element w-full bg-cream-card rounded-2xl p-12 text-center border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm">
          <p className="font-inter text-ink-soft mb-2">No CUET words found matching "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-orange-500 font-inter text-[13px] font-semibold hover:underline bg-transparent border-none cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="dash-element grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {filteredCards.map((card) => (
            <VocabCard
              key={card.vocab.id}
              vocabCard={card}
              onClick={() => setOpenCard(card)}
            />
          ))}
        </div>
      )}

      {/* OpenVocabCard Modal */}
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
