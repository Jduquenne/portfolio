# AGENTS.md

Read this file first, then the relevant file in `docs/`.

## Preamble

The Binary Personality Portfolio (2026): a portfolio that demonstrates software
engineering and precision design, not a plain showcase. The goal is "Zero Friction"
while telling a human story through a rigorous IT aesthetic.

- **Stack:** Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, Framer Motion,
  next-intl (`fr` default + `en`), Lucide React, ESLint.
- **Non-negotiable:**
  - **Two Adventures.** Desktop (bento dashboard) and mobile (snap feed) are two
    distinct experiences, not responsive variants. Breakpoint: `lg` (1024px).
  - **Static export.** Everything resolves at build time. No server at runtime.
  - **Design system.** 8px grid, four-colour palette, Geist Mono + Inter Variable.
- **Languages:** the conversation is in French; everything written in the repo (code,
  comments, names, docs, commit messages) is in English.
- **Philosophy:** "Less, but better." Every line must be justified. Favour surgical
  precision over exhaustiveness.

## Session protocol

1. Read this file, "Current focus" in `docs/roadmap.md` and the latest entries of
   `log/devlog.md`.
2. Propose a short plan and wait for approval on any non-trivial task.
3. Implement, then verify (see "Before you finish a task").
4. Write the devlog entry, update the roadmap if a status changed.
5. Propose the commit message.

## Absolute rules

1. **Git belongs to the owner.** Never run a git command. When asked for a commit,
   answer with only the message text: `feature: <description>` or `fix: <description>`,
   in English, short, no bullet points, no technical details.
2. **No silent architecture decisions.** A structural choice (new dependency, new
   layer, new data format, choosing between two approaches) is proposed, validated by
   the owner, then recorded in `docs/decisions.md`.
3. **Never add a dependency without explicit approval.** Never invent a version: use
   `npm install <pkg>` so the current one is resolved.
4. **No work outside the request.** Ideas go to "Ideas / later" in `docs/roadmap.md`.
5. **Honest status.** Never call something done if it was not verified. Roadmap
   statuses reflect what was actually measured.
6. **Read the relevant file before any modification.**

## Orientation

| Read | Why |
|---|---|
| `docs/architecture.md` | Code structure, Two Adventures, data flow, sections per device |
| `docs/development.md` | Setup, commands, env variables, GitHub data, build and deploy, Claude tooling |
| `docs/conventions.md` | Code style, motion, i18n, commits, "add a X" checklists |
| `docs/ui-design.md` | 8px grid, palette, typography, motion, states and accessibility, known tooling gaps |
| `docs/spec-sections.md` | What each portfolio section must do |
| `docs/roadmap.md` | Current focus, honest status, known debt, ideas |
| `docs/decisions.md` | Why things are the way they are |
| `log/devlog.md` | What previous sessions did and what is still open |
| `docs/archive/` | Original context files, untouched (`CLAUDE.md` of 2026-10-27, traceability map) |

## Project map

```
src/
├── app/                # App Router: root redirect stub, [locale]/ pages (home, cv), globals.css
├── components/
│   ├── desktop/        # Desktop-only: DesktopLayout, Hero, Sidebar, PlayModal, sections/
│   ├── mobile/         # Mobile-only: MobileLayout, BottomNav, ScrollToTop, sections/
│   ├── shared/         # AdventureRouter, LanguageSwitcher, LightsOut, ExperienceDescription, RepoStatsReadout
│   └── cv/             # A4 CV: CvDocument (react-pdf), cvData, Cv (page UI)
├── hooks/              # useDevice, useCountUp
├── i18n/               # next-intl routing, navigation, request
├── lib/                # github.ts, motion.ts, utils.ts, languages.ts, lightsOut.ts, data/cv.ts
└── types/              # SectionId, LocalizedString, GitHub types
messages/{en,fr}.json   # all UI text
scripts/                # build-cv, build-og (build-time generators)
```

## Golden rules

Details in `docs/conventions.md` and `docs/ui-design.md`.

- Never use `any` (checked by `npm run lint`).
- Never hardcode user-facing text in a component, including `title` and `alt`.
  `messages/en.json` and `messages/fr.json` keep identical key sets.
- Never mix desktop and mobile logic in one component (`/design-check` § 3).
- Framer Motion variants are defined outside JSX, and the presets of `src/lib/motion.ts`
  (`fadeUp`, `fadeInLeft`, `stagger()`) are reused instead of redefined.
- Spacing uses the 8px grid: Tailwind classes that are multiples of 8px
  (`p-2`, `p-4`, `p-6`, `p-8`...), plus step 1 (4px) as micro-spacing. Never `p-3`, `mt-5`.
- Text sizes use the Tailwind scale (no `text-[10px]`). Transitions last at least 200ms.
  Every interactive element has a visible focus state (details in `docs/ui-design.md`).
- Never call `setState` inside an effect to mirror an external source: use
  `useSyncExternalStore`.
- Never write comments on self-evident code. Never introduce global state without a
  clear reason.
- Prefer small composed components. One component per file, PascalCase. Interfaces over
  `type` for objects. `@/` alias for internal imports.
- After changing `src/lib/data/cv.ts` or the `cv.*` translations, run
  `npm run build:cv` and commit the regenerated `public/cv-*` files.
- `SectionId` in `src/types/index.ts` stays in sync with the `nav.*` translation keys.
- Never grant `Contents` to the GitHub token: the build has no reason to read source code.

## Picking work

Start from "Current focus" in `docs/roadmap.md`, then the "Still open" points of the
latest `log/devlog.md` entries. Never start a new phase without validation.

## Before you finish a task

```bash
npm run lint
npx tsc --noEmit
```

Run `npm run build` if pages, data or build scripts changed (needs `GH_USERNAME` and
`GH_TOKEN`, network access, and regenerates `public/cv-*` and `public/og.png`).

Then: add the devlog entry, update the roadmap, propose the commit message.

## Where things are tracked

- Status and next steps: `docs/roadmap.md`
- Architecture decisions: `docs/decisions.md`
- Session history: `log/devlog.md`
- Original context files and migration map: `docs/archive/`
