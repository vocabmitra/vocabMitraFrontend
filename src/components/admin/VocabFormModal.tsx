import { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Check } from 'lucide-react';
import type { VocabInput, AdminCategoryItem } from '../../api/endpoints/admin.api';
import { VOCAB_TYPES, USE_CASE_TAGS } from '../../types/entities/vocab.types';

interface VocabFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VocabInput) => Promise<void>;
  initialData?: VocabInput | null;
  vocabTypes: AdminCategoryItem[];
  useCaseTags: AdminCategoryItem[];
}

export function VocabFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  vocabTypes,
  useCaseTags,
}: VocabFormModalProps) {
  const isEditing = Boolean(initialData?.id);

  const [vocab, setVocab] = useState('');
  const [vocabType, setVocabType] = useState('WORD');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [meaning, setMeaning] = useState('');
  const [trick, setTrick] = useState('');
  const [example, setExample] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form state when editing or resetting when opening
  useEffect(() => {
    if (initialData) {
      setVocab(initialData.vocab || '');
      setVocabType(initialData.vocabType || (vocabTypes[0]?.name ?? 'WORD'));
      const parsedTags = (initialData.useCaseTag || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      
      const presetList = USE_CASE_TAGS as readonly string[];
      const presetFound = parsedTags.filter((t) => presetList.includes(t.toUpperCase()));
      const customFound = parsedTags.filter((t) => !presetList.includes(t.toUpperCase()));

      setSelectedTags(presetFound);
      setCustomTagInput(customFound.join(', '));
      setMeaning(initialData.meaning || '');
      setTrick(initialData.trick || '');
      setExample(initialData.example || '');
      setMessage(initialData.message || '');
    } else {
      setVocab('');
      setVocabType('WORD');
      setSelectedTags(['CAT']);
      setCustomTagInput('');
      setMeaning('');
      setTrick('');
      setExample('');
      setMessage('');
    }
    setError(null);
  }, [initialData, isOpen, vocabTypes, useCaseTags]);

  if (!isOpen) return null;

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vocab.trim()) {
      setError('Vocabulary word or phrase is required.');
      return;
    }
    if (!meaning.trim()) {
      setError('Meaning is required.');
      return;
    }

    const manualTags = customTagInput
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);
    const combinedTags = Array.from(new Set([...selectedTags, ...manualTags]));

    if (combinedTags.length === 0) {
      setError('At least one Use Case Tag / Exam Category is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...(initialData?.id ? { id: initialData.id } : {}),
        vocab: vocab.trim(),
        vocabType: vocabType.toUpperCase().trim(),
        useCaseTag: combinedTags.join(', '),
        meaning: meaning.trim(),
        trick: trick.trim(),
        example: example.trim(),
        message: message.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save vocabulary entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute live combined tags preview
  const previewManualTags = customTagInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const previewCombined = Array.from(new Set([...selectedTags, ...previewManualTags]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-cream-card border border-black/10 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        
        {/* Fixed Top Header */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 px-6 sm:px-8 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bricolage text-xl font-bold text-ink m-0">
                {isEditing ? 'Edit Vocabulary Entry' : 'Add New Vocabulary'}
              </h2>
              <p className="font-inter text-[12px] text-ink-soft m-0">
                {isEditing ? `Updating ID #${initialData?.id}` : 'Fill in the vocabulary details below'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-soft hover:text-ink bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer border-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 font-inter space-y-6">
          
          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-3">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN: Metadata & Classification */}
            <div className="space-y-5">
              {/* Word & Vocab Type in 1 row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Word / Phrase <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vocab}
                    onChange={(e) => setVocab(e.target.value)}
                    placeholder="e.g. Bear in mind"
                    className="w-full bg-cream rounded-xl py-2.5 px-4 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-ink-soft/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Vocab Type <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={vocabType}
                    onChange={(e) => setVocabType(e.target.value)}
                    className="w-full bg-cream rounded-xl py-2.5 px-3 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all cursor-pointer font-semibold"
                  >
                    {VOCAB_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-cream text-ink">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Use Case Tags (Pill Badges + Custom Comma-Separated Manual Input) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Use Case Tags / Exam Categories <span className="text-orange-500">*</span>
                </label>
                
                {/* Preset Exam Badges */}
                <div className="flex flex-wrap gap-2 p-3 bg-cream rounded-xl border border-black/10 dark:border-white/10 min-h-[46px] items-center">
                  {USE_CASE_TAGS.map((tagName) => {
                    const isSelected = selectedTags.includes(tagName);
                    return (
                      <button
                        type="button"
                        key={tagName}
                        onClick={() => toggleTag(tagName)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-black/5 dark:bg-white/5 text-ink-soft border-black/5 dark:border-white/10 hover:text-ink hover:bg-black/10'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {tagName}
                      </button>
                    );
                  })}
                </div>

                {/* Manual Custom Tags Input */}
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Or Add Custom Tags (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    placeholder="e.g. GMAT, BANKING, SAT, IELTS"
                    className="w-full bg-cream rounded-xl py-2 px-3.5 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-ink-soft/50 font-medium"
                  />
                </div>

                <p className="text-[11px] text-ink-soft m-0">
                  Combined tags: <span className="font-semibold text-ink">{previewCombined.join(', ') || 'None'}</span>
                </p>
              </div>

              {/* Message / Context Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Message / Context Note (Displayed to users)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Frequently tested in CAT reading comprehension"
                  className="w-full bg-cream rounded-xl py-2.5 px-4 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-ink-soft/50"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Content Definitions & Memory Aids */}
            <div className="space-y-4">
              {/* Meaning */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Meaning / Definition <span className="text-orange-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Clear definition of the word or phrase..."
                  className="w-full bg-cream rounded-xl py-2.5 px-4 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-ink-soft/50 resize-none"
                  required
                />
              </div>

              {/* Mnemonic / Trick */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Trick / Mnemonic (Memory Aid)
                </label>
                <textarea
                  rows={2}
                  value={trick}
                  onChange={(e) => setTrick(e.target.value)}
                  placeholder="Visual hook or mnemonic breakdown to remember easily..."
                  className="w-full bg-cream rounded-xl py-2.5 px-4 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-ink-soft/50 resize-none"
                />
              </div>

              {/* Example Sentence */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Example Sentence
                </label>
                <textarea
                  rows={2}
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Sentence demonstrating contextual usage..."
                  className="w-full bg-cream rounded-xl py-2.5 px-4 text-sm text-ink border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-ink-soft/50 resize-none"
                />
              </div>
            </div>

          </div>

          {/* Hidden Submit Button to support Enter key submit */}
          <button type="submit" className="hidden" />
        </form>

        {/* Fixed Bottom Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-black/5 dark:border-white/10 px-6 sm:px-8 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-ink-soft hover:text-ink bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer border-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-wait"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Entry' : 'Create Entry'}
          </button>
        </div>

      </div>
    </div>
  );
}
