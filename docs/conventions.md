# Conventions

## Code

- **Components:** PascalCase, one component per file.
- **Hooks:** `use` prefix (e.g. `useDevice`).
- **Types:** prefer interfaces over `type` for objects, PascalCase.
- **Imports:** `@/` alias for all internal imports.
- **No `any`:** strict TypeScript, zero compromise.
- **Language:** all code, comments, variable names and commit messages in English.
- **Comments:** none on self-evident code.
- **State:** no global state without a clear reason. Never call `setState` inside an
  effect to mirror an external source: subscribe with `useSyncExternalStore` (see
  `src/hooks/useDevice.ts`).
- **Composition:** prefer small composed components over large monolithic blocks.
- **Desktop and mobile:** never mix their logic in the same component. Shared logic goes
  in `src/components/shared/`, `src/hooks/` or `src/lib/`.

## Animations

- Use Framer Motion for any non-trivial animation.
- Variants are defined outside JSX. Reuse the shared presets in `src/lib/motion.ts`
  (`fadeUp`, `fadeInLeft`, `stagger()`) rather than redefining them per component.
- Desktop hover reactions use spring physics (`type: "spring"`).

## i18n

- No user-facing string in a component, including `title` and `alt` attributes. UI text
  goes in `messages/{en,fr}.json` and is read with `useTranslations`. Content data goes
  in `src/lib/data/cv.ts` as `LocalizedString`.
- Both message files keep identical key sets (57 keys each on 2026-10-27).
- Use ICU plurals rather than building plurals in code.
- `SectionId` (`src/types/index.ts`) stays in sync with the `nav.*` keys.

## Commits

The owner commits. When asked for a commit, answer with only the message text, no git
command. Format: `feature: <description>` or `fix: <description>`. In English, short, no
bullet points, no technical details. (This is the format of the existing history, not
Conventional Commits.)

## Checklist: add a component

1. Read the target directory to follow its existing patterns.
2. Pick the category: `desktop`, `mobile` or `shared` (`ui` is described by the
   `/new-component` command, but `src/components/ui/` does not exist yet).
3. Create `ComponentName.tsx` with a named export (not default) and a props `interface`.
4. Define animation variants above the component, or reuse `src/lib/motion.ts`.
5. Colours from the palette, spacing on the 8px grid, see [ui-design.md](ui-design.md).
6. Put all UI text in `messages/{en,fr}.json`.
7. `desktop`: no mobile logic, no `scroll-snap`, no `BottomNav`. `mobile`: no hover-only
   states, no `BentoGrid`.
8. Run the checks in `AGENTS.md` ("Before you finish a task").

## Checklist: add a translation key

1. Add the key to `messages/en.json` and `messages/fr.json`, same path.
2. Read it with `useTranslations`, never inline the text.
3. For a section id, update `SectionId` and the `nav.*` keys together.
4. If the key is in the `cv.*` namespace, run `npm run build:cv` and commit the
   regenerated `public/cv-*` files.
