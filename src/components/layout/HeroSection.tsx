import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="vv-container relative flex items-center justify-between flex-wrap-reverse gap-10 pt-[50px] px-7 pb-[60px]"
      aria-label="Hero"
    >
      {/* Left Column (Text & CTAs) */}
      <div className="max-w-[640px] flex-[1_1_500px]">
        {/* Headline */}
        <h1
          className="font-bricolage text-[clamp(46px,5vw,82px)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-ink opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          Learn tough words.<br />
          <span className="text-upsc">Remember them</span><br />
          long after the exam.
        </h1>

        {/* Subtext */}
        <p
          className="text-[clamp(18px,2vw,22px)] leading-relaxed text-ink-soft max-w-[52ch] mb-10 font-medium opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          VocabMitra turns difficult exam words into mnemonics you can't forget, then quietly brings them back for practice until they stick.
        </p>

        {/* Action Buttons */}
        <div
          className="flex items-center flex-wrap gap-5 max-w-[500px] mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center justify-center whitespace-nowrap py-3.5 px-8 rounded-full bg-upsc text-white text-lg font-bold font-inter border-none cursor-pointer shadow-[0_8px_24px_rgba(234,88,12,0.25)] transition-all duration-200 ease-[var(--ease)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(234,88,12,0.35)]"
          >
            Get Started
          </button>
          <p className="text-[15px] font-medium text-ink-soft leading-snug max-w-[220px]">
            Built for SSC, Banking, CUET & UPSC aspirants
          </p>
        </div>
      </div>

      {/* Right Column (Mascot & Floating Cards) */}
      <div
        className="flex-[1_1_400px] relative flex justify-center items-center min-h-[500px] opacity-0 animate-fade-up max-[900px]:mt-10"
        style={{ animationDelay: '0.4s' }}
      >
        <img
          src="/images/fox_study.png"
          alt="Vocab Mitra Fox Study"
          className="w-full max-w-[560px] h-auto object-contain z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
        />
      </div>
    </section>
  );
}
