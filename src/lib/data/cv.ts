import type { Locale, LocalizedString } from "@/types";

export function localize(value: LocalizedString | string, locale: string): string {
  if (typeof value === "string") return value;
  return value[(locale as Locale)] ?? value.en;
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
  role: LocalizedString;
  period: string;
  current?: boolean;
  description: LocalizedString;
  stack: string[];
}

interface CVStackCategory {
  label: string;
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
      en: "Fullstack Developer · 3D / Three.js",
      fr: "Développeur Fullstack · 3D / Three.js",
    },
    tagline: {
      en: "Fullstack developer. 3D / Three.js.",
      fr: "Développeur fullstack. 3D / Three.js.",
    },
    description: {
      en: "Building precise, human software. Autodidact. JavaScript at heart.",
      fr: "Concevoir des logiciels précis et humains. Autodidacte. JavaScript dans l'âme.",
    },
    available: true,
  },

  // ─── Contact ─────────────────────────────────────────────────────────────────
  contact: {
    email: "your@email.com",
    github: "https://github.com/YOUR_GITHUB_USERNAME",
    linkedin: "https://linkedin.com/in/YOUR_LINKEDIN",
  },

  // ─── Experience ──────────────────────────────────────────────────────────────
  experiences: [
    {
      company: "Nom de l'entreprise",
      role: {
        en: "Fullstack Developer",
        fr: "Développeur Fullstack",
      },
      period: "2023",
      current: true,
      description: {
        en: "Describe your mission here. What you built, the impact, key responsibilities. Two sentences is enough.",
        fr: "Décris ta mission ici. Ce que tu as construit, l'impact, les responsabilités clés. Deux phrases suffisent.",
      },
      stack: ["Next.js", "TypeScript", "React", "Node.js"],
    },
    {
      company: "Entreprise précédente",
      role: {
        en: "Frontend Developer",
        fr: "Développeur Frontend",
      },
      period: "2021 — 2023",
      description: {
        en: "Describe your mission here. Technologies used, notable projects, team.",
        fr: "Décris ta mission ici. Technologies utilisées, projets marquants, équipe.",
      },
      stack: ["React", "JavaScript", "Tailwind CSS"],
    },
  ],

  // ─── Stack ───────────────────────────────────────────────────────────────────
  stack: [
    {
      label: "Frontend",
      items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    },
    {
      label: "Backend",
      items: ["Node.js", "Python", "C", "C++"],
    },
    {
      label: "3D / Games",
      items: ["Three.js", "C#", "WebGL"],
    },
  ],

  // ─── Passions / Entropy ──────────────────────────────────────────────────────
  passions: [
    {
      stat: "3D",
      title: {
        en: "Three.js & WebGL",
        fr: "Three.js & WebGL",
      },
      label: {
        en: "3D rendering · Shaders · Interactive",
        fr: "Rendu 3D · Shaders · Interactif",
      },
    },
    {
      stat: "C#",
      title: {
        en: "Game Development",
        fr: "Développement de jeux",
      },
      label: {
        en: "C# · Simulation · Game design",
        fr: "C# · Simulation · Game design",
      },
    },
    {
      stat: "∞",
      title: {
        en: "Self-taught",
        fr: "Autodidacte",
      },
      label: {
        en: "JavaScript · Fullstack · Autodidact",
        fr: "JavaScript · Fullstack · Autodidacte",
      },
    },
  ],
};
