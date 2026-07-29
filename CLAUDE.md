# 🛠 Project: The Binary Personality Portfolio (2026)

## 🎯 High-Level Vision

A portfolio that is not a simple showcase, but a demonstration of software engineering and precision design. The goal is to achieve "Zero Friction" while telling a human story through a rigorous IT aesthetic.

---

## ⚙️ Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 16 (App Router)                   |
| Language   | TypeScript (strict mode)                  |
| Styling    | Tailwind CSS v4                           |
| Animations | Framer Motion                             |
| i18n       | next-intl — `fr` (default) + `en`         |
| Fonts      | `next/font` — Geist Mono + Inter Variable |
| Icons      | Lucide React                              |
| Linting    | ESLint + Prettier                         |

**Main commands:**

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Check code
```

---

## 📁 Project Structure

```
src/
├── app/                  # App Router (layouts, pages)
├── components/
│   ├── ui/               # Reusable atomic components (Button, Card...)
│   ├── desktop/          # Desktop-exclusive components (BentoGrid...)
│   ├── mobile/           # Mobile-exclusive components (SnapCard...)
│   └── shared/           # Shared components (Nav, Footer...)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
└── types/                # Global TypeScript types
```

---

## 🧠 Architecture "Two Adventures"

The experience is **fundamentally different** depending on the device — not simple responsive design.
The breakpoint is **`lg` (1024px)**.

### 1. Desktop: The Integrated Bento Dashboard

- **Concept:** An immersive dashboard where information is spatialized.
- **UX Flow:** Non-linear navigation. The user "explores" via hover states that reveal data layers (Personality Layer vs Technical Layer).
- **Satisfying Factor:** Synchronized transitions with Framer Motion. Hovering a passion makes the entire grid react with spring physics (`type: "spring"`).

### 2. Mobile: The Sequential Narrative Feed

- **Concept:** An experience optimized for the thumb (Bottom-Navigation).
- **UX Flow:** Linear snap navigation (`scroll-snap-type`). Each section is an autonomous "unit of thought".
- **Satisfying Factor:** Haptic-mimicry — visual micro-animations and fluid transitions to simulate a native app feel.

---

## 🎨 Design System (Sober & IT-Centric)

### Grid

**Hard Grid 8px system.** Every spacing value must be a multiple of 8px.
Use Tailwind classes exclusively: `p-2` (8px), `p-4` (16px), `p-8` (32px), etc.

### Color Palette

| Token      | Hex       | Usage                                  |
| ---------- | --------- | -------------------------------------- |
| `base`     | `#020617` | Slate 950 — main background            |
| `surface`  | `#0F172A` | Slate 900 — Bento Cards, surfaces      |
| `accent`   | `#38BDF8` | Sky 400 — CTAs, highlights, IT sparkle |
| `contrast` | `#F8FAFC` | Slate 50 — main text                   |

### Typography

- **`Geist Mono`** — Headings, labels, numeric data, code-style elements
- **`Inter Variable`** — Body text, descriptions

---

## 🧩 Portfolio Sections

| Section        | Key Concept                                                            |
| -------------- | ---------------------------------------------------------------------- |
| **Profile**    | Identity, availability, contact — sidebar on desktop, first card on mobile |
| **Experience** | Timeline from `cv.ts` — roles, periods, stacks                         |
| **Stack**      | Technical categories from `cv.ts`                                      |
| **Projects**   | GitHub repos fetched at build time, most recently pushed first         |
| **Passions**   | Specialities as data — numbers, metadata. Zero long text               |

`SectionId` in `src/types/index.ts` is the single source of truth for section ids and
must stay in sync with the `nav.*` translation keys.

---

## 🔌 Data & Deployment

**Static export.** `output: "export"` in production, deployed to GitHub Pages under
`basePath: /portfolio`. There is no server at runtime — everything resolves at build time.
Anything that must stay fresh requires a redeploy.

**CV data** lives in `src/lib/data/cv.ts`. Every translatable field is a
`LocalizedString` (`{ en, fr }`) read through `localize()`.

**GitHub data** is fetched at build time in `src/lib/github.ts`, in a single GraphQL
request. The Projects section lists the `REPO_COUNT` most recently pushed repos — owned,
public, forks excluded. The repo counters apply the same filters, so the displayed number
always describes the listed set.

| Variable      | Purpose                          |
| ------------- | -------------------------------- |
| `GH_USERNAME` | GitHub account to read           |
| `GH_TOKEN`    | Fine-grained PAT (see below)     |

Set both in `.env.local` locally and as Actions secrets for CI. The token needs
**`Metadata: read-only`** (repo listing + public/private counters) and
**`Deployments: read-only`** (resolves GitHub Pages URLs), on all repositories.
Never grant `Contents` — the build has no reason to read source code.

If the token is missing or rejected, the build falls back to an unauthenticated REST
call and warns on stdout: repos still list, counters and Pages links disappear.

---

## 📐 Code Conventions

- **Components:** PascalCase, one component per file
- **Hooks:** `use` prefix (e.g. `useScrollSnap`)
- **Types:** Prefer interfaces over `type` for objects, PascalCase
- **Imports:** `@/` alias for all internal imports
- **Animations:** All Framer Motion variants defined outside JSX (in `const` above the component)
- **No `any`:** Strict TypeScript, zero compromise
- **Language:** All code, comments, variable names, and commit messages must be written in English
- **i18n:** No user-facing string in a component — UI text goes in `messages/{en,fr}.json` and is read with `useTranslations`; content data goes in `cv.ts` as `LocalizedString`. Both files must keep identical key sets. Use ICU plurals rather than building plurals in code

---

## 🤖 Instructions for Claude

### Always do

- Read the relevant file before any modification
- Respect the **"Two Adventures"** philosophy — never do simple responsive, think two distinct experiences
- Use Framer Motion for any non-trivial animation
- Always verify alignment on the 8px grid
- Prefer composing small components over large monolithic blocks
- Write all code, comments, and variable names in English

### Never do

- Add dependencies without explicit validation
- Use `any` in TypeScript
- Write comments on self-evident code
- Introduce global state without a clear reason
- Mix desktop and mobile logic in the same component
- Use spacing values outside the 8px grid (e.g. `p-3`, `mt-5`)
- Hardcode user-facing text in a component, including `title` and `alt` attributes
- Call `setState` inside an effect to mirror an external source — subscribe with `useSyncExternalStore` instead

### Development philosophy

**Less, but better.** Every line of code must be justified. Favor surgical precision over exhaustiveness. One "perfect" component is worth more than three "correct" ones.

## Git workflow

When the user asks for a **commit**, respond with only the commit message text — do not run any git commands. Format: `feature: <description>` or `fix: <description>`. In English. Short, no bullet points, no technical details.
