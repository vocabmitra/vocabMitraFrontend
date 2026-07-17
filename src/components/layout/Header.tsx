import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Search, Moon, Sun, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, logout } = useAuthStore();
  const { openAuthModal } = useUIStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="mb-14 flex items-center justify-between">
      <Link to="/" className="font-fraunces text-xl font-medium tracking-wide">
        vocabulary <span className="text-accent italic">vault</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search words..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border border-hairline rounded-full py-1.5 pl-8 pr-4 text-sm focus:outline-none focus:border-accent text-text-primary placeholder:text-text-secondary font-inter"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </form>

        <button 
          onClick={toggleTheme} 
          className="border border-hairline bg-transparent text-text-secondary font-mono text-[12px] tracking-wider px-3.5 py-2 rounded-full cursor-pointer hover:border-accent hover:text-accent transition-colors flex items-center gap-2"
        >
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          <span className="hidden sm:inline">toggle mode</span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-text-secondary hover:text-accent transition-colors">
              <UserIcon size={20} />
            </Link>
            <button onClick={logout} className="font-mono text-[12px] uppercase text-text-secondary hover:text-mnemonic tracking-wider">
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => openAuthModal('login')} 
            className="font-mono text-[12px] uppercase text-text-secondary hover:text-accent tracking-wider"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
