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
- ⬜ No automated tests exist (no test script in `package.json`).
- ⬜ The design fixes of 2026-10-27 were not looked at in a browser.

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
- ⬜ **Not audited:** hover/active/loading/empty states on every element, `alt` text and
  semantic HTML across the site, `animate` limited to `transform` and `opacity`, and
  `prefers-reduced-motion` for the Framer Motion animations (only the hero caret and
  `useCountUp` are covered).

## Ideas / later

TODO(owner): none documented before the migration.
