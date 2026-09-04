import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const EXAM_CARDS = [
  {
    id: 'ssc',
    title: 'SSC',
    desc: 'Best system for competitive exams.',
    img: '/images/ssc_logo.png'
  },
  {
    id: 'banking',
    title: 'Banking',
    desc: 'Boost scores in bank exams.',
    img: '/images/banking_logo.png'
  },
  {
    id: 'cuet',
    title: 'CUET',
    desc: 'Curated for university entrances.',
    img: '/images/cuet_logo.png'
  },
  {
    id: 'upsc',
    title: 'UPSC',
    desc: 'Master vocabulary for top exams.',
    img: '/images/upsc_logo.png'
  }
];

export function ExamFocusSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    tl.fromTo('.exam-label',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo('.exam-card',
      { opacity: 0, scale: 0.85, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.5)' },
      '-=0.3'
    );

    tl.fromTo('.exam-footer',
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-20" style={{ background: 'var(--section-bg-1)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col items-center justify-center">
        {/* Heading */}
        <h2 className="exam-label font-bricolage text-3xl md:text-[40px] font-bold text-ink text-center mb-16 leading-[1.1] tracking-[-0.02em] opacity-0 uppercase">
          MADE FOR YOUR EXAMS!
        </h2>

        {/* Exam Cards Grid */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-12 lg:gap-x-16 mb-14 w-full">
          {EXAM_CARDS.map((exam) => (
            <div key={exam.id} className="exam-card flex flex-col items-center text-center opacity-0">
              {/* Squircle Card */}
              <div
                className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-[2rem] shadow-xl flex flex-col justify-center items-center mb-4 transition-transform hover:-translate-y-1 duration-300"
                style={{ background: 'var(--exam-icon-bg)', border: '1px solid var(--exam-icon-border)' }}
              >
                <img 
                  src={exam.img} 
                  alt={`${exam.title} Logo`} 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-2.5 rounded-full bg-white/5 p-1"
                />
                <span className="font-bricolage font-bold text-ink tracking-wide text-[15px] sm:text-base">
                  {exam.title}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-ink-soft text-[13px] sm:text-[14px] leading-snug max-w-[130px] sm:max-w-[150px] font-medium">
                {exam.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <p className="exam-footer text-ink-soft text-[13px] md:text-sm text-center font-semibold font-space uppercase tracking-[0.05em] opacity-0">
          One-word substitutions, idioms, phrasal verbs and foreign words — all exam-weighted.
        </p>
      </div>
    </section>
  );
}
