import { Sparkles, Zap, BookmarkCheck, GraduationCap } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

/**
 * AuthPage — fully integrated with Navbar and matching site aesthetic.
 */
export default function AuthPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-black/10 dark:border-white/10 bg-cream-card shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
          
          {/* Left Side: Brand & Ambient Highlights */}
          <div className="lg:col-span-5 relative bg-black/5 dark:bg-white/5 p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10">
            {/* Subtle Ambient Glow */}
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none bg-orange-500/10 blur-3xl"
            />

            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Sparkles size={22} />
                </div>
                <span className="font-bricolage text-xl font-bold text-ink tracking-tight">Vocab Mitra</span>
              </div>

              <blockquote className="font-bricolage text-[clamp(24px,3vw,34px)] font-bold leading-tight tracking-tight text-ink mb-4">
                &ldquo;The limits of my language are the limits of my world.&rdquo;
              </blockquote>
              <cite className="font-space text-xs font-bold tracking-widest uppercase text-ink-soft not-italic block mb-8">
                — Ludwig Wittgenstein
              </cite>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream/60 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <Zap size={18} className="text-orange-500 shrink-0" />
                <span className="text-xs font-semibold text-ink font-inter">Interactive Flashcard Practice</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream/60 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <BookmarkCheck size={18} className="text-orange-500 shrink-0" />
                <span className="text-xs font-semibold text-ink font-inter">Bookmark & Track Learned Words</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream/60 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <GraduationCap size={18} className="text-orange-500 shrink-0" />
                <span className="text-xs font-semibold text-ink font-inter">Exam Focused (CAT, CUET, GRE, UPSC)</span>
              </div>
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <AuthForm />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
