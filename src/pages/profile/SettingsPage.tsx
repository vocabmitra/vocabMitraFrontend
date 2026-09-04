import { useState, useEffect } from 'react';
import { User, Mail, AtSign, Check, Shield, Sun, Moon, Sparkles, Key, Save } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

import { authApi } from '../../api/endpoints/auth.api';
import { normalizeError } from '../../utils/errorHandler';

export default function SettingsPage() {
  const { user, profile, setProfile } = useAuthStore();
  const { addToast } = useUIStore();
  const { theme, toggleTheme } = useThemeStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync initial form values from auth store / profile response
  useEffect(() => {
    setFirstName(profile?.firstName || user?.firstName || '');
    setLastName(profile?.lastName || user?.lastName || '');
    setEmail(profile?.email || user?.email || '');
  }, [profile, user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updates: { firstName?: string; lastName?: string; email?: string } = {};

    if (firstName.trim()) updates.firstName = firstName.trim();
    if (lastName.trim()) updates.lastName = lastName.trim();
    if (email.trim()) updates.email = email.trim();

    try {
      const updatedProfile = await authApi.updateProfile(updates);
      if (updatedProfile && updatedProfile.firstName) {
        setProfile(updatedProfile);
      } else if (profile) {
        setProfile({
          ...profile,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        });
      }
      addToast('Profile details updated successfully!', 'success');
    } catch (err) {
      console.error('Profile update failed:', err);
      // Fallback update in state
      if (profile) {
        setProfile({
          ...profile,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        });
      }
      addToast(normalizeError(err).message || 'Profile updated!', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFirstName(profile?.firstName || user?.firstName || '');
    setLastName(profile?.lastName || user?.lastName || '');
    setEmail(profile?.email || user?.email || '');
  };

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col gap-8 pb-16 pr-4 sm:pr-6 md:pr-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="font-bricolage text-[28px] sm:text-[34px] font-bold text-ink leading-tight">
            Account Settings
          </h1>
          <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 font-inter text-[11px] font-bold">
            Preferences
          </span>
        </div>
        <p className="font-inter text-[14px] text-ink-soft">
          Manage your personal details, profile settings, and application preferences.
        </p>
      </div>

      {/* ─── 1. UPDATE PROFILE FORM SECTION ─── */}
      <div className="bg-cream-card rounded-2xl p-6 sm:p-8 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col gap-6">
        
        {/* Section Title */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bricolage text-[20px] font-bold text-ink leading-tight">
                Update My Profile
              </h2>
              <span className="font-inter text-[12px] text-ink-soft">
                Personal information & contact details
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-ink-soft font-inter text-[11px] font-medium border border-transparent dark:border-white/5">
            <Shield size={12} className="text-green-500" />
            Verified User
          </span>
        </div>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 mt-2">
          
          {/* Username Readonly Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <AtSign size={18} className="text-orange-500 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
              <div className="flex items-baseline gap-2">
                <span className="font-inter text-[12px] text-ink-soft font-medium">Username:</span>
                <span className="font-inter text-[14px] font-bold text-ink">
                  @{profile?.username || user?.username || 'user'}
                </span>
              </div>
              <span className="font-inter text-[11px] text-ink-soft italic">
                (Username is unique and cannot be changed)
              </span>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* First Name Input */}
            <div className="flex flex-col gap-2">
              <label className="font-inter text-[13px] font-semibold text-ink flex items-center gap-1.5">
                <User size={14} className="text-orange-500" />
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
                className="w-full bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-inter text-[14px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all shadow-sm"
              />
            </div>

            {/* Last Name Input */}
            <div className="flex flex-col gap-2">
              <label className="font-inter text-[13px] font-semibold text-ink flex items-center gap-1.5">
                <User size={14} className="text-orange-500" />
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-inter text-[14px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all shadow-sm"
              />
            </div>

          </div>

          {/* Email Address Input */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-[13px] font-semibold text-ink flex items-center gap-1.5">
              <Mail size={14} className="text-orange-500" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
              className="w-full bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-inter text-[14px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all shadow-sm"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-inter text-[13px] font-medium text-ink-soft hover:text-ink bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all border-none cursor-pointer"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl font-inter text-[14px] font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.35)] active:scale-95 transition-all border-none cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* ─── 2. THEME & APPEARANCE SECTION ─── */}
      <div className="bg-cream-card rounded-2xl p-6 sm:p-8 border border-black/5 dark:border-white/5 dark:border-t-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 border border-purple-500/20 shadow-inner">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bricolage text-[20px] font-bold text-ink leading-tight">
                Appearance & Theme
              </h2>
              <span className="font-inter text-[12px] text-ink-soft">
                Customize your visual interface preference
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon size={20} className="text-purple-400" />
            ) : (
              <Sun size={20} className="text-orange-500" />
            )}
            <div className="flex flex-col">
              <span className="font-inter text-[14px] font-semibold text-ink capitalize">
                {theme} Mode Active
              </span>
              <span className="font-inter text-[12px] text-ink-soft">
                Switch between high-contrast dark theme and warm light theme
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl font-inter text-[13px] font-semibold text-ink bg-white/80 dark:bg-white/10 border border-black/10 dark:border-white/10 hover:border-orange-500/50 shadow-sm transition-all cursor-pointer"
          >
            Switch Theme
          </button>
        </div>
      </div>

    </div>
  );
}
