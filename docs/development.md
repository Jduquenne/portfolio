# Development

Each command below states whether it was verified during the migration (2026-10-27).

## Prerequisites and setup

- Node 20 (version used by CI, `.github/workflows/deploy.yml`).
- `npm ci` to install (CI) or `npm install` locally.
- `.env.local` with `GH_USERNAME` and `GH_TOKEN` (see "GitHub data"). Git-ignored.

## Commands

| Command | What it does | Verified |
|---|---|---|
| `npm run dev` | Start the development server | not run |
| `npm run build` | `build:cv`, then `build:og`, then `next build` (static export in production) | not run (regenerates `public/` files, needs GitHub access) |
| `npm run build:cv` | Render the A4 CV to `public/cv-{fr,en}.pdf` + `cv-preview-{fr,en}.webp` | not run |
| `npm run build:og` | Render the social preview card to `public/og.png` | not run |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) | yes, passes |
| `npx tsc --noEmit` | Type check (there is no npm script for it) | yes, passes |
| `npm start` | `next start` (not used in production: the site is a static export) | not run |

## Environment variables

Names only, never values. Set both in `.env.local` locally and as Actions secrets for CI.

| Variable | Purpose |
|---|---|
| `GH_USERNAME` | GitHub account to read |
| `GH_TOKEN` | Fine-grained PAT (see below) |

## GitHub data

Fetched at build time in `src/lib/github.ts`, in a single GraphQL request. The Projects
section lists the `REPO_COUNT` (currently 8) most recently pushed repos: owned, public,
forks excluded. The repo counters apply the same filters, so the displayed number always
describes the listed set. This is the only external API the project uses.

The token needs **`Metadata: read-only`** (repo listing and public/private counters) and
**`Deployments: read-only`** (resolves GitHub Pages URLs), on all repositories. Never
grant `Contents`: the build has no reason to read source code.

If the token is missing or rejected, the build falls back to an unauthenticated REST call
and warns on stdout: repos still list, counters and Pages links disappear.

## CV pipeline

`npm run build:cv` runs `scripts/cv.mjs`, which bundles `scripts/build-cv.mts` with
esbuild into the git-ignored `scripts/dist/` (react-pdf ships ESM-only subpath exports
that trip on-the-fly TS loaders) and runs it. It renders
`src/components/cv/CvDocument.tsx` to PDF and a WebP preview per locale.

The avatar is passed to react-pdf as a `file:` URL (`pathToFileURL`): react-pdf reads a Windows path such
as `E:...` as a remote URL and fails with "fetch failed", leaving an empty photo frame.

react-pdf and its tooling are **devDependencies**: never shipped to the client. After
changing `src/lib/data/cv.ts` or the `cv.*` translations, run `npm run build:cv` and
commit the regenerated `public/cv-*` files (output is deterministic). CI regenerates them
on every deploy regardless.

## Performance and accessibility check

Lighthouse is not a dependency of the project. Run it from outside the repo (for instance
`npx lighthouse <url> --preset=desktop`) against the deployed site: a local static server has to mimic
GitHub Pages (gzip, the `/portfolio` base path) or the figures come out lower. A Windows build also
writes the RSC segment files in nested folders, which gives one 404 in the console that the Linux CI build
does not have.

## Sitemap

`src/app/sitemap.ts` generates `sitemap.xml` (home and CV, in both languages, with `hreflang`
alternates). There is no `robots.txt`: crawlers only read it at the root of the host, and
`jduquenne.github.io` root belongs to the user site, not to this project page. Submit
`https://jduquenne.github.io/portfolio/sitemap.xml` in Google Search Console if needed.

## Social preview image

`npm run build:og` renders `public/og.png` (1200x630) from `scripts/build-og.mjs`. Per the
script's header, the output is deterministic and the regenerated `public/og.png` is
committed. The card is in English on purpose: it is shared for both locales.

## Static export and deployment

`output: "export"` in production, deployed to GitHub Pages under `basePath: /portfolio`
(`next.config.ts`). There is no server at runtime: everything resolves at build time.
Anything that must stay fresh requires a redeploy.

`.github/workflows/deploy.yml` builds on every push to `master`, on manual dispatch, and
daily at 05:00 UTC (scheduled redeploy to refresh the GitHub data).

## Claude tooling (`.claude/`)

| Item | Purpose |
|---|---|
| `commands/design-check.md` (`/design-check`) | Audits `src/` for 8px grid, palette, Two Adventures separation, inline motion variants, `any`, then runs `npm run lint` |
| `commands/new-component.md` (`/new-component`) | Scaffolds a component: `ComponentName desktop\|mobile\|shared\|ui [--animated]` |
| `hooks/guard-violations.sh` | `PostToolUse` hook on `Edit\|Write`, greps edited `.ts`/`.tsx` for grid, `any` and palette violations |
| `settings.json` | Enables the `frontend-design` plugin, registers the hook, blocks state-changing git commands |

> Note (migration): known gaps, not fixed (the migration does not modify scripts).
> - `guard-violations.sh` reads `$CLAUDE_TOOL_INPUT`, which is not set in the environment
>   observed in a session. It is probably inactive, and its stdout would not reach the
>   agent anyway. Not verified.
> - The hook and `design-check.md` list `p-6`, `m-6`, `mt-6`, `gap-6`... as violations.
>   They are valid (24px). They also miss real violations such as `py-1.5` and `py-0.5`.
> - `design-check.md` § 4 and the type scale: it does not check the arbitrary text sizes,
>   the 200ms minimum duration or the focus ring added by D-008.
> - `new-component.md` lists a `ui` category, but `src/components/ui/` does not exist
>   yet.

## Known issues

See "Known debt" in [roadmap.md](roadmap.md).
