import { useEffect, useRef, useState } from 'react';
import { Search, BookOpen, Sparkles, RefreshCw, Brain } from 'lucide-react';

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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col items-center">
        
        {/* Header Content */}
        <div className="max-w-[700px] w-full text-center mb-6">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-4">
            Zero Admin
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-6">
            You learn. VocabMitra does the organising.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65]">
            No saving words, no building decks, no review schedules to babysit.
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative mt-20 w-full max-w-[1100px] mx-auto flex flex-col md:grid md:grid-cols-5 gap-10 md:gap-4 px-2 md:px-0">
          
          {/* Desktop Line */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] border-b-2 border-dashed border-ink/20" />
          <div 
            className="hidden md:block absolute top-8 left-[10%] h-[3px] bg-upsc transition-all duration-[2000ms] ease-out z-0"
            style={{ width: isVisible ? '80%' : '0%' }}
          />

          {/* Mobile Line */}
          <div className="md:hidden absolute top-8 bottom-8 left-12 w-[2px] border-l-2 border-dashed border-ink/20" />
          <div 
            className="md:hidden absolute top-8 left-12 w-[3px] bg-upsc transition-all duration-[2000ms] ease-out z-0"
            style={{ height: isVisible ? 'calc(100% - 64px)' : '0%' }}
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div 
                key={step.title}
                className={`relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6 md:gap-0 transition-all duration-700 ease-out transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                {/* Icon Box */}
                <div 
                  className={`w-16 h-16 shrink-0 rounded-2xl border-2 border-ink flex items-center justify-center shadow-[4px_4px_0_var(--ink)] md:mb-6 relative z-10 ml-4 md:ml-0 md:mx-auto transition-colors duration-500 ${
                    isVisible ? 'bg-white' : 'bg-cream-card'
                  }`}
                  style={{ transitionDelay: `${index * 300 + 300}ms` }}
                >
                  <Icon 
                    className={`w-7 h-7 transition-colors duration-500 ${
                      isVisible ? 'text-upsc' : 'text-ink/30'
                    }`}
                    style={{ transitionDelay: `${index * 300 + 300}ms` }} 
                  />
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
