import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { WordReveal } from '../ui/WordReveal';
import { useAuthStore } from '../../store/useAuthStore';

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated || Boolean(localStorage.getItem('vv-auth-token')) || Boolean(user);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      }
    });

    tl.fromTo('.cta-subtext-word',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'power2.out' }
    );

    tl.fromTo(buttonRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' },
      '-=0.2'
    );

    tl.fromTo('.cta-fox',
      { opacity: 0, x: 40, y: 40 },
      { opacity: 1, x: 0, y: 0, duration: 1, ease: 'power3.out' },
      0.2
    );

    // Magnetic button
    if (buttonRef.current && window.matchMedia('(min-width: 768px)').matches) {
      const btn = buttonRef.current;
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        xTo(x);
        yTo(y);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-transparent py-20 sm:py-32 overflow-hidden" style={{ perspective: '1200px', background: 'var(--section-bg-2)', borderTop: '1px solid var(--section-border)', borderBottom: '1px solid var(--section-border)' }}>
      <div className="vv-container flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">

        {/* Left Column: Text */}
        <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-bricolage text-[clamp(40px,6vw,64px)] font-extrabold text-ink leading-[1.05] tracking-[-0.03em] mb-6">
            Build a vocabulary you actually remember.
          </h2>
          <p className="text-[18px] sm:text-[20px] text-ink-soft font-medium leading-[1.6] max-w-[480px] mb-10">
            <WordReveal
              text="Start with one word today. VocabMitra will keep it alive until exam day."
              wordClassName="cta-subtext-word opacity-0"
            />
          </p>
          <button
            ref={buttonRef}
            onClick={() => navigate(isLoggedIn ? '/profile' : '/auth')}
            className="inline-flex items-center justify-center px-10 py-4 sm:py-5 bg-orange-500 text-white font-bold text-[18px] sm:text-[20px] rounded-full border-none cursor-pointer shadow-[0_8px_40px_rgba(249,115,22,0.45)] hover:bg-orange-400 hover:shadow-[0_12px_48px_rgba(249,115,22,0.55)] active:scale-[0.98] transition-all duration-200"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get started for free'}
          </button>
        </div>

        {/* Right Column: Mascot Image */}
        <div className="w-full md:w-[40%] flex justify-center md:justify-end">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
            <div className="animate-[floaty_6s_ease-in-out_infinite]">
              <img
                src="/images/fox_confidence.png"
                alt="Confident Fox Mascot"
                className="cta-fox w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] opacity-0"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
