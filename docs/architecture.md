# Architecture

## Overview

A portfolio that is not a simple showcase, but a demonstration of software engineering
and precision design. The goal is "Zero Friction" while telling a human story through a
rigorous IT aesthetic.

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| i18n | next-intl, `fr` (default) + `en` |
| Fonts | `next/font`: Geist Mono + Inter Variable |
| Icons | Lucide React |
| Linting | ESLint |

> Note (migration): the original context listed "ESLint + Prettier". There is no
> Prettier dependency or config, and the owner does not want one. Removed.

## Two Adventures

The experience is **fundamentally different** depending on the device, not simple
responsive design. The breakpoint is **`lg` (1024px)**, resolved at runtime by
`useDevice` (`src/hooks/useDevice.ts`, `useSyncExternalStore` on a media query) and
dispatched by `AdventureRouter` (`src/components/shared/AdventureRouter.tsx`).
Until the device is known, a neutral placeholder is rendered.

### 1. Desktop: the integrated bento dashboard

- **Concept:** an immersive dashboard where information is spatialized.
- **UX flow:** non-linear navigation. The user "explores" via hover states that reveal
  data layers (Personality Layer vs Technical Layer).
- **Satisfying factor:** synchronized transitions with Framer Motion. Hovering a passion
  makes the entire grid react with spring physics (`type: "spring"`).

### 2. Mobile: the sequential narrative feed

- **Concept:** an experience optimized for the thumb (bottom navigation).
- **UX flow:** linear snap navigation (`scroll-snap-type`). Each section is an
  autonomous "unit of thought".
- **Satisfying factor:** haptic mimicry, visual micro-animations and fluid transitions
  that simulate a native app feel.

### 3. `/cv`: the printed sheet

A third rendering of `cv.ts`: an A4 CV on light "paper" (dark ink, sky accent, same
type and structural language as the portfolio). Generated as a static PDF at build time,
not in the browser. See [development.md](development.md) (CV pipeline).

## Project map

Verified against the code on 2026-10-27.

```
src/
├── app/
│   ├── layout.tsx, page.tsx      # root redirect stub with Open Graph tags (see below)
│   ├── not-found.tsx             # static 404.html, both locales
│   ├── sitemap.ts                # sitemap.xml with fr/en alternates (force-static)
│   ├── fonts.ts                  # next/font: Inter + Geist Mono
│   ├── [locale]/                 # layout.tsx, page.tsx (home), cv/page.tsx
│   ├── globals.css
│   └── icon.svg
├── components/
│   ├── desktop/                  # DesktopLayout, Hero, Sidebar (+ SidebarContact, SidebarLink, SidebarSection, LocaleToggle), PlayModal, CursorGlow, CommandPalette, ProjectPreview, sections/
│   │   └── sections/             # Experience, Projects, Specialties
│   ├── mobile/                   # MobileLayout, BottomNav, ScrollToTop, ProjectPoster, sections/
│   │   └── sections/             # Profile, Experience, Stack, Projects, Passions, Play
│   ├── shared/                   # AdventureRouter, AdventureSkeleton, AvailabilityBadge, ContactAction (mobile), NoScriptContent, ExperienceDescription,
│   │                             #   LanguageSwitcher, LightsOut, RepoStatsReadout
│   └── cv/                       # CvDocument (react-pdf), cvData (cv.ts -> plain strings), Cv (page UI)
├── hooks/                        # useDevice, useCountUp, useActiveSection, useCopyEmail
├── i18n/                         # routing, navigation, request (next-intl)
├── lib/
│   ├── data/cv.ts                # CV content, LocalizedString fields, localize()
│   ├── github.ts                 # build-time GitHub fetch
│   ├── motion.ts                 # shared Framer Motion presets
│   ├── site.ts                   # SITE_URL, the one place the public URL is written
│   ├── previews.ts               # matches public/previews/<repo>.* files to the listed repos (build time)
│   ├── lightsOut.ts              # Lights Out game logic
│   ├── languages.ts              # GitHub language colours
│   └── utils.ts
└── types/index.ts                # Locale, LocalizedString, SectionId, Project, GitHub types
messages/{en,fr}.json             # all UI text, identical key sets
scripts/                          # cv.mjs, build-cv.mts, build-og.mjs, fonts/
public/                           # avatar.{png,webp}, og.png, cv-{fr,en}.pdf, cv-preview-{fr,en}.webp, previews/
```

> Note (migration): the original structure listed `components/ui/`, and examples such
> as `BentoGrid`, `SnapCard`, `Nav`, `Footer` and `useScrollSnap`. None exists in the
> code. It also omitted `components/cv/`, `i18n/` and `app/[locale]/`. This map replaces
> it.

The root `src/app/page.tsx` is a static redirect stub to the default locale. Crawlers
that ignore the meta refresh (LinkedIn, Slack...) still read the Open Graph tags there.

## Sections per device

Section ids come from `SectionId` in `src/types/index.ts`, the single source of truth.
They must stay in sync with the `nav.*` translation keys. `/cv` is a separate route,
not a section. See [spec-sections.md](spec-sections.md) for what each section does.

| Section | Desktop (`DesktopLayout`) | Mobile (`MobileLayout`) |
|---|---|---|
| Profile | `Sidebar` | `ProfileSection` (first card) |
| Experience | `ExperienceSection` | `ExperienceSection` |
| Stack | block inside `Sidebar` | `StackSection` (dedicated section) |
| Projects | `ProjectsSection` | `ProjectsSection` |
| Passions | `SpecialtiesSection` | `PassionsSection` |
| Play | modal (`PlayModal`) opened from the Hero or the command palette | `PlaySection` |

Desktop also has a `Hero` above Experience. Desktop and mobile never import from each
other. `shared/` holds what both use (`LightsOut`, `ExperienceDescription`, ...).

## Data flow

```
src/lib/data/cv.ts ──► components (via localize(locale))
        │
        └──► scripts/build-cv.mts ──► public/cv-{fr,en}.pdf + cv-preview-*.webp ──► /cv
GitHub GraphQL ──► src/lib/github.ts (fetchPortfolioRepos, at build) ──► [locale]/page.tsx
        └──► AdventureRouter ──► DesktopLayout | MobileLayout (props: repos, stats)
messages/{en,fr}.json ──► next-intl (useTranslations)
```

- **CV data** is in `src/lib/data/cv.ts`. Every translatable field is a
  `LocalizedString` (`{ en, fr }`) read through `localize()`.
- **GitHub data** is fetched at build time. See [development.md](development.md).
- **Crawlers and no-JavaScript:** the layout is chosen in the browser (`useDevice`), so the static HTML
  alone would hold no text. `NoScriptContent` (server component, in `<noscript>`) renders the name,
  headline, contact links, experiences, stack and projects; a `<noscript><style>` in the head hides the
  skeleton when scripts are off. With scripts on, the browser does not build the `<noscript>` content.
- **Static pages:** `[locale]/page.tsx` is `force-static`. Anything that must stay fresh
  requires a redeploy.
