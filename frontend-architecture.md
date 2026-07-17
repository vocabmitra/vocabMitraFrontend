# Vocabulary Vault — Frontend Architecture (Build Phase: Mock Data)

**Stack:** Vite, React, TypeScript, Tailwind CSS, Zustand, React Router, Axios (configured, unused for now), Lucide React
**Scope:** Frontend only. Backend does not exist yet — this app runs entirely on a mock data layer that mirrors the real API contract, so switching to the live backend later is a one-line import change, not a rewrite.

---

## 1. Routing

Full routes exist now, not just components:

```
/                     HomePage        — hero, Word of the Day, stats, browse grid
/word/:slug           WordDetailPage  — dictionary entry view
/category/:slug       CategoryPage    — browse grid filtered to one category
/flashcards           FlashcardsPage  — flip-card mode (optional ?category= query param)
/quiz                 QuizPage        — auto-generated MCQ challenge
/profile              ProfilePage     — PROTECTED: bookmarks + progress dashboard
```

`ProfilePage` is the only route wrapped in `<ProtectedRoute>` (redirects to `/` and opens the auth modal if no mock session exists). Every other gated *action* (bookmark a word from the detail page, track progress) uses the in-place `useAuthGate` modal pattern instead of a route redirect — see architecture v1 rationale, unchanged.

```tsx
// routes/AppRouter.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/word/:slug" element={<WordDetailPage />} />
  <Route path="/category/:slug" element={<CategoryPage />} />
  <Route path="/flashcards" element={<FlashcardsPage />} />
  <Route path="/quiz" element={<QuizPage />} />
  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
</Routes>
```

---

## 2. Folder Structure

```
src/
├── api/
│   ├── axiosInstance.ts        # configured now, unused until real backend exists
│   ├── endpoints/               # will call axiosInstance once backend is live
│   │   ├── auth.api.ts
│   │   ├── words.api.ts
│   │   └── progress.api.ts
│   └── mock/                    # ACTIVE data source for this build phase
│       ├── mockClient.ts        # shared fake-latency + fake-error helper
│       ├── fixtures/
│       │   ├── words.fixtures.ts
│       │   ├── categories.fixtures.ts
│       │   └── users.fixtures.ts
│       ├── mockWords.api.ts
│       ├── mockAuth.api.ts
│       └── mockProgress.api.ts
│
├── components/
│   ├── common/                  # Button, Input, Modal, Badge, Skeleton, Toast
│   ├── layout/                  # Header, Footer, PageShell
│   ├── word/                    # WordCard, WordDetail, MnemonicNote, ExampleQuote
│   └── auth/                    # AuthModal, LoginForm, SignupForm
│
├── features/
│   ├── words/
│   ├── flashcards/
│   ├── quiz/
│   ├── progress/
│   └── bookmarks/
│
├── hooks/
│   ├── useAuthGate.ts
│   ├── useTheme.ts
│   └── useDebounce.ts
│
├── store/
│   ├── useAuthStore.ts          # mock session, persisted
│   ├── useThemeStore.ts
│   ├── useWordStore.ts
│   └── useUIStore.ts
│
├── types/
│   ├── entities/
│   │   ├── word.types.ts
│   │   ├── user.types.ts
│   │   ├── category.types.ts
│   │   └── progress.types.ts
│   ├── api.types.ts
│   └── index.ts
│
├── utils/
│   ├── errorHandler.ts
│   ├── errorMessages.ts
│   └── constants.ts
│
├── pages/
│   ├── HomePage.tsx
│   ├── WordDetailPage.tsx
│   ├── CategoryPage.tsx
│   ├── FlashcardsPage.tsx
│   ├── QuizPage.tsx
│   └── ProfilePage.tsx
│
├── routes/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx
│
├── styles/
│   └── globals.css              # Tailwind entry + design tokens as CSS variables
│
├── App.tsx
└── main.tsx
```

The only folder that changes when the real backend arrives is `api/` — swap the import in each `features/*` hook from `../api/mock/mockWords.api` to `../api/endpoints/words.api`. Nothing in `components/`, `store/`, `pages/`, or `types/` needs to change.

---

## 3. Mock Data Layer

This is the part that didn't exist in v1 — it's what makes the frontend buildable and demoable with zero backend.

```ts
// api/mock/mockClient.ts
export function mockRequest<T>(data: T, opts?: { fail?: boolean; delayMs?: [number, number] }): Promise<T> {
  const [min, max] = opts?.delayMs ?? [400, 900];
  const delay = Math.floor(Math.random() * (max - min)) + min;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (opts?.fail) {
        reject({ response: { data: { error: { code: 'MOCK_ERROR', message: 'Simulated failure' } } } });
      } else {
        resolve(data);
      }
    }, delay);
  });
}
```

```ts
// api/mock/mockWords.api.ts
import { mockRequest } from './mockClient';
import { wordsFixture } from './fixtures/words.fixtures';
import { Word } from '@/types';

export const mockWordsApi = {
  getAll: () => mockRequest<Word[]>(wordsFixture),
  getBySlug: (slug: string) => {
    const word = wordsFixture.find((w) => w.slug === slug);
    return word
      ? mockRequest<Word>(word)
      : mockRequest<Word>(null as unknown as Word, { fail: true });
  },
  getByCategory: (categorySlug: string) =>
    mockRequest<Word[]>(wordsFixture.filter((w) => w.category.slug === categorySlug)),
};
```

Every screen therefore genuinely awaits a promise and handles `loading` / `error` / `success` states — so when the real API is dropped in, no component needs new states written, only a new import.

**Fixtures** (`fixtures/words.fixtures.ts` etc.) hold ~20–30 realistic words matching the `Word` type exactly (term, meaning, mnemonic, exampleUsage, category, difficulty) — enough to make every screen (grid, detail, flashcards, quiz distractors, search) feel real, not empty.

---

## 4. Mock Auth (Functional, Not Real)

Auth genuinely works from the UI's perspective — a signup/login "succeeds," a user session is created and persisted, and every gated action respects it. What's mocked is only the absence of a real server and real credential security.

```ts
// api/mock/mockAuth.api.ts
import { mockRequest } from './mockClient';
import { User } from '@/types';

export const mockAuthApi = {
  login: (email: string, _password: string) => {
    const user: User = { id: 'u_1', email, name: email.split('@')[0] };
    return mockRequest<User>(user);
  },
  signup: (email: string, _password: string) => {
    const user: User = { id: `u_${Date.now()}`, email, name: email.split('@')[0] };
    return mockRequest<User>(user);
  },
};
```

```ts
// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAuthApi } from '@/api/mock/mockAuth.api';
import { User } from '@/types';
import { normalizeError } from '@/utils/errorHandler';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await mockAuthApi.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw normalizeError(err);
        }
      },
      signup: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await mockAuthApi.signup(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw normalizeError(err);
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'vocab-vault-auth' }
  )
);
```

Because this is persisted via Zustand's `persist` middleware, refreshing the page keeps the mock user logged in — exactly like a real session would, which is what makes `/profile` and the `useAuthGate` pattern properly testable during this build phase.

---

## 5. Zustand Stores

| Store | Holds | Persisted? |
|---|---|---|
| `useThemeStore` | `theme`, `toggleTheme()` | Yes (localStorage) |
| `useAuthStore` | mock `user`, `isAuthenticated`, `login/signup/logout` | Yes (localStorage) |
| `useWordStore` | fetched (mock) words, categories, active filter, search query | In-memory, refetched on load |
| `useUIStore` | modal open/close state, toast queue | In-memory |

Unchanged in principle from v1 — `useWordStore` now sources from `mockWordsApi` instead of a real endpoint, transparently to every component that reads from it.

---

## 6. Types

Unchanged from v1 — all entity and API shapes live in `/types`, and the mock fixtures are written to satisfy those types exactly, so there is zero drift between what the mock layer returns today and what the real API must return later.

---

## 7. Error Handling

Unchanged in approach from v1: `normalizeError()` converts any thrown value (including the simulated mock errors) into a friendly `AppError`, logs the raw detail to console, and only ever renders the mapped message. This means the error-handling path is fully exercised during this build phase, not left as a TODO for when the real backend arrives.

---

## 8. Dependencies to Install

Vite + React + Tailwind are already set up. Add:

```bash
npm i zustand react-router-dom axios lucide-react
```

That's the complete list for this build phase — no form library, no animation library, no UI kit. Keep it lean; everything else (modals, toasts, skeletons) is hand-built to match the design system exactly rather than fought into a generic component library's defaults.
