# Decisions

Format: Date, Status (accepted / proposed / superseded / rejected), Context, Decision,
Alternatives considered, Consequences. Decisions D-001 to D-006 were recorded during the
migration from the original `CLAUDE.md` and the code. Their dates and alternatives were
not documented. They are all `accepted` because the code implements them.

## D-001: Static export on GitHub Pages

- **Date:** unknown, before migration
- **Status:** accepted
- **Context:** the portfolio needs no runtime server.
- **Decision:** `output: "export"` in production, deployed to GitHub Pages under
  `basePath: /portfolio`.
- **Alternatives considered:** not documented
- **Consequences:** everything resolves at build time. Anything that must stay fresh
  requires a redeploy (see D-007).

## D-002: GitHub data fetched at build time with one GraphQL request

- **Date:** unknown, before migration
- **Status:** accepted
- **Context:** the Projects section and repo counters need GitHub data.
- **Decision:** a single GraphQL request in `src/lib/github.ts`, with the `REPO_COUNT`
  most recently pushed owned public non-fork repos. Unauthenticated REST fallback if the
  token is missing or rejected. The token has `Metadata` and `Deployments` read-only,
  never `Contents`.
- **Alternatives considered:** not documented
- **Consequences:** counters and Pages links disappear in the fallback. GitHub is the only
  external API.

## D-003: CV generated as a static PDF at build time

- **Date:** unknown, before migration
- **Status:** accepted
- **Context:** a third rendering of `cv.ts` as an A4 sheet.
- **Decision:** `scripts/build-cv.mts` renders `CvDocument.tsx` with react-pdf to
  `public/cv-{fr,en}.pdf` and WebP previews. react-pdf and tooling are devDependencies.
- **Alternatives considered:** not documented
- **Consequences:** nothing ships to the client. Regenerated files are committed after a
  change to `cv.ts` or the `cv.*` translations. CI regenerates them on every deploy.

## D-004: Two Adventures

- **Date:** unknown, before migration
- **Status:** accepted
- **Context:** the experience should be fundamentally different per device.
- **Decision:** a desktop bento dashboard and a mobile snap feed, separated at `lg`
  (1024px) and dispatched by `AdventureRouter`. No shared component mixes both.
- **Alternatives considered:** responsive design (explicitly rejected in the original
  `CLAUDE.md`)
- **Consequences:** two component trees under `components/desktop/` and
  `components/mobile/`, with `shared/` for common parts.

## D-005: next-intl, French default

- **Date:** unknown, before migration
- **Status:** accepted
- **Decision:** `fr` (default) and `en` through next-intl. UI text in `messages/`, content
  data as `LocalizedString` in `cv.ts`.
- **Alternatives considered:** not documented
- **Consequences:** both message files keep identical key sets.

## D-006: Lucide React for icons

- **Date:** unknown, before migration
- **Status:** accepted
- **Decision:** Lucide React is the icon library (7 files import it).
- **Alternatives considered:** not documented
- **Consequences:** none documented.

## D-007: Daily scheduled redeploy

- **Date:** 2026-10 (commit `7d4be27`)
- **Status:** accepted
- **Context:** GitHub data is resolved at build time and goes stale.
- **Decision:** `.github/workflows/deploy.yml` also runs on a daily cron (05:00 UTC).
- **Alternatives considered:** not documented
- **Consequences:** the "latest activity" readout and repo list refresh once a day.

## D-008: Selective adoption of the `landing-page-design` skill

- **Date:** 2026-10-27
- **Status:** accepted
- **Context:** a `SKILL.md` (visual system for landing pages) was compared with the
  project's design rules. It targets conversion pages, the portfolio is a narrative.
- **Decision:** adopt only the rules that do not contradict the project: Tailwind type
  scale without arbitrary sizes, `text-wrap` balance and pretty, visible focus ring,
  200ms minimum transition, `prefers-reduced-motion`, scroll reveals without unthrottled
  listeners, the state set (hover, active, focus, loading, empty, error), a skip-to-content
  link, a custom 404, alt text and semantic HTML. The 4px step stays allowed as an owner
  exception to the 8px grid.
- **Alternatives considered:** adopting the whole skill, rejected. It forbids Inter and
  Lucide, imposes another spacing table, other dark backgrounds, a cubic-bezier curve
  instead of spring physics, and a landing-page structure (CTA, FAQ, tagline reveal).
  Not adopted: the spacing table, the single typeface, Phosphor/Solar/Iconamoon icons, the
  skill's dark backgrounds, the no-gradient rule (the dot-grid backdrop uses radial
  gradients), part A (strategy and structure), the tagline reveal section.
- **Consequences:** `docs/ui-design.md` carries the adopted rules. `SKILL.md` is not part
  of the agent context.

## D-009: Text fallback in `<noscript>` and a sitemap

- **Date:** 2026-10-27
- **Status:** accepted
- **Context:** the device layout is chosen in the browser, so the static HTML held no visible text and no
  `<h1>` (checked on the live site). Link previews worked (they read the head), but tools that do not run
  JavaScript saw an empty page.
- **Decision:** render a plain semantic version of the content in a `<noscript>` block from the server page,
  and generate a `sitemap.xml`. The public URL lives in `src/lib/site.ts`.
- **Alternatives considered:** server-rendering the mobile feed (desktop visitors would see a flash);
  rendering both layouts and hiding one with CSS (doubles the DOM, against the Two Adventures rule);
  visually hidden duplicate text (read twice by screen readers).
- **Consequences:** the text exists twice in the source (the app and the fallback) but both read `cv.ts`.
  `robots.txt` is not possible on a project page.

## D-010: Project previews as local files matched by repo name, clip loaded on hover

- **Date:** 2026-10-27
- **Status:** accepted
- **Context:** the Projects section is text only, and the repo list comes from GitHub at build time, so a
  repo can appear, be renamed or disappear without the site being touched.
- **Decision:** previews are committed files in `public/previews/`, matched to repos by name at build time.
  No manifest. Desktop: a muted H.264 clip requested only after a 150ms hover or focus, over a still.
  Mobile: the still only. A repo without files keeps the text layout.
- **Alternatives considered:** GIF (several MB); animated WebP (about 1 MB, cannot be paused, always
  decoded); GitHub's generated social image (`openGraphImageUrl`: a third-party request, not the app's
  look, gone with the repo); automatic capture in CI (the build would fail whenever a demo is down).
- **Consequences:** the repo grows by about 230 KiB per project, and a clip goes stale when the project
  changes visually (re-record and redo the three files, see development.md). Renaming a repo drops its media until the
  files are renamed; the build logs unused files.

## D-011: Experience projects as structured data, not links inside a description

- **Date:** 2026-11-04
- **Status:** accepted
- **Context:** the current experience ships two apps, but `description` was a single string and the project names
  were turned into links by matching them in the text (`ExperienceDescription`), so the two apps read as one block.
  Artemis FoodLab was also described as offline on IndexedDB, which is no longer true (its own Node.js API, sign-in
  required, IndexedDB kept as a cache).
- **Decision:** `CVExperience` gets an optional `projects` (`label`, `href`, localized `description`), shown under
  the description by `ExperienceProjects` (desktop, mobile), as a list in `NoScriptContent` and, in the CV PDF, as a single line of project names
  (one page is the constraint; the descriptions stay on the site). `links` and `ExperienceDescription` are removed. The stack stays at experience level.
- **Alternatives considered:** line breaks inside the description string (fragile, no structure for the PDF);
  moving the two apps to the Projects section (fed by GitHub, cannot carry a written description).
- **Consequences:** a project is now data, so a new one means one entry in `projects` in both languages. Links are
  not printed in the PDF (they were not before). The CV keeps only the names: four projects with a description
  each made both CVs two pages.

## D-012: The availability map is written in-house, only the routes come from OpenStreetMap

- **Date:** 2026-11-04
- **Status:** accepted
- **Context:** the Hero has a free area, and "available for work" does not say where or how. A map answers it, and
  a click on a city can show the trip from Bailleul.
- **Decision:** the outlines (France, Corsica, Hauts-de-France) are hand-written, stylised polylines in
  `src/lib/availability/data/geography.ts`: a faceted silhouette, not a cartographic one. The projection (Mercator,
  so that a 45 km radius stays a true circle), the camera, the toolpath animation and the paper crumple are all
  code of this repo. The only external data is the road route from Bailleul to each city inside the radius,
  computed once outside the project, simplified, and kept as plain output in `data/routes.ts`. Nothing of the
  tool that produced it is in the repo. The licence (ODbL) asks for attribution: a line shown with the route and in
  a footer (`OsmCredit`).
- **Alternatives considered:** a map library or a GeoJSON dataset from another repo (rejected: owner wants the
  component fully in-house); straight lines or right-angle "toolpath" routes (rejected: not credible); a routing
  service called at runtime (rejected: static export, no server).
- **Consequences:** routes are a snapshot. Durations are typical car times without traffic, rounded to 5 minutes.
  Changing the radius or the origin means recomputing the routes outside the project. Only cities inside the
  radius have a route; the others are context.

## D-013: An imperative scene engine under a thin React shell

- **Date:** 2026-11-04
- **Status:** accepted
- **Context:** the map is about 200 SVG elements animated at 60 frames per second (a head drawing the outlines, a
  camera zoom, a crumple), with state that React should also know about (mode, selected city, phase).
- **Decision:** five layers that do not mix. Data (`src/lib/availability/data`), geometry (`geo`, pure functions),
  engine (`engine`: world, tweens, toolpath, crumple, scene, no React, no DOM), render (`render`: writes a frame to
  the SVG, collision-free labels) and UI (`components/shared/availability`, `components/desktop`). The scene produces
  a plain `SceneFrame` per tick; `applyFrame` writes it to the elements through refs, so React never re-renders per
  frame. React only subscribes to the discrete state (`useSyncExternalStore`). The map layer is loaded with
  `next/dynamic` (no SSR) after the Hero is on screen. The refs are filled through a registry of callbacks, because
  components may not mutate what they receive.
- **Alternatives considered:** driving the SVG from React state (a re-render of every element per frame); a canvas
  (loses the crisp strokes and the easy a11y split); an animation library (a new dependency, and the toolpath
  semantics are specific).
- **Consequences:** the engine and the geometry are testable without a browser, but no test runner is installed
  (owner decision): checks are made outside the repo. A mobile layer reuses the engine and the data and brings its own
  UI.

## D-014: The map is permanent, and the Hero fills the first screen

- **Date:** 2026-11-04
- **Status:** accepted
- **Context:** a toggle button made the map optional, but most visitors would not press it, and without it the Hero
  is an empty screen. A full-height Hero was tested first (a 65% version was dropped).
- **Decision:** the Hero fills the visible height, with three zones (thesis, availability card, bottom row). The map
  draws itself about a second after the Hero is in, once per browser session (`sessionStorage`); later views, and
  language switches, show it already drawn. It opens on the on-site view, after drawing the whole of France first.
  There is no way to hide it. Clearing a route crumples the line into a paper ball that flies into the card.
- **Alternatives considered:** the map behind a button (hidden for most visitors); the map hidden by default with a
  one-line summary visible (kept as a fallback, not needed).
- **Consequences:** the first screen carries the most visual weight of the site, so it must stay legible at small
  sizes (the card scrolls inside itself under about 700px of height, and the map is faded under text and buttons).
  `Escape` clears a route only when no dialog is open.

## D-015: The availability map on mobile: its own section, reached from the first screen

- **Date:** 2026-11-04
- **Status:** accepted
- **Context:** the map carries information (where and how he can work) that a phone visitor should not miss, but the
  desktop Hero has no mobile counterpart. The tab bar has five entries, and a sixth is cramped (11px between entries
  at 390px, 6px at 360px, touching at 320px).
- **Decision:** a section `availability` right after Profile (not a tab bar entry, not in `SectionId`), same
  snap as its neighbours. The map fills it, under a head (title and mode switch) and a panel (the
  summary and the cities) of fixed heights (128px and 184px), so the
  free area of the map never changes and the camera never jumps. It draws itself the first time 60% of it is on screen,
  once per browser session. The on-site view frames the 45 km circle, not the whole region (the cities are 18px apart
  at region scale, under a fingertip). A tap picks the nearest reachable city within 32px, and the cities are also a
  row the finger slides sideways. The first screen links to the section ("Lieu de travail", 45 km around Bailleul or
  remote) and is reworked: three groups spread over the height, the availability badge beside the name, the language
  switch in the top corner, the "Contact" block replaced by three outline buttons. To serve both layouts the engine now
  takes four insets instead of a left reserve, an on-site focus, a route zoom cap and a speed scale for off-screen
  drawing, and labels stay inside the viewport.
- **Alternatives considered:** a sixth tab bar entry (too tight on small phones); the map inside the profile card (no
  room); a per-dot tap (a finger misses at that scale); a mobile-only map with different data (duplicates the engine).
- **Consequences:** desktop and mobile share the data, the engine, the renderer and `components/shared/availability`;
  each owns its placement (`desktop/availabilityLayout.ts`, `mobile/availabilityLayout.ts`).
  **Amendment, same day, after a real phone:** the first version kept the mobile sections at `h-screen` (`100vh`) with a
  fixed tab bar. On a phone `100vh` is taller than the visible area (the address bar), so the bottom of each section
  and the tab bar covered content. The mobile layout is now a column of the visible height (`.h-visible`: `100vh`, then
  `100dvh`): the scrolling area takes what is left (`min-h-0 flex-1`), the sections are `h-full`, and the tab bar sits
  after it (no longer fixed, no longer over anything). Sections need no bottom room for it (`pb-6`).

## D-016: The passions as a 3D constellation, and Three.js

- **Date:** 2026-11-04
- **Status:** accepted (dependencies approved by the owner the same day)
- **Context:** the Passions section was three cards of keywords. The owner wanted something creative that shows how he
  thinks and works, made with Three.js, light enough for any device, with more precise passions (they are part of his
  personality and can match a recruiter).
- **Decision:** the passions are a constellation named `CCFM-1409` (the initials of the four steps, and a date only
  people who know him recognise). Four suns are the steps (Understand, Design, Build, Show), planets are the passions,
  and the tools of a passion go around it. A passion that belongs to two or three steps sits between those suns and
  is tied to each. A tool has a level from 1 to 5 only when the owner sets one; levels are on tools, never on passions.
  The code follows D-013: data (`lib/data/constellation.ts`), pure layers (`lib/constellation`: model, layout, math,
  store, no Three.js), the scene (`lib/constellation/engine`, the only code that imports Three.js) and a thin React
  shell (`components/shared/constellation`, `components/desktop`). The scene writes the position of every label and
  of the leader line straight to the DOM; React only sees the discrete choice (sun, planet, tool) through a store.
  The panel is HTML styled as a game HUD, not a plane in 3D: it stays sharp, selectable, translated and reachable by
  keyboard. `three` is requested with a dynamic `import()` only when the stage comes within 600px of the scroll area,
  and not at all with data saving on. Until it is there (or without WebGL) the same passions are a plain list of
  buttons grouped by step, which is also how a keyboard or a screen reader reaches them once the scene is up. Reduced
  motion draws a still scene, rendered only when something changes.
- **Dependencies:** `three` and `@types/three` (types are a separate package). No react-three-fiber, no drei.
- **Alternatives considered:** react-three-fiber and drei (two more dependencies for one scene, and React would sit in
  the frame loop); 2D canvas or SVG (no depth, no orbits); the panel as a 3D plane (blurry text, no selection, no
  translation); a card grid with CSS only (what it was).
- **Consequences:** a 138.8 KiB (gzip) chunk, requested only near the section; the first load is unchanged (checked:
  no request for it before scrolling). `cv.passions` is left alone, so the CV and its PDF do not change; the Hero's
  "areas" figure now counts the planets. The spec of the section changes: a short description per passion is allowed.
  The mobile section still shows the old cards until the constellation is built for it (a vertical layout is already
  in the code, not yet exercised).
  **Amendment, same day: mobile.** The mobile section (`components/mobile/sections/PassionsSection`) uses the same
  data, store and scene, with its own layout (`LayoutKind` "tall": the suns one under the other) and its own HUD. The
  scene runs in `compact` mode: fewer stars, a pixel ratio of at most 1.5, no antialiasing, and the orbit controls off,
  because a drag on a phone must scroll the feed (the canvas is `touch-action: pan-y`), so the scene drifts on its own and
  is chosen by taps (a tap reaches 40px around a node). Names are shown only for what is in focus (a chosen sun, the open
  planet) and never above the title. The panel is a sheet over the bottom of the stage (`mobile/PlanetSheet`), with
  Description and Tools as two tabs so it never scrolls; level labels in words are left out of its rows (the diamonds and
  a screen-reader text carry the level). The four tabs are a 2x2 grid of 40px targets above the tab bar.

