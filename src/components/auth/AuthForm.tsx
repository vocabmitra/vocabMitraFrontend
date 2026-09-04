import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { authApi } from '../../api/endpoints/auth.api';
import { normalizeError } from '../../utils/errorHandler';
import { toAuthUser, extractAuthPayload } from '../../types';

/* ─── Validation schemas ─── */
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username too long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
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

      console.log('[AuthForm] Login successful, payload extracted:', { token, user });

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
      // OPEN: backend may return a token on signup; if not, redirect to sign in
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
    <div style={{ width: '100%' }}>
      {/* Segmented tab toggle */}
      <div
        style={{
          display: 'flex',
          background: 'var(--cream)',
          border: '2px solid var(--ink)',
          borderRadius: '16px',
          padding: '6px',
          marginBottom: '32px',
        }}
        role="tablist"
        aria-label="Sign in or Sign up"
      >
        {(['signin', 'signup'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => switchTab(t)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              fontWeight: 700,
              border: '2px solid transparent',
              cursor: 'pointer',
              transition: 'background 0.2s var(--ease), color 0.2s var(--ease), border-color 0.2s var(--ease)',
              background: tab === t ? 'var(--ink)' : 'transparent',
              color: tab === t ? 'var(--cream)' : 'var(--ink)',
            }}
            onMouseEnter={(e) => {
              if (tab !== t) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--line)';
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== t) {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }
            }}
          >
            {t === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {submitError && (
        <div
          style={{
            background: 'color-mix(in srgb, #FF5A5F 10%, var(--cream-card))',
            border: '2px dashed #FF5A5F',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FF5A5F',
            fontFamily: "'Inter', sans-serif",
          }}
          role="alert"
        >
          {submitError}
        </div>
      )}

      {/* ─── Sign In form ─── */}
      {tab === 'signin' && (
        <form onSubmit={handleLogin} noValidate role="tabpanel" aria-label="Sign in form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loginForm.formState.isSubmitting}
              style={{ width: '100%', marginTop: '12px' }}
              id="signin-submit"
            >
              Sign In
            </Button>
          </div>
        </form>
      )}

      {/* ─── Sign Up form ─── */}
      {tab === 'signup' && (
        <form onSubmit={handleSignup} noValidate role="tabpanel" aria-label="Sign up form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={signupForm.formState.isSubmitting}
              style={{ width: '100%', marginTop: '12px' }}
              id="signup-submit"
            >
              Create Account
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
