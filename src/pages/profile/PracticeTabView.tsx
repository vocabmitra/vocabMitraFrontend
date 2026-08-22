import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Clock, Play } from 'lucide-react';
import { usePracticeStore } from '../../store/usePracticeStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import type { VocabCard } from '../../types';

export function PracticeTabView() {
  const navigate = useNavigate();
  const { settings, updateSettings, startSession } = usePracticeStore();
  const [practiceCards, setPracticeCards] = useState<VocabCard[]>([]);

  useEffect(() => {
    const fetchPracticeQueue = async () => {
      try {
        const cards = await vocabApi.getPracticeQueue();
        setPracticeCards(cards);
      } catch (err) {
        console.error('Failed to fetch practice queue', err);
      }
    };
    fetchPracticeQueue();
  }, []);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isRemoving, setIsRemoving] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === practiceCards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(practiceCards.map(c => c.vocab.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleStartPractice = () => {
    if (selectedIds.size === 0) return;
    const cardsToPractice = practiceCards.filter(c => selectedIds.has(c.vocab.id));
    startSession(cardsToPractice);
    navigate('/practice');
  };

  const handleRemoveSelected = async () => {
    if (selectedIds.size === 0) return;
    setIsRemoving(true);
    try {
      const idsToRemove = Array.from(selectedIds);
      await Promise.all(idsToRemove.map(id => vocabApi.togglePractice(id)));
      setPracticeCards(prev => prev.filter(c => !selectedIds.has(c.vocab.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to remove from practice queue', err);
    } finally {
      setIsRemoving(false);
    }
  };

  if (practiceCards.length === 0) {
    return (
      <div className="max-w-[900px]">
        <div className="flex items-center gap-2.5 mb-7">
          <Dumbbell size={20} className="text-upsc" />
          <h1 className="font-bricolage text-2xl font-bold text-ink m-0">
            Practice Queue
          </h1>
        </div>
        <div className="dash-element w-full bg-cream-card rounded-2xl border-2 border-ink/10 p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mb-4">
            <Dumbbell size={28} className="text-ink-soft" />
          </div>
          <h3 className="font-bricolage text-[24px] font-bold text-ink mb-2">
            Your Practice Queue is Empty
          </h3>
          <p className="font-inter text-[16px] text-ink-soft max-w-[400px] mb-6">
            Add words to your practice queue from the vocabulary dictionary to review them here.
          </p>
          <Link
            to="/vocabulary"
            className="inline-flex items-center justify-center gap-2 font-inter font-semibold text-[15px] text-white bg-upsc hover:bg-upsc-dark transition-colors px-6 py-3 rounded-full shadow-[0_4px_0_var(--ink)] hover:translate-y-[2px] hover:shadow-[0_2px_0_var(--ink)] active:translate-y-[4px] active:shadow-none"
          >
            Explore Vocabulary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px]">
      <div className="flex items-center gap-2.5 mb-7">
        <Dumbbell size={20} className="text-upsc" />
        <h1 className="font-bricolage text-2xl font-bold text-ink m-0">
          Practice Queue
        </h1>
      </div>

      <div className="dash-element flex flex-col lg:flex-row gap-8">
        
        {/* Left: Queue List */}
        <div className="flex-1 bg-cream-card rounded-2xl border-2 border-ink shadow-[4px_4px_0_var(--ink)] overflow-hidden">
        <div className="p-5 border-b-2 border-ink bg-ink/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={selectedIds.size === practiceCards.length && practiceCards.length > 0}
              onChange={toggleSelectAll}
              className="w-5 h-5 rounded border-2 border-ink accent-ink cursor-pointer"
            />
            <span className="font-bricolage font-bold text-ink text-[16px]">Select All</span>
          </div>
          <div className="flex items-center gap-4">
            {selectedIds.size > 0 && (
              <button
                onClick={handleRemoveSelected}
                disabled={isRemoving}
                className="font-inter text-[13px] font-bold text-upsc hover:text-upsc-dark transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50"
              >
                {isRemoving ? 'Removing...' : `Remove (${selectedIds.size})`}
              </button>
            )}
            <span className="font-space font-bold text-[13px] text-ink-soft uppercase tracking-wide">
              {practiceCards.length} Words
            </span>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          {practiceCards.map(card => (
            <div 
              key={card.vocab.id} 
              className="flex items-center gap-4 p-5 border-b border-ink/10 hover:bg-ink/5 transition-colors cursor-pointer"
              onClick={() => toggleSelect(card.vocab.id)}
            >
              <input 
                type="checkbox" 
                checked={selectedIds.has(card.vocab.id)}
                onChange={() => toggleSelect(card.vocab.id)}
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 rounded border-2 border-ink accent-ink cursor-pointer shrink-0"
              />
              <div>
                <h4 className="font-bricolage text-[18px] font-bold text-ink mb-1">
                  {card.vocab.vocab}
                </h4>
                <p className="font-inter text-[14px] text-ink-soft line-clamp-1">
                  {card.vocab.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Settings & Start */}
      <div className="w-full lg:w-[320px] flex flex-col gap-6">
        
        {/* Settings Card */}
        <div className="bg-cream-card rounded-2xl border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-6">
          <h3 className="font-bricolage text-[20px] font-bold text-ink mb-6 flex items-center gap-2">
            <Clock size={20} />
            Session Settings
          </h3>
          
          <label className="flex items-center justify-between cursor-pointer mb-6">
            <span className="font-inter font-bold text-ink text-[16px]">Timed Mode</span>
            <div className="relative inline-block w-12 h-6 rounded-full bg-ink/10 transition-colors duration-200">
              <input 
                type="checkbox" 
                className="peer opacity-0 w-0 h-0" 
                checked={settings.isTimed}
                onChange={(e) => updateSettings({ isTimed: e.target.checked })}
              />
              <span className={`absolute cursor-pointer top-1 left-1 bottom-1 w-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-6 shadow-sm ${settings.isTimed ? 'bg-upsc' : 'bg-ink-soft'}`} />
            </div>
          </label>

          <div className={`transition-opacity duration-200 ${settings.isTimed ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex justify-between items-end mb-2">
              <span className="font-inter text-[14px] font-medium text-ink-soft">Time limit per card</span>
              <span className="font-space font-bold text-[14px] text-ink">{settings.timeLimitSeconds}s</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="1"
              value={settings.timeLimitSeconds}
              onChange={(e) => updateSettings({ timeLimitSeconds: Number(e.target.value) })}
              className="w-full accent-upsc"
            />
            <div className="flex justify-between mt-2 font-space text-[11px] font-bold text-ink/40">
              <span>5s</span>
              <span>30s</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStartPractice}
          disabled={selectedIds.size === 0}
          className={`
            flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 shadow-[4px_4px_0_var(--ink)] font-bricolage text-[18px] font-bold transition-all
            ${selectedIds.size > 0 
              ? 'bg-upsc border-ink text-white hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)] active:translate-y-1 active:shadow-[2px_2px_0_var(--ink)]' 
              : 'bg-ink/10 border-ink/20 text-ink/40 cursor-not-allowed shadow-none'}
          `}
        >
          <Play size={18} className={selectedIds.size > 0 ? 'fill-white' : 'fill-ink/40'} />
          Start Practice ({selectedIds.size})
        </button>

      </div>

    </div>
    </div>
  );
}
