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
