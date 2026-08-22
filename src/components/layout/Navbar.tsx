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
    <nav
      className="sticky top-0 z-50 transition-colors duration-400"
      style={{
        background: theme === 'dark' ? 'rgba(18,18,18,0.65)' : 'rgba(244,250,255,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(11,83,148,0.12)',
      }}
    >
      <div className="vv-container flex justify-between items-center py-4 sm:py-5">
        {/* Wordmark */}
        <NavLink
          to="/"
          aria-label="Vocab Mitra home"
          className="no-underline"
        >
          <div className="flex items-center">
            <img 
              src={theme === 'dark' ? "/vocab_mitra_logo.png" : "/vocab_mitra_logo_white.png"} 
              alt="Vocab Mitra Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1 text-sm font-semibold">
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
                `px-4 py-2 rounded-full font-inter transition-colors duration-200 no-underline ${
                  isActive
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-ink-soft bg-transparent hover:bg-white/5 hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Nav right */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            id="theme-toggle"
            className="w-9 h-9 rounded-full border border-line bg-transparent text-ink-soft flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-line hover:text-ink hover:border-line"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Avatar / Login */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setAvatarMenuOpen((v) => !v)}
                aria-label="Open account menu"
                aria-expanded={avatarMenuOpen}
                id="avatar-button"
                className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-space text-xs font-bold text-white cursor-pointer ring-2 ring-orange-500/30 hover:ring-orange-500/60 transition-all"
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
                    className="absolute right-0 top-[calc(100%+8px)] rounded-xl p-1.5 min-w-[180px] z-50 shadow-2xl shadow-black/30 animate-[fadeUp_0.2s_var(--ease)_forwards]"
                    style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--dropdown-border)' }}
                    role="menu"
                  >
                    <div className="px-3 pt-2 pb-2.5 border-b border-line mb-1">
                      <div className="font-bricolage font-semibold text-[15px] text-ink">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="font-space text-[11px] text-ink-soft">
                        @{user.username}
                      </div>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setAvatarMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent border-none cursor-pointer text-ink text-[13px] font-inter font-semibold transition-colors duration-150 hover:bg-white/5"
                      role="menuitem"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent border-none cursor-pointer text-orange-400 text-[13px] font-inter font-semibold transition-colors duration-150 hover:bg-white/5"
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
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold font-inter transition-all duration-200 cursor-pointer hover:bg-orange-400 hover:shadow-[0_4px_20px_rgba(249,115,22,0.35)]"
            >
              <LogIn size={15} />
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
