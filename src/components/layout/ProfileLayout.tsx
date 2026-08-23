import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bookmark, CheckCircle, LogOut, Dumbbell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useThemeStore } from '../../store/useThemeStore';
import { authApi } from '../../api/endpoints/auth.api';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const NAV_ITEMS = [
  { to: '/profile', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile/practice-queue', label: 'Practice Queue', icon: Dumbbell, end: false },
  { to: '/profile/bookmarks', label: 'Bookmarked Vocabs', icon: Bookmark, end: false },
  { to: '/profile/learned', label: 'Learned Vocabs', icon: CheckCircle, end: false },
];

export default function ProfileLayout() {
  const { user, logout } = useAuthStore();
  const { addToast } = useUIStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    addToast('Signed out. See you soon!', 'info');
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="w-full">
        <div className="w-full max-w-[1500px] mx-auto pr-4 sm:pr-6 md:pr-8 flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
          {/* Desktop Sidebar */}
          <aside
            className="hidden md:flex w-[260px] lg:w-[280px] shrink-0 border-r border-line py-8 pr-6 pl-4 sm:pl-6 md:pl-8 flex-col sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto rounded-lg"
            style={{ backgroundColor: theme === 'light' ? 'var(--ink)' : 'var(--cream)' }}
          >
            {/* Nav items */}
            <nav className="flex-1 flex flex-col gap-1.5" aria-label="Profile navigation">
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-[10px] text-[14px] font-inter transition-all duration-200 ease-[var(--ease)] no-underline group ${isActive
                      ? 'font-semibold text-white bg-white/10'
                      : 'font-medium text-white/70 bg-transparent hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                  {label}
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-[10px] text-[14px] font-inter font-medium text-white/70 bg-transparent border-none cursor-pointer transition-colors duration-200 ease-[var(--ease)] w-full hover:bg-white/5 hover:text-red-400 text-left mt-2"
                aria-label="Log out"
                id="profile-logout"
              >
                <LogOut size={18} className="opacity-70" />
                Log out
              </button>
            </nav>

            {/* Motivational Mascot Widget */}
            <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 relative overflow-hidden flex flex-col justify-end min-h-[140px]">
              <div className="relative z-10 w-[60%]">
                <p className="font-inter text-[12px] font-medium text-white/80 leading-snug mb-1">
                  Stay consistent, vocabulary grows with you.
                </p>
                <div className="text-orange-400 text-[18px]">✨</div>
              </div>

              <img
                src="/images/fox_study.png"
                alt="VocabMitra mascot reading a book"
                className="absolute right-0 bottom-0 w-[90px] h-auto object-contain translate-x-3 translate-y-3 drop-shadow-md"
              />
            </div>
          </aside>

          {/* ─── Main content area ─── */}
          <main className="flex-1 py-8 md:pl-8 overflow-y-auto min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile tab bar */}
      <MobileTabBar onLogout={handleLogout} />
      <Footer />
    </>
  );
}

function MobileTabBar({ onLogout }: { onLogout: () => void }) {
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
