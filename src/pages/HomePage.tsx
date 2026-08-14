import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VocabCard } from '../components/vocab/VocabCard';
import { OpenVocabCard } from '../components/vocab/OpenVocabCard';
import { MOCK_WORD_OF_THE_DAY, MOCK_PREVIEW_CARDS } from '../api/mock/fixtures/vocabFixtures';
import { parseUseCaseTags } from '../types';
import type { VocabCard as VocabCardType } from '../types';
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

/* ─── Intersection Observer for scroll-reveal ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage() {
  const navigate = useNavigate();
  const [openCard, setOpenCard] = useState<VocabCardType | null>(null);

  useReveal();

  const wodTags = parseUseCaseTags(MOCK_WORD_OF_THE_DAY.vocab.useCaseTag);
  const mainTag = wodTags[0]?.toLowerCase() || 'ink';
  const wodColor = `var(--${mainTag}, var(--ink))`;

  return (
    <>
      <Navbar />

      <main>
        {/* ══════════════════ HERO ══════════════════ */}
        <HeroSection />

        {/* ══════════════════ EXAM FOCUS ══════════════════ */}
        <ExamFocusSection />

        {/* ══════════════════ THE REAL PROBLEM ══════════════════ */}
        <ProblemSection />

        {/* ══════════════════ THE SOLUTION ══════════════════ */}
        <SolutionSection />

        {/* ══════════════════ THE LEARNING SCREEN ══════════════════ */}
        <LearningScreenSection />

        {/* ══════════════════ YOUR HOME SCREEN ══════════════════ */}
        <HomeScreenSection />

        {/* ══════════════════ ZERO ADMIN PROCESS ══════════════════ */}
        <ProcessSection />

        {/* ══════════════════ PRACTICE ══════════════════ */}
        <PracticeSection />

        {/* ══════════════════ ONE PRACTICE SYSTEM ══════════════════ */}
        <PracticeSystemSection />

        {/* ══════════════════ MY VOCABULARY ══════════════════ */}
        <VocabularySection />

        {/* ══════════════════ WORD OF THE DAY ══════════════════ */}
        <section
          id="wod"
          className="vv-container pt-[30px] px-7 pb-[90px]"
          aria-label="Word of the Day"
        >
          <div
            className="reveal font-space text-xs font-bold tracking-[0.05em] uppercase text-ink-soft mb-[18px]"
          >
            Card of the day · {wodTags[0]}
          </div>

          {/* WoD Card */}
          <div
            className="reveal wod-entry group border-2 border-solid border-ink rounded-[20px] pt-[42px] px-[42px] pb-[36px] bg-cream-card cursor-pointer relative overflow-hidden transition-all duration-[0.35s] ease-[var(--ease)] shadow-[8px_8px_0_var(--wod-color)] hover:-translate-x-1 hover:-translate-y-1 hover:-rotate-[0.6deg] hover:shadow-[12px_12px_0_var(--wod-color)] active:translate-x-0 active:translate-y-0 active:rotate-0 active:shadow-[4px_4px_0_var(--wod-color)]"
            tabIndex={0}
            role="button"
            aria-label={`Open full entry for ${MOCK_WORD_OF_THE_DAY.vocab.vocab}`}
            onClick={() => setOpenCard(MOCK_WORD_OF_THE_DAY)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenCard(MOCK_WORD_OF_THE_DAY); }}
            style={{ '--wod-color': wodColor } as React.CSSProperties}
          >
            {/* Punch hole */}
            <div
              className="absolute top-5 left-5 w-4 h-4 rounded-full bg-cream border-2 border-solid border-ink"
              aria-hidden="true"
            />

            {/* "open entry" hint */}
            <div
              className="wod-open-hint absolute top-10 right-10 font-space text-[11px] font-bold text-ink flex items-center gap-1.5 bg-cream border-2 border-solid border-ink rounded-full py-1.5 px-3 opacity-0 -translate-y-1 rotate-4 transition-all duration-300 ease-[var(--ease-soft)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:rotate-0"
              aria-hidden="true"
            >
              open
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </div>

            {/* Headword row */}
            <div className="flex items-center gap-3.5 flex-wrap mb-2.5 ml-8">
              <div className="font-bricolage text-[clamp(36px,5vw,50px)] font-bold text-ink">
                {MOCK_WORD_OF_THE_DAY.vocab.vocab}
              </div>
              {wodTags.map((tag) => (
                <span
                  key={tag}
                  className="font-space text-xs font-bold text-white rounded-full py-1 px-3"
                  style={{ background: wodColor }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Type & Phonetic */}
            <div className="font-space text-sm text-ink-soft mb-6 ml-8">
              / {MOCK_WORD_OF_THE_DAY.vocab.vocabType} /
            </div>

            {/* Meaning */}
            <div className="text-[19px] font-medium leading-[1.6] max-w-[48ch] mb-6 ml-8">
              {MOCK_WORD_OF_THE_DAY.vocab.meaning}
            </div>

            {/* Mnemonic (Margin note style) */}
            <div
              className="ml-8 mb-6 max-w-[50ch] bg-[color-mix(in_srgb,var(--wod-color)_12%,var(--cream-card))] border-2 border-dashed border-[var(--wod-color)] rounded-[14px] py-4 px-5"
            >
              <div className="font-space text-[11px] font-bold tracking-[0.05em] uppercase text-[var(--wod-color)] mb-1.5">
                Memory Hook
              </div>
              <div className="font-inter font-semibold text-base text-ink leading-[1.5]">
                "{MOCK_WORD_OF_THE_DAY.vocab.trick}"
              </div>
            </div>

            {/* Citation */}
            <div className="ml-8 border-l-[3px] border-solid border-ink pl-4 text-[15px] text-ink-soft italic max-w-[50ch]">
              "{MOCK_WORD_OF_THE_DAY.vocab.example}"
              <span className="block font-space not-italic text-[10.5px] font-bold tracking-[0.05em] uppercase mt-2 opacity-70">
                Example usage
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════ TRANSFORMATION ══════════════════ */}
        <TransformationSection />

        {/* ══════════════════ PREVIEW GRID ══════════════════ */}
        <section
          className="vv-container px-7 pb-[100px]"
          aria-label="Word preview"
        >
          <div className="reveal flex justify-between items-baseline mb-6">
            <h2 className="font-bricolage text-[28px] font-bold text-ink m-0">
              From the deck
            </h2>
          </div>

          {/* 3-col grid */}
          <div
            className="reveal catalog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]"
          >
            {MOCK_PREVIEW_CARDS.map((card, i) => (
              <div
                key={card.vocab.id}
                className="opacity-0"
                style={{
                  animation: `fadeUp 0.55s var(--ease) ${0.05 * i}s forwards`,
                }}
              >
                <VocabCard
                  vocabCard={card}
                  onClick={() => setOpenCard(card)}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal flex justify-center mt-10">
            <button
              onClick={() => navigate('/vocabulary')}
              className="inline-flex items-center gap-2 font-inter font-bold text-sm text-cream bg-ink py-[13px] px-6 rounded-full border-none cursor-pointer transition-all duration-200 ease-[var(--ease)] hover:scale-[1.04] hover:bg-upsc"
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

      </main>

      <Footer />

      {/* OpenVocabCard modal */}
      {openCard && (
        <OpenVocabCard
          vocabCard={openCard}
          isOpen={!!openCard}
          onClose={() => setOpenCard(null)}
        />
      )}

      {/* Interaction styles */}
      <style>{`
        /* Isometric Section Styles */
        .isometric-section.is-visible .iso-layer-top {
          transform: translateZ(90px);
        }

        /* Connecting Dashed Lines */
        .iso-line {
          position: absolute;
          width: 2px;
          height: 90px;
          background-image: linear-gradient(to bottom, var(--ink-soft) 50%, transparent 50%);
          background-size: 2px 10px;
          opacity: 0;
          transform-origin: bottom;
          transform: rotateX(-90deg) scaleY(0);
          transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease;
        }

        .isometric-section.is-visible .iso-line {
          opacity: 0.3;
          transform: rotateX(-90deg) scaleY(1);
        }

        .iso-line-tl { top: 38px; left: 38px; }
        .iso-line-tr { top: 38px; right: 38px; }
        .iso-line-bl { bottom: 38px; left: 38px; }
        .iso-line-br { bottom: 38px; right: 38px; }
      `}</style>
    </>
  );
}
