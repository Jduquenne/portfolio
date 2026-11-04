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
and a section nav at the bottom (`HeroSectionNav`): Experience, Projects, Passions, each with one real figure
(roles and first year from `cv.ts`, public repo count, number of passions), jumping with `scrollToSection`. It is
visible only while the whole Hero is on screen (`useFullyVisible`). The browser Back button returns to the Hero:
leaving it adds one history entry, and going back to the entry before scrolls to the top (`useBackToHero`).
Between the thesis and the bottom row, the availability card and the map behind the Hero (see below).

## Availability (desktop only for now)

A map behind the Hero and a card in its middle, answering "where and how can he work". The card is titled "Lieu de travail" / "Work location" (not "availability", which the sidebar badge already says); the code keeps the name `availability`. Mobile is still to design.

- **Two modes**, chosen in the card. *On site · hybrid*: the Hauts-de-France, Bailleul as the starting point, and a
  radius of 45 km (`data/config.ts`). *Remote* ("À distance" in French, the word LinkedIn France uses next to "Sur site" and "Hybride"): the whole of France, "anywhere in France".
- **Opening:** about a second after the Hero is in, a glowing point draws France and Corsica (rapid moves between
  shapes show as a dotted line), the camera zooms in, and it draws the region, Bailleul and the radius. Once per
  browser session: later views and language switches show it already drawn. Reduced motion shows it drawn.
- **Cities in range** (the ones with a road route) are chips in the card and dots on the map. Choosing one zooms to
  the trip, draws the road, and shows "about N min by car, N km, without traffic". Choosing it again, the Clear
  button or `Escape` (when no dialog is open) crumples the line into a paper ball that flies into the card.
- **Hover** on a city shows its name, distance and time. Names of cities that would collide step aside.
- **Credit:** "Routes © OpenStreetMap contributors" under a route and in the footer. The no-JavaScript fallback states
  the availability in one sentence.
- **Accessibility:** the map is decorative (hidden from assistive technology). The same cities and the same
  information are in the card, which is keyboard-operable.

## Rules

- Section ids and `nav.*` translation keys stay in sync (`SectionId`).
- `/cv` is a separate route, not a section.
- The Projects list and the repo counters use the same filters (owned, public, forks
  excluded), so the displayed number describes the listed set.
