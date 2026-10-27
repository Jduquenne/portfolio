# UI design system (sober and IT-centric)

## Grid

**Hard grid 8px system.** Every spacing value must be a multiple of 8px. Use Tailwind
classes exclusively: `p-2` (8px), `p-4` (16px), `p-8` (32px), etc.

Tailwind spacing steps are 4px each, so only the even steps land on the grid. `p-3` (12px),
`p-5` (20px), `p-7` (28px), `py-10` (40px) and half-steps like `py-1.5` (6px) are off the
grid. `p-6` (24px) is on the grid.

Never use spacing values outside the grid (e.g. `p-3`, `mt-5`). Always verify alignment.

## Colour palette

| Token | Hex | Usage |
|---|---|---|
| `base` | `#020617` | Slate 950, main background |
| `surface` | `#0F172A` | Slate 900, bento cards and surfaces |
| `accent` | `#38BDF8` | Sky 400, CTAs, highlights, IT sparkle |
| `contrast` | `#F8FAFC` | Slate 50, main text |

GitHub language colours (`src/lib/languages.ts`) are data, applied through inline style
in the Projects sections. They are the only hex values outside the palette in the UI.

## Typography

- **`Geist Mono`:** headings, labels, numeric data, code-style elements.
- **`Inter Variable`:** body text, descriptions.

Loaded with `next/font` in `src/app/[locale]/layout.tsx`.

## Known gaps in the tooling

The checks in `.claude/` disagree with the rule above. See "Claude tooling" in
[development.md](development.md). Existing code that breaks the rules is listed under
"Known debt" in [roadmap.md](roadmap.md).
