# Portfolio sections

Where each section is rendered per device: [architecture.md](architecture.md).

| Section | Key concept |
|---|---|
| **Profile** | Identity, availability, then the primary contact action (`ContactAction`) and secondary links: sidebar on desktop, first screen on mobile (see "Mobile first screen") |
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

## Availability

A map behind the Hero and a card in its middle, answering "where and how can he work". The card is titled "Lieu de travail" / "Work location" (not "availability", which the sidebar badge already says); the code keeps the name `availability`. On mobile it is its own section (below).

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

### Availability on mobile

A section right after Profile (id `availability`, no tab bar entry), same data and engine as the desktop.

- **Layout:** the map fills the screen. A head (title and the two modes, 40px buttons) sits on top, a panel of fixed
  height at the bottom: the summary line ("Up to 45 km around Bailleul"), a slot for either the hint or the chosen trip,
  and the cities as a row that slides sideways. The on-site view frames the radius, not the whole region.
- **Start:** the drawing begins the first time 60% of the section is on screen, once per browser session. Later views and
  language switches show it drawn. Reduced motion shows it drawn.
- **Touch:** a tap on the map picks the nearest city within 32px, a tap on a city in the row does the same, "Clear"
  crumples the route into the panel. A vertical swipe that starts on the map scrolls the feed and selects nothing.
- **Credit:** the OpenStreetMap line shows in the panel with the trip.

### Mobile first screen

Three groups spread over the screen height, so nothing is left empty at the bottom: **who** (photo, then name, role, age
and the availability badge, with the thesis under), **where** (a link to the section above) and **how** (the contact
action, then GitHub, LinkedIn and CV as three outline buttons). The language switch sits in the top corner. On taller
screens the thesis grows (from 820px of height) and the photo, the buttons and the link too (from 900px).

## Rules

- Section ids and `nav.*` translation keys stay in sync (`SectionId`).
- `/cv` is a separate route, not a section.
- The Projects list and the repo counters use the same filters (owned, public, forks
  excluded), so the displayed number describes the listed set.
