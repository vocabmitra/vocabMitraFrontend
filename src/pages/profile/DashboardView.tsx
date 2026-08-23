import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, ChevronDown, Sparkles, BookOpen, Clock, Flame, 
  ChevronRight, Volume2, Lightbulb, Search, Bookmark
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { vocabApi } from '../../api/endpoints/vocab.api';
import { authApi } from '../../api/endpoints/auth.api';
import type { VocabCard as VocabCardType } from '../../types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function DashboardView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [recentLearned, setRecentLearned] = useState<VocabCardType[]>([]);
  const [stats, setStats] = useState({ totalBookmarked: 0, totalLearned: 0, currentStreak: 12 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, learnedRes] = await Promise.all([
          authApi.getProfile(),
          vocabApi.getLearned()
        ]);
        
        setStats({
          totalBookmarked: profileRes.stats.totalBookmarks,
          totalLearned: profileRes.stats.totalLearned,
          currentStreak: profileRes.stats.currentStreak > 0 ? profileRes.stats.currentStreak : 12
        });
        
        setRecentLearned(learnedRes.slice(0, 4));
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
    <div ref={containerRef} className="w-full flex flex-col gap-8 pb-10">
      
      {/* ─── Global Top Header ─── */}
      <div className="dash-element flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
        <div>
          <h1 className="font-bricolage text-[28px] sm:text-[32px] font-bold text-ink mb-1 flex items-center gap-2">
            Good morning, {user?.firstName || 'User'} <span className="text-[24px]">👋</span>
          </h1>
          <p className="font-inter text-[14px] text-ink-soft">
            Let's make today a great day to learn.
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {/* Global Streak */}
          <div className="flex items-center gap-3">
            <Flame className="text-orange-500 fill-orange-500" size={20} />
            <div className="flex flex-col">
              <span className="font-bricolage font-bold text-ink leading-tight text-[15px]">{stats.currentStreak}</span>
              <span className="font-inter text-[10px] text-ink-soft leading-tight">Day streak</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-line" />

          {/* Notifications */}
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-ink-soft hover:bg-line/30 transition-colors border border-line cursor-pointer bg-transparent">
            <Bell size={18} />
          </button>

          {/* Profile Dropdown Trigger */}
          <button className="flex items-center gap-2 py-1.5 pr-2 pl-1.5 rounded-full border border-line bg-cream-card hover:bg-line/30 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-ink text-cream flex items-center justify-center font-space text-[12px] font-bold">
              {user ? user.firstName[0] : 'U'}
            </div>
            <span className="font-inter text-[13px] font-medium text-ink hidden sm:block">{user?.firstName}</span>
            <ChevronDown size={14} className="text-ink-soft hidden sm:block" />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-8">
        
        {/* ─── MIDDLE COLUMN (Main Content) ─── */}
        <div className="flex-1 flex flex-col min-w-0 gap-8">
          


          {/* Quick Action Grid */}
          <div className="dash-element grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-cream-card border border-line rounded-2xl p-5 flex flex-col hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="font-bricolage text-[20px] font-bold text-ink leading-tight">5</div>
                  <div className="font-inter text-[12px] text-ink-soft">New words</div>
                </div>
              </div>
              <div className="mt-auto font-inter text-[12px] font-semibold text-green-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Start learning <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-cream-card border border-line rounded-2xl p-5 flex flex-col hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </div>
                <div>
                  <div className="font-bricolage text-[20px] font-bold text-ink leading-tight">8</div>
                  <div className="font-inter text-[12px] text-ink-soft">Words for practice</div>
                </div>
              </div>
              <div className="mt-auto font-inter text-[12px] font-semibold text-orange-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Practice now <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-cream-card border border-line rounded-2xl p-5 flex flex-col hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="font-bricolage text-[20px] font-bold text-ink leading-tight flex items-baseline gap-1">10 <span className="text-[12px] font-medium text-ink-soft">min</span></div>
                  <div className="font-inter text-[12px] text-ink-soft">Quick practice</div>
                </div>
              </div>
              <div className="mt-auto font-inter text-[12px] font-semibold text-purple-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Start timer <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-cream-card border border-line rounded-2xl p-5 flex flex-col hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                  <Flame size={20} className="fill-red-600" />
                </div>
                <div>
                  <div className="font-bricolage text-[20px] font-bold text-ink leading-tight">{stats.currentStreak}</div>
                  <div className="font-inter text-[12px] text-ink-soft">Day streak</div>
                </div>
              </div>
              <div className="mt-auto font-inter text-[12px] font-semibold text-red-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Keep it up! <Flame size={14} className="fill-red-600 ml-0.5" />
              </div>
            </div>
          </div>

          {/* Widgets Row */}
          <div className="dash-element grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Continue Learning */}
            <div className="bg-cream-card border border-line rounded-3xl p-6 relative overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 text-orange-600 font-inter font-semibold text-[13px] mb-5">
                <Bookmark size={16} /> Continue learning
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bricolage text-[22px] font-bold text-orange-500 uppercase">LASSITUDE</h3>
                <Volume2 size={16} className="text-ink-soft cursor-pointer hover:text-ink" />
              </div>
              <p className="font-inter text-[14px] text-ink-soft mb-5">Tiredness / lack of energy</p>
              
              <div className="font-inter text-[13px] text-ink font-medium max-w-[70%]">
                <span className="font-bold">Mnemonic:</span> "Lassi pi ke nind aati hai."
              </div>

              {/* Decorative image */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 mt-4">
                <div className="text-[60px]">🥛</div>
              </div>

              <div className="mt-auto pt-8 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between font-inter text-[11px] font-medium text-ink-soft mb-2">
                    <span>3 / 5 steps completed</span>
                  </div>
                  <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full w-[60%]" />
                  </div>
                </div>
                <button className="shrink-0 bg-orange-500 hover:bg-orange-400 text-white font-inter text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 border-none">
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Your Next Practice */}
            <div className="bg-cream-card border border-line rounded-3xl p-6 flex flex-col">
              <div className="flex items-center gap-2 text-blue-600 font-inter font-semibold text-[13px] mb-5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                Your next practice
              </div>

              <div className="flex flex-col gap-1 mb-6">
                
                {/* List Item 1 */}
                <div className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-line/30 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-inter text-[13px] font-bold text-ink truncate">8 words you added</div>
                    <div className="font-inter text-[11px] text-ink-soft truncate">Ready to practice</div>
                  </div>
                  <ChevronRight size={14} className="text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* List Item 2 */}
                <div className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-line/30 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-inter text-[13px] font-bold text-ink truncate">5 words marked for more practice</div>
                    <div className="font-inter text-[11px] text-ink-soft truncate">We'll show these more often</div>
                  </div>
                  <ChevronRight size={14} className="text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* List Item 3 */}
                <div className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-line/30 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-inter text-[13px] font-bold text-ink truncate">Mixed flashcards</div>
                    <div className="font-inter text-[11px] text-ink-soft truncate">Vocabulary · Idioms · OWS · Phrasal Verbs</div>
                  </div>
                  <ChevronRight size={14} className="text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-inter text-[14px] font-bold py-3.5 rounded-xl border-none transition-colors cursor-pointer mt-auto flex justify-center items-center gap-2">
                Start practice <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="dash-element bg-cream-card border border-line rounded-2xl py-6 px-8 relative overflow-hidden flex items-center mt-2">
            <div className="font-bricolage text-[24px] text-green-500/50 absolute left-6 top-6">"</div>
            <p className="font-inter text-[15px] font-medium text-ink pl-6 relative z-10 max-w-[60%]">
              The more you practice, the easier it gets to remember.
            </p>
            <img 
              src="/images/fox_study.png" 
              alt="Mascot" 
              className="absolute right-8 bottom-0 w-[80px] object-contain drop-shadow-md z-10"
            />
            <div className="absolute right-[140px] bottom-0 text-[40px] opacity-20 filter blur-[1px]">🌿</div>
          </div>

          <div className="dash-element font-inter italic text-[12px] text-ink-soft text-center mt-4 px-4 opacity-70">
            "Words are, of course, the most powerful drug used by mankind." – Rudyard Kipling
          </div>

        </div>

        {/* ─── RIGHT COLUMN (Side Panel) ─── */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          
          {/* Today's Goal */}
          <div className="dash-element bg-cream-card border border-line rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-inter font-semibold text-[13px] text-ink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                Today's goal
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-line bg-transparent font-inter text-[11px] font-semibold text-ink hover:bg-line/30 transition-colors cursor-pointer">
                Edit
              </button>
            </div>

            <div className="font-inter text-[13px] font-bold text-ink mb-3">
              7 / 20 <span className="font-normal text-ink-soft">words practiced</span>
            </div>
            
            <div className="w-full h-2 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full w-[35%]" />
            </div>
          </div>
          
          {/* Word of the Day */}
          <div className="dash-element bg-cream-card border border-line rounded-3xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center gap-2 text-yellow-600 font-inter font-semibold text-[13px] mb-5">
              <Lightbulb size={16} /> Word of the Day
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bricolage text-[20px] font-bold text-ink uppercase tracking-wide">PERSPICACIOUS</h3>
              <Volume2 size={16} className="text-ink-soft cursor-pointer hover:text-ink" />
            </div>
            
            <div className="font-inter text-[13px] text-ink-soft mb-2">(Adjective)</div>
            <p className="font-inter text-[14px] text-ink mb-6">Having a ready insight into things.</p>
            
            <div className="font-inter text-[13px] font-bold text-ink mb-2 flex items-center gap-1.5">
              Mnemonic <Lightbulb size={14} className="text-yellow-500 fill-yellow-500" />
            </div>
            <p className="font-inter text-[13.5px] font-medium text-ink-soft italic leading-relaxed mb-6 relative">
              <span className="relative z-10">"Person is cautious →<br/>sees things clearly."</span>
              <span className="absolute right-0 top-0 text-[40px] drop-shadow-sm -translate-y-2 opacity-90">📚</span>
            </p>

            <button className="w-full bg-transparent border-2 border-orange-500/20 text-orange-500 font-inter font-bold text-[14px] py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-colors cursor-pointer mt-auto">
              Learn this word
            </button>
          </div>

          {/* Recently Practiced */}
          <div className="dash-element bg-cream-card border border-line rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-inter font-semibold text-[13px] text-ink">
                <Clock size={16} className="text-ink-soft" /> Recently practiced
              </div>
              <button className="text-orange-500 font-inter font-semibold text-[12px] bg-transparent border-none cursor-pointer hover:underline">
                View all
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { word: 'Obstinate', time: 'Yesterday', tag: 'Good', color: 'text-green-600 bg-green-500/10' },
                { word: 'Ephemeral', time: 'Yesterday', tag: 'Needs practice', color: 'text-orange-600 bg-orange-500/10' },
                { word: 'Zeal', time: '2 days ago', tag: 'Good', color: 'text-green-600 bg-green-500/10' },
                { word: 'Mellifluous', time: '2 days ago', tag: 'Needs practice', color: 'text-orange-600 bg-orange-500/10' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-line/50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-inter text-[14px] font-bold text-ink">{item.word}</div>
                    <div className="font-inter text-[11px] text-ink-soft mt-0.5">{item.time}</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md font-inter text-[11px] font-semibold ${item.color}`}>
                    {item.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
