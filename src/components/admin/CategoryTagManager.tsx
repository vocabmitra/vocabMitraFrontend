import { useState } from 'react';
import { Tag, Layers, ShieldCheck } from 'lucide-react';
import type { AdminCategoryItem } from '../../api/endpoints/admin.api';

interface CategoryTagManagerProps {
  vocabTypes: AdminCategoryItem[];
  useCaseTags: AdminCategoryItem[];
}

export function CategoryTagManager({
  vocabTypes,
  useCaseTags,
}: CategoryTagManagerProps) {
  const [activeTab, setActiveTab] = useState<'tags' | 'types'>('tags');

  return (
    <div className="flex flex-col gap-6 font-inter">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${
            activeTab === 'tags'
              ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
              : 'bg-cream-card text-ink-soft hover:text-ink border border-black/5 dark:border-white/5'
          }`}
        >
          <Tag size={16} />
          Fixed Use Case Tags ({useCaseTags.length})
        </button>

        <button
          onClick={() => setActiveTab('types')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${
            activeTab === 'types'
              ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
              : 'bg-cream-card text-ink-soft hover:text-ink border border-black/5 dark:border-white/5'
          }`}
        >
          <Layers size={16} />
          Fixed Vocab Types ({vocabTypes.length})
        </button>
      </div>

      {/* ─── TAB 1: FIXED USE CASE & EXAM TAGS ─── */}
      {activeTab === 'tags' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-3">
            <ShieldCheck size={18} className="shrink-0" />
            <span>
              Use case & exam tags are system constants locked to <strong>CAT</strong>, <strong>CUET</strong>, <strong>GRE</strong>, <strong>SSC</strong>, and <strong>UPSC</strong>.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {useCaseTags.map((tag) => (
              <div
                key={tag.id}
                className="bg-cream-card rounded-2xl p-6 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-bricolage text-lg font-bold text-ink uppercase tracking-wide">
                      {tag.name}
                    </span>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5 uppercase">
                      Fixed System Tag
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed m-0">
                    {tag.description || 'Target exam / category tag.'}
                  </p>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-3 mt-4 flex items-center justify-between text-xs text-ink-soft font-medium">
                  <span>Current Library Count:</span>
                  <span className="font-bold text-ink">{tag.count} vocabs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: FIXED VOCAB TYPES ─── */}
      {activeTab === 'types' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs flex items-center gap-3">
            <ShieldCheck size={18} className="shrink-0" />
            <span>
              Vocab types are system constants locked to <strong>WORD</strong>, <strong>PHRASE</strong>, and <strong>IDIOM</strong>.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vocabTypes.map((item) => (
              <div
                key={item.id}
                className="bg-cream-card rounded-2xl p-6 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-bricolage text-lg font-bold text-ink uppercase tracking-wide">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5 uppercase">
                      Fixed System Type
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed m-0">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-3 mt-4 flex items-center justify-between text-xs text-ink-soft font-medium">
                  <span>Current Library Count:</span>
                  <span className="font-bold text-ink">{item.count} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
