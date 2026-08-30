import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Flame, Search, BookOpen, Target, Bookmark,
  Leaf, Zap, Volume2, Lightbulb, Star, MessageSquare,
  PenTool, Link as LinkIcon, Globe, ArrowRight, Book
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api/endpoints/auth.api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function DashboardView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({ currentStreak: 7 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await authApi.getProfile();
        setStats({
          currentStreak: profileRes.stats.currentStreak > 0 ? profileRes.stats.currentStreak : 7
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.dash-element',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-6 pb-12 max-w-[1200px] mx-auto pr-4 sm:pr-6 md:pr-8">

      {/* ─── Global Top Header ─── */}
      <div className="dash-element flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
        {/* Search Bar */}
        <div className="relative w-full max-w-[400px]">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-soft opacity-70" />
          <input
            type="text"
            placeholder="Search any word..."
            className="w-full bg-cream-card rounded-2xl py-3 pl-12 pr-4 font-inter text-[14px] text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Streak Pill */}
          <div className="flex items-center gap-3 bg-cream-card rounded-2xl px-4 py-2 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <Flame className="text-orange-500 fill-orange-500" size={18} />
            <div className="flex flex-col">
              <span className="font-bricolage font-bold text-ink leading-none text-[15px]">{stats.currentStreak}</span>
              <span className="font-inter text-[10px] text-ink-soft leading-tight mt-0.5">day streak</span>
            </div>
          </div>

          {/* Notifications */}
          <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-ink-soft hover:text-ink bg-cream-card cursor-pointer transition-colors border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <Bell size={18} />
          </button>

          {/* Profile Avatar */}
          <button className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bricolage font-bold text-[16px] cursor-pointer shadow-[0_4px_10px_rgba(249,115,22,0.3)] hover:opacity-90 transition-opacity border-none">
            {user ? user.firstName[0].toUpperCase() : 'N'}
          </button>
        </div>
      </div>

      {/* ─── Row 1: Metrics ─── */}
      <div className="dash-element grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">

        {/* Metric 1 */}
        <div className="bg-cream-card rounded-2xl p-5 flex items-center gap-4 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Target size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[12px] font-medium text-purple-400 mb-1">Today's Target</span>
            <span className="font-bricolage text-[24px] font-bold text-ink leading-none mb-1 flex items-baseline gap-1">
              2 / 20 <span className="text-[14px] text-ink-soft font-medium font-inter">words</span>
            </span>
            <span className="font-inter text-[12px] text-ink-soft">Ready to practice</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-cream-card rounded-2xl p-5 flex items-center gap-4 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
            <Target size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[12px] font-medium text-green-500 mb-1">Sets Ready</span>
            <span className="font-bricolage text-[24px] font-bold text-ink leading-none mb-1">5</span>
            <span className="font-inter text-[12px] text-ink-soft">Ready to practice</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-cream-card rounded-2xl p-5 flex items-center gap-4 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Flame size={22} className="fill-orange-500/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[12px] font-medium text-orange-500 mb-1">Streak Maintained</span>
            <span className="font-bricolage text-[24px] font-bold text-ink leading-none mb-1 flex items-baseline gap-1">
              5 <span className="text-[14px] text-ink-soft font-medium font-inter">days</span>
            </span>
            <span className="font-inter text-[12px] text-ink-soft">Keep it going!</span>
          </div>
        </div>

      </div>

      {/* ─── Row 2: Learning ─── */}
      <div className="dash-element grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Continue Learning */}
        <div className="xl:col-span-7 bg-cream-card rounded-2xl p-6 flex flex-col border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col gap-1 mb-6">
            <div className="font-inter text-[14px] font-medium text-purple-500">
              Continue from where you left
            </div>
            <div className="font-inter text-[13px] text-ink-soft">
              [ Learning Words ]
            </div>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-bricolage text-[32px] font-bold text-ink leading-none uppercase">
                LASSITUDE
              </h2>
              <p className="font-inter text-[14px] text-ink-soft mb-2">
                Tiredness / lack of energy
              </p>
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-orange-500" />
                <span className="font-inter text-[14px] text-orange-500">Lassi pi ke nind aati hai.</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 shadow-inner">
              <Book size={28} className="text-ink-soft opacity-80" />
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex-1 w-full max-w-[300px]">
              <div className="w-full h-2 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden mb-3 shadow-inner">
                <div className="h-full bg-purple-500 rounded-full w-[57%] shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
              </div>
              <div className="font-inter text-[13px] text-ink-soft font-medium">
                4 / 7 words completed
              </div>
            </div>
            <button className="shrink-0 bg-transparent border border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/5 text-purple-500 font-inter text-[13px] font-medium px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Today's Learning */}
        <div className="xl:col-span-5 bg-cream-card rounded-2xl p-6 flex flex-col border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="font-inter text-[11px] font-bold text-ink-soft tracking-[0.1em] mb-4 uppercase opacity-80">
            Today's Learning
          </div>

          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col">
              <span className="font-bricolage text-[48px] font-bold text-ink leading-none mb-1">10</span>
              <span className="font-inter text-[13px] text-ink-soft leading-tight max-w-[100px]">
                new words met today
              </span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 shadow-inner">
              <Leaf size={28} className="text-green-500 fill-green-500/10 opacity-90" />
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2">
            {['ALACRITY', 'CANDID', 'OBSTINATE'].map((word) => (
              <div key={word} className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 font-inter text-[10px] font-bold text-ink-soft tracking-[0.1em] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] border border-transparent dark:border-white/5">
                {word}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── Row 3: Practice & Word of the Day ─── */}
      <div className="dash-element grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Practice */}
        <div className="xl:col-span-5 bg-cream-card rounded-2xl p-6 flex flex-col border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="font-inter text-[11px] font-bold text-purple-500 tracking-[0.1em] mb-4 uppercase">
            Practice
          </div>

          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-bricolage text-[32px] font-bold text-ink leading-none">
                5 cards ready
              </h2>
              <p className="font-inter text-[14px] text-ink-soft">
                Scheduled · 6 min
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 shadow-inner">
              <Zap size={28} className="text-purple-500 fill-purple-500/10 opacity-90" />
            </div>
          </div>

          <div className="mt-auto flex justify-start sm:justify-end">
            <button className="w-full sm:w-auto bg-transparent border border-purple-500/50 hover:border-purple-500 text-purple-500 font-inter text-[13px] font-semibold px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
              Start Practice <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Word of the Day */}
        <div className="xl:col-span-7 bg-cream-card rounded-2xl p-6 flex flex-col border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
          <div className="font-inter text-[11px] font-bold text-orange-500 tracking-[0.1em] mb-4 uppercase">
            Word of the Day
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h2 className="font-bricolage text-[36px] font-bold text-ink leading-none uppercase">
                  EPHEMERAL
                </h2>
                <Volume2 size={24} className="text-ink-soft cursor-pointer hover:text-ink transition-colors" />
              </div>
              <p className="font-inter text-[15px] text-ink-soft">
                Lasting for a very short time.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 shadow-inner">
              <Star size={28} className="text-orange-500 fill-orange-500 opacity-90" />
            </div>
          </div>

          <div className="mt-auto flex items-start gap-4 pt-6">
            <Lightbulb size={20} className="text-orange-500 shrink-0 mt-0.5 opacity-80" />
            <p className="font-inter text-[14px] font-medium text-ink-soft italic leading-relaxed">
              "Ephemeral cheez, pal bhar ki mehmaan."
            </p>
          </div>
        </div>

      </div>

      {/* ─── Row 4: CUET Focus ─── */}
      <div className="dash-element w-full mt-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2 font-inter text-[13px] font-bold text-orange-500 uppercase tracking-wider">
            <span>✨</span> CUET FOCUS
          </div>
          <button className="bg-transparent border-none text-orange-500 font-inter text-[13px] font-semibold cursor-pointer flex items-center gap-1 hover:underline">
            Explore all <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pb-4 pt-2 w-full">

          <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-3 w-full border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <span className="font-inter text-[13px] font-semibold text-ink leading-tight">Previous-Year<br />Words</span>
          </div>

          <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-3 w-full border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <span className="font-inter text-[13px] font-semibold text-ink leading-tight">Idioms &<br />Phrases</span>
          </div>

          <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-3 w-full border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <PenTool size={20} />
            </div>
            <span className="font-inter text-[13px] font-semibold text-ink leading-tight">One Word<br />Substitution</span>
          </div>

          <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-3 w-full border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
              <LinkIcon size={20} />
            </div>
            <span className="font-inter text-[13px] font-semibold text-ink leading-tight">Phrasal<br />Verbs</span>
          </div>

          <div className="bg-cream-card rounded-2xl p-4 flex items-center gap-3 w-full border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Globe size={20} />
            </div>
            <span className="font-inter text-[13px] font-semibold text-ink leading-tight">Foreign<br />Words</span>
          </div>

        </div>
      </div>

    </div>
  );
}
