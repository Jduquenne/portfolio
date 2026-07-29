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

interface CVExperience {
  company: string;
  website?: string;
  role: LocalizedString;
  period: string;
  current?: boolean;
  description: LocalizedString;
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
      en: "Building precise, human software. Autodidact. JavaScript at heart.",
      fr: "Concevoir des logiciels précis et humains. Autodidacte. JavaScript dans l'âme.",
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
      company: "Dagoma",
      website: "https://www.dagoma3d.com/",
      role: {
        en: "Fullstack Developer",
        fr: "Développeur Fullstack",
      },
      period: "2021 - 2024",
      description: {
        en: "Real-time supervision of an industrial 3D printer farm and embedded control interface for professional machines, built fullstack",
        fr: "Supervision temps réel d’une ferme d’imprimantes 3D industrielles et interface de contrôle embarquée des machines professionnelles, développées fullstack",
      },
      stack: [
        "TypeScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Python",
        "C++",
      ],
    },
    {
      company: "Codecare",
      website: "https://www.codecare.fr/fr/",
      role: {
        en: "Application Developer - C# - JS",
        fr: "Développeur d’application - C# - JS",
      },
      period: "2020 — 2021",
      description: {
        en: "Maintenance and evolution of 3 business applications in parallel — C#/.Net backend, Vue.js and Quasar cross-platform interfaces.",
        fr: "Maintenance et évolution de 3 applications métier en parallèle — C#/.Net côté back, Vue.js et Quasar côté interfaces cross-platform.",
      },
      stack: ["VueJs", "Quasar", "Typescript", "C#", ".Net"],
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
        "Angular",
        "Tailwind CSS",
      ],
    },
    {
      label: { en: "Backend", fr: "Backend" },
      items: ["Node.js", "Go", "Python", "C", "C++"],
    },
    {
      label: { en: "Tools & Others", fr: "Outils & Autres" },
      items: ["Github", "Gitlab", "Docker", "MongoDB", "SQL", "Linux"],
    },
    {
      label: { en: "3D / Games", fr: "3D / Jeux" },
      items: ["Three.js", "WebGL", "Monogame", "Godot", "C#"],
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
