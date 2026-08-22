import { useRef } from 'react';
import { Search, BookOpen, Sparkles, RefreshCw, Brain } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const STEPS = [
  {
    icon: Search,
    title: 'Search',
    description: 'Meet a word anywhere — look it up in a tap.'
  },
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Meaning, mnemonic, example, in one screen.'
  },
  {
    icon: Sparkles,
    title: 'Saved automatically',
    description: 'It enters your vocabulary. No decks.'
  },
  {
    icon: RefreshCw,
    title: 'Practice',
    description: 'It returns as a flashcard at the right time.'
  },
  {
    icon: Brain,
    title: 'Remember',
    description: 'Recall it in the exam hall, not just today.'
  }
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    // Create a synchronized timeline triggered when the section enters the viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.process-container',
        start: 'top 80%', // Triggers as soon as it's 20% visible
      }
    });

    // 1. Fade in the steps sequentially
    const steps = gsap.utils.toArray('.process-step');
    tl.fromTo(steps,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
      }
    );

    // 2. Draw the line
    const lineTarget = isDesktop ? '.process-line-desktop' : '.process-line-mobile';
    const lineProp = isDesktop ? 'width' : 'height';
    const lineEndValue = isDesktop ? '80%' : 'calc(100% - 64px)';

    tl.fromTo(lineTarget,
      { [lineProp]: '0%' },
      {
        [lineProp]: lineEndValue,
        duration: 1.5,
        ease: 'power1.inOut',
      },
      '-=0.2'
    );

    // 3. Highlight the icons sequentially to match the line drawing
    const iconBoxes = gsap.utils.toArray('.process-icon-box');
    const icons = gsap.utils.toArray('.process-icon');

    // 1.5 seconds / 5 steps = 0.3s stagger
    tl.to(iconBoxes, {
      borderColor: '#8B5CF6', // Violet
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
      duration: 0.4,
      stagger: 0.3,
    }, '<'); // '<' aligns the start with the line animation

    tl.to(icons, {
      color: '#10B981', // Green
      duration: 0.4,
      stagger: 0.3,
    }, '<');

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-15 overflow-hidden" style={{ perspective: '1200px', background: 'var(--section-bg-2)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }} >
      <div className="vv-container flex flex-col items-center">

        {/* Header Content */}
        <div className="max-w-[900px] w-full text-center mb-6">
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em]">
            You learn.
          </h2>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-6">
            VocabMitra does the organising.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65]">
            No saving words, no building decks, no review schedules to babysit.
          </p>
        </div>

        {/* Process Flow */}
        <div className="process-container relative mt-10 w-full max-w-[1100px] mx-auto flex flex-col md:grid md:grid-cols-5 gap-10 md:gap-0 px-2 md:px-0">

          {/* Desktop connecting line (track) */}
          <div className="hidden md:block absolute top-[30px] left-[10%] right-[10%] h-[4px] bg-line rounded-full" />
          {/* Desktop fill line */}
          <div className="process-line-desktop hidden md:block absolute top-[30px] left-[10%] h-[4px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 z-0 w-0 rounded-full" />

          {/* Mobile line (track) */}
          <div className="md:hidden absolute top-8 bottom-8 left-[46px] w-[4px] bg-line rounded-full" />
          {/* Mobile fill line */}
          <div className="process-line-mobile md:hidden absolute top-8 left-[46px] w-[4px] bg-gradient-to-b from-violet-500 via-fuchsia-500 to-emerald-400 z-0 h-0 rounded-full" />

          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="process-step relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6 md:gap-0 opacity-0 px-2"
              >
                {/* Circular Icon — dark with subtle border */}
                <div className="process-icon-box w-16 h-16 shrink-0 rounded-full border-2 border-line bg-cream-card flex items-center justify-center md:mb-6 relative z-10 ml-4 md:mx-auto transition-all duration-300">
                  <Icon className="process-icon w-7 h-7 text-ink-soft transition-colors duration-300" />
                </div>

                {/* Text */}
                <div className="pt-1 md:pt-0">
                  <h4 className="font-bricolage text-[19px] sm:text-[20px] font-bold text-ink mb-1.5 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[14px] sm:text-[14.5px] text-ink-soft font-medium leading-snug md:px-2">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
