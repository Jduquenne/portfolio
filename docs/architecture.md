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
| 3D | Three.js (`three`), loaded on demand, only for the Passions constellation |
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
│   ├── desktop/                  # DesktopLayout, Hero, PlanetPanel, HeroAvailability, AvailabilityCard, availabilityLayout, Footer, HeroSectionNav, Sidebar (+ SidebarContact, SidebarLink, SidebarSection, LocaleToggle, StackChip, StackReadout, StackFocus), PlayModal, CursorGlow, CommandPalette, ProjectPreview, sections/
│   │   └── sections/             # Experience, Projects, Specialties
│   ├── mobile/                   # MobileLayout, BottomNav, ScrollToTop, PlanetSheet, ProjectPoster, ProfileIdentity, WorkLocationLink, ContactLinks, availabilityLayout, availability/, sections/
│   │   ├── availability/         # AvailabilityPanel, CityRail
│   │   └── sections/             # Profile, Availability, Experience, Stack, Projects, Passions, Play
│   ├── shared/                   # AdventureRouter, AdventureSkeleton, AvailabilityBadge, ContactAction (mobile), NoScriptContent, ExperienceProjects,
│   │                             #   LanguageSwitcher, LightsOut, RepoStatsReadout
│   │   ├── availability/         # AvailabilityMap + MapOutlines, MapRoutes, MapCities, MapOrigin, MapPen, MapCrumples, CityTooltip,
│   │   │                         #   ModeSwitch, CityChips, RouteSummary, OsmCredit (shared by desktop and, later, mobile)
│   │   └── constellation/        # ConstellationStage, ConstellationLabels, SunTabs, ToolRows, LevelPips, PlanetList
│   └── cv/                       # CvDocument (react-pdf), cvData (cv.ts -> plain strings), Cv (page UI)
├── hooks/                        # useDevice, useCountUp, useActiveSection, useCopyEmail, useFullyVisible, useBackToHero,
│                                 #   useAvailabilityScene, useSceneLoop, useDismissOnEscape, useStartWhenVisible,
│                                 #   useConstellation, useConstellationEngine, useNearScreen, useFitText
├── i18n/                         # routing, navigation, request (next-intl)
├── lib/
│   ├── data/cv.ts                # CV content, LocalizedString fields, localize()
│   ├── data/constellation.ts     # the passions: suns, planets, tools (LocalizedString), read by the constellation only
│   ├── constellation/            # see "Passions constellation" below: types, math, model, layout, store, engine/
│   ├── dataSaver.ts              # is the browser asked to save data
│   ├── github.ts                 # build-time GitHub fetch
│   ├── motion.ts                 # shared Framer Motion presets
│   ├── scroll.ts                 # scrollToSection, scrollToTop, scroll root id and desktop insets (one place)
│   ├── availability/             # the availability map, see "Availability map" below
│   │   ├── data/                 #   geography, cities, routes (generated output), config (origin, radius, motion)
│   │   ├── geo/                  #   math, projection, shape, camera (pure functions)
│   │   ├── engine/               #   world, tweens, toolpath, crumple, scene (no React, no DOM)
│   │   ├── render/               #   handles + registry, applyFrame, obstacles (writes a frame to the SVG)
│   │   ├── types.ts · visit.ts   #   shared types, first-visit flag
│   ├── site.ts                   # SITE_URL, the one place the public URL is written
│   ├── stack.ts                  # where a technology is used, from the experiences of cv.ts
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
| Passions | `SpecialtiesSection` (the constellation) | `PassionsSection` (the constellation) |
| Play | modal (`PlayModal`) opened from the Hero or the command palette | `PlaySection` |

Desktop also has a `Hero` above Experience. Desktop and mobile never import from each
other. `shared/` holds what both use (`LightsOut`, `ExperienceProjects`, ...).

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

## Availability map

```
data ──► World (projected once) ──► Scene (state machine, tweens, toolpath) ──► SceneFrame (plain data)
                                          ▲                                        │
        React: useAvailabilityScene ──────┘                                        ▼
        (useSyncExternalStore: phase, mode, selected city)              applyFrame ──► SVG elements (via refs)
                                                                                       ▲
 DesktopLayout ► Hero ► HeroAvailability (dynamic, no SSR) ► AvailabilityMap + AvailabilityCard
```

- The **scene** knows nothing of React or the DOM. It takes a viewport and a clock, and returns a frame. The
  **renderer** knows the SVG and the content drawn over it (elements marked `data-map-obstacle`, so labels step
  aside), and nothing of the scene's rules.
- **Layout contracts** live in one place each: `DESKTOP_SCROLL_INSET_*` and `DESKTOP_HERO_BLEED` in `lib/scroll.ts`
  (the layer reaches the edges of the scroll area), `reservedLeft` and the card width in
  `components/desktop/availabilityLayout.ts` (the map keeps the card's width free).
- **Adding a city:** an entry in `data/cities.ts` (both languages). With a route in `data/routes.ts` and inside the
  radius, it becomes clickable.
- **Two layouts, one engine.** A layout decides only three things through a `SceneConfig`: the insets the map leaves
  free (`reserve`), the paddings, and what the on-site view frames (`focus`: the region or the radius). Desktop:
  `desktop/availabilityLayout.ts` (a left reserve for the card). Mobile: `mobile/availabilityLayout.ts` (a fixed head on
  top, a fixed panel at the bottom). `AvailabilityMap` gets `tapReachPx` on a touch screen: no per-dot clicks and no
  hover, the scene picks the nearest city to the tap (`pickCity`).
- Desktop starts the drawing a second after the Hero is in (`HeroAvailability`), mobile when the section is on screen
  (`useStartWhenVisible`). Both use the same first-visit flag.

## Passions constellation

Built like the availability map (D-013, D-016): layers that do not mix.

```
lib/data/constellation.ts      content, LocalizedString: four suns, the planets (suns, note, tools), levels
lib/constellation/
  types.ts · math.ts           shared types, small vector helpers and a seeded generator (pure)
  model.ts                     data + language + level labels -> ConstellationModel (pure)
  layout.ts                    orbits, and planets pushed apart so they do not pile up (pure, deterministic)
  store.ts                     the visitor's choice: sun, planet, tool (no Three.js, works before the scene exists)
  engine/                      the only code that imports Three.js: nodes, parts, shaders, index (frame loop, picking, camera)
hooks/useConstellation         model, layout and store for a layout kind ("wide" on desktop, "tall" for mobile)
hooks/useConstellationEngine   requests the engine with import() once enabled, starts it on the stage, disposes it
components/shared/constellation/ConstellationStage   canvas + labels + leader line as one decorative layer
```

- **Frame:** the engine writes positions and opacity of the labels (`data-node`) and of the leader line (`data-leader`) to
  the DOM, and reads the panel (`data-panel`) to keep the open planet clear of it. React re-renders only when the choice
  changes. With reduced motion it renders only when something changes.
- **Sky and the page:** the layer bleeds past the stage (`DESKTOP_HERO_BLEED`) and is masked at its top and bottom
  (`.constellation-veil`), so the page's dot grid shows through and there is no edge between the canvas and the DOM.
- **Tiers:** `compact` (a phone) uses fewer stars, a pixel ratio of at most 1.5, no antialiasing, the orbit controls off (a drag
  scrolls the page), a wider tap reach and labels only for what is in focus.

