import { useState, useEffect } from 'react';
import { useVocabStore } from '../store/useVocabStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VocabCard } from '../components/vocab/VocabCard';
import { OpenVocabCard } from '../components/vocab/OpenVocabCard';
import { CategoryBadge } from '../components/vocab/CategoryBadge';
import { parseUseCaseTags } from '../types';
import type { VocabCard as VocabCardType } from '../types';
import { vocabApi } from '../api/endpoints/vocab.api';
import { HeroSection } from '../components/layout/HeroSection';
import { ExamFocusSection } from '../components/layout/ExamFocusSection';
import { ProblemSection } from '../components/layout/ProblemSection';
import { SolutionSection } from '../components/layout/SolutionSection';
import { LearningScreenSection } from '../components/layout/LearningScreenSection';
import { HomeScreenSection } from '../components/layout/HomeScreenSection';
import { ProcessSection } from '../components/layout/ProcessSection';
import { PracticeSection } from '../components/layout/PracticeSection';
import { PracticeSystemSection } from '../components/layout/PracticeSystemSection';
import { VocabularySection } from '../components/layout/VocabularySection';
import { TransformationSection } from '../components/layout/TransformationSection';
import { CtaSection } from '../components/layout/CtaSection';
import { useGSAP } from '@gsap/react';
import { logger } from '../utils/logger';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const navigate = useNavigate();
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  const { vocabList, upsertVocabCards } = useVocabStore();

  const [wordOfTheDayId, setWordOfTheDayId] = useState<number | null>(null);
  const [previewCardIds, setPreviewCardIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await vocabApi.getVocabList({ size: 7 });
        if (res.content.length > 0) {
          upsertVocabCards(res.content);
          setWordOfTheDayId(res.content[0].vocab.id);
          setPreviewCardIds(res.content.slice(1, 7).map(c => c.vocab.id));
        }
      } catch (err) {
        logger.error('Failed to fetch home data:', err);
      }
    };
    fetchHomeData();
  }, [upsertVocabCards]);

  const wordOfTheDay = vocabList.find(c => c.vocab.id === wordOfTheDayId) || null;
  const previewCards = previewCardIds.map(id => vocabList.find(c => c.vocab.id === id)).filter(Boolean) as VocabCardType[];

  useGSAP(() => {
    // Word of the day section
    gsap.fromTo(
      '.wod-reveal-header',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.wod-reveal-header', start: 'top 85%' } }
    );
    gsap.fromTo(
      '.wod-entry-card',
      { y: 40, opacity: 0, rotationX: 10 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.wod-entry-card', start: 'top 85%' } }
    );

    // Preview grid section
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.preview-grid-section', start: 'top 80%' } });
    tl.fromTo('.preview-header', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
      .fromTo('.catalog-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.1 }, '-=0.3')
      .fromTo('.preview-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  });

  const wodTags = wordOfTheDay ? parseUseCaseTags(wordOfTheDay.vocab.useCaseTag) : [];
  const mainTag = wodTags[0]?.toLowerCase() || 'ink';
  const wodColor = `var(--${mainTag}, var(--ink))`;

  return (
    <div className="relative bg-transparent">
      <Navbar />

      <main>
        {/* ══════════════════ HERO ══════════════════ */}
        <HeroSection />

        {/* ══════════════════ EXAM FOCUS ══════════════════ */}
        <ExamFocusSection />

        {/* ══════════════════ THE REAL PROBLEM ══════════════════ */}
        <div id="problem-anchor" aria-hidden="true" />
        <ProblemSection />

        {/* ══════════════════ THE SOLUTION ══════════════════ */}
        <div id="solution-anchor" aria-hidden="true" />
        <SolutionSection />

        {/* ══════════════════ THE LEARNING SCREEN ══════════════════ */}
        <LearningScreenSection />

        {/* ══════════════════ YOUR HOME SCREEN ══════════════════ */}
        <HomeScreenSection />

        {/* ══════════════════ ZERO ADMIN PROCESS ══════════════════ */}
        <ProcessSection />

        {/* ══════════════════ PRACTICE ══════════════════ */}
        <div id="practice-anchor" aria-hidden="true" />
        <PracticeSection />

        {/* ══════════════════ ONE PRACTICE SYSTEM ══════════════════ */}
        <PracticeSystemSection />

        {/* ══════════════════ MY VOCABULARY ══════════════════ */}
        <VocabularySection />

        {/* ══════════════════ WORD OF THE DAY ══════════════════ */}
        <div id="cta-anchor" aria-hidden="true" />
        {wordOfTheDay && (
          <section
            id="wod"
            className="w-full pt-[30px] px-7 pb-[90px]"
            aria-label="Word of the Day"
          >
            <div
              className="vv-container wod-reveal-header font-space text-xs font-bold tracking-[0.05em] uppercase text-neutral-500 mb-[18px]"
            >
              Card of the day · {wodTags[0]}
            </div>

            {/* WoD Card */}
            <div
              className="wod-entry-card wod-entry group border border-line rounded-2xl pt-[42px] px-[42px] pb-[36px] bg-cream-card cursor-pointer relative transition-all duration-[0.35s] ease-[var(--ease)] shadow-[0_8px_30px_var(--line)] hover:-translate-y-1 hover:shadow-[0_24px_60px_var(--line)] w-8/10 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wod-color)]"
              tabIndex={0}
              role="button"
              aria-label={`Open full entry for ${wordOfTheDay.vocab.vocab}`}
              onClick={() => setOpenCardId(wordOfTheDay.vocab.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenCardId(wordOfTheDay.vocab.id); }}
              style={{ '--wod-color': wodColor } as React.CSSProperties}
            >
              {/* "open entry" hint */}
              <div
                className="wod-open-hint absolute top-8 right-8 font-inter text-[12px] font-medium text-ink-soft flex items-center gap-1.5 bg-transparent border border-line rounded-lg py-1.5 px-3 opacity-0 transition-all duration-300 ease-[var(--ease-soft)] group-hover:opacity-100 group-hover:bg-line"
                aria-hidden="true"
              >
                open
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </div>

              {/* Headword row */}
              <div className="flex items-center gap-3.5 flex-wrap mb-2.5 ml-8">
                <div className="font-bricolage text-[clamp(36px,5vw,50px)] font-bold text-ink">
                  {wordOfTheDay.vocab.vocab}
                </div>
                {wodTags.map((tag) => (
                  <CategoryBadge key={tag} tag={tag} active />
                ))}
              </div>

              {/* Type & Phonetic */}
              <div className="font-space text-sm text-ink-soft mb-6 ml-8">
                / {wordOfTheDay.vocab.vocabType} /
              </div>

              {/* Meaning */}
              <div className="text-[19px] font-medium leading-[1.6] max-w-[48ch] mb-6 ml-8 text-ink-soft">
                {wordOfTheDay.vocab.meaning}
              </div>

              {/* Mnemonic */}
              <div className="ml-8 mb-6 max-w-[50ch] bg-orange-500/10 border border-orange-500/20 rounded-xl py-4 px-5">
                <div className="font-inter text-xs font-semibold tracking-wide uppercase text-orange-600 dark:text-orange-400 mb-1.5">
                  Memory Hook
                </div>
                <div className="font-inter font-medium text-[15px] text-ink leading-relaxed">
                  "{wordOfTheDay.vocab.trick}"
                </div>
              </div>

              {/* Example */}
              <div className="ml-8 mb-4 max-w-[50ch]">
                <div className="font-inter italic text-[15px] text-ink-soft leading-relaxed mb-2">
                  "{wordOfTheDay.vocab.example}"
                </div>
                <div className="font-space text-[10px] font-bold tracking-[0.08em] uppercase text-ink-soft opacity-60">
                  Example Usage
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════ TRANSFORMATION ══════════════════ */}
        <TransformationSection />

        {/* ══════════════════ PREVIEW GRID ══════════════════ */}
        <section
          className="preview-grid-section vv-container px-7 pb-[100px] mt-15"
          aria-label="Word preview"
        >
          <div className="preview-header flex justify-between items-baseline mb-6">
            <h2 className="font-bricolage text-[28px] font-bold text-ink m-0">
              From the deck
            </h2>
          </div>

          {/* 3-col grid */}
          <div
            className="catalog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]"
          >
            {previewCards.map((card) => (
              <div
                key={card.vocab.id}
                className="catalog-card"
              >
                <VocabCard
                  vocabCard={card}
                  onClick={() => setOpenCardId(card.vocab.id)}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="preview-cta flex justify-center mt-10">
            <button
              onClick={() => navigate('/vocabulary')}
              className="inline-flex items-center gap-2 font-inter font-bold text-sm text-white bg-orange-500 py-[13px] px-6 rounded-full border-none cursor-pointer transition-all duration-200 ease-[var(--ease)] hover:bg-orange-400 hover:shadow-[0_4px_24px_rgba(249,115,22,0.4)] hover:scale-[1.03]"
              id="see-all-words-cta"
              aria-label="See all vocabulary words"
            >
              See all words
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* ══════════════════ CTA SECTION ══════════════════ */}
        <CtaSection />

        {/* ══════════════════ MODAL ══════════════════ */}
        {openCardId && (
          <OpenVocabCard
            vocabCard={vocabList.find(c => c.vocab.id === openCardId)!}
            isOpen={!!openCardId}
            onClose={() => setOpenCardId(null)}
          />
        )}
      </main>

      <Footer />

    </div>
  );
}
