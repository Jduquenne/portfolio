# Devlog

Entry format: date, what was done, figures if any, problems, **Still open**. Most recent
first. History before the migration is in `git log` (31 commits on 2026-10-27).

## 2026-10-27: UX additions from the skill

**Done**
- `useActiveSection` (`useSyncExternalStore` over an `IntersectionObserver` on `#main`):
  `BottomNav` marks the section in view (`aria-current`, accent colour).
- `<MotionConfig reducedMotion="user">` in `AdventureRouter`: all Framer Motion animations
  honour `prefers-reduced-motion`.
- Global press feedback in `globals.css` (`scale: 0.98` on `button` and `a[href]`, motion-safe).
- `--default-transition-duration: 200ms`: Tailwind's default is 150ms, so every bare
  `transition-colors` was under the 200ms minimum.
- `AdventureSkeleton` replaces the blank placeholder while the device is detected.
- `LanguageSwitcher`: `aria-label` and `lang` (key `language.switch` in both message files).

**Checked**
- `tsc`, `lint` and `next build` pass; the compiled CSS contains the 200ms default and the
  `scale` rule. Not seen in a browser.

**Still open**
- Try it on a phone and a desktop: the section highlight, the skeleton flash, the press feel.
- UX ideas not done are listed in `docs/roadmap.md`.

## 2026-10-27: Design rules from the skill, and code fixes

**Done**
- Compared `SKILL.md` with the project rules. Adopted the compatible rules only (D-008 in
  `docs/decisions.md`, rules in `docs/ui-design.md`). `SKILL.md` is left out of the context.
- Owner decisions: 4px (step 1) is allowed as micro-spacing; `text-[10px]` becomes `text-xs`.
- Code fixes:
  - PlayModal: backdrop motion moved into `backdropVariants`; exit transitions 200ms.
  - Type scale: 10 `text-[10px]` to `text-xs` (both Projects sections); Hero `text-[2rem]`
    + `leading-[1.18]` to `text-3xl`; mobile Profile `leading-[1.35]` removed.
  - Spacing: `gap-3`, `px-3`, `mb-3`, `py-1.5`, `pt-1.5`, `py-0.5`, `p-1.5`, `py-px`, close
    button offsets moved onto the grid (Hero, Sidebar, both Experience sections, Profile, Stack,
    LightsOut, PlayModal, Cv).
  - Durations under 200ms raised (Projects topics fade, LightsOut cells).
  - `globals.css`: `text-wrap` balance/pretty and a global `:focus-visible` outline (base layer).
  - New: skip-to-content link, `id="main"` on every page, custom `not-found.tsx`, `fonts.ts`
    (fonts moved out of `[locale]/layout.tsx`), keys `a11y.skip_to_content` and `not_found.*`
    in both message files (identical key sets).
- Correction: `py-10` (40px) is on the 8px grid. An earlier note listed it as a violation.

**Checked**
- `npm run lint`, `npx tsc --noEmit` and `npx next build` pass; `404.html` is generated
  with both locales. Not looked at in a browser, so the visual effect of the larger chips
  and the `text-3xl` hero is unseen.
- `npm run build` (with `build:cv`, `build:og`) not run, `public/` untouched.

**Still open**
- Visual check of desktop and mobile in a browser.
- Remaining known debt in `docs/roadmap.md`.

## 2026-10-27: Agent context migration

**Done**
- Moved `CLAUDE.md` to `docs/archive/CLAUDE-2026-10-27.md` (identical to `HEAD`).
- Created `AGENTS.md` (router), `CLAUDE.md` (import only), `docs/architecture.md`,
  `development.md`, `conventions.md`, `ui-design.md`, `spec-sections.md`, `roadmap.md`,
  `decisions.md`, this devlog and `docs/archive/migration-map-2026-10-27.md`.
- Merged git `deny` permissions into `.claude/settings.json`.
- No source, build config or dependency was modified.

**Checked**
- `npm run lint`: passes. `npx tsc --noEmit`: passes.
- `npm run build`, `npm run dev`, `/design-check`: not run.

**Problems found (not fixed)**
- Docs vs code: `components/ui/`, `BentoGrid`, `SnapCard`, `Nav`, `Footer`,
  `useScrollSnap` and Prettier were in the old context and do not exist.
- Tooling: `p-6` wrongly flagged by the hook and `design-check.md`; hook probably inactive.
- Code vs rules: inline motion in `PlayModal.tsx`, off-grid spacing. See "Known debt" in
  `docs/roadmap.md`.

**Still open**
- TODO(owner): "Current focus" and "Ideas / later" in `docs/roadmap.md`.
- Known debt items in `docs/roadmap.md`.
- `README.md` is still the `create-next-app` boilerplate.
