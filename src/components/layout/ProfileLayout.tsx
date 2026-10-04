import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Bookmark, LogOut, BarChart2, Settings, HelpCircle, MessageSquare, Target, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { authApi } from '../../api/endpoints/auth.api';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const NAV_SECTIONS = [
  {
    title: '',
    items: [
      { to: '/profile', label: 'Home', icon: Home, iconColor: 'text-orange-500', end: true, fill: true },
      { to: '/vocabulary', label: 'Vocabulary', icon: BookOpen, iconColor: 'text-emerald-600', end: false, fill: false },
      { to: '/profile/exam-focus', label: 'Exam Focus', icon: Target, iconColor: 'text-red-500', end: false, fill: false },
    ]
  },
  {
    title: 'YOUR LEARNING',
    items: [
      { to: '/profile/bookmarks', label: 'Bookmarks', icon: Bookmark, iconColor: 'text-red-500', end: false, fill: true },
      { to: '/profile/learned', label: 'Progress', icon: BarChart2, iconColor: 'text-blue-500', end: false, fill: false },
    ]
  },
  {
    title: 'OTHER',
    items: [
      { to: '/profile/settings', label: 'Settings', icon: Settings, iconColor: 'text-slate-500', end: false, fill: true },
    ]
  }
];

export default function ProfileLayout() {
  const { setProfile, logout } = useAuthStore();
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
            className="hidden md:flex w-[260px] lg:w-[280px] shrink-0 border-r border-black/5 py-8 pr-6 pl-4 sm:pl-6 md:pl-8 flex-col sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto bg-[#fdfbf7]"
          >
            {/* Nav items */}
            <nav className="flex-1 flex flex-col gap-6" aria-label="Profile navigation">
              {NAV_SECTIONS.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  {section.title && (
                    <h4 className="text-[11px] font-inter font-bold text-[#64748b] tracking-widest uppercase mb-1 px-3">
                      {section.title}
                    </h4>
                  )}
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3.5 px-3 py-3 rounded-[12px] text-[15px] font-inter transition-all duration-200 no-underline group ${isActive
                            ? 'font-bold text-[#ea580c] bg-[#ffedd5]'
                            : 'font-medium text-[#0f172a] hover:bg-black/5'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={20}
                              className={`transition-colors ${isActive ? 'text-[#ea580c]' : item.iconColor}`}
                              fill={item.fill ? "currentColor" : "none"}
                              strokeWidth={item.fill ? 1.5 : 2}
                            />
                            {item.label}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Bottom Sidebar Elements */}
            <div className="mt-8 flex flex-col gap-4">

              {/* Help & Feedback */}
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-inter font-medium text-[#64748b] bg-transparent border-none cursor-pointer hover:bg-black/5 hover:text-[#0f172a] text-left transition-colors">
                  <HelpCircle size={18} />
                  Help
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-inter font-medium text-[#64748b] bg-transparent border-none cursor-pointer hover:bg-black/5 hover:text-[#0f172a] text-left transition-colors">
                  <MessageSquare size={18} />
                  Feedback
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-inter font-medium text-[#64748b] bg-transparent border-none cursor-pointer hover:bg-red-50 hover:text-red-500 text-left transition-colors"
                >
                  <LogOut size={18} />
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
  const flattenedItems = NAV_SECTIONS.flatMap(s => s.items);
  // Just take the first 4 for mobile tab bar
  const mobileItems = flattenedItems.slice(0, 4);

  return (
    <nav
      className="md:hidden sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-black/5 px-4 shadow-sm"
      aria-label="Profile tabs"
    >
      <div className="flex gap-0 overflow-x-auto justify-between">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 px-4 text-[11px] font-inter no-underline whitespace-nowrap shrink-0 border-b-2 ${isActive
                  ? 'font-bold text-[#ea580c] border-[#ea580c]'
                  : 'font-medium text-[#64748b] border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? 'text-[#ea580c]' : item.iconColor} fill={item.fill ? "currentColor" : "none"} strokeWidth={item.fill ? 1.5 : 2} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
