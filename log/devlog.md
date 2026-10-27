# Devlog

Entry format: date, what was done, figures if any, problems, **Still open**. Most recent
first. History before the migration is in `git log` (31 commits on 2026-10-27).

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
