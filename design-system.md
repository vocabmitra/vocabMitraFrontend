# Vocabulary Vault — Design System: "The Reading Room"

A reference companion to `design-mockup.html`. Treat the mockup as the visual source of truth; this file exists so the tokens can be wired into Tailwind config directly.

## Concept

Every word is presented like a real dictionary entry, not a SaaS feature card — because that's the one thing this product genuinely has that a generic template doesn't. Category tags read like part-of-speech abbreviations. The mnemonic is set apart as a hand-annotated margin note, not boxed into a card identical to everything else. Dark mode is the primary mode (a "reading room at night" feel, matching when most exam prep actually happens); light mode is a warm paper flip, not a washed-out inverse.

## Colors

| Token | Dark mode | Light mode | Use |
|---|---|---|---|
| `--bg` | `#14120F` (ink) | `#FAF6EC` (paper) | Page background |
| `--surface` | `#1F1C17` | `#F1EAD9` | Cards, catalog cells |
| `--text-primary` | `#F1EBDD` | `#211D17` | Headwords, body |
| `--text-secondary` | `#A69C87` | `#6B6255` | Labels, phonetics, meta |
| `--accent` (brass) | `#C9A15A` | `#A87F3E` | Links, active tab, tags, save button |
| `--mnemonic` (oxblood) | `#9C4A4A` | `#7A2E2E` | Mnemonic margin rule + label only |
| `--hairline` | `rgba(241,235,221,0.14)` | `rgba(33,29,23,0.12)` | Borders, dividers |

Rule of thumb: brass = navigation/interaction, oxblood = memory/mnemonic, never mixed. No other accent colors — a third accent color would undercut the "one deliberate risk" the palette is built around.

## Typography

| Role | Font | Weight/style notes |
|---|---|---|
| Display (headwords, mnemonic text) | `Fraunces` | 500 regular; italic for mnemonic text specifically |
| Body / UI | `Inter` | 400 body, 500 for emphasis — never above 500 |
| Utility (tags, phonetics, labels, eyebrows) | `IBM Plex Mono` | 400 regular, uppercase + letter-spacing for labels |

Google Fonts import (already in the mockup `<head>`):
```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap
```

## Layout Conventions

- Max content width ~760px, centered — this is a reading product, not a dashboard.
- Hairline `border-top` dividers between sections instead of card shadows or heavy borders.
- Browse grids use a 1px-gap "card catalog" layout (background = hairline color, cells = `--bg`), not rounded cards with drop shadows — cheap to build as a CSS grid, and it's what makes the catalog feel like an index rather than a feed.
- No border-radius above 4px anywhere except pill-shaped tags/buttons — this is a deliberate break from the generic rounded-card SaaS look.
- No gradients, no drop shadows, no glow effects anywhere in the UI.

## Component Notes for Build

- **Category tag**: bordered pill, mono font, italic, brass color — styled like a dictionary abbreviation (`n.`, `upsc`), not a colorful badge.
- **Mnemonic block**: 2px left rule in oxblood, uppercase mono label ("Mnemonic") above italic Fraunces text. Never boxed/bordered on all sides.
- **Example usage**: styled as a citation — left hairline border, italic body text, small mono source label below.
- **Save/bookmark button**: outline button, brass border and text, fills solid brass on hover. Always paired with a small "Requires an account" hint in `--text-secondary` next to it, so the auth gate is visible before the user even clicks.
- **Flashcard flip**: reuse the same headword/meaning/mnemonic typographic treatment on front/back rather than inventing new card chrome.

## Explicitly Avoid

- Cream background + terracotta accent + high-contrast serif (the most common "AI template" look).
- Near-black background + single neon accent.
- Rounded cards with drop shadows (this is what the original vibe-coded prototype already does — we're deliberately moving away from it).
