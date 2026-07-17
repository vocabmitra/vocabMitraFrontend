# Product Requirements Document — Vocabulary Vault

**Status:** Draft v2 — Frontend build phase
**Owner:** [Client Name]
**Prepared by:** [Your Team]
**Last updated:** July 17, 2026

---

## 1. What We're Building

Vocabulary Vault is a web-based vocabulary learning platform. Users browse curated English words, each paired with a meaning, a memorable **mnemonic hook**, and an **example sentence**, organized by exam category (CAT, CUET, GRE, SSC, UPSC, etc.).

The core idea: **one clean dataset of words, reused across many small features.** We are not building ten separate systems — we're building one solid `Word` data model and then layering lightweight, high-value features (flashcards, quizzes, spaced repetition, streaks) on top of it.

**Current build phase:** frontend only, built independently of the backend. A teammate is building the real API separately; this phase produces a complete, production-quality UI running against a **mock data layer** that mirrors the eventual API contract exactly, so swapping mock calls for real Axios calls later is a drop-in change, not a rewrite.

**What this is not (yet):** a full language-learning suite (no grammar, no speaking practice, no multi-language support), and not yet wired to a real backend, real payments, or real persistence beyond the browser.

---

## 2. Target Users

| Segment | Who they are | Why they're here |
|---|---|---|
| **Primary: Competitive exam aspirants** | Students prepping for CAT, UPSC, SSC, CUET, GRE, GMAT, banking exams | Need to memorize hundreds of exam-relevant words fast; existing tools don't tailor content to Indian competitive exams |
| **Secondary: General vocabulary builders** | Working professionals, content writers, ESL learners | Want to sound more articulate; enjoy a "word of the day" habit |
| **Tertiary (future): Teachers / coaching institutes** | Coaching centers, English teachers | Could assign word lists/collections to students (B2B, not v1) |

**Primary persona:** "Priya, 22, preparing for CAT." Studies in short bursts on her phone between classes, forgets words she learned last week, and is motivated by visible progress (streaks, mastery counts).

---

## 3. Goals & Non-Goals (This Build Phase)

**Goals:**
- Ship a fully working, fully styled frontend against mock data — every screen, state, and interaction is real except the network layer.
- Mock data layer must simulate real network behavior (latency, loading states, error cases) so components are built defensively from day one.
- Fake auth that actually works client-side (persisted mock session) so every gated interaction can be tested end-to-end before the real backend exists.
- Ship with the full routing structure so pages, not just components, exist as real navigable URLs.
- Design system and folder structure must not need rework when the real API arrives — only the contents of `api/` change.

**Non-goals (this phase):**
- Real backend integration (Axios calls exist but hit mock functions, not a server).
- Real payments/subscription enforcement.
- Real password security, JWT, or session expiry — mock auth is for UI development, not production auth.

---

## 4. Features (Frontend Scope)

### 4.1 Core

| Feature | Route | Description |
|---|---|---|
| **Word Library** | `/` | Homepage: hero, Word of the Day, stats overview, browse grid with category filters |
| **Word Detail Page** | `/word/:slug` | Dictionary-entry-style view: meaning, mnemonic margin note, example citation, save-to-vault action |
| **Category Page** | `/category/:slug` | Same catalog grid, filtered to one exam category |
| **Search** | in header, all pages | Client-side search against the mock word set |
| **Word of the Day** | on `/` | One featured word, deterministically rotated by date against the mock dataset |
| **Flashcard Mode** | `/flashcards` (optional `?category=`) | Flip-card view over any word set |

### 4.2 Retention & Engagement

| Feature | Route | Description |
|---|---|---|
| **Auth Modal (Login/Signup)** | modal, triggered contextually | Mock auth: creates/restores a fake user session in `useAuthStore`, persisted to localStorage |
| **Bookmarks / My Vault** | `/profile` (protected) | List of saved words for the logged-in mock user |
| **Progress Dashboard** | `/profile` (protected) | Streak counter, mastered count — derived from mock `UserWordProgress` records |
| **Quiz / Daily Challenge** | `/quiz` | Auto-generated MCQ from mock word + category data |

### 4.3 Deferred to later phases
Themed Collections, Word Families/Related Words, Audio Pronunciation, Printable Export, Community Mnemonics, real Subscription enforcement — all unchanged from v1 PRD, not part of this build pass.

---

## 5. Mock Data Layer Requirements

- Lives in `src/api/mock/`, structured to mirror real endpoints 1:1 (`mockWordsApi`, `mockAuthApi`, `mockProgressApi`).
- Every mock function returns a `Promise` and simulates latency (400–900ms randomized) via `setTimeout`, so every screen must handle a real loading state, not just a happy-path render.
- Mock functions occasionally return a simulated error path (toggleable per call) so error-handling UI (toasts, inline errors, empty states) is exercised during development, not left untested until the real API exists.
- `axiosInstance.ts` is still created and configured now (baseURL from `.env`, interceptors) even though nothing calls it yet — this is what gets flipped on when the real backend is ready. Mock functions live alongside it, not inside it, so the switch is a one-line import change per API file, not a refactor.

---

## 6. Data Model Reference

Unchanged — see the attached class diagram ("Vocabulary Vault — Data Model"). Core entities: `Word`, `Category`, `Mnemonic`, `ExampleSentence`, `User`, `UserWordProgress`, `SubscriptionPlan`, `Collection`, `Bookmark`, `WordOfDay`, `WordRelation`. The mock data layer generates fixtures matching these shapes exactly, from `src/types/`.

---

## 7. Open Questions for Client / Backend Teammate

- Confirm the real API response envelope (`{ success, data, error }`) before backend work starts, so mocks don't need reshaping later.
- Confirm auth mechanism (JWT in header vs. httpOnly cookie) — affects whether `axiosInstance` needs `withCredentials` vs. a bearer token interceptor when it goes live.
- Initial word count / content source for the real dataset (the mock dataset here is illustrative, ~20–30 words, not the final content set).
