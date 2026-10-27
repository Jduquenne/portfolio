# Portfolio sections

Where each section is rendered per device: [architecture.md](architecture.md).

| Section | Key concept |
|---|---|
| **Profile** | Identity, availability, then the primary contact action (`ContactAction`) and secondary links: sidebar on desktop, first card on mobile |
| **Experience** | Timeline from `cv.ts`: roles, periods, stacks. Project names in a description become links (`ExperienceDescription`) |
| **Stack** | Technical categories from `cv.ts`. A block in the sidebar on desktop, a dedicated section on mobile |
| **Projects** | GitHub repos fetched at build time, most recently pushed first |
| **Passions** | Specialities as data: numbers, metadata. Zero long text |
| **Play** | Mobile only as a section: a Lights Out mini-game (`LightsOut`). Desktop opens it from a modal triggered in the Hero |

## Hero (desktop only)

Above Experience: the `cv.identity.description` thesis in Geist Mono, a "latest activity"
readout from the GitHub data, and two entry points: the command palette (`Ctrl K`) and the game.

## Rules

- Section ids and `nav.*` translation keys stay in sync (`SectionId`).
- `/cv` is a separate route, not a section.
- The Projects list and the repo counters use the same filters (owned, public, forks
  excluded), so the displayed number describes the listed set.
