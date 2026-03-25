# 🛠 Project: The Binary Personality Portfolio (2026)

## 🎯 High-Level Vision

A portfolio that is not a simple showcase, but a demonstration of software engineering and precision design. The goal is to achieve "Zero Friction" while telling a human story through a rigorous IT aesthetic.

---

## ⚙️ Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 15 (App Router)                   |
| Language   | TypeScript (strict mode)                  |
| Styling    | Tailwind CSS v4                           |
| Animations | Framer Motion                             |
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

| Section     | Key Concept                                                        |
| ----------- | ------------------------------------------------------------------ |
| **Hero**    | Identity + instant hook, entrance animation                        |
| **Logic**   | Tech stack, projects, GitHub Activity (custom 3D graph)            |
| **Entropy** | Passions as data — numbers, sharp images, metadata. Zero long text |
| **Contact** | Minimal CTA                                                        |

---

## 📐 Code Conventions

- **Components:** PascalCase, one component per file
- **Hooks:** `use` prefix (e.g. `useScrollSnap`)
- **Types:** Prefer interfaces over `type` for objects, PascalCase
- **Imports:** `@/` alias for all internal imports
- **Animations:** All Framer Motion variants defined outside JSX (in `const` above the component)
- **No `any`:** Strict TypeScript, zero compromise
- **Language:** All code, comments, variable names, and commit messages must be written in English

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

### Development philosophy

**Less, but better.** Every line of code must be justified. Favor surgical precision over exhaustiveness. One "perfect" component is worth more than three "correct" ones.

## Git workflow

When the user asks for a **commit**, respond with only the commit message text — do not run any git commands. Format: `feature: <description>` or `fix: <description>`. In English. Short, no bullet points, no technical details.
