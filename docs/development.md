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

## Adding a project preview

1. Record the project (a dozen seconds, 16:10, for instance 1280x800): a quick look at each page, then the most
   visual one last. Anything works: OBS, ScreenToGif, or a scripted headless Chrome. Visit every page once before
   recording so nothing loads during the clip, and move the mouse like a hand would (curved path, slow start and
   end, small pauses); a straight constant-speed drag looks like a bot. A visible cursor helps the viewer follow.
   Some cases that came up: an app that keeps its data in the browser starts empty, so record from a clean
   profile and enter a few plausible examples through its own interface before the clip starts; an app that
   fetches content (a photo, an API) makes the clip depend on the network, so keep its responses during the
   warm-up and serve them from memory while recording. A public demo mode, when the app has one, is the
   simplest way to get data.
2. Encode the clip with ffmpeg (about 14 s at most, no audio, 448px wide, `faststart` so it starts before it is
   fully downloaded):
   `ffmpeg -i <video> -t 14 -an -vf "fps=24,scale=448:-2:flags=lanczos" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart public/previews/<repo>.mp4`
3. Take one frame as the still, ideally the page that presents the whole project (a home page with its menu,
   before the cursor appears), and write it twice with any image tool (sharp, Squoosh, ffmpeg):
   `public/previews/<repo>.webp` at 640px wide (quality about 78, shown full width on a phone) and
   `public/previews/<repo>.thumb.webp` at **exactly 448px wide** (the desktop thumbnail is 224px, so a 2x
   source downsizes cleanly even on a 1x screen). The sizes to expect: clip about 150 KiB for 13 s, stills from 5 to 45 KiB depending on how detailed the frame is.
4. Commit the three files.

The steps above are a recipe: the repo carries no script for them, and the build never runs ffmpeg.

The files are matched to the GitHub repos **by name** at build time (`src/lib/previews.ts`). A repo without
files simply has no media. Files that match none of the listed repos (renamed, deleted, or older than the
eight most recent) stay harmless and the build logs `[previews] not used by the listed repos: ...`. The
repo name must match exactly; after a rename on GitHub, rename the files too.

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
