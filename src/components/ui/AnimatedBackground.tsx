import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../../hooks/useTheme';

/**
 * BLOB DESIGN
 * -----------
 * Each blob has a `pageY` — its "home" position along the full document (in px).
 * In the rAF loop:
 *   transform = translateY(pageY - scrollY * parallaxFactor)
 *
 * - parallaxFactor < 1 → blob scrolls slower than content → drifts upward relative to page
 * - Different factors per blob = layered depth effect
 *
 * All blobs start at `top: 0, left: X` in the fixed container and are
 * repositioned via transform — so they span the entire page height.
 */
const BLOBS = [
  // ── Hero (top of page) ──────────────────────────────────────
  {
    id: 'blob-0',
    pageY: -100,
    left: 'auto', right: '-8%',
    width: '900px', height: '900px',
    background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 65%)',
    parallaxFactor: 0.40,
  },
  // ── Exam Focus (new) ────────────────────────────────────────
  {
    id: 'blob-5',
    pageY: 700,
    left: '15%', right: 'auto',
    width: '650px', height: '650px',
    background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)',
    parallaxFactor: 0.65,
  },
  // ── Problem / Solution ──────────────────────────────────────
  {
    id: 'blob-1',
    pageY: 1400,
    left: '-12%', right: 'auto',
    width: '780px', height: '780px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 65%)',
    parallaxFactor: 0.55,
  },
  // ── Solution 2 (new) ────────────────────────────────────────
  {
    id: 'blob-6',
    pageY: 2100,
    left: 'auto', right: '5%',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)',
    parallaxFactor: 0.35,
  },
  // ── Process / Practice ──────────────────────────────────────
  {
    id: 'blob-2',
    pageY: 2900,
    left: 'auto', right: '-10%',
    width: '720px', height: '720px',
    background: 'radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 65%)',
    parallaxFactor: 0.48,
  },
  // ── Mid page left (new) ─────────────────────────────────────
  {
    id: 'blob-7',
    pageY: 3600,
    left: '-5%', right: 'auto',
    width: '850px', height: '850px',
    background: 'radial-gradient(circle, rgba(234,179,8,0.14) 0%, transparent 65%)',
    parallaxFactor: 0.70,
  },
  // ── Vocabulary / Practice System ────────────────────────────
  {
    id: 'blob-3',
    pageY: 4300,
    left: '-8%', right: 'auto',
    width: '700px', height: '700px',
    background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)',
    parallaxFactor: 0.60,
  },
  // ── Deep scroll right (new) ─────────────────────────────────
  {
    id: 'blob-8',
    pageY: 5100,
    left: 'auto', right: '12%',
    width: '650px', height: '650px',
    background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 65%)',
    parallaxFactor: 0.45,
  },
  // ── CTA / WoD ───────────────────────────────────────────────
  {
    id: 'blob-4',
    pageY: 5800,
    left: 'auto', right: '-12%',
    width: '860px', height: '860px',
    background: 'radial-gradient(circle, rgba(249,115,22,0.20) 0%, transparent 65%)',
    parallaxFactor: 0.50,
  },
  // ── Footer / Bottom (new) ───────────────────────────────────
  {
    id: 'blob-9',
    pageY: 6800,
    left: '10%', right: 'auto',
    width: '900px', height: '900px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)',
    parallaxFactor: 0.55,
  },
  // ── Very Bottom (new) ───────────────────────────────────────
  {
    id: 'blob-10',
    pageY: 7800,
    left: 'auto', right: '0%',
    width: '750px', height: '750px',
    background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)',
    parallaxFactor: 0.40,
  }
];

export function AnimatedBackground() {
  const { isDark } = useTheme();
  const glowRef = useRef<HTMLDivElement>(null);

  // ── Page-space parallax via rAF ─────────────────────────────────────────
  useEffect(() => {
    if (!isDark) return;

    let raf: number;

    const tick = () => {
      const sy = window.scrollY;
      BLOBS.forEach((blob) => {
        const el = document.getElementById(blob.id);
        if (!el) return;
        const y = blob.pageY - sy * blob.parallaxFactor;
        // Use gsap.set instead of style.transform so it merges with GSAP's scale animation
        gsap.set(el, { y });
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    tick(); // set initial position immediately

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isDark]);

  // ── GSAP: fade-in on load + mouse glow ─────────────────────────────────
  useGSAP(() => {
    if (!isDark) return;

    // Staggered blob reveal
    BLOBS.forEach((blob, i) => {
      gsap.fromTo(`#${blob.id}`,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 1.8, delay: i * 0.12, ease: 'power3.out' }
      );
    });

    // Mouse-following glow
    if (!glowRef.current) return;
    gsap.set(glowRef.current, { xPercent: -50, yPercent: -50 });

    const mm = window.matchMedia('(pointer: fine)');
    if (mm.matches) {
      const glow = glowRef.current;
      const xTo = gsap.quickTo(glow, 'left', { duration: 1.0, ease: 'power3' });
      const yTo = gsap.quickTo(glow, 'top', { duration: 1.0, ease: 'power3' });
      const onMove = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }
  }, [isDark]);

  return (
    // Fixed layer = stays behind all content, covers viewport
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-cream transition-colors duration-700">

      {/* Blobs — dark mode only */}
      {isDark && BLOBS.map((blob) => (
        <div
          key={blob.id}
          id={blob.id}
          className="absolute rounded-full opacity-0 will-change-transform"
          style={{
            top: 0,
            left: blob.left,
            right: blob.right,
            width: blob.width,
            height: blob.height,
            background: blob.background,
            filter: 'blur(90px)',
          }}
        />
      ))}

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '50%',
          left: '50%',
        }}
      />
    </div>
  );
}
