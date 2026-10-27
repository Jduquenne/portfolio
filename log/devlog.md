# Devlog

Entry format: date, what was done, figures if any, problems, **Still open**. Most recent
first. History before the migration is in `git log` (31 commits on 2026-10-27).

## 2026-10-27: Desktop sidebar redone, and the CV photo restored

**Done**
- Sidebar rebuilt on the grid of the main area: same 48px top margin, photo spanning the 224px column, every
  block sharing the same left and right edges (the old one left the photo at 160px and let "EN" and the copy
  icon float a few pixels off the edge). New pieces: `AvailabilityBadge` (pinging dot, also used by the
  mobile profile; the "●" character left `hero.available`), `LocaleToggle` (FR | EN), `SidebarContact`
  (32px action and a tinted copy segment instead of a 40px block and a loose icon), `SidebarSection` and
  `SidebarLink` (rows with a hairline and an arrow that leans the way the link goes).
- The copy logic moved to `useCopyEmail`; the mobile `ContactAction` keeps its look and uses it too.
- `avatar.webp` is 448px (10 KiB) so the 224px photo stays sharp on dense screens.

**Incident found on the way**
- The deployed CV had an empty photo frame. The commit that made the avatar lighter removed
  `public/avatar.png`, which `build-cv.mts` read; the CI regenerates the CV on every deploy, and react-pdf
  does not fail on a missing image, it leaves the frame empty. Checked on the live preview image.
- `build-cv.mts` now builds the CV photo from `avatar.webp` (converted to PNG in memory, passed as a data
  URI), so no second image file is needed. CV regenerated, both previews checked: photo back in FR and EN.
- `public/avatar.png` reappeared untracked in the working copy; nothing reads it any more.

**Checked**
- Headless Chrome: hover on a row (accent colour, arrow moved by 2px, hairline lit), language toggle
  (`/en/`, `aria-pressed` updated), copy failure state (address shown, layout held), mobile profile
  unchanged and no console message. `tsc` and `lint` pass.

**Still open**
- After the next deploy, check the live CV preview shows the photo.
- Decide what to do with the untracked `public/avatar.png`.

## 2026-10-27: Real README

**Done**
- `README.md` replaced: the repository is public and listed in the portfolio's own project grid, and it still
  held the `create-next-app` text. It is a showcase, not a guide to reuse the site: the social card as a
  banner, what the project is ("my own site, not a template"), the two experiences and `/cv`, what is worth a
  look (static export, GitHub data, hover previews, accessibility, bilingual), the stack, and links to the
  architecture, design and decision docs. A first version also explained how to run and deploy it; the owner
  does not want to guide people to customise it, so that was removed (setup stays in `docs/development.md`).
- Facts checked against the code and the docs (commands, cron time, fallback without a token, the paths
  of the linked docs). No licence is claimed: the repository has no `LICENSE` file.
- Removed the "README is boilerplate" item from the known debt in `docs/roadmap.md`.

**Still open**
- A licence is an owner decision (none is stated today).

## 2026-10-27: Deployed site checked

**Done**
- After the push, checked the live site (headless Chrome, curl, Lighthouse):
  - HTML: the thesis, an `<h1>` and the `<noscript>` block are in the static page; `sitemap.xml` is served with
    its `hreflang` alternates.
  - Previews: at rest only the seven 448px thumbnails are requested (200) and there is no `<video>`; hovering
    each of the cards tried (artemis-foodlab, theme-park-map, sowftware, torpheen-arena, daily-drawing,
    portfolio) plays its clip (paused false, time advancing, opacity 1). GitHub Pages answers with
    `Accept-Ranges: bytes`.
  - Lighthouse: mobile 96 / 100 / 100 / 100 (LCP 2.6 s, was 3.0 s), desktop 100 / 100 / 100 / 100.
- Not a problem: one aborted HEAD request to `/fr/cv/` is Next's own link prefetch; its files answer 200.

**Still open**
- Remaining Lighthouse notes are not ours to fix: GitHub Pages fixes the cache lifetime at 10 minutes, and the
  oversize-image notes are the 2x thumbnails kept sharp for high-density screens.

## 2026-10-27: Preview for theme-park-map

**Done**
- `theme-park-map` ("Park Map History", on GitHub Pages although the repo has no homepage set): the clip
  arrives on the index of 37 parks, searches "Spirou", opens the plan of the Spirou park (the only park with a
  plan) and zooms in once. 7.4 s, 59 KiB. The still is the index page.
- The plan's zoom control is a Leaflet link (`a.leaflet-control-zoom-in`), not a button.
- Clicking a point of interest only opens "no description recorded", so the clip stays on the plan.

**Checked**
- Frames of the clip and the grid at rest: seven cards out of eight have a thumbnail, only the thumbnails are
  requested and no `<video>` exists.

**Still open**
- `tierlist-creator` has no preview; the `theme-park-map` card still has no description (none on GitHub).

## 2026-10-27: Previews for the other main projects

**Done**
- Clips and stills for `artemis-foodlab` (public demo account: week of menus, recipes, shopping list with two
  items ticked, freezer, journal), `sowftware` (a plot and three plantings entered through the interface, then
  catalogue, sowing calendar, three tomatoes placed on the garden plan, yield), `torpheen-arena` (eight spins
  before recording so the inventory is full, then three spins and a rarity filter), `daily-drawing`
  (welcome, a theme, the photo, the calendar, the badges) and `portfolio` itself (home, cursor glow, scroll to
  the projects, hover on the Dofus card, `Ctrl K`, recorded from a production build). Each one starts on the
  app's main page, which is also its still. 9 to 13 s, 60 to 160 KiB per clip.
- Recording tooling kept outside the repo, with a shared kit: hand-like mouse, visible cursor, clean profile
  per run (apps that keep state in the browser start the same way each time), and a network replay for
  `daily-drawing` (its photo comes from the network: the responses are kept during the warm-up and served from
  memory, so the clip shows no loading and always the same photo).

**Problems met on the way**
- A click on "Ail" ticked "Melon": the target finder picked a container that starts with the same text; it now
  takes the smallest matching element. The demo state persisted between runs: profiles are now wiped first.
- The replayed photo came back broken: the cross-origin body was recorded as 0 bytes (fetched again from Node),
  and stale compression headers had to be dropped from the replayed responses.

**Checked**
- Frames of every encoded clip. In the page: at rest only the 448px thumbnails are requested and no `<video>`
  exists; the grid shows six cards with a thumbnail. `tsc`, `lint` and `next build` pass.

**Still open**
- Look at the grid and the hover on each card, then decide: placeholder for the cards without media,
  `theme-park-map`, `tierlist-creator`, and whether to add `job-lens` and `amusement-park-website` (they
  only show once they are among the eight most recently pushed).

## 2026-10-27: Dofus clip redone as a tour

**Done**
- The first clip (the map only, dragged in a straight line at constant speed) looked like a bot. New clip: a
  quick look at seven pages (Grimoire, Métiers, Calcul XP with a job picked and its results, Calcul POD,
  Ressources scrolled, Parchemins with another stat, Prix Dofus with another Dofus), then the interactive map
  panned in two unhurried gestures and zoomed. 13.3 s, 149 KiB.
- The still is the home page with the list of modules (frame at 0.3 s), not the map: it presents the whole
  tool at a glance. The recording keeps the cursor off screen until the hand first moves, so that opening
  frame has no cursor. The stills are small (13 and 6 KiB) because that page is flat colour.
- Recording: every page is visited once off the record so nothing loads during the clip; a visible cursor
  with a click ring is injected; mouse moves follow a curved path with slow start and end, a little tremor
  and pauses, timed on the real clock, with seeded noise so a re-run gives the same clip.

**Checked**
- Frames of the encoded clip, and the clip playing inside the card in headless Chrome (rest, then 2.5, 5.5,
  8.5 and 11.5 s after hover): the tour plays through and the video is still running at 11.6 of 13.3 s.

**Still open**
- Judge the pace by eye on the real card; the owner may want it shorter or slower.

## 2026-10-27: Project previews (clip on hover)

**Done**
- Hover previews like YouTube: a still at rest, a muted H.264 clip requested only after a 150ms hover or
  focus, played over the still and paused when leaving. Desktop only; mobile gets the still. No clip with
  reduced motion or data saving. Decision D-010, rules in `docs/ui-design.md`.
- `src/lib/previews.ts` matches `public/previews/<repo>.*` to the GitHub repos by name and logs unused
  files; `ProjectPreview` (desktop), `ProjectPoster` (mobile), key `logic.preview_alt`, type
  `RepoPreview`. The desktop card became a row (thumbnail + text) only when a preview exists.
- The recording is turned into the clip (448px, 24 fps, CRF 28, no audio, faststart) and two stills (640px
  and a 448px thumbnail) by a helper kept outside the repo on purpose (not versioned); the same steps are
  written as a recipe in `docs/development.md`.
- First preview: the Dofus fan site (`dofus-retro-craft-dashboard`), recorded with headless Chrome and
  ffmpeg: Grimoire, then the interactive map dragged and zoomed. 143 KiB clip, 43 and 23 KiB stills.

**Checked**
- Headless Chrome: at rest only the thumbnail is requested and there is no `<video>`; 100 ms after hover
  still none; during hover the clip is requested, plays muted at full opacity; after leaving it is paused,
  rewound, opacity 0; keyboard focus on a card link starts it too. Mobile: only the poster is requested.
- `tsc`, `lint` and `next build` pass; the three files land in `out/previews`.

**Problems met on the way**
- First clip opened on the map still loading (dark frame): the recording now warms the tiles up off the
  record. A 640px still showed stripes at 1x (browser downsizing by 2.9x): hence the 448px thumbnail.

**Still open**
- Other projects have no preview; look at the card with the owner, then decide on a placeholder and on
  recordings for the other demos.

## 2026-10-27: Lighthouse and its fixes

**Done**
- Measured the deployed site with Lighthouse (installed outside the repo): mobile 94 / 100 / 100 / 100,
  desktop 100 / 96 / 100 / 100. Local figures first looked worse because the test server had no gzip and
  no robots.txt: not the site.
- Fixes: language switcher name now starts with its visible text (`EN: Changer de langue`); text opacity
  moved to two levels (`/50` and `/70`) instead of `/16` to `/60`, 84 class changes in 21 files; the avatar
  is served as `avatar.webp` (320px, 5 KiB instead of the 74 KiB PNG, which stays for the CV).
- Rules added to `docs/ui-design.md` and `AGENTS.md`.

**Checked**
- Local production build with gzip: accessibility 100 on mobile and desktop, performance 95 / 100,
  best practices 96 (a Windows-only 404 on a prefetch file, not present on the live site), SEO 100.
  The two audits (contrast, label in name) and the image audits no longer fail. The look stays subdued.

**Still open**
- Re-measure the deployed site after the next deploy. Mobile LCP stays near 3 s (architecture).

## 2026-10-27: Text for crawlers and visitors without JavaScript

**Done**
- Checked on the live site first: the static HTML had no visible text, no `<h1>` and no sitemap (only the
  head, with title and description, was readable).
- `NoScriptContent` renders the identity, contact links, experiences, stack and projects in a `<noscript>`
  from `[locale]/page.tsx`; keys `noscript.notice` in both message files. The skeleton is hidden when
  scripts are off (`data-adventure-skeleton` + a `<noscript><style>` in the head).
- `sitemap.xml` with `hreflang` alternates. No `robots.txt` (not possible under a project page).
- `SITE_URL` now lives in `src/lib/site.ts` instead of two copies.
- Decision D-009.

**Checked**
- `tsc`, `lint`, `next build` pass. Built HTML: "rigoureux" and `<h1` now present in both locales.
  Chrome with JavaScript off: readable page, skeleton hidden. With JavaScript on: no console error or
  warning, one `<main>`, nothing changes visually.

**Still open**
- Not verified with a real crawler. After deploy, `curl` the live page again to confirm.

## 2026-10-27: Wording review fixes

**Done**
- Bug: the English page showed "6 ans" on the 3D printing card. `stat` is now a `LocalizedString`
  ("6 years" / "6 ans"); the two passions components localize it.
- Consistency: titles all follow `// name` (Projects had none), "// let's play" is "// jeu" in French,
  separators are " · " (were " - "), "Électronique" accented, GitHub/GitLab/JavaScript spelled correctly,
  straight apostrophes became `’` in the French strings, palette placeholder is neutral ("Saisir une
  commande…") while the game keeps `tu`.
- Precision: meta description now names two real things built (the 3D printer control screen, an offline meal
  planner); dropped "moderne" and "vélocité"; the Dagoma line says "développement" like its English twin.
  Contact button is first person: "M’écrire" / "Email me".
- Failed copy: the address is shown (selectable) next to the message, in the contact block and in the palette,
  since it is not displayed otherwise.
- Documented the rules in `docs/conventions.md` (Wording).
- CV: regenerated the PDFs and previews (the committed ones still said "33 years old"). `build-cv.mts` now
  passes the avatar as a `file:` URL: on Windows react-pdf treated `E:...` as a remote URL and the photo
  came out blank ("fetch failed").

**Checked**
- `tsc`, `lint`, `next build` pass. FR and EN pages read in headless Chrome: passions, section titles,
  contact button, subtitle, failed-copy line. Both CV previews looked at (photo present, 34 ans / years).

**Still open**
- "Disponible", hero thesis and figures: owner input (see `docs/roadmap.md`).

## 2026-10-27: Scroll-to-top only when scrolling up

**Done**
- Mobile `ScrollToTop` no longer shows while reading downwards: it appears when the scroll goes back up
  (past 60% of a screen) and hides on the way down or near the top.
- Checked in headless Chrome with a mobile viewport: opacity 0 at the top and when scrolling down, 1
  after scrolling up one section, 0 again going down or back to the top. `tsc`, `lint`, `next build` pass.

**Still open**
- Stack still lists Monogame and Godot (owner decision); wording review of `messages/` and `cv.ts`.

## 2026-10-27: Desktop project cards show their description

**Done**
- Desktop `ProjectsSection`: the description is visible at rest (clamped to 3 lines) instead of on
  hover only, so no card is empty and nothing depends on hover. Topics replace it on hover when a
  repo has both; with only one of the two, that one is always shown.
- The two stacked layers moved from `absolute inset-0` to a one-cell grid: the clamp did not cut
  an absolutely positioned paragraph in Chrome and showed a fourth line (measured: 58.5px high now,
  exactly three lines).

**Checked**
- Re-shot in headless Chrome: cards read well. No repo has topics today, so the hover swap to topics
  was not seen. `tsc`, `lint` and `next build` pass.

**Still open**
- Mobile scroll-to-top overlaps card text; Monogame and Godot still in the stack (owner decision).

## 2026-10-27: Visual check in headless Chrome

**Done**
- Screenshots of desktop (home, cursor glow, projects, passions, palette) and mobile (every section)
  taken with Chrome driven by `puppeteer-core`, installed outside the repo.
- Bug fixed: `RepoStatsReadout` showed "0 dépôts · 0 publics · 0 privés" after a direct jump to the
  Projects section (nav tap, palette): `useInView` used `-15%` margins on all sides, so a header
  snapped to the top never counted as visible. Now only the bottom margin is cut.
- Confirmed in the render: cursor glow is subtle, palette and contact button read well, bottom nav
  marks the active section, the primary button is the only filled element.

**Findings left open** (see "Observed in the visual check" in `docs/roadmap.md`).

## 2026-10-27: Touch targets on mobile

**Done**
- Interactive controls reachable on mobile now have a 40px hit area: bottom nav links (full bar
  height), scroll-to-top, language switcher, project icon links, profile links, contact button.
  The visuals barely move: small elements grow their hit area with a negative margin.
- The stack chips are not interactive, so they were left alone (an earlier note listed them).

**Checked**
- `tsc`, `lint` and `next build` pass. No browser available in the session, so not seen.

**Still open**
- Bottom nav: the labels sit on one line on a 360px screen; check on a real phone, in French too.
- Project icon links now sit 40px apart (they were 32px); check the card header on mobile.
- Inline links (experience descriptions, company name) keep their text size.

## 2026-10-27: Primary contact action

**Done**
- Step 3 of the "wow" plan, one commit per step: `ContactAction` (shared) with an accent "Write to
  Jason" button with a square copy-address icon beside it (the address is not shown in clear);
  the copy button has no outline; feedback is the icon swap (check, or cross on failure) in
  accent and an announced status.
- Placed under the availability line in the desktop sidebar and the first mobile card; the old
  plain email link was removed from both contact lists (GitHub, LinkedIn, CV stay).
- Keys `contact.write`, `copy`, `copied`, `copy_failed` in both message files (85 keys each).

**Checked**
- `tsc`, `lint` and `next build` pass, `public/` untouched, the label is in both locale pages.
  Not run in a browser.

**Still open**
- The visible feedback is icon-only; the "Copied" text is only for screen readers. Adjust if it is too discreet.
- Copy needs `localhost` or https. A `mailto:` needs a mail client, hence the copy button.

## 2026-10-27: Command palette (Ctrl+K)

**Done**
- Step 2 of the "wow" plan, one commit per step: `CommandPalette` (desktop), 11 commands in
  3 groups, keyboard driven, accessible (combobox/listbox), no dependency.
- `DesktopLayout` now holds `playOpen` and `paletteOpen` and renders `PlayModal` and the palette;
  `Hero` takes `onPlay` and `onOpenPalette` and shows a "Commands Ctrl K" button next to Play.
- Keys `palette.*` added to both message files (81 keys each, identical).

**Checked**
- `tsc`, `lint` and `next build` pass, `public/` untouched. Not run in a browser.

**Still open**
- Try it: open with `Ctrl K`, filter, arrows, `Enter`, `Esc`, "Play" from the palette, language
  switch, email copy (needs `localhost` or https for the clipboard).
- Next step: a clear primary contact action.

## 2026-10-27: Cursor glow on the desktop backdrop

**Done**
- Step 1 of the "wow" plan, one commit per step: `CursorGlow` lights the dot grid and adds a
  halo around the mouse (desktop only). CSS in `globals.css`, mounted in `DesktopLayout`.
- The cards (`bg-surface`) hide the glow underneath: it shows in the gaps and the margins. A
  per-card border glow was left out on purpose.

**Checked**
- `tsc`, `lint` and `next build` pass; the compiled CSS keeps the `mask-image`. Not seen in a
  browser.

**Still open**
- Toned down after the first try ("too much glow"): halo `0.07` to `0.025`, lit dots at 45%
  opacity, radius `10rem` to `6rem`. Tune further by eye if needed.
- Next steps: command palette (`Ctrl+K`), then a clear primary contact action.

## 2026-10-27: UX additions from the skill

**Done**
- `useActiveSection` (`useSyncExternalStore` over an `IntersectionObserver` on `#main`):
  `BottomNav` marks the section in view (`aria-current`, accent colour).
- `<MotionConfig reducedMotion="user">` in `AdventureRouter`: all Framer Motion animations
  honour `prefers-reduced-motion`.
- Global press feedback in `globals.css` (`scale: 0.98` on `button` and `a[href]`, motion-safe).
- `--default-transition-duration: 200ms`: Tailwind's default is 150ms, so every bare
  `transition-colors` was under the 200ms minimum.
- `AdventureSkeleton` replaces the blank placeholder while the device is detected.
- `LanguageSwitcher`: `aria-label` and `lang` (key `language.switch` in both message files).

**Checked**
- `tsc`, `lint` and `next build` pass; the compiled CSS contains the 200ms default and the
  `scale` rule. Not seen in a browser.

**Still open**
- Try it on a phone and a desktop: the section highlight, the skeleton flash, the press feel.
- UX ideas not done are listed in `docs/roadmap.md`.

## 2026-10-27: Design rules from the skill, and code fixes

**Done**
- Compared `SKILL.md` with the project rules. Adopted the compatible rules only (D-008 in
  `docs/decisions.md`, rules in `docs/ui-design.md`). `SKILL.md` is left out of the context.
- Owner decisions: 4px (step 1) is allowed as micro-spacing; `text-[10px]` becomes `text-xs`.
- Code fixes:
  - PlayModal: backdrop motion moved into `backdropVariants`; exit transitions 200ms.
  - Type scale: 10 `text-[10px]` to `text-xs` (both Projects sections); Hero `text-[2rem]`
    + `leading-[1.18]` to `text-3xl`; mobile Profile `leading-[1.35]` removed.
  - Spacing: `gap-3`, `px-3`, `mb-3`, `py-1.5`, `pt-1.5`, `py-0.5`, `p-1.5`, `py-px`, close
    button offsets moved onto the grid (Hero, Sidebar, both Experience sections, Profile, Stack,
    LightsOut, PlayModal, Cv).
  - Durations under 200ms raised (Projects topics fade, LightsOut cells).
  - `globals.css`: `text-wrap` balance/pretty and a global `:focus-visible` outline (base layer).
  - New: skip-to-content link, `id="main"` on every page, custom `not-found.tsx`, `fonts.ts`
    (fonts moved out of `[locale]/layout.tsx`), keys `a11y.skip_to_content` and `not_found.*`
    in both message files (identical key sets).
- Correction: `py-10` (40px) is on the 8px grid. An earlier note listed it as a violation.

**Checked**
- `npm run lint`, `npx tsc --noEmit` and `npx next build` pass; `404.html` is generated
  with both locales. Not looked at in a browser, so the visual effect of the larger chips
  and the `text-3xl` hero is unseen.
- `npm run build` (with `build:cv`, `build:og`) not run, `public/` untouched.

**Still open**
- Visual check of desktop and mobile in a browser.
- Remaining known debt in `docs/roadmap.md`.

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
