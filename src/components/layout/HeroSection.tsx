import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { WordReveal } from '../ui/WordReveal';
import { useAuthStore } from '../../store/useAuthStore';

// Floating vocabulary words — positions are % from top-left of section
const FLOATING_WORDS = [
  // Left side
  { word: 'OBSTINATE',  top: '72%', left: '2%',   color: 'orange', delay: 1.2, duration: 7 },
  { word: 'LASSITUDE',  top: '30%', left: '0%',   color: 'muted',  delay: 1.8, duration: 9 },
  { word: 'EPHEMERAL',  top: '88%', left: '5%',   color: 'muted',  delay: 2.4, duration: 8 },
  // Right side / bottom
  { word: 'ALACRITY',   top: '82%', right: '2%',  color: 'orange', delay: 1.5, duration: 10 },
  { word: 'CANDID',     top: '15%', right: '5%',  color: 'muted',  delay: 2.0, duration: 7  },
  { word: 'TENACIOUS',  top: '55%', right: '1%',  color: 'muted',  delay: 2.6, duration: 9  },
  // Bottom center-ish
  { word: 'PERSPICUOUS',top: '95%', left: '35%',  color: 'muted',  delay: 2.2, duration: 8  },
];

export function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated || Boolean(localStorage.getItem('vv-auth-token')) || Boolean(user);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.hero-headline',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    );

    tl.fromTo('.hero-subtext-word',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.015, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo('.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.2'
    );

    tl.fromTo('.hero-mascot',
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.2)' },
      0.3
    );

    // Staggered float-in for ambient words
    gsap.utils.toArray<HTMLElement>('.hero-float-word').forEach((el) => {
      const delay = parseFloat(el.dataset.delay || '1');
      gsap.fromTo(el,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 1.0, delay, ease: 'power2.out' }
      );

      // Continuous gentle float loop
      const dur = parseFloat(el.dataset.dur || '8');
      const yAmt = 8 + Math.random() * 8;
      gsap.to(el, {
        y: -yAmt,
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay + 0.5,
      });
    });

    // Mouse parallax for mascot
    const mascot = document.querySelector('.hero-mascot-img');
    let xTo: gsap.QuickToFunc;
    let yTo: gsap.QuickToFunc;

    if (mascot) {
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      const handleMouseMove = (e: MouseEvent) => {
        if (!mediaQuery.matches) return;
        if (!xTo) xTo = gsap.quickTo(mascot, 'x', { duration: 0.8, ease: 'power3' });
        if (!yTo) yTo = gsap.quickTo(mascot, 'y', { duration: 0.8, ease: 'power3' });
        const x = (e.clientX / window.innerWidth - 0.5) * -24;
        const y = (e.clientY / window.innerHeight - 0.5) * -24;
        xTo(x);
        yTo(y);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="vv-container relative z-10 flex items-center justify-between flex-wrap-reverse gap-10 pt-[70px] px-7 pb-[60px] overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Floating ambient vocabulary words ── */}
      {FLOATING_WORDS.map((fw) => (
        <span
          key={fw.word}
          className="hero-float-word absolute pointer-events-none select-none font-space font-bold tracking-[0.14em] text-[11px] sm:text-[12px] opacity-0"
          style={{
            top: fw.top,
            left: 'left' in fw ? (fw as any).left : undefined,
            right: 'right' in fw ? (fw as any).right : undefined,
            color: fw.color === 'orange'
              ? 'rgba(249,115,22,0.55)'
              : 'rgba(255,255,255,0.13)',
          }}
          data-delay={fw.delay}
          data-dur={fw.duration}
          aria-hidden="true"
        >
          {fw.word}
        </span>
      ))}

      {/* Left Column (Text & CTAs) */}
      <div className="max-w-[640px] flex-[1_1_500px] relative z-10">
        {/* Headline */}
        <h1
          className="hero-headline font-bricolage text-[clamp(46px,5vw,82px)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-ink opacity-0"
        >
          <span className="block">Learn tough words.</span>
          <span className="block text-orange-500">Remember them</span>
          <span className="block">long after the exam.</span>
        </h1>

        {/* Subtext */}
        <p className="text-[clamp(18px,2vw,22px)] leading-relaxed text-ink-soft max-w-[52ch] mb-10 font-medium">
          <WordReveal
            text="VocabMitra turns difficult exam words into mnemonics you can't forget, then quietly brings them back for practice until they stick."
            wordClassName="hero-subtext-word opacity-0"
          />
        </p>

        {/* Action Buttons */}
        <div
          className="hero-cta flex items-center flex-wrap gap-5 max-w-[500px] mb-8 opacity-0"
        >
          <button
            onClick={() => navigate(isLoggedIn ? '/profile' : '/auth')}
            className="flex items-center justify-center whitespace-nowrap py-3.5 px-8 rounded-full bg-orange-500 text-white text-lg font-bold font-inter border-none cursor-pointer shadow-[0_8px_32px_rgba(249,115,22,0.35)] transition-all duration-200 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-[0_12px_40px_rgba(249,115,22,0.45)]"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get started for free'}
          </button>
          <p className="text-[15px] font-medium text-ink-soft leading-snug max-w-[220px]">
            Built for SSC, Banking, CUET &amp; UPSC aspirants
          </p>
        </div>
      </div>

      {/* Right Column (Mascot) */}
      <div
        className="hero-mascot flex-[1_1_400px] relative flex justify-center items-center min-h-[500px] opacity-0 max-[900px]:mt-10"
      >
        <div className="hero-mascot-img relative">
          <img
            src="/images/fox_study.png"
            alt="Vocab Mitra Fox Study"
            className="w-full max-w-[560px] h-auto object-contain z-10 drop-shadow-[0_24px_48px_rgba(0,0,0,0.4)] relative"
          />
          
          {/* Mnemonic Floating Card Overlay */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 sm:-bottom-8 rounded-2xl p-5 z-20 w-[280px] sm:w-[320px] backdrop-blur-xl pointer-events-none"
            style={{
              background: 'var(--vocab-card-bg)',
              border: '1px solid var(--vocab-card-border)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ color: 'var(--vocab-card-title)' }} className="font-bricolage font-bold text-lg mb-0.5 tracking-wide uppercase">LASSITUDE</h3>
            <p className="text-ink-soft text-sm mb-4">Tiredness / lack of energy</p>
            <div
              className="rounded-xl py-3 px-3.5 flex items-start gap-2.5"
              style={{ background: 'var(--mnemonic-bg)', border: '1px solid var(--mnemonic-border)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0 mt-0.5">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
              </svg>
              <p style={{ color: 'var(--mnemonic-text)' }} className="text-[13.5px] font-medium leading-snug">
                "Lassi pi ke nind aati hai."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
