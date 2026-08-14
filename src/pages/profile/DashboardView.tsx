import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, BookOpen, Bookmark, Flame, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { MOCK_VOCAB_CARDS } from '../../api/mock/fixtures/vocabFixtures';

// Mock profile data — replace with authApi.getProfile() in production
const MOCK_PROFILE = {
  totalBookmarked: 12,
  totalLearned: 47,
  currentStreak: 0, // BLOCKED — not in backend DTO yet, stub as 0
};

// Mock category breakdown from learned words
const CATEGORY_BREAKDOWN = [
  { tag: 'UPSC', count: 18, color: '#FF5A5F' },
  { tag: 'GRE', count: 14, color: '#1F8A8C' },
  { tag: 'CAT', count: 8, color: '#FFE58A' },
  { tag: 'SSC', count: 5, color: '#3DDC97' },
  { tag: 'CUET', count: 2, color: '#8891A3' },
];

const MAX_COUNT = Math.max(...CATEGORY_BREAKDOWN.map((c) => c.count));

export default function DashboardView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const recentLearned = MOCK_VOCAB_CARDS.filter((c) => c.isLearned).slice(0, 3);
  const recentBookmarked = MOCK_VOCAB_CARDS.filter((c) => c.isBookmarked).slice(0, 3);

  return (
    <div className="max-w-[820px]">
      {/* ─── Identity header ─── */}
      <div className="flex items-center justify-between mb-9 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cream-card border border-solid border-line flex items-center justify-center font-space text-xl font-bold text-upsc">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : '??'}
          </div>
          <div>
            <h1 className="font-bricolage text-2xl font-bold text-ink mb-0.5 mt-0">
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </h1>
            <div className="font-space text-xs text-ink-soft">
              @{user?.username}
            </div>
          </div>
        </div>
        <button
          onClick={() => setEditMode((v) => !v)}
          className="inline-flex items-center gap-1.5 py-2 px-4 rounded-[10px] border border-solid border-line bg-cream text-ink-soft text-[13px] font-inter font-medium cursor-pointer transition-colors duration-200 ease-[var(--ease)] hover:border-upsc hover:text-upsc"
          id="edit-profile-btn"
        >
          <Edit3 size={13} />
          {editMode ? 'Cancel edit' : 'Edit profile'}
        </button>
      </div>

      {editMode && (
        <div className="bg-cream border border-solid border-line rounded-xl p-5 mb-7">
          <p className="font-space text-xs text-ink-soft text-center m-0">
            Profile editing — coming soon. Wire to PATCH /user/profile when backend endpoint is confirmed.
          </p>
        </div>
      )}

      {/* ─── Stats strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8">
        {[
          { icon: Flame, label: 'Current Streak', value: `${MOCK_PROFILE.currentStreak}d`, note: '(coming soon)', color: '#FF5A5F' },
          { icon: BookOpen, label: 'Words Learned', value: MOCK_PROFILE.totalLearned, note: null, color: 'var(--upsc)' },
          { icon: Bookmark, label: 'Bookmarked', value: MOCK_PROFILE.totalBookmarked, note: null, color: 'var(--upsc)' },
        ].map(({ icon: Icon, label, value, note, color }) => (
          <div
            key={label}
            className="bg-cream border border-solid border-line rounded-xl pt-[22px] px-5 pb-[22px]"
          >
            <Icon size={20} style={{ color }} className="mb-2.5" />
            <div className="font-bricolage text-[28px] font-bold text-ink leading-none">
              {value}
            </div>
            <div className="font-space text-[11px] text-ink-soft mt-1">
              {label}
              {note && <span className="opacity-60"> {note}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Category breakdown chart ─── */}
      <div className="bg-cream border border-solid border-line rounded-2xl p-7 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-upsc" />
          <h2 className="font-bricolage text-[17px] font-bold text-ink m-0">
            Category Breakdown
          </h2>
          <span className="font-space text-[11px] text-ink-soft ml-auto">
            from learned words
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {CATEGORY_BREAKDOWN.map(({ tag, count, color }) => (
            <div key={tag} className="flex items-center gap-3">
              <span className="font-space text-[11px] font-medium text-ink-soft w-10 shrink-0">
                {tag}
              </span>
              <div className="flex-1 h-2 bg-cream-card rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-600 ease-[var(--ease)]"
                  style={{
                    width: `${(count / MAX_COUNT) * 100}%`,
                    background: color,
                  }}
                />
              </div>
              <span className="font-space text-xs font-bold text-ink w-6 text-right shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Recent previews ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Recently Learned */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bricolage text-base font-bold text-ink m-0">
              Recently Learned
            </h3>
            <button onClick={() => navigate('/profile/learned')} className="font-space text-[11px] text-upsc bg-transparent border-none cursor-pointer p-0">
              See all →
            </button>
          </div>
          {recentLearned.length > 0 ? recentLearned.map((c) => (
            <div key={c.vocab.id} className="flex items-center gap-2.5 py-2.5 px-0 border-b border-solid border-line">
              <BookOpen size={14} className="text-upsc shrink-0" />
              <div>
                <div className="font-bricolage font-semibold text-sm text-ink">{c.vocab.vocab}</div>
                <div className="text-xs text-ink-soft">{c.vocab.meaning.slice(0, 50)}…</div>
              </div>
            </div>
          )) : (
            <p className="font-space text-xs text-ink-soft m-0">No learned words yet.</p>
          )}
        </div>

        {/* Recently Bookmarked */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bricolage text-base font-bold text-ink m-0">
              Bookmarked
            </h3>
            <button onClick={() => navigate('/profile/bookmarks')} className="font-space text-[11px] text-upsc bg-transparent border-none cursor-pointer p-0">
              See all →
            </button>
          </div>
          {recentBookmarked.length > 0 ? recentBookmarked.map((c) => (
            <div key={c.vocab.id} className="flex items-center gap-2.5 py-2.5 px-0 border-b border-solid border-line">
              <Bookmark size={14} className="text-upsc shrink-0" />
              <div>
                <div className="font-bricolage font-semibold text-sm text-ink">{c.vocab.vocab}</div>
                <div className="text-xs text-ink-soft">{c.vocab.meaning.slice(0, 50)}…</div>
              </div>
            </div>
          )) : (
            <p className="font-space text-xs text-ink-soft m-0">No bookmarks yet. Open any word and bookmark it!</p>
          )}
        </div>
      </div>
    </div>
  );
}
