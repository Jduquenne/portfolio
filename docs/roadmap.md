# Roadmap

Legend: ✅ done · 🟡 in progress · ⬜ not started · ⏸ waiting for a decision

## Current focus

TODO(owner): no phase or focus was documented before the migration. State the current
focus here.

## Honest status (2026-10-27)

- ✅ Desktop and mobile experiences, `/cv` page and CV PDF generation, GitHub data at
  build time, social preview image, daily scheduled redeploy: present in the code and
  the git history. Not re-tested during the migration (the app was not run).
- ✅ `npm run lint`, `npx tsc --noEmit` and `npx next build` pass (2026-10-27, after the
  D-008 design fixes). `npm run build` (with `build:cv` and `build:og`) was not run.
- ✅ Lighthouse on the deployed site (2026-10-27, before the contrast/label/avatar fixes): mobile 94 /
  100 / 100 / 100, desktop 100 / 96 / 100 / 100 (performance, accessibility, best practices, SEO). After the
  fixes, on a local production build: accessibility 100 on both, mobile performance 95 (LCP 2.9 s), desktop 100.
  The deployed site was not re-measured after the fixes.
- ⬜ Mobile LCP is about 3 s (good is 2.5 s): the hero text only renders after the JavaScript has loaded,
  because the layout is chosen in the browser. Going lower means changing that (see D-009 alternatives).
- ⬜ No automated tests exist (no test script in `package.json`).
- ⬜ The design fixes, UX additions, cursor glow and command palette of 2026-10-27 were not looked
  at in a browser. The palette's keyboard flow and focus handling are untested by hand.

## Known debt

Existing code or tooling that does not follow the rules. The code issues found by the
migration audit (inline motion in `PlayModal`, off-grid spacing, arbitrary text sizes,
short transitions) were fixed on 2026-10-27, see the devlog.

- ⬜ **`.claude/hooks/guard-violations.sh`** is probably inactive (reads `$CLAUDE_TOOL_INPUT`)
  and its stdout would not reach the agent. Not verified.
- ⬜ **`.claude/hooks/guard-violations.sh` and `.claude/commands/design-check.md`** list
  `p-6`, `m-6`, `mt-6`, `gap-6` as violations (24px is on the grid) and miss `py-1.5` and
  `py-0.5`. They do not check arbitrary text sizes, the 200ms minimum duration or the
  focus ring.
- ⬜ **`README.md`** is the unmodified `create-next-app` boilerplate.
- ⬜ **`Cv.tsx`** gives the CV preview image the PDF file name as `alt`
  (`Jason_Duquenne_CV_FR.pdf`). A translated description needs a new `cv.*` key, hence a
  `build:cv` run.
- ⬜ **Not audited:** hover, loading and empty states on every element, `alt` text and
  semantic HTML across the site, and `animate` limited to `transform` and `opacity`.
- ⬜ **UX ideas not done:** touch targets for the inline links (experience descriptions, company name)
  on mobile.
- ⬜ **Wording, owner input needed:** "Disponible" alone (FR, and the CV) does not say available for what
  (the English "Available for work" does; the sidebar is too narrow for a longer French label); the hero
  thesis is abstract (a concrete version exists, but it would make the hero about three lines longer); the
  experiences carry no figures (users, duration, fleet size), none were invented.

- ⬜ **Crawler view not checked with a real crawler**: the fallback was verified in the generated HTML and
  in Chrome with JavaScript off, not with Search Console or a link-preview tool.

## Observed in the visual check (2026-10-27, headless Chrome, desktop 1440x900 and mobile 390x844)

- ✅ **Desktop project cards looked empty at rest** (description on hover only, and most repos have
  no topics): the description now shows at rest, clamped to 3 lines; topics replace it on hover
  when a repo has both.
- ✅ **Scroll-to-top overlapped text** on the mobile feed: it now shows only while scrolling back up.
- ⬜ **Stack still lists Monogame and Godot** (category "3D / Jeux") although game dev mentions were
  removed from the metadata and the social preview. Content decision for the owner.
- ✅ Fixed during the check: the repo counters stayed at "0" after a direct jump to the section
  (`useInView` margin cut the top 15%).

## Ideas / later

TODO(owner): none documented before the migration.
