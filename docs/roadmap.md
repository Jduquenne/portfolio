# Roadmap

Legend: ✅ done · 🟡 in progress · ⬜ not started · ⏸ waiting for a decision

## Current focus

TODO(owner): no phase or focus was documented before the migration. State the current
focus here.

## Honest status (2026-10-27)

- ✅ Desktop and mobile experiences, `/cv` page and CV PDF generation, GitHub data at
  build time, social preview image, daily scheduled redeploy: present in the code and
  the git history. Not re-tested during the migration (the app was not run).
- ✅ `npm run lint` and `npx tsc --noEmit` pass.
- ⬜ No automated tests exist (no test script in `package.json`).
- ⬜ `npm run build` was not run during the migration.

## Known debt

Existing code that does not follow the rules, found by the migration audit. Not fixed.

- ⬜ **Inline motion props** in `src/components/desktop/PlayModal.tsx` (l. 75-78):
  `initial`, `animate`, `exit` and `transition` are object literals in the JSX. Rule:
  variants live outside JSX (see [conventions.md](conventions.md)).
- ⬜ **Spacing off the 8px grid** (`gap-3`, `px-3`, `py-10`, `py-1.5`, ...), found by a
  regex search, so possibly not exhaustive:
  `src/components/cv/Cv.tsx` (l. 21, 37), `desktop/Hero.tsx` (66), `desktop/PlayModal.tsx`
  (100), `desktop/Sidebar.tsx` (75, 128), `desktop/sections/ExperienceSection.tsx` (81,
  92), `mobile/sections/ExperienceSection.tsx` (83, 93), `mobile/sections/ProfileSection.tsx`
  (84), `mobile/sections/StackSection.tsx` (47), `shared/LightsOut.tsx` (61).
- ⬜ **`.claude/hooks/guard-violations.sh`** is probably inactive (reads `$CLAUDE_TOOL_INPUT`)
  and wrongly flags valid `-6` classes. Not verified.
- ⬜ **`.claude/hooks/guard-violations.sh` and `.claude/commands/design-check.md`** list
  `p-6`, `m-6`, `mt-6`, `gap-6` as violations (24px is on the grid) and miss `py-10` and
  half-steps.
- ⬜ **`README.md`** is the unmodified `create-next-app` boilerplate.

## Ideas / later

TODO(owner): none documented before the migration.
