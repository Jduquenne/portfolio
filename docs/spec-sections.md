# Portfolio sections

Where each section is rendered per device: [architecture.md](architecture.md).

| Section | Key concept |
|---|---|
| **Profile** | Identity, availability, then the primary contact action (`ContactAction`) and secondary links: sidebar on desktop, first card on mobile |
| **Experience** | Timeline from `cv.ts`: roles, periods, stacks. An experience can list its own `projects` (linked name and one line each, `ExperienceProjects`) |
| **Stack** | Technical categories from `cv.ts`. A block in the sidebar on desktop, a dedicated section on mobile |
| **Projects** | GitHub repos fetched at build time, most recently pushed first. Desktop cards show the description at rest (3 lines), topics swap in on hover when the repo has any. A repo with files in `public/previews/` also gets a thumbnail: a clip on hover on desktop, a still on mobile |
| **Passions** | Specialities as data: numbers, metadata. Zero long text |
| **Play** | Mobile only as a section: a Lights Out mini-game (`LightsOut`). Desktop opens it from a modal triggered in the Hero |

## Hero (desktop only)

Above Experience, and filling the visible height of the main area (`min-h-full`), so Experience is
out of sight when the page opens. The `cv.identity.description` thesis in Geist Mono, a "latest
activity" readout from the GitHub data, two entry points (the command palette `Ctrl K` and the game),
and a scroll cue at the bottom that leads to Experience (`scrollToSection`, `src/lib/scroll.ts`), visible
only while the whole Hero is on screen (`useFullyVisible`).
Test in progress: more content is planned for the free space.

## Rules

- Section ids and `nav.*` translation keys stay in sync (`SectionId`).
- `/cv` is a separate route, not a section.
- The Projects list and the repo counters use the same filters (owned, public, forks
  excluded), so the displayed number describes the listed set.
