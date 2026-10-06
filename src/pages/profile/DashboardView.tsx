import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, ArrowRight, FileText
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LongCard } from '../../components/dashboard/LongCard';

export default function DashboardView() {
  const { profile, user } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const firstName = profile?.firstName || user?.firstName || (user as any)?.name?.split(' ')[0] || 'Student';

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.dash-element',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-10 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">

      {/* ─── 1. Welcome Section ─── */}
      <div className="dash-element flex flex-col gap-1">
        <h1 className="font-bricolage text-xl sm:text-2xl font-bold text-ink leading-tight">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="font-inter text-md text-ink-soft">
          What would you like to learn today?
        </p>
      </div>

      {/* ─── 2. Categories (5 Long Cards) ─── */}
      <div className="dash-element grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <LongCard
          title="Words"
          description="Build your vocabulary, one word at a time."
          icon={<img src="/image_icons/book.png" alt="Words" className="w-[80px] h-[80px] object-contain" />}
          cardBgClass="bg-[#fef4e8] dark:bg-[#18181b]"
          shapeBgClass="bg-[#ffdfbe] dark:bg-orange-500/10"
          iconBoxBgClass="bg-gradient-to-br from-white to-[#ffdfbe] dark:from-[#241c18] dark:to-[#1a1412] dark:border dark:border-orange-500/20"
          buttonBgClass="bg-[#ffbe7c] dark:bg-orange-500/20"
          onClick={() => navigate('/profile/practice')}
        />
        <LongCard
          title="Idioms & Phrases"
          description="Learn popular expressions."
          icon={<img src="/image_icons/message.png" alt="Idioms" className="w-[80px] h-[80px] object-contain" />}
          cardBgClass="bg-[#fdf2f4] dark:bg-[#18181b]"
          shapeBgClass="bg-[#fbcfe8] dark:bg-pink-500/10"
          iconBoxBgClass="bg-gradient-to-br from-white to-[#fbcfe8] dark:from-[#26161f] dark:to-[#1a1417] dark:border dark:border-pink-500/20"
          buttonBgClass="bg-[#f9a8d4] dark:bg-pink-500/20"
          onClick={() => navigate('/profile/exam-focus?tab=idioms-and-phrases')}
        />
        <LongCard
          title="Phrasal Verbs"
          description="Master verb combinations."
          icon={<img src="/image_icons/link.png" alt="Phrasal Verbs" className="w-[80px] h-[80px] object-contain" />}
          cardBgClass="bg-[#f0fdf4] dark:bg-[#18181b]"
          shapeBgClass="bg-[#bbf7d0] dark:bg-emerald-500/10"
          iconBoxBgClass="bg-gradient-to-br from-white to-[#bbf7d0] dark:from-[#16241b] dark:to-[#131a15] dark:border dark:border-emerald-500/20"
          buttonBgClass="bg-[#86efac] dark:bg-emerald-500/20"
          onClick={() => navigate('/profile/exam-focus?tab=phrasal-verbs')}
        />
        <LongCard
          title="One Word Substitution"
          description="Say more in fewer words."
          icon={<img src="/image_icons/bulb.png" alt="One Word Substitution" className="w-[80px] h-[80px] object-contain" />}
          cardBgClass="bg-[#f5f3ff] dark:bg-[#18181b]"
          shapeBgClass="bg-[#ddd6fe] dark:bg-purple-500/10"
          iconBoxBgClass="bg-gradient-to-br from-white to-[#ddd6fe] dark:from-[#21182c] dark:to-[#17141d] dark:border dark:border-purple-500/20"
          buttonBgClass="bg-[#c4b5fd] dark:bg-purple-500/20"
          onClick={() => navigate('/profile/exam-focus?tab=one-word-substitution')}
        />
        <LongCard
          title="Foreign Words"
          description="Explore words from around the world."
          icon={<img src="/image_icons/earth.png" alt="Foreign Words" className="w-[80px] h-[80px] object-contain" />}
          cardBgClass="bg-[#eff6ff] dark:bg-[#18181b]"
          shapeBgClass="bg-[#bfdbfe] dark:bg-sky-500/10"
          iconBoxBgClass="bg-gradient-to-br from-white to-[#bfdbfe] dark:from-[#17212c] dark:to-[#14181d] dark:border dark:border-sky-500/20"
          buttonBgClass="bg-[#93c5fd] dark:bg-sky-500/20"
          onClick={() => navigate('/profile/exam-focus?tab=foreign-words')}
        />
      </div>

      {/* ─── 3. Continue Learning ─── */}
      <div className="dash-element w-full">
        <div
          onClick={() => navigate('/profile/practice')}
          className="relative w-full rounded-[32px] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-[#fef4e8] dark:bg-[#18181b] border border-black/5 dark:border-white/10 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer hover:shadow-md dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all group overflow-hidden"
        >
          {/* Sweeping Background Shape on the Right */}
          <div
            className="absolute -bottom-1/2 -right-10 w-[60%] h-[200%] bg-[#ffdfbe] dark:bg-orange-500/10 rounded-tl-[100%] pointer-events-none transition-transform duration-500 group-hover:scale-105"
          />

          <div className="relative z-10 flex items-center gap-5 sm:gap-6 w-full">
            {/* Puffy Icon Box (matching LongCards) */}
            <div className="w-[76px] h-[76px] rounded-[22px] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.12)] bg-gradient-to-br from-white to-[#ffdfbe] dark:from-[#241c18] dark:to-[#1a1412] dark:border dark:border-orange-500/20 shrink-0">
              <img src="/image_icons/book.png" alt="Continue" className="w-[65px] h-[65px] object-contain" />
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="font-inter text-[11px] font-bold text-[#64748b] dark:text-orange-400 tracking-[0.08em] uppercase">
                Continue Learning
              </span>
              <h2 className="font-bricolage text-[26px] sm:text-[30px] font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight uppercase tracking-tight">
                LASSITUDE
              </h2>
              <p className="font-inter text-[14px] text-[#475569] dark:text-[#a1a1aa] font-medium">
                Tiredness / lack of energy
              </p>
            </div>
          </div>

          <button className="relative z-10 shrink-0 bg-[#ea580c] hover:bg-[#d946ef] bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-inter text-[15px] font-bold px-8 py-3.5 rounded-full shadow-[0_4px_12px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_16px_rgba(234,88,12,0.4)] dark:shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer border-none">
            Continue <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ─── 4. Explore More ─── */}
      <div className="dash-element flex flex-col gap-4">
        <h2 className="font-bricolage text-[24px] font-bold text-ink">
          Explore More
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div
            className="bg-white dark:bg-[#18181b] rounded-[24px] p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform border border-black/5 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
          >
            <div className="w-14 h-14 rounded-[18px] bg-[#ffedd5]/50 dark:bg-orange-500/15 flex items-center justify-center shrink-0">
              <Search size={24} className="text-[#ea580c] dark:text-orange-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-inter text-[16px] font-bold text-ink leading-tight">Search Words</span>
              <span className="font-inter text-[13px] text-ink-soft">Find any word instantly.</span>
            </div>
            <ArrowRight size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
          </div>

          <div
            onClick={() => navigate('/profile/cuet-focus')}
            className="bg-gradient-to-r from-[#f3e8ff] to-[#faf5ff] dark:from-purple-950/20 dark:to-[#18181b] dark:bg-[#18181b] rounded-[24px] p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform border border-[#d8b4fe]/20 dark:border-purple-500/20 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
          >
            <div className="w-14 h-14 rounded-[18px] bg-white/60 dark:bg-purple-500/15 flex items-center justify-center shrink-0">
              <FileText size={24} className="text-[#9333ea] dark:text-purple-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-inter text-[16px] font-bold text-ink leading-tight">Browse by Exam</span>
              <span className="font-inter text-[13px] text-ink-soft">CUET, SSC, Banking & more.</span>
            </div>
            <ArrowRight size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
          </div>

          <div
            onClick={() => navigate('/profile/user-words')}
            className="bg-gradient-to-r from-[#ffe4e6] to-[#fff1f2] dark:from-rose-950/20 dark:to-[#18181b] dark:bg-[#18181b] rounded-[24px] p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform border border-[#fda4af]/20 dark:border-rose-500/20 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
          >
            <div className="w-14 h-14 rounded-[18px] bg-white/60 dark:bg-rose-500/15 flex items-center justify-center shrink-0">
              <Star size={24} className="text-[#e11d48] dark:text-rose-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-inter text-[16px] font-bold text-ink leading-tight">View Bookmarks</span>
              <span className="font-inter text-[13px] text-ink-soft">Your saved words.</span>
            </div>
            <ArrowRight size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
          </div>

        </div>
      </div>

    </div>
  );
}
