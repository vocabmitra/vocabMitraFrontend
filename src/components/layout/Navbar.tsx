import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api/endpoints/auth.api';
import { useUIStore } from '../../store/useUIStore';

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    addToast('Signed out. See you soon!', 'info');
    navigate('/');
    setAvatarMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b-2 border-ink transition-colors duration-400 ease-[var(--ease)]">
      <div className="vv-container flex justify-between items-center py-4 sm:py-5">
        {/* Wordmark */}
        <NavLink
          to="/"
          aria-label="Vocab Mitra home"
          className="no-underline"
        >
          <div className="font-space text-lg font-bold flex items-center gap-0.5 text-ink">
            <span className="text-upsc">[</span>
            vocab mitra
            <span className="text-upsc">]</span>
          </div>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          {[
            { to: '/', label: 'Home' },
            { to: '/vocabulary', label: 'Vocabulary' },
            { to: '/profile', label: 'Profile' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full font-inter transition-colors duration-200 ease-[var(--ease-soft)] no-underline ${
                  isActive
                    ? 'text-cream bg-ink'
                    : 'text-ink-soft bg-transparent hover:bg-line hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Nav right */}
        <div className="flex items-center gap-3.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            id="theme-toggle"
            className="w-9 h-9 rounded-full border-2 border-ink bg-transparent text-ink flex items-center justify-center transition-all duration-400 ease-[var(--ease)] cursor-pointer hover:bg-ink hover:text-cream hover:scale-105 hover:-rotate-12"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Avatar / Login */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setAvatarMenuOpen((v) => !v)}
                aria-label="Open account menu"
                aria-expanded={avatarMenuOpen}
                id="avatar-button"
                className="w-9 h-9 rounded-full bg-upsc border-2 border-ink flex items-center justify-center font-space text-xs font-bold text-white cursor-pointer"
              >
                {initials}
              </button>
              {/* Dropdown */}
              {avatarMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAvatarMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] bg-cream-card border-2 border-ink rounded-xl p-1.5 min-w-[180px] z-50 shadow-[4px_4px_0_var(--ink)] animate-[fadeUp_0.2s_var(--ease)_forwards]"
                    role="menu"
                  >
                    <div className="px-3 pt-2 pb-2.5 border-b-2 border-line mb-1">
                      <div className="font-bricolage font-semibold text-[15px] text-ink">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="font-space text-[11px] text-ink-soft">
                        @{user.username}
                      </div>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setAvatarMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent border-none cursor-pointer text-ink text-[13px] font-inter font-semibold transition-colors duration-150 hover:bg-line"
                      role="menuitem"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent border-none cursor-pointer text-upsc text-[13px] font-inter font-semibold transition-colors duration-150 hover:bg-line"
                      role="menuitem"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              aria-label="Log in"
              id="login-button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-ink bg-cream-card text-ink text-sm font-semibold font-inter transition-all duration-200 ease-[var(--ease)] cursor-pointer shadow-[2px_2px_0_var(--ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_var(--ink)]"
            >
              <LogIn size={15} />
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
