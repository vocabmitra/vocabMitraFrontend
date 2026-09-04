import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Bookmark, LogOut, BarChart2, Settings, HelpCircle, MessageSquare, ChevronDown, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { authApi } from '../../api/endpoints/auth.api';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const NAV_ITEMS = [
  { to: '/profile', label: 'Home', icon: Home, end: true },
  { to: '/profile/bookmarks', label: 'Vocabulary', icon: Bookmark, end: false },
  { to: '/profile/learned', label: 'Progress', icon: BarChart2, end: false },
  { to: '/profile/cuet-focus', label: 'CUET Focus', icon: Sparkles, end: false, special: true },
  { to: '/profile/settings', label: 'Settings', icon: Settings, end: false },
];

export default function ProfileLayout() {
  const { user, profile, setProfile, logout } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await authApi.getProfile();
        if (res && isMounted) {
          setProfile(res);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, [setProfile]);

  const handleLogout = () => {
    logout();
    addToast('Signed out. See you soon!', 'info');
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="w-full">
        <div className="w-full max-w-[1500px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
          {/* Desktop Sidebar */}
          <aside
            className="hidden md:flex w-[260px] lg:w-[280px] shrink-0 border-none py-8 pr-6 pl-4 sm:pl-6 md:pl-8 flex-col sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto rounded-lg bg-[var(--sidebar-bg)]"
          >
            {/* Nav items */}
            <nav className="flex-1 flex flex-col gap-1.5" aria-label="Profile navigation">
              {NAV_ITEMS.map((item) => {
                const { to, label, icon: Icon, end, special } = item as typeof NAV_ITEMS[0] & { special?: boolean };
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-[10px] text-[14px] font-inter transition-all duration-200 ease-[var(--ease)] no-underline group ${
                        special 
                          ? isActive 
                            ? 'font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                            : 'font-semibold text-orange-400 bg-transparent hover:bg-orange-500/5 hover:text-orange-500'
                          : isActive
                            ? 'font-semibold text-white bg-white/10'
                            : 'font-medium text-white/70 bg-transparent hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} className={`transition-opacity ${special ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} />
                    {label}
                  </NavLink>
                );
              })}

            </nav>

            {/* Bottom Sidebar Elements */}
            <div className="mt-auto flex flex-col gap-4">
              {/* Profile Dropdown Widget */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-inter font-bold text-lg shrink-0">
                    {(profile?.firstName?.[0] || user?.firstName?.[0] || (user as any)?.name?.[0] || 'N').toUpperCase()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-inter font-semibold text-white text-[14px] leading-tight truncate">
                      {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user as any)?.name || 'Nikhil')}
                    </span>
                    <span className="font-inter font-medium text-white/60 text-[11px] leading-tight mt-1 truncate">
                      {profile?.email || user?.email || 'Keep Learning!'}
                    </span>
                  </div>
                </div>
                <ChevronDown size={16} className="text-white/50 shrink-0" />
              </div>

              {/* Help & Feedback */}
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-inter font-medium text-white/70 bg-transparent border-none cursor-pointer hover:bg-white/5 hover:text-white text-left transition-colors">
                  <HelpCircle size={18} className="opacity-80" />
                  Help
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-inter font-medium text-white/70 bg-transparent border-none cursor-pointer hover:bg-white/5 hover:text-white text-left transition-colors">
                  <MessageSquare size={18} className="opacity-80" />
                  Feedback
                </button>
                {/* Keeping the logout functionality accessible here as an option */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-inter font-medium text-white/70 bg-transparent border-none cursor-pointer hover:bg-white/5 hover:text-red-400 text-left transition-colors"
                >
                  <LogOut size={18} className="opacity-80" />
                  Log out
                </button>
              </div>
            </div>
          </aside>

          {/* ─── Main content area ─── */}
          <main className="flex-1 py-8 md:pl-8 overflow-y-auto min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile tab bar */}
      <MobileTabBar />
      <Footer />
    </>
  );
}

function MobileTabBar() {
  return (
    <nav
      className="md:hidden sticky top-[72px] z-40 bg-[color-mix(in_srgb,var(--cream)_90%,transparent)] backdrop-blur-md border-b border-line px-4"
      aria-label="Profile tabs"
    >
      <div className="flex gap-0 overflow-x-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-4 text-[11px] font-inter no-underline whitespace-nowrap shrink-0 border-b-2 ${isActive
                ? 'font-semibold text-upsc border-upsc'
                : 'font-normal text-ink-soft border-transparent'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
