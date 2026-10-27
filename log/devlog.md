# Devlog

Entry format: date, what was done, figures if any, problems, **Still open**. Most recent
first. History before the migration is in `git log` (31 commits on 2026-10-27).

## 2026-10-27: Scroll-to-top only when scrolling up

**Done**
- Mobile `ScrollToTop` no longer shows while reading downwards: it appears when the scroll goes back up
  (past 60% of a screen) and hides on the way down or near the top.
- Checked in headless Chrome with a mobile viewport: opacity 0 at the top and when scrolling down, 1
  after scrolling up one section, 0 again going down or back to the top. `tsc`, `lint`, `next build` pass.

**Still open**
- Stack still lists Monogame and Godot (owner decision); wording review of `messages/` and `cv.ts`.

## 2026-10-27: Desktop project cards show their description

**Done**
- Desktop `ProjectsSection`: the description is visible at rest (clamped to 3 lines) instead of on
  hover only, so no card is empty and nothing depends on hover. Topics replace it on hover when a
  repo has both; with only one of the two, that one is always shown.
- The two stacked layers moved from `absolute inset-0` to a one-cell grid: the clamp did not cut
  an absolutely positioned paragraph in Chrome and showed a fourth line (measured: 58.5px high now,
  exactly three lines).

**Checked**
- Re-shot in headless Chrome: cards read well. No repo has topics today, so the hover swap to topics
  was not seen. `tsc`, `lint` and `next build` pass.

**Still open**
- Mobile scroll-to-top overlaps card text; Monogame and Godot still in the stack (owner decision).

## 2026-10-27: Visual check in headless Chrome

**Done**
- Screenshots of desktop (home, cursor glow, projects, passions, palette) and mobile (every section)
  taken with Chrome driven by `puppeteer-core`, installed outside the repo.
- Bug fixed: `RepoStatsReadout` showed "0 dépôts · 0 publics · 0 privés" after a direct jump to the
  Projects section (nav tap, palette): `useInView` used `-15%` margins on all sides, so a header
  snapped to the top never counted as visible. Now only the bottom margin is cut.
- Confirmed in the render: cursor glow is subtle, palette and contact button read well, bottom nav
  marks the active section, the primary button is the only filled element.

**Findings left open** (see "Observed in the visual check" in `docs/roadmap.md`).

## 2026-10-27: Touch targets on mobile

**Done**
- Interactive controls reachable on mobile now have a 40px hit area: bottom nav links (full bar
  height), scroll-to-top, language switcher, project icon links, profile links, contact button.
  The visuals barely move: small elements grow their hit area with a negative margin.
- The stack chips are not interactive, so they were left alone (an earlier note listed them).

**Checked**
- `tsc`, `lint` and `next build` pass. No browser available in the session, so not seen.

**Still open**
- Bottom nav: the labels sit on one line on a 360px screen; check on a real phone, in French too.
- Project icon links now sit 40px apart (they were 32px); check the card header on mobile.
- Inline links (experience descriptions, company name) keep their text size.

## 2026-10-27: Primary contact action

**Done**
- Step 3 of the "wow" plan, one commit per step: `ContactAction` (shared) with an accent "Write to
  Jason" button with a square copy-address icon beside it (the address is not shown in clear);
  the copy button has no outline; feedback is the icon swap (check, or cross on failure) in
  accent and an announced status.
- Placed under the availability line in the desktop sidebar and the first mobile card; the old
  plain email link was removed from both contact lists (GitHub, LinkedIn, CV stay).
- Keys `contact.write`, `copy`, `copied`, `copy_failed` in both message files (85 keys each).

**Checked**
- `tsc`, `lint` and `next build` pass, `public/` untouched, the label is in both locale pages.
  Not run in a browser.

**Still open**
- The visible feedback is icon-only; the "Copied" text is only for screen readers. Adjust if it is too discreet.
- Copy needs `localhost` or https. A `mailto:` needs a mail client, hence the copy button.

## 2026-10-27: Command palette (Ctrl+K)

**Done**
- Step 2 of the "wow" plan, one commit per step: `CommandPalette` (desktop), 11 commands in
  3 groups, keyboard driven, accessible (combobox/listbox), no dependency.
- `DesktopLayout` now holds `playOpen` and `paletteOpen` and renders `PlayModal` and the palette;
  `Hero` takes `onPlay` and `onOpenPalette` and shows a "Commands Ctrl K" button next to Play.
- Keys `palette.*` added to both message files (81 keys each, identical).

**Checked**
- `tsc`, `lint` and `next build` pass, `public/` untouched. Not run in a browser.

**Still open**
- Try it: open with `Ctrl K`, filter, arrows, `Enter`, `Esc`, "Play" from the palette, language
  switch, email copy (needs `localhost` or https for the clipboard).
- Next step: a clear primary contact action.

## 2026-10-27: Cursor glow on the desktop backdrop

**Done**
- Step 1 of the "wow" plan, one commit per step: `CursorGlow` lights the dot grid and adds a
  halo around the mouse (desktop only). CSS in `globals.css`, mounted in `DesktopLayout`.
- The cards (`bg-surface`) hide the glow underneath: it shows in the gaps and the margins. A
  per-card border glow was left out on purpose.

**Checked**
- `tsc`, `lint` and `next build` pass; the compiled CSS keeps the `mask-image`. Not seen in a
  browser.

**Still open**
- Toned down after the first try ("too much glow"): halo `0.07` to `0.025`, lit dots at 45%
  opacity, radius `10rem` to `6rem`. Tune further by eye if needed.
- Next steps: command palette (`Ctrl+K`), then a clear primary contact action.

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
