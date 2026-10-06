import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { authApi } from '../../api/endpoints/auth.api';
import { normalizeError } from '../../utils/errorHandler';
import { toAuthUser, extractAuthPayload } from '../../types';

/* ─── Validation schemas ─── */
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username too long'),
  password: z.string().min(1, 'Password is required').max(100, 'Password too long'),
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username too long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    email: z.string().email('Enter a valid email').max(100, 'Email too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password too long'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFields = z.infer<typeof loginSchema>;
type SignupFields = z.infer<typeof signupSchema>;

type AuthTab = 'signin' | 'signup';

interface AuthFormProps {
  /** Initial active tab */
  defaultTab?: AuthTab;
  /** Called on successful auth */
  onSuccess?: () => void;
}

export function AuthForm({ defaultTab = 'signin', onSuccess }: AuthFormProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { addToast } = useUIStore();

  // Intended destination after login (from ProtectedRoute state)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  /* ─── Login form ─── */
  const loginForm = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });

  const handleLogin = loginForm.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      const res = await authApi.login({ username: data.username, password: data.password });
      const { token, user } = extractAuthPayload(res, data.username);

      login(user, token);
      addToast(`Welcome back, ${user.firstName || user.username}!`, 'success');

      const roleUpper = user?.role ? String(user.role).toUpperCase() : '';
      const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'ROLE_ADMIN';

      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        onSuccess ? onSuccess() : navigate(from, { replace: true });
      }
    } catch (err) {
      setSubmitError(normalizeError(err).message);
    }
  });

  /* ─── Signup form ─── */
  const signupForm = useForm<SignupFields>({ resolver: zodResolver(signupSchema) });

  const handleSignup = signupForm.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      const res = await authApi.signup({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      const authUser = toAuthUser(res);
      addToast(`Account created! Welcome, ${authUser.firstName}.`, 'success');
      setTab('signin');
    } catch (err) {
      setSubmitError(normalizeError(err).message);
    }
  });

  const switchTab = (next: AuthTab) => {
    setTab(next);
    setSubmitError(null);
    loginForm.clearErrors();
    signupForm.clearErrors();
  };

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="mb-6">
        <h1 className="font-bricolage text-3xl font-bold text-ink mb-2 tracking-tight">
          {tab === 'signin' ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="text-sm text-ink-soft font-inter leading-relaxed">
          {tab === 'signin'
            ? 'Sign in to access your saved words, track progress, and practice flashcards.'
            : 'Join Vocab Mitra to build your personal vocabulary vault.'}
        </p>
      </div>

      {/* Segmented Pill Tab Toggle */}
      <div
        className="flex p-1.5 bg-cream rounded-2xl border border-black/10 dark:border-white/10 mb-6"
        role="tablist"
        aria-label="Sign in or Sign up"
      >
        {(['signin', 'signup'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => switchTab(t)}
            className={`flex-1 py-2.5 px-4 rounded-xl font-inter text-xs sm:text-sm font-bold transition-all cursor-pointer border-none flex items-center justify-center gap-2 ${
              tab === t
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t === 'signin' ? <LogIn size={15} /> : <UserPlus size={15} />}
            {t === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Error Banner */}
      {submitError && (
        <div
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2.5 mb-6 animate-fade-in"
          role="alert"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* ─── Sign In Form ─── */}
      {tab === 'signin' && (
        <form onSubmit={handleLogin} noValidate role="tabpanel" aria-label="Sign in form" className="space-y-4">
          <Input
            id="signin-username"
            label="Username"
            type="text"
            placeholder="your_username"
            autoComplete="username"
            {...loginForm.register('username')}
            error={loginForm.formState.errors.username?.message}
          />
          <Input
            id="signin-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...loginForm.register('password')}
            error={loginForm.formState.errors.password?.message}
          />
          <button
            type="submit"
            disabled={loginForm.formState.isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            id="signin-submit"
          >
            {loginForm.formState.isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      )}

      {/* ─── Sign Up Form ─── */}
      {tab === 'signup' && (
        <form onSubmit={handleSignup} noValidate role="tabpanel" aria-label="Sign up form" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="signup-firstname"
              label="First Name"
              type="text"
              placeholder="Ada"
              autoComplete="given-name"
              {...signupForm.register('firstName')}
              error={signupForm.formState.errors.firstName?.message}
            />
            <Input
              id="signup-lastname"
              label="Last Name"
              type="text"
              placeholder="Lovelace"
              autoComplete="family-name"
              {...signupForm.register('lastName')}
              error={signupForm.formState.errors.lastName?.message}
            />
          </div>
          <Input
            id="signup-username"
            label="Username"
            type="text"
            placeholder="ada_lovelace"
            autoComplete="username"
            {...signupForm.register('username')}
            error={signupForm.formState.errors.username?.message}
          />
          <Input
            id="signup-email"
            label="Email"
            type="email"
            placeholder="ada@example.com"
            autoComplete="email"
            {...signupForm.register('email')}
            error={signupForm.formState.errors.email?.message}
          />
          <Input
            id="signup-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...signupForm.register('password')}
            error={signupForm.formState.errors.password?.message}
            hint="Minimum 8 characters"
          />
          <Input
            id="signup-confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...signupForm.register('confirmPassword')}
            error={signupForm.formState.errors.confirmPassword?.message}
          />
          <button
            type="submit"
            disabled={signupForm.formState.isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            id="signup-submit"
          >
            {signupForm.formState.isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
