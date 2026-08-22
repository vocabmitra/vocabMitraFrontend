import { AuthForm } from '../components/auth/AuthForm';

/**
 * AuthPage — no Navbar per spec.
 * Full-page auth with two-panel layout: left branding, right form.
 */
export default function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-transparent">
      {/* ─── Left panel: brand + ambient art ─── */}
      <div className="relative bg-transparent hidden md:flex flex-col justify-between p-10 md:p-12 border-r-2 border-solid border-ink overflow-hidden">
        {/* Ambient glow (kept for subtle accent but changed to cream theme) */}
        <div
          aria-hidden="true"
          className="absolute -bottom-[100px] -left-[100px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--upsc) 8%, transparent), transparent 55%),
                         radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--cat) 8%, transparent), transparent 55%)`,
          }}
        />

        {/* Wordmark */}
        <div className="font-space text-[18px] font-bold flex items-center gap-0.5 text-ink relative z-10">
          <span className="text-upsc">[</span>
          vocab mitra
          <span className="text-upsc">]</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <blockquote className="font-bricolage text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink mb-5 max-w-[18ch]">
            "The limits of my language are the limits of my world."
          </blockquote>
          <cite className="font-space text-xs font-bold tracking-[0.06em] uppercase text-ink-soft not-italic">
            — Ludwig Wittgenstein
          </cite>
        </div>

        {/* Bottom label */}
        <div className="font-space text-[11.5px] text-ink-soft relative z-10 font-bold">
          © {new Date().getFullYear()} Vocab Mitra
        </div>
      </div>

      {/* ─── Right panel: form ─── */}
      <div className="flex items-start md:items-center justify-center pt-[60px] md:pt-12 pb-10 px-6 md:p-12 bg-cream-card">
        <div className="w-full max-w-[440px]">
          <div className="mb-9">
            <h1 className="font-bricolage text-4xl font-bold text-ink mb-2 tracking-[-0.02em] mt-0">
              Welcome
            </h1>
            <p className="text-base text-ink-soft font-inter leading-[1.5] m-0">
              Sign in to save words, track progress, and build your vocabulary.
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
