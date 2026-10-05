import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
  Shield,
  Plus,
  Search,
  SlidersHorizontal,
  Edit3,
  Trash2,
  Eye,
  BookOpen,
  Tag,
  Layers,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminApi, type VocabInput, type AdminCategoryItem } from '../../api/endpoints/admin.api';
import type { Vocab } from '../../types';
import { VocabFormModal } from '../../components/admin/VocabFormModal';
import { CategoryTagManager } from '../../components/admin/CategoryTagManager';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import { useUIStore } from '../../store/useUIStore';

export default function AdminDashboardPage() {
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'library' | 'taxonomy'>('library');

  // Data states
  const [vocabs, setVocabs] = useState<(Vocab & { message?: string })[]>([]);
  const [vocabTypes, setVocabTypes] = useState<AdminCategoryItem[]>([]);
  const [useCaseTags, setUseCaseTags] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabInput | null>(null);
  const [previewingCard, setPreviewingCard] = useState<Vocab | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load Admin Data
  const loadData = async (targetPage = page, targetSize = pageSize) => {
    const validPage = typeof targetPage === 'number' && !isNaN(targetPage) ? targetPage : page;
    const validSize = typeof targetSize === 'number' && !isNaN(targetSize) ? targetSize : pageSize;

    setIsLoading(true);
    try {
      const vRes = await adminApi.getVocabs(validPage, validSize, 'id');
      if (vRes && Array.isArray(vRes.content)) {
        setVocabs(vRes.content);
        setTotalPages(vRes.totalPages);
        setTotalElements(vRes.totalElements);
        setPage(vRes.number);
      } else if (Array.isArray(vRes)) {
        setVocabs(vRes);
        setTotalPages(Math.max(1, Math.ceil((vRes as any).length / validSize)));
        setTotalElements((vRes as any).length);
      }
      const tList = await adminApi.getVocabTypes();
      const tagList = await adminApi.getUseCaseTags();
      setVocabTypes(tList);
      setUseCaseTags(tagList);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403 || status === 401) {
        addToast('Access Denied: Administrator permissions required.', 'error');
        navigate('/', { replace: true });
        return;
      }
      addToast('Failed to load admin data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(0, pageSize);
  }, []);

  // Filtered Vocabs
  const filteredVocabs = useMemo(() => {
    return vocabs.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.vocab.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        (item.trick && item.trick.toLowerCase().includes(q));

      const matchesType =
        selectedTypeFilter === 'ALL' ||
        item.vocabType.toUpperCase() === selectedTypeFilter.toUpperCase();

      const matchesTag =
        selectedTagFilter === 'ALL' ||
        item.useCaseTag.toUpperCase().includes(selectedTagFilter.toUpperCase());

      return matchesSearch && matchesType && matchesTag;
    });
  }, [vocabs, searchQuery, selectedTypeFilter, selectedTagFilter]);

  // Handlers for Vocab Form Submit
  const handleFormSubmit = async (formData: VocabInput) => {
    if (formData.id) {
      await adminApi.updateVocab(formData.id, formData);
      addToast(`Updated "${formData.vocab}" successfully!`, 'success');
    } else {
      await adminApi.createVocab(formData);
      addToast(`Added "${formData.vocab}" to library!`, 'success');
    }
    loadData();
  };

  // Handlers for Delete Vocab
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await adminApi.deleteVocab(deletingId);
      addToast('Vocabulary entry deleted successfully.', 'success');
      loadData();
    } catch (err) {
      addToast('Failed to delete vocabulary entry', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] bg-transparent font-inter pb-20">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-8 flex flex-col gap-8">
          
          {/* ─── Header Console Section ─── */}
          <div className="bg-cream-card rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <Shield size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="font-bricolage text-2xl sm:text-3xl font-bold text-ink m-0">
                    Admin Console
                  </h1>
                  <span className="bg-orange-500/20 text-orange-500 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-orange-500/30 uppercase tracking-wider">
                    Superuser Mode
                  </span>
                </div>
                <p className="font-inter text-xs sm:text-sm text-ink-soft m-0">
                  Manage vocabulary repository, taxonomy categories, exam tags, and system content.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => loadData(page, pageSize)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-ink-soft hover:text-ink bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-all border-none cursor-pointer"
                title="Refresh Admin Data"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsFormModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 shadow-[0_4px_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer border-none hover:-translate-y-0.5"
              >
                <Plus size={16} /> Add Vocabulary
              </button>
            </div>
          </div>

          {/* ─── Metric Cards ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-cream-card rounded-2xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <BookOpen size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-soft">Total Vocabs</span>
                <span className="font-bricolage text-2xl font-bold text-ink leading-tight">
                  {totalElements}
                </span>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Layers size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-soft">Vocab Types</span>
                <span className="font-bricolage text-2xl font-bold text-ink leading-tight">
                  {vocabTypes.length}
                </span>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Tag size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-soft">Use Case Tags</span>
                <span className="font-bricolage text-2xl font-bold text-ink leading-tight">
                  {useCaseTags.length}
                </span>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <CheckCircle size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-soft">API Status</span>
                <span className="font-bricolage text-lg font-bold text-green-500 leading-tight">
                  Healthy
                </span>
              </div>
            </div>
          </div>

          {/* ─── Main Content Tabs ─── */}
          <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/10 pb-4">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${
                activeTab === 'library'
                  ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
                  : 'bg-cream-card text-ink-soft hover:text-ink border border-black/5 dark:border-white/5'
              }`}
            >
              <BookOpen size={16} />
              Vocabulary Library ({filteredVocabs.length})
            </button>

            <button
              onClick={() => setActiveTab('taxonomy')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${
                activeTab === 'taxonomy'
                  ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
                  : 'bg-cream-card text-ink-soft hover:text-ink border border-black/5 dark:border-white/5'
              }`}
            >
              <Layers size={16} />
              Categories & Taxonomy
            </button>
          </div>

          {/* ─── TAB 1: VOCABULARY LIBRARY ─── */}
          {activeTab === 'library' && (
            <div className="flex flex-col gap-6">
              
              {/* Search & Filter Bar */}
              <div className="bg-cream-card rounded-2xl p-4 border border-black/5 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search input */}
                <div className="relative w-full md:max-w-md">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by word, meaning, or trick..."
                    className="w-full bg-cream rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-ink-soft/60 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>

                {/* Dropdown Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-ink-soft uppercase tracking-wider">
                    <SlidersHorizontal size={14} /> Filter:
                  </div>

                  {/* Filter by Type */}
                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="bg-cream text-ink text-xs font-semibold rounded-xl py-2 px-3 border border-black/10 dark:border-white/10 focus:outline-none cursor-pointer shrink-0"
                  >
                    <option value="ALL">All Types</option>
                    {vocabTypes.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  {/* Filter by Exam Tag */}
                  <select
                    value={selectedTagFilter}
                    onChange={(e) => setSelectedTagFilter(e.target.value)}
                    className="bg-cream text-ink text-xs font-semibold rounded-xl py-2 px-3 border border-black/10 dark:border-white/10 focus:outline-none cursor-pointer shrink-0"
                  >
                    <option value="ALL">All Exam Tags</option>
                    {useCaseTags.map((tag) => (
                      <option key={tag.id} value={tag.name}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-cream-card rounded-3xl border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-inter">
                    <thead>
                      <tr className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                        <th className="py-4 px-5">ID</th>
                        <th className="py-4 px-5">Vocabulary Word</th>
                        <th className="py-4 px-5">Type</th>
                        <th className="py-4 px-5">Use Case Tags</th>
                        <th className="py-4 px-5 max-w-xs">Meaning</th>
                        <th className="py-4 px-5 max-w-xs">Trick / Mnemonic</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs text-ink">
                      {filteredVocabs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-ink-soft font-medium">
                            No vocabulary entries found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredVocabs.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                          >
                            <td className="py-4 px-5 font-mono text-ink-soft font-semibold">
                              #{item.id}
                            </td>

                            <td className="py-4 px-5 font-bricolage text-base font-bold text-ink">
                              {item.vocab}
                            </td>

                            <td className="py-4 px-5">
                              <span className="font-semibold text-[10px] text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {item.vocabType}
                              </span>
                            </td>

                            <td className="py-4 px-5">
                              <div className="flex flex-wrap gap-1">
                                {item.useCaseTag.split(',').map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="font-semibold text-[10px] text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="py-4 px-5 max-w-xs truncate text-ink-soft" title={item.meaning}>
                              {item.meaning}
                            </td>

                            <td className="py-4 px-5 max-w-xs truncate text-ink-soft" title={item.trick}>
                              {item.trick || '—'}
                            </td>

                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setPreviewingCard(item)}
                                  className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-black/10 dark:hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
                                  title="Preview card"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingItem({
                                      id: item.id,
                                      vocab: item.vocab,
                                      vocabType: item.vocabType,
                                      useCaseTag: item.useCaseTag,
                                      trick: item.trick,
                                      meaning: item.meaning,
                                      example: item.example,
                                      message: item.message,
                                    });
                                    setIsFormModalOpen(true);
                                  }}
                                  className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-all border-none bg-transparent cursor-pointer"
                                  title="Edit entry"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => setDeletingId(item.id)}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-all border-none bg-transparent cursor-pointer"
                                  title="Delete entry"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ─── Pagination Bar ─── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs text-ink-soft">
                  <div className="flex items-center gap-2">
                    <span>Showing</span>
                    <span className="font-bold text-ink">
                      {totalElements === 0 ? 0 : page * pageSize + 1}–{Math.min((page + 1) * pageSize, totalElements)}
                    </span>
                    <span>of</span>
                    <span className="font-bold text-ink">{totalElements}</span>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadData(page - 1, pageSize)}
                      disabled={page === 0 || isLoading}
                      className="px-3 py-1.5 rounded-xl bg-cream border border-black/10 dark:border-white/10 text-ink font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i).map((p) => {
                        if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 0 && p !== totalPages - 1) {
                          if (p === 1 && page > 3) return <span key={p} className="px-1 text-ink-soft">…</span>;
                          if (p === totalPages - 2 && page < totalPages - 4) return <span key={p} className="px-1 text-ink-soft">…</span>;
                          return null;
                        }
                        return (
                          <button
                            key={p}
                            onClick={() => loadData(p, pageSize)}
                            disabled={isLoading}
                            className={`w-8 h-8 rounded-xl font-semibold text-xs border-none cursor-pointer transition-all ${
                              p === page
                                ? 'bg-orange-500 text-white font-bold shadow-sm'
                                : 'bg-cream text-ink-soft hover:text-ink hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                          >
                            {p + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => loadData(page + 1, pageSize)}
                      disabled={page >= totalPages - 1 || isLoading}
                      className="px-3 py-1.5 rounded-xl bg-cream border border-black/10 dark:border-white/10 text-ink font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setPageSize(newSize);
                        loadData(0, newSize);
                      }}
                      className="bg-cream text-ink text-xs font-semibold rounded-xl py-1 px-2.5 border border-black/10 dark:border-white/10 focus:outline-none cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: TAXONOMY & CATEGORY MANAGER ─── */}
          {activeTab === 'taxonomy' && (
            <CategoryTagManager
              vocabTypes={vocabTypes}
              useCaseTags={useCaseTags}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* ─── VOCAB FORM MODAL (Add / Edit) ─── */}
      <VocabFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        vocabTypes={vocabTypes}
        useCaseTags={useCaseTags}
      />

      {/* ─── CARD PREVIEW MODAL ─── */}
      {previewingCard && (
        <OpenVocabCard
          vocabCard={{
            vocab: previewingCard,
            isBookmarked: false,
            isLearned: false,
          }}
          isOpen={Boolean(previewingCard)}
          onClose={() => setPreviewingCard(null)}
        />
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-card rounded-2xl p-6 max-w-sm w-full border border-black/10 dark:border-white/10 shadow-2xl font-inter">
            <h3 className="font-bricolage text-lg font-bold text-ink mb-2">Delete Vocabulary Entry</h3>
            <p className="text-xs text-ink-soft mb-6 leading-relaxed">
              Are you sure you want to delete vocabulary entry #{deletingId}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft bg-black/5 dark:bg-white/5 hover:bg-black/10 border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm border-none cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
