# Migration map, 2026-10-27

Traceability of every information block of the original context files. Source
`CLAUDE.md` is archived as `CLAUDE-2026-10-27.md` (line numbers refer to it).

| Bloc | Source | Summary | Destination | Statut |
|---|---|---|---|---|
| B-001 | `CLAUDE.md` l. 3-5 | Vision: demonstration of engineering and design, "Zero Friction" | `AGENTS.md` § Preamble, `docs/architecture.md` § Overview | migrated |
| B-002 | l. 189-191 | "Less, but better" philosophy | `AGENTS.md` § Preamble | migrated |
| B-003 | l. 171 | Read the relevant file before any modification | `AGENTS.md` § Absolute rules (6) | migrated |
| B-004 | l. 172 | Respect Two Adventures, never simple responsive | `AGENTS.md` § Preamble, `docs/architecture.md` § Two Adventures | migrated |
| B-005 | l. 173 | Use Framer Motion for non-trivial animation | `docs/conventions.md` § Animations | migrated |
| B-006 | l. 174 | Always verify alignment on the 8px grid | `AGENTS.md` § Golden rules, `docs/ui-design.md` § Grid | migrated |
| B-007 | l. 175 | Prefer composing small components | `AGENTS.md` § Golden rules, `docs/conventions.md` § Code | migrated |
| B-008 | l. 176 | Write code, comments, names in English | `AGENTS.md` § Preamble, `docs/conventions.md` § Code | merged with B-040 |
| B-009 | l. 180 | Never add dependencies without validation | `AGENTS.md` § Absolute rules (3) | migrated |
| B-010 | l. 181 | Never use `any` | `AGENTS.md` § Golden rules, `docs/conventions.md` § Code | merged with B-039 |
| B-011 | l. 182 | No comments on self-evident code | `AGENTS.md` § Golden rules, `docs/conventions.md` § Code | migrated |
| B-012 | l. 183 | No global state without a clear reason | `AGENTS.md` § Golden rules, `docs/conventions.md` § Code | migrated |
| B-013 | l. 184 | Never mix desktop and mobile logic in one component | `AGENTS.md` § Golden rules, `docs/conventions.md` § Code | migrated |
| B-014 | l. 185 | No spacing outside the 8px grid | `AGENTS.md` § Golden rules, `docs/ui-design.md` § Grid | merged with B-026 |
| B-015 | l. 186 | No hardcoded user-facing text, including `title` and `alt` | `AGENTS.md` § Golden rules, `docs/conventions.md` § i18n | merged with B-040 |
| B-016 | l. 187 | No `setState` in an effect to mirror an external source: `useSyncExternalStore` | `AGENTS.md` § Golden rules, `docs/conventions.md` § Code | migrated |
| B-017 | l. 9-20 | Tech stack table | `docs/architecture.md` § Overview | migrated, "Prettier" removed (approved) |
| B-018 | l. 32-44 | Project structure of `src/` | `AGENTS.md` § Project map, `docs/architecture.md` § Project map | migrated, rebuilt from the code (approved) |
| B-019 | l. 49-52 | Two Adventures concept, `lg` breakpoint | `docs/architecture.md` § Two Adventures | migrated |
| B-020 | l. 54-58 | Desktop: bento dashboard | `docs/architecture.md` § Two Adventures | migrated |
| B-021 | l. 60-64 | Mobile: sequential narrative feed | `docs/architecture.md` § Two Adventures | migrated |
| B-022 | l. 66-70 | `/cv`: the printed sheet | `docs/architecture.md` § Two Adventures | migrated |
| B-023 | l. 97-106 | Sections table | `docs/spec-sections.md`, `docs/architecture.md` § Sections per device | migrated |
| B-024 | l. 108-109 | Desktop Hero | `docs/spec-sections.md` § Hero | migrated |
| B-025 | l. 111-113 | `SectionId` single source of truth, `/cv` is a route | `docs/architecture.md` § Sections per device, `AGENTS.md` § Golden rules | migrated |
| B-026 | l. 76-79 | Hard 8px grid | `docs/ui-design.md` § Grid | migrated |
| B-027 | l. 81-88 | Colour palette | `docs/ui-design.md` § Colour palette | migrated |
| B-028 | l. 90-93 | Typography | `docs/ui-design.md` § Typography | migrated |
| B-029 | l. 22-28 | Main commands | `docs/development.md` § Commands | migrated, completed with `build:cv`, `build:og`, `tsc` |
| B-030 | l. 119-121 | Static export, GitHub Pages, no server | `docs/development.md` § Static export, `docs/decisions.md` D-001 | migrated |
| B-031 | l. 123-132 | `cv.ts` data and the `/cv` pipeline | `docs/development.md` § CV pipeline, `docs/architecture.md` § Data flow | migrated |
| B-032 | l. 134-137 | GitHub data at build time, `REPO_COUNT` repos | `docs/development.md` § GitHub data, `docs/decisions.md` D-002 | migrated |
| B-033 | l. 139-150 | Env variables, token permissions, fallback | `docs/development.md` § Environment variables, § GitHub data | migrated |
| B-034 | l. 156 | Components PascalCase, one per file | `docs/conventions.md` § Code | migrated |
| B-035 | l. 157 | Hooks with `use` prefix | `docs/conventions.md` § Code | migrated, example `useScrollSnap` replaced by `useDevice` (does not exist) |
| B-036 | l. 158 | Interfaces over `type` for objects | `docs/conventions.md` § Code | migrated |
| B-037 | l. 159 | `@/` alias for internal imports | `docs/conventions.md` § Code | migrated |
| B-038 | l. 160 | Framer Motion variants outside JSX, shared presets | `docs/conventions.md` § Animations | migrated |
| B-039 | l. 161 | No `any` | `docs/conventions.md` § Code | merged with B-010 |
| B-040 | l. 162-163 | English everywhere, i18n rules and ICU plurals | `docs/conventions.md` § Code, § i18n | migrated |
| B-041 | l. 193-195 | Git workflow: commit message only | `AGENTS.md` § Absolute rules (1), `docs/conventions.md` § Commits | migrated |
| B-042 | `.claude/commands/design-check.md` | Audit command | `docs/development.md` § Claude tooling | migrated, gap on `p-6` noted |
| B-043 | `.claude/commands/new-component.md` | Scaffold command | `docs/development.md` § Claude tooling, `docs/conventions.md` § Checklist | migrated |
| B-044 | `.claude/hooks/guard-violations.sh` | Post-edit violation grep | `docs/development.md` § Claude tooling | migrated, "probably inactive" noted |
| B-045 | `.claude/settings.json` | Plugin and hook registration | kept in place, git permissions merged | migrated |
| B-046 | `README.md` | `create-next-app` boilerplate, no project information | left in place, untouched | dropped (no information to migrate) |

## Statistics

46 blocks: 40 migrated, 5 merged (B-008, B-010, B-014, B-015, B-039 into their twins
B-040, B-039, B-026), 1 dropped (B-046). Corrected or removed details (B-017, B-018, B-035,
B-042, B-044) are counted as migrated. No block is `pending decision`.

Additional content with no origin block (derived from the code, for gaps found by the
audit): `docs/decisions.md` D-003 to D-007 context, `docs/development.md` § Social preview
image (from the header of `scripts/build-og.mjs`), `docs/roadmap.md` § Known debt.
