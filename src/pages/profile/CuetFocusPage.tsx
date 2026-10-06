import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    BookOpen,
    MessageSquare,
    PenTool,
    Link as LinkIcon,
    Globe,
    Search,
    RefreshCw,
    ArrowLeft,
    GraduationCap,
    Landmark,
    ShieldCheck,
    ChevronDown,
    Filter,
} from 'lucide-react';
import { ShrinkVocabCard } from '../../components/vocab/ShrinkVocabCard';
import { ExploreExamCard, type ExamCategory } from '../../components/vocab/ExploreExamCard';
import { OpenVocabCard } from '../../components/vocab/OpenVocabCard';
import { PracticeSessionLauncher } from '../../components/vocab/PracticeSessionLauncher';
import type { VocabCard as VocabCardType } from '../../types';
import { vocabApi } from '../../api/endpoints/vocab.api';

// ── Exam Categories ──
const EXAM_CATEGORIES: ExamCategory[] = [
    {
        id: 'MBA',
        title: 'MBA Exams',
        subtitle: 'CAT · XAT · SNAP · NMAT',
        icon: GraduationCap,
        colorTheme: 'orange',
        features: [
            'High-frequency vocabulary',
            'Previous-year words',
            'Reading comprehension',
        ],
    },
    {
        id: 'CUET',
        title: 'CUET',
        subtitle: 'UG · PG',
        icon: BookOpen,
        colorTheme: 'purple',
        features: [
            'Key subject vocabulary',
            'Important terms',
            'Reading comprehension',
        ],
    },
    {
        id: 'GOVT',
        title: 'Government Exams',
        subtitle: 'SSC · Banking · UPSC · State PSC',
        icon: Landmark,
        colorTheme: 'blue',
        features: [
            'Previous-year vocabulary',
            'One-word substitutions',
            'Synonyms & antonyms',
        ],
    },
    {
        id: 'DEFENCE',
        title: 'Defence Exams',
        subtitle: 'CDS · NDA · AFCAT',
        icon: ShieldCheck,
        colorTheme: 'green',
        features: [
            'Defence-specific vocabulary',
            'Previous-year words',
            'Synonyms & antonyms',
        ],
    },
];

// ── Sub-tabs for Exam detail view ──
const SUB_TABS = [
    { id: 'vocabulary', title: 'Vocabulary', icon: BookOpen },
    { id: 'foreign-words', title: 'Foreign Words', icon: Globe },
    { id: 'idioms-and-phrases', title: 'Idioms & Phrases', icon: MessageSquare },
    { id: 'one-word-sub', title: 'One Word Sub.', icon: PenTool },
    { id: 'phrasal-verbs', title: 'Phrasal Verbs', icon: LinkIcon },
];

export default function CuetFocusPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const examParam = searchParams.get('exam');

    const [selectedExamId, setSelectedExamId] = useState<string | null>(examParam || null);
    const [cards, setCards] = useState<VocabCardType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('vocabulary');
    const [selectedYear, setSelectedYear] = useState('All Years');
    const [searchQuery, setSearchQuery] = useState('');
    const [openCard, setOpenCard] = useState<VocabCardType | null>(null);

    // Pagination states
    const [page, setPage] = useState(0);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    // Sync selectedExamId from searchParams
    useEffect(() => {
        const ex = searchParams.get('exam');
        if (ex) {
            setSelectedExamId(ex);
        }
    }, [searchParams]);

    const handleSelectExam = (examId: string) => {
        setSelectedExamId(examId);
        setSearchParams({ exam: examId }, { replace: true });
        setPage(0);
    };

    const handleBackToExamFocus = () => {
        setSelectedExamId(null);
        setSearchParams({}, { replace: true });
    };

    // Load vocabs for selected exam
    useEffect(() => {
        if (!selectedExamId) return;

        const loadExamVocabs = async () => {
            setIsLoading(true);
            try {
                const tagToFetch = selectedExamId === 'CUET' ? 'CUET' : selectedExamId;
                const response = await vocabApi.filterVocabByUseCaseTag(tagToFetch, page, pageSize, 'id');
                setCards(response.content || []);
                setTotalPages(response.totalPages || 1);
            } catch (error) {
                console.error('[ExamFocus] Failed to fetch vocabs:', error);
                setCards([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadExamVocabs();
    }, [selectedExamId, page, pageSize]);

    // Filter cards by search, active sub-tab, and year filter
    const filteredCards = useMemo(() => {
        return cards.filter((card) => {
            // Year filter matching
            if (selectedYear && selectedYear !== 'All Years') {
                const tagStr = (card.vocab.useCaseTag || '').toLowerCase();
                const yearStr = selectedYear.toLowerCase();
                const tagsStr = (card.vocab as any).tags ? String((card.vocab as any).tags).toLowerCase() : '';
                const combined = `${tagStr} ${tagsStr}`;

                if (combined.includes('202') || combined.includes('201')) {
                    if (!combined.includes(yearStr)) return false;
                }
            }

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                card.vocab.vocab.toLowerCase().includes(q) ||
                card.vocab.meaning.toLowerCase().includes(q) ||
                (card.vocab.trick && card.vocab.trick.toLowerCase().includes(q));

            if (!matchesSearch) return false;

            const typeUpper = (card.vocab.vocabType || '').toUpperCase();
            if (activeTab === 'idioms-and-phrases' && typeUpper !== 'IDIOM' && typeUpper !== 'PHRASE') return false;
            if (activeTab === 'one-word-sub' && typeUpper !== 'WORD') return false;
            if (activeTab === 'phrasal-verbs' && typeUpper !== 'PHRASE') return false;
            if (activeTab === 'foreign-words' && typeUpper !== 'FOREIGN') return false;

            return true;
        });
    }, [cards, searchQuery, activeTab, selectedYear]);

    const currentExam = EXAM_CATEGORIES.find((e) => e.id === selectedExamId) || EXAM_CATEGORIES[1];

    return (
        <div className="w-full flex flex-col gap-6 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">
            {/* ─── LEVEL 1: CHOOSE YOUR EXAM FOCUS ─── */}
            {!selectedExamId ? (
                <div className="dash-element flex flex-col gap-8 w-full">
                    {/* Header */}
                    <div>
                        <h1 className="font-bricolage text-3xl font-extrabold text-[#0f172a] dark:text-[#f8fafc] leading-tight m-0">
                            Choose Your Exam Focus
                        </h1>
                        <p className="font-inter text-[14px] text-[#64748b] dark:text-ink-soft mt-1.5 font-medium">
                            Pick a category and start your preparation journey.
                        </p>
                    </div>

                    {/* 2x2 Grid of ExploreExamCards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {EXAM_CATEGORIES.map((exam) => (
                            <ExploreExamCard
                                key={exam.id}
                                exam={exam}
                                onClick={() => handleSelectExam(exam.id)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                /* ─── LEVEL 2: EXAM VOCABULARY HUB ─── */
                <div className="dash-element flex flex-col gap-6 w-full">
                    {/* Back button & Exam Badge */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <button
                            onClick={handleBackToExamFocus}
                            className="flex items-center gap-2 font-inter font-bold text-[14px] text-[#ea580c] hover:underline cursor-pointer bg-transparent border-none"
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} />
                            <span>Back to Exam Focus</span>
                        </button>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f3e8ff] dark:bg-purple-950/40 border border-[#e9d5ff] dark:border-purple-800/40 text-[#9333ea] dark:text-purple-300 font-inter font-bold text-[14px] shadow-2xs">
                            <span>🎓</span>
                            <span>{currentExam.title}</span>
                        </div>
                    </div>

                    {/* Top Controls Row: Search Bar, Reel Mode, Year Filter */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full max-w-[500px]">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-ink-soft" />
                            <input
                                type="text"
                                placeholder="Search words (e.g. obstinate, meticulous, ubiquitous...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/90 dark:bg-[#18181b] rounded-2xl py-3 pl-11 pr-10 font-inter text-[14px] text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8] dark:placeholder:text-ink-soft/70 border border-black/5 dark:border-white/10 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-[#f97316]/40 dark:focus:border-white/20 transition-all"
                            />
                            <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-ink-soft" />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                            {/* Practice Reel Launcher */}
                            <PracticeSessionLauncher
                                cards={filteredCards}
                                label="Reel Mode"
                            />

                            {/* Year Filter Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="appearance-none bg-white/90 dark:bg-[#18181b] border border-black/5 dark:border-white/10 rounded-2xl py-3 pl-4 pr-10 font-inter font-bold text-[14px] text-[#0f172a] dark:text-[#f8fafc] shadow-xs cursor-pointer focus:outline-none dark:hover:border-white/25"
                                >
                                    <option value="All Years" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">All Years</option>
                                    <option value="2024" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2024</option>
                                    <option value="2023" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2023</option>
                                    <option value="2022" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2022</option>
                                    <option value="2021" className="bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#f8fafc]">2021</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#f8fafc] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Sub-tabs Row */}
                    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {SUB_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl font-inter text-[14px] font-bold transition-all cursor-pointer border ${isActive
                                            ? 'bg-[#fff3e0] dark:bg-orange-500/15 border-[#f97316]/30 dark:border-orange-500/30 text-[#ea580c] dark:text-orange-400 shadow-xs'
                                            : 'bg-white/80 dark:bg-[#18181b] border-black/5 dark:border-white/10 text-[#64748b] dark:text-[#a1a1aa] hover:text-[#0f172a] dark:hover:text-[#f8fafc] hover:bg-white dark:hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={16} className={isActive ? 'text-[#ea580c] dark:text-orange-400' : 'text-[#64748b] dark:text-[#a1a1aa]'} />
                                    {tab.title}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid of ExamVocabCard components */}
                    {isLoading ? (
                        <div className="w-full bg-white/80 dark:bg-[#18181b] rounded-2xl p-16 text-center border border-black/5 dark:border-white/10 shadow-xs flex flex-col items-center justify-center gap-3">
                            <RefreshCw size={24} className="animate-spin text-[#f97316]" />
                            <p className="font-inter text-xs text-[#64748b] dark:text-ink-soft">Loading vocabulary entries...</p>
                        </div>
                    ) : filteredCards.length === 0 ? (
                        <div className="w-full bg-white/80 dark:bg-[#18181b] rounded-2xl p-12 text-center border border-black/5 dark:border-white/10 shadow-xs">
                            <p className="font-inter text-[#64748b] dark:text-[#a1a1aa] mb-2">
                                {searchQuery.trim()
                                    ? `No vocabulary entries found matching "${searchQuery}".`
                                    : 'No vocabulary entries found for this category.'}
                            </p>
                            {searchQuery.trim() && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-[#f97316] font-inter text-[13px] font-semibold hover:underline bg-transparent border-none cursor-pointer"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
                            {filteredCards.map((card, idx) => {
                                const yearNum = 2024 - (idx % 4);
                                return (
                                    <ShrinkVocabCard
                                        key={card.vocab.id}
                                        vocabCard={card}
                                        tag={`${currentExam.id} ${yearNum}`}
                                        onClick={() => setOpenCard(card)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center items-center gap-4 font-inter text-[13px] font-bold">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0 || isLoading}
                                className="font-inter font-bold text-[13px] text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not(:disabled):bg-[#f97316] hover:not(:disabled):text-white hover:not(:disabled):border-[#f97316] shadow-2xs"
                            >
                                Previous
                            </button>
                            <span className="text-[#64748b] dark:text-ink-soft px-2">
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1 || isLoading}
                                className="font-inter font-bold text-[13px] text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not(:disabled):bg-[#f97316] hover:not(:disabled):text-white hover:not(:disabled):border-[#f97316] shadow-2xs"
                            >
                                Next
                            </button>
                        </div>
                    )}
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
