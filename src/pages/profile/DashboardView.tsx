import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, BookOpen, Bookmark, Flame, ChevronRight, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { authApi } from '../../api/endpoints/auth.api';
import type { VocabCard as VocabCardType } from '../../types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Mock category breakdown
const CATEGORY_BREAKDOWN = [
  { tag: 'UPSC', count: 18 },
  { tag: 'GRE', count: 14 },
  { tag: 'CAT', count: 8 },
  { tag: 'SSC', count: 5 },
  { tag: 'CUET', count: 2 },
];

const MAX_COUNT = Math.max(...CATEGORY_BREAKDOWN.map((c) => c.count));

export default function DashboardView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [recentLearned, setRecentLearned] = useState<VocabCardType[]>([]);
  const [recentBookmarked, setRecentBookmarked] = useState<VocabCardType[]>([]);
  const [stats, setStats] = useState({ totalBookmarked: 0, totalLearned: 0, currentStreak: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, learnedRes, bookmarkedRes] = await Promise.all([
          authApi.getProfile(),
          vocabApi.getLearned(),
          vocabApi.getBookmarked()
        ]);
        
        setStats({
          totalBookmarked: profileRes.stats.totalBookmarks,
          totalLearned: profileRes.stats.totalLearned,
          currentStreak: profileRes.stats.currentStreak
        });
        
        setRecentLearned(learnedRes.slice(0, 3));
        setRecentBookmarked(bookmarkedRes.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Sophisticated, smooth staggered entrance
    tl.fromTo('.dash-element', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }
    );

    // Smooth progress bar fill
    tl.fromTo('.progress-fill',
      { width: '0%' },
      { width: (_, target) => target.dataset.width, duration: 1.2, ease: 'power3.out', stagger: 0.1 },
      '-=0.6'
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-[1000px] w-full mx-auto">
      
      {/* ─── Identity header ─── */}
      <div className="dash-element flex items-center justify-between mb-10 pb-8 border-b border-ink/10 flex-wrap gap-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center font-bricolage text-2xl sm:text-3xl font-medium text-ink">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : '??'}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-cream rounded-full" />
          </div>
          <div>
            <h1 className="font-bricolage text-2xl sm:text-3xl font-medium text-ink mb-1 tracking-tight">
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </h1>
            <div className="font-inter text-sm text-ink-soft">
              @{user?.username || 'user'} &middot; Free Plan
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setEditMode((v) => !v)}
          className="flex items-center gap-2 py-2.5 px-5 rounded-lg border border-ink/20 bg-transparent text-ink text-sm font-medium transition-all hover:bg-ink/5 active:scale-95"
        >
          <Edit3 size={15} />
          {editMode ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {editMode && (
        <div className="dash-element bg-ink/5 border border-ink/10 rounded-xl p-5 mb-10 text-center">
          <p className="font-inter text-sm text-ink-soft m-0">
            Profile editing functionality will be available soon.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 mb-12">
          
          {/* Left Column (Stats & Breakdown) */}
          <div className="flex flex-col gap-8">
            
            {/* ─── Stats strip ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { icon: Flame, label: 'Current Streak', value: `${stats.currentStreak}`, unit: 'days' },
                { icon: Bookmark, label: 'Bookmarked', value: `${stats.totalBookmarked}`, unit: 'words' },
                { icon: BookOpen, label: 'Learned', value: `${stats.totalLearned}`, unit: 'words' },
              ].map((stat, i) => (
                <div key={i} className="bg-cream-card border border-ink/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-upsc/10 flex items-center justify-center mb-4">
                    <stat.icon size={20} className="text-upsc" />
                  </div>
                  <div className="font-bricolage text-3xl font-bold text-ink mb-1">
                    {stat.value}
                  </div>
                  <div className="font-inter text-[13px] font-medium text-ink-soft flex items-center justify-between">
                    {stat.label}
                    <span className="text-[11px] font-space tracking-wider uppercase opacity-50">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {recentLearned.length > 0 ? recentLearned.map((c) => (
                <div key={c.vocab.id} onClick={() => navigate('/vocab')} className="group flex items-center justify-between py-3 cursor-pointer border-b border-ink/5 last:border-0 transition-all">
                  <div className="pr-4">
                    <div className="font-bricolage font-medium text-sm text-ink mb-1 group-hover:text-ink-soft transition-colors">{c.vocab.vocab}</div>
                    <div className="font-inter text-xs text-ink-soft line-clamp-1">{c.vocab.meaning}</div>
                  </div>
                  <ChevronRight size={14} className="text-ink/20 group-hover:text-ink group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              )) : (
                <div className="py-8 text-center text-ink-soft">
                  <p className="font-inter text-sm m-0">No learned words yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recently Bookmarked */}
          <div className="dash-element bg-cream-card border border-ink/10 rounded-xl p-7 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-ink/5">
              <h3 className="font-bricolage text-base font-medium text-ink m-0">
                Bookmarks
              </h3>
              <button onClick={() => navigate('/profile/bookmarks')} className="text-xs font-medium text-ink-soft hover:text-ink transition-colors">
                View All
              </button>
            </div>
            
            <div className="flex flex-col">
              {recentBookmarked.length > 0 ? recentBookmarked.map((c) => (
                <div key={c.vocab.id} onClick={() => navigate('/vocab')} className="group flex items-center justify-between py-3 cursor-pointer border-b border-ink/5 last:border-0 transition-all">
                  <div className="pr-4">
                    <div className="font-bricolage font-medium text-sm text-ink mb-1 group-hover:text-ink-soft transition-colors">{c.vocab.vocab}</div>
                    <div className="font-inter text-xs text-ink-soft line-clamp-1">{c.vocab.meaning}</div>
                  </div>
                  <ChevronRight size={14} className="text-ink/20 group-hover:text-ink group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              )) : (
                <div className="py-8 text-center text-ink-soft">
                  <p className="font-inter text-sm m-0">No bookmarks saved.</p>
                </div>
              )}
            </div>
          </div>

        </div>

    </div>
  );
}
