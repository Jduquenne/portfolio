# UI design system (sober and IT-centric)

Rules adopted from the `landing-page-design` skill are marked (D-008). The skill itself is
not part of the project: see [decisions.md](decisions.md) for what was kept and rejected.

## Grid

**Hard grid 8px system.** Every spacing value must be a multiple of 8px. Use Tailwind
classes exclusively: `p-2` (8px), `p-4` (16px), `p-8` (32px), etc.

Tailwind steps are 4px each, so only the even steps land on the grid (`p-2`, `p-4`, `p-6`
24px, `p-10` 40px, `p-12` 48px, `p-14` 56px...). `p-3` (12px), `p-5` (20px), `p-7` (28px)
and half-steps like `py-1.5` (6px) or `py-0.5` (2px) are off the grid.

**Exception (owner decision, 2026-10-27):** step 1 (4px: `gap-1`, `p-1`, `m-1`) is allowed
as micro-spacing, for tight groups such as tag chips and hit areas.

Never use other spacing values (e.g. `p-3`, `mt-5`). Always verify alignment.

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

Loaded with `next/font` in `src/app/fonts.ts`.

- **Type scale (D-008):** font sizes use Tailwind's default scale (`text-xs` ... `text-9xl`).
  No arbitrary sizes (`text-[10px]`, `text-[2rem]`). If a size falls between two steps, use
  the closest step below, with its paired line height. Do not set a custom `leading-[...]`
  on top of a scale step.
- **Text wrapping (D-008):** `text-wrap: balance` on `h1`-`h3` and `text-wrap: pretty` on
  `p` are set in the `base` layer of `globals.css`. A utility such as `text-balance`
  still wins on a given element.
- No italics, no weights above bold.

## Motion (D-008, the spring physics stay)

- Entrance and hover reactions keep the spring physics of `src/lib/motion.ts` (the skill's
  cubic-bezier curve was rejected).
- No transition shorter than 200ms. `--default-transition-duration` is set to 200ms in
  `globals.css` (Tailwind's default is 150ms), so a bare `transition-colors` complies. Framer
  Motion durations are written as `duration: 0.2` at least.
- Respect `prefers-reduced-motion`: replace movement with a plain opacity change, or none.
  Covered: the hero caret (`globals.css`), `useCountUp`, and every Framer Motion animation
  through `<MotionConfig reducedMotion="user">` in `AdventureRouter`.
- Trigger scroll reveals with `whileInView` or `IntersectionObserver`, once. Never attach
  unthrottled work to a `scroll` listener (`ScrollToTop` uses a passive listener).
- Animate `transform` and `opacity`, not `top`, `left`, `width`, `height`.

## Desktop signature: cursor glow

`CursorGlow` (`components/desktop/`) lights the backdrop dot grid (accent at 45%, 6rem radius) around the
mouse and adds a barely visible halo (2.5%). Kept subtle on purpose: it first read as too much glow. The lit dots reuse the backdrop's 32px tile so they sit exactly on the resting
dots. It writes `--mx` / `--my` straight to the DOM (no React state), is throttled with
`requestAnimationFrame`, ignores touch and pen, fades out when the mouse leaves the window, and
is hidden under `prefers-reduced-motion`. It lives under the content (`-z-10` in an `isolate`d
root), so it shows in the gaps between cards and never over text. Desktop only.

## States and accessibility (D-008)

- Every interactive element has hover, active, and a **visible focus ring**. Both are global
  in the `base` layer of `globals.css`: a `:focus-visible` outline (2px accent, 2px offset)
  and a `scale: 0.98` press feedback on `button` and `a[href]` (motion-safe only).
- The mobile bottom nav marks the section in view (`aria-current` and accent colour), driven
  by `useActiveSection`.
- Before the device is known, `AdventureSkeleton` is shown (sidebar and cards shape, pulse
  only when motion is allowed). It uses `lg:` classes, which is acceptable for a placeholder
  that renders neither adventure.
- Controls without a visible name get an `aria-label` from `messages/` (`LanguageSwitcher`).
- Loading states are skeletons shaped like the real layout, never spinners. Empty states
  are composed views, never a blank panel. Errors are inline and specific, never
  `window.alert()`.
- No dead links: a button pointing at `#` is either linked or visibly disabled. The current
  page is indicated in the navigation.
- A skip-to-content link (first focusable element of `[locale]/layout.tsx`, targets
  `#main`) and a custom `404` (`src/app/not-found.tsx`, both locales since the visitor's
  locale is unknown). Every page has one `<main id="main">`.
- Alt text on every meaningful image. Semantic HTML: `nav`, `main`, `section`, `aside`.
- `<title>`, meta description, `og:image` and social tags: set in `[locale]/layout.tsx` and
  `app/page.tsx`.

## Known gaps in the tooling

The checks in `.claude/` disagree with the rule above. See "Claude tooling" in
[development.md](development.md). Existing code that breaks the rules is listed under
"Known debt" in [roadmap.md](roadmap.md).
