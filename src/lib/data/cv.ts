import type { Locale, LocalizedString } from "@/types";

export function localize(
  value: LocalizedString | string,
  locale: string,
): string {
  if (typeof value === "string") return value;
  return value[locale as Locale] ?? value.en;
}

interface CVIdentity {
  name: string;
  initials: string;
  subtitle: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  available: boolean;
}

interface CVContact {
  email: string;
  github: string;
  linkedin: string;
}

export interface CVExperienceLink {
  label: string;
  href: string;
}

interface CVExperience {
  company: LocalizedString;
  website?: string;
  role: LocalizedString;
  period: string;
  current?: boolean;
  description: LocalizedString;
  links?: CVExperienceLink[];
  stack: string[];
}

interface CVStackCategory {
  label: LocalizedString;
  items: string[];
}

interface CVPassion {
  stat: string;
  title: LocalizedString;
  label: LocalizedString;
}

interface CV {
  identity: CVIdentity;
  contact: CVContact;
  experiences: CVExperience[];
  stack: CVStackCategory[];
  passions: CVPassion[];
}

export const cv: CV = {
  // ─── Identity ────────────────────────────────────────────────────────────────
  identity: {
    name: "Jason Duquenne",
    initials: "JD",
    subtitle: {
      en: "Fullstack Developer · Javascript",
      fr: "Développeur Fullstack · Javascript",
    },
    tagline: {
      en: "Fullstack Developer · Javascript.",
      fr: "Développeur Fullstack · Javascript.",
    },
    description: {
      en: "An engineer's rigor, the intent to be useful. I build tools you use without thinking about them.",
      fr: "La rigueur d'un ingénieur, l'intention de rendre service. Je construis des outils qu'on utilise sans y penser.",
    },
    available: true,
  },

  // ─── Contact ─────────────────────────────────────────────────────────────────
  contact: {
    email: "duquennejason@gmail.com",
    github: "https://github.com/Jduquenne",
    linkedin: "https://linkedin.com/in/jasonduquenne",
  },

  // ─── Experience ──────────────────────────────────────────────────────────────
  experiences: [
    {
      company: { en: "Independent", fr: "Indépendant" },
      role: {
        en: "Fullstack Developer",
        fr: "Développeur Fullstack",
      },
      period: "2024",
      current: true,
      description: {
        en: "Web products designed and shipped independently, end to end. Artemis FoodLab — a local-first meal planner, fully in-browser on IndexedDB, no backend. Dofus Retro Craft Dashboard — a static-first utility hub: XP and craft calculators, interactive map and profitability guides, all client-side. AI integrated into the workflow (Claude Code, Gemini) for brainstorming and speed, architecture and review kept in hand.",
        fr: "Produits web conçus et livrés en indépendant, de bout en bout. Artemis FoodLab — planificateur de repas local-first, entièrement dans le navigateur sur IndexedDB, sans backend. Dofus Retro Craft Dashboard — hub d'outils static-first : calculateurs d'XP et de craft, carte interactive et guides de rentabilité, tout côté client. IA intégrée au workflow (Claude Code, Gemini) pour le brainstorming et la vélocité, architecture et revue gardées en main.",
      },
      links: [
        {
          label: "Artemis FoodLab",
          href: "https://jduquenne.github.io/artemis-foodlab/",
        },
        {
          label: "Dofus Retro Craft Dashboard",
          href: "https://jduquenne.github.io/dofus-retro-craft-dashboard/",
        },
      ],
      stack: [
        "TypeScript",
        "React",
        "Next.js",
        "Three.js",
        "WebGL",
        "Tailwind CSS",
        "IndexedDB",
        "Claude Code",
      ],
    },
    {
      company: { en: "Dagoma", fr: "Dagoma" },
      website: "https://www.dagoma3d.com/",
      role: {
        en: "Fullstack Developer",
        fr: "Développeur Fullstack",
      },
      period: "2022 — 2024",
      description: {
        en: "Continued to build out the 3D printer farm dashboard and support its API. Embedded control screen for Dagoma's professional printers (Pro430, SigmaPro): a React interface under Electron, running on Raspbian on top of OctoPrint. Custom OctoPrint plugin in Python to bridge the machine with Dagoma's API and app, plus contributions to the Marlin firmware (C++).",
        fr: "Poursuite de l’intégration du dashboard de la ferme d’imprimantes 3D et du support de son API. Écran de contrôle embarqué des imprimantes professionnelles Dagoma (Pro430, SigmaPro) : interface React sous Electron, tournant sur Raspbian au-dessus d’OctoPrint. Plugin OctoPrint sur mesure en Python pour relier la machine à l’API et à l’app Dagoma, et contribution au firmware Marlin (C++).",
      },
      stack: [
        "TypeScript",
        "React",
        "Electron",
        "Node.js",
        "Express",
        "MongoDB",
        "Python",
        "C++",
        "OctoPrint",
        "Raspberry Pi",
      ],
    },
    {
      company: { en: "Dagoma", fr: "Dagoma" },
      website: "https://www.dagoma3d.com/",
      role: {
        en: "Frontend Developer · Work-study",
        fr: "Développeur Frontend · Alternance",
      },
      period: "2021 — 2022",
      description: {
        en: "Led the frontend build of the 3D printer farm management dashboard — fully in React — with strong involvement in the Node.js / Express API.",
        fr: "En charge de la mise en place du frontend du dashboard de gestion de la ferme d’imprimantes 3D — entièrement en React — avec une contribution soutenue à l’API Node.js / Express.",
      },
      stack: ["TypeScript", "React", "Node.js", "Express", "MongoDB"],
    },
    {
      company: { en: "Codecare", fr: "Codecare" },
      website: "https://www.codecare.fr/fr/",
      role: {
        en: "Application Developer · Work-study",
        fr: "Développeur d’application · Alternance",
      },
      period: "2020 — 2021",
      description: {
        en: "Built hospital medication inventory applications: stock tracking, withdrawals handled by nursing staff, prescription creation and Kanban-based restocking. Modern dashboard in Vue.js and Quasar, C# / .NET backend.",
        fr: "Développement d’applications de gestion d’inventaire de médicaments en milieu hospitalier : suivi des stocks, sorties assurées par le personnel infirmier, création d’ordonnances et réapprovisionnement en Kanban. Dashboard moderne en Vue.js et Quasar, back-end C# / .NET.",
      },
      stack: ["Vue.js", "Quasar", "TypeScript", "C#", ".NET"],
    },
  ],

  // ─── Stack ───────────────────────────────────────────────────────────────────
  stack: [
    {
      label: { en: "Frontend", fr: "Frontend" },
      items: [
        "JavaScript",
        "TypeScript",
        "Next.js",
        "React",
        "Vue.js",
        "Quasar",
        "Angular",
        "Tailwind CSS",
        "Electron",
      ],
    },
    {
      label: { en: "Backend", fr: "Backend" },
      items: ["Node.js", "Express", "Go", "Python", "C", "C++", ".NET"],
    },
    {
      label: { en: "Tools & Others", fr: "Outils & Autres" },
      items: ["Github", "Gitlab", "Docker", "MongoDB", "SQL", "Linux"],
    },
    {
      label: { en: "3D / Games", fr: "3D / Jeux" },
      items: ["Three.js", "WebGL", "Monogame", "Godot", "C#"],
    },
    {
      label: { en: "AI", fr: "IA" },
      items: ["Claude Code", "Gemini"],
    },
  ],

  // ─── Passions ────────────────────────────────────────────────────────────────
  passions: [
    {
      stat: "∞",
      title: {
        en: "Self-taught",
        fr: "Autodidacte",
      },
      label: {
        en: "Dev - Tech - Photography - Electronics - Watchmaking",
        fr: "Dev - Informatique - Photographie - Electronique - Horlogerie",
      },
    },
    {
      stat: "3D",
      title: {
        en: "Blender & Three.js & WebGL",
        fr: "Blender & Three.js & WebGL",
      },
      label: {
        en: "3D rendering · Shaders · Interactive",
        fr: "Rendu 3D · Shaders · Interactif",
      },
    },
    {
      stat: "6 ans",
      title: {
        en: "3D Printing",
        fr: "Impression 3D",
      },
      label: {
        en: "FDM · CAD · Prototyping · Materials",
        fr: "FDM · CAO · Prototypage · Matériaux",
      },
    },
  ],
};
