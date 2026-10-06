import { CheckCircle2, ArrowRight } from 'lucide-react';

export interface ExamCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colorTheme: 'orange' | 'purple' | 'blue' | 'green';
  features: string[];
}

interface ExploreExamCardProps {
  exam: ExamCategory;
  onClick: () => void;
}

const THEME_STYLES = {
  orange: {
    bg: 'bg-[#fff8f0] dark:bg-[#18181b]',
    border: 'border-[#fed7aa]/60 hover:border-[#f97316] dark:border-white/10 dark:hover:border-orange-500/50',
    iconBg: 'bg-[#ffedd5] text-[#ea580c] dark:bg-orange-500/15 dark:text-orange-400',
    barColor: 'bg-[#ea580c] dark:bg-orange-500',
    checkColor: 'text-[#ea580c] dark:text-orange-400',
    checkBg: 'bg-[#ffedd5] dark:bg-orange-500/15',
    btnColor: 'text-[#ea580c] dark:text-orange-400',
    glowColor: 'from-[#ffedd5]/60 dark:from-orange-500/10',
    illustrationColor: '#f97316',
  },
  purple: {
    bg: 'bg-[#faf5ff] dark:bg-[#18181b]',
    border: 'border-[#e9d5ff]/60 hover:border-[#a855f7] dark:border-white/10 dark:hover:border-purple-500/50',
    iconBg: 'bg-[#f3e8ff] text-[#9333ea] dark:bg-purple-500/15 dark:text-purple-400',
    barColor: 'bg-[#9333ea] dark:bg-purple-500',
    checkColor: 'text-[#9333ea] dark:text-purple-400',
    checkBg: 'bg-[#f3e8ff] dark:bg-purple-500/15',
    btnColor: 'text-[#9333ea] dark:text-purple-400',
    glowColor: 'from-[#f3e8ff]/60 dark:from-purple-500/10',
    illustrationColor: '#a855f7',
  },
  blue: {
    bg: 'bg-[#f0f9ff] dark:bg-[#18181b]',
    border: 'border-[#bae6fd]/60 hover:border-[#0284c7] dark:border-white/10 dark:hover:border-sky-500/50',
    iconBg: 'bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-500/15 dark:text-sky-400',
    barColor: 'bg-[#0284c7] dark:bg-sky-500',
    checkColor: 'text-[#0284c7] dark:text-sky-400',
    checkBg: 'bg-[#e0f2fe] dark:bg-sky-500/15',
    btnColor: 'text-[#0284c7] dark:text-sky-400',
    glowColor: 'from-[#e0f2fe]/60 dark:from-sky-500/10',
    illustrationColor: '#0284c7',
  },
  green: {
    bg: 'bg-[#f0fdf4] dark:bg-[#18181b]',
    border: 'border-[#bbf7d0]/60 hover:border-[#16a34a] dark:border-white/10 dark:hover:border-emerald-500/50',
    iconBg: 'bg-[#dcfce7] text-[#16a34a] dark:bg-emerald-500/15 dark:text-emerald-400',
    barColor: 'bg-[#16a34a] dark:bg-emerald-500',
    checkColor: 'text-[#16a34a] dark:text-emerald-400',
    checkBg: 'bg-[#dcfce7] dark:bg-emerald-500/15',
    btnColor: 'text-[#16a34a] dark:text-emerald-400',
    glowColor: 'from-[#dcfce7]/60 dark:from-emerald-500/10',
    illustrationColor: '#16a34a',
  },
};

export function ExploreExamCard({ exam, onClick }: ExploreExamCardProps) {
  const styles = THEME_STYLES[exam.colorTheme] || THEME_STYLES.orange;
  const Icon = exam.icon;

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      tabIndex={0}
      role="button"
      className={`group relative flex flex-col justify-between rounded-[24px] p-6 sm:p-7 border ${styles.bg} ${styles.border} shadow-xs hover:shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 overflow-hidden min-h-[260px] cursor-pointer select-none`}
    >
      {/* ── Soft Top-Right Color Glow ── */}
      <div className={`absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl ${styles.glowColor} to-transparent opacity-60 rounded-tl-full pointer-events-none transition-transform duration-500 group-hover:scale-110`} />

      {/* ── Top Row: Icon + Title + Tags ── */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${styles.iconBg}`}>
            <Icon size={26} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-bricolage text-[24px] font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight">
              {exam.title}
            </h3>
            <p className="font-inter text-[13px] font-bold text-[#64748b] dark:text-ink-soft mt-1 tracking-wide uppercase">
              {exam.subtitle}
            </p>
            <div className={`w-10 h-1 rounded-full ${styles.barColor} mt-2`} />
          </div>
        </div>

        {/* ── Right Section Illustration ── */}
        <div className="hidden sm:block absolute top-0 right-0 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
          {exam.colorTheme === 'orange' && (
            <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
              <path d="M20 70 L40 50 L60 60 L90 20" stroke={styles.illustrationColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M75 20 H90 V35" stroke={styles.illustrationColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="15" y="65" width="12" height="20" rx="3" fill={styles.illustrationColor} />
              <rect x="35" y="45" width="12" height="40" rx="3" fill={styles.illustrationColor} />
              <rect x="55" y="55" width="12" height="30" rx="3" fill={styles.illustrationColor} />
              <rect x="75" y="25" width="12" height="60" rx="3" fill={styles.illustrationColor} />
            </svg>
          )}

          {exam.colorTheme === 'purple' && (
            <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
              <rect x="25" y="45" width="70" height="18" rx="4" fill={styles.illustrationColor} transform="rotate(-10 25 45)" />
              <rect x="20" y="25" width="70" height="18" rx="4" fill={styles.illustrationColor} transform="rotate(-5 20 25)" />
              <rect x="15" y="65" width="75" height="20" rx="4" fill={styles.illustrationColor} />
            </svg>
          )}

          {exam.colorTheme === 'blue' && (
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <path d="M45 10 L80 30 V80 H10 V30 Z" fill="none" stroke={styles.illustrationColor} strokeWidth="4" />
              <rect x="25" y="40" width="8" height="30" fill={styles.illustrationColor} />
              <rect x="41" y="40" width="8" height="30" fill={styles.illustrationColor} />
              <rect x="57" y="40" width="8" height="30" fill={styles.illustrationColor} />
            </svg>
          )}

          {exam.colorTheme === 'green' && (
            <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
              <path d="M10 45 L90 15 L70 45 L90 75 Z" fill={styles.illustrationColor} />
              <path d="M40 30 L60 45 L40 60 Z" fill="white" />
            </svg>
          )}
        </div>
      </div>

      {/* ── Middle: Checklist Items ── */}
      <div className="my-5 flex flex-col gap-2.5 relative z-10">
        {exam.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${styles.checkBg} ${styles.checkColor}`}>
              <CheckCircle2 size={14} strokeWidth={2.5} />
            </div>
            <span className="font-inter text-[14px] font-medium text-[#334155] dark:text-[#cbd5e1]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom: Explore CTA ── */}
      <div className="relative z-10 pt-2">
        <div className={`inline-flex items-center gap-2 font-inter font-bold text-[14px] ${styles.btnColor} group-hover:translate-x-1 transition-transform`}>
          <span>Explore</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
