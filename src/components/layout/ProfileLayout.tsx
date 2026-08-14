import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bookmark, CheckCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { authApi } from '../../api/endpoints/auth.api';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const NAV_ITEMS = [
  { to: '/profile', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile/bookmarks', label: 'Bookmarked Vocabs', icon: Bookmark, end: false },
  { to: '/profile/learned', label: 'Learned Vocabs', icon: CheckCircle, end: false },
];

export default function ProfileLayout() {
  const { user, logout } = useAuthStore();
  const { addToast } = useUIStore();
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
      <div className="bg-[var(--cream)]">
        <div className="vv-container flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
          {/* ─── Desktop Sidebar ─── */}
          <aside className="hidden md:flex w-[240px] shrink-0 border-r border-line py-8 pr-4 flex-col sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto">
          {/* User mini-card */}
          {user && (
            <div className="px-3 pb-5 mb-2 border-b border-line">
              <div className="w-11 h-11 rounded-xl bg-line/30 border border-line flex items-center justify-center font-space text-sm font-bold text-upsc mb-2.5">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="font-bricolage font-semibold text-[15px] text-ink">
                {user.firstName} {user.lastName}
              </div>
              <div className="font-space text-[11.5px] text-ink-soft">
                @{user.username}
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="flex-1 flex flex-col gap-0.5" aria-label="Profile navigation">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-inter transition-colors duration-200 ease-[var(--ease)] no-underline ${
                    isActive
                      ? 'font-semibold text-upsc bg-upsc/10'
                      : 'font-medium text-ink-soft bg-transparent hover:bg-line/30 hover:text-ink'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout at bottom */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-inter font-medium text-ink-soft bg-transparent border-none cursor-pointer transition-colors duration-200 ease-[var(--ease)] w-full hover:bg-line/30 hover:text-upsc"
            aria-label="Log out"
            id="profile-logout"
          >
            <LogOut size={16} />
            Log out
          </button>
        </aside>

        {/* ─── Main content area ─── */}
        <main className="flex-1 px-4 py-5 pb-20 md:p-10 overflow-y-auto min-w-0">
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
              `flex flex-col items-center gap-1 py-3 px-4 text-[11px] font-inter no-underline whitespace-nowrap shrink-0 border-b-2 ${
                isActive
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
