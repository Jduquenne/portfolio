import type { ConstellationData } from "@/lib/constellation/types";

/**
 * The passions as a constellation: four suns (the steps of how the owner works),
 * planets (the passions) between them, and the tools of each planet.
 * A tool has a `level` (1 to 5, labels in `passions.level_*`) only when the owner
 * has set one: none is guessed.
 */
export const constellation: ConstellationData = {
  designation: "CCFM-1409",
  suns: [
    {
      name: { en: "Understand", fr: "Comprendre" },
      hint: {
        en: "Observe, take apart, analyse",
        fr: "Observer, démonter, analyser",
      },
    },
    {
      name: { en: "Design", fr: "Concevoir" },
      hint: {
        en: "Model, structure, code",
        fr: "Modéliser, structurer, coder",
      },
    },
    {
      name: { en: "Build", fr: "Fabriquer" },
      hint: { en: "Make it real", fr: "Passer au réel" },
    },
    {
      name: { en: "Show", fr: "Montrer" },
      hint: {
        en: "Make it visible and beautiful",
        fr: "Rendre visible et beau",
      },
    },
  ],
  planets: [
    {
      id: "computing",
      name: { en: "Computing", fr: "Informatique" },
      suns: [0],
      note: {
        en: "Passionate about computing since a very young age.",
        fr: "Passionné d’informatique depuis mon plus jeune âge.",
      },
      tools: [
        { name: "Windows", level: 5 },
        { name: "Linux", level: 4 },
        { name: "macOS", level: 3 },
      ],
    },
    {
      id: "research",
      name: { en: "Research & Development", fr: "Recherche & Développement" },
      suns: [0, 1],
      note: {
        en: "Understanding an object, improving it, making it repairable: that is what fascinates me most. I have always wanted to take everything apart to understand how each object works.",
        fr: "Comprendre un objet, l’améliorer, le rendre réparable : c’est ce qui me passionne le plus. J’ai toujours voulu tout démonter pour comprendre comment chaque objet fonctionne.",
      },
      tools: [],
    },
    {
      id: "reverse-engineering",
      name: { en: "Reverse engineering", fr: "Rétro ingénierie" },
      suns: [0, 2],
      note: {
        en: "Finding out that an object has become unusable, or that it lacks a feature, frustrates me: it pushes me to understand how it works so I can restore it or change it to fit my needs.",
        fr: "Découvrir qu’un objet est devenu inutilisable, ou qu’il lui manque une fonctionnalité, me frustre : cela me pousse à comprendre son fonctionnement pour le remettre en état ou le transformer selon mes besoins.",
      },
      tools: [],
    },
    {
      id: "roller-coasters",
      name: { en: "Roller coasters", fr: "Roller coaster" },
      suns: [0, 1, 2],
      note: {
        en: "Hooked on this world since the first RollerCoaster Tycoon, on my first computer. I have watched the big manufacturers evolve (Vekoma, Intamin, B&M). In every new simulation game (NoLimits) or management game (RollerCoaster Tycoon, Parkitect, Planet Coaster), I design parks and roller coasters. This world is part of my life and satisfies my engineer’s brain.",
        fr: "Passionné par cet univers depuis le premier RollerCoaster Tycoon, sur mon premier ordinateur. J’ai vu évoluer les grands constructeurs (Vekoma, Intamin, B&M). Sur chaque nouveau jeu de simulation (NoLimits) ou de gestion (RollerCoaster Tycoon, Parkitect, Planet Coaster), je conçois des parcs et des montagnes russes. Cet univers fait partie de ma vie et comble mon cerveau d’ingénieur.",
      },
      tools: [
        { name: "NoLimits 2 Roller Coaster Simulation", level: 3 },
        { name: "RollerCoaster Tycoon", level: 5 },
        { name: "Planet Coaster", level: 5 },
        { name: "Parkitect", level: 3 },
      ],
    },
    {
      id: "cars",
      name: { en: "Cars", fr: "Automobile" },
      suns: [0, 2],
      note: {
        en: "The sound of an engine, the evolution of design, new technologies, hands dirty from tinkering with it. I could recognise every make and model before I could add numbers.",
        fr: "Le bruit d’un moteur, l’évolution du design, les nouvelles technologies, les mains sales après avoir bricolé dessus. Je savais reconnaître chaque marque et chaque modèle avant de savoir faire des additions.",
      },
      tools: [],
    },
    {
      id: "cartography",
      name: { en: "Cartography", fr: "Cartographie" },
      suns: [0, 3],
      note: {
        en: "A map means you are never lost, as long as you can read it. I am at ease in this field, and that probably feeds this passion: I enjoy reading and analysing maps.",
        fr: "Une carte permet de ne jamais être perdu, à condition de savoir la lire. J’ai de l’aisance dans ce domaine, et c’est sans doute ce qui nourrit cette passion : j’aime lire et analyser des cartes.",
      },
      tools: [
        { name: "Google Earth", level: 5 },
        { name: "Google Maps", level: 5 },
      ],
    },
    {
      id: "web-development",
      name: { en: "Web development", fr: "Développement Web" },
      suns: [1, 2],
      note: {
        en: "A passion that came later, and lets me work on what most of the planet uses: the Internet.",
        fr: "Une passion venue plus tard, qui me permet de travailler sur ce que la majorité de la planète utilise : Internet.",
      },
      tools: [
        { name: "Visual Studio Code", level: 5 },
        { name: "GitHub", level: 5 },
        { name: "Postman", level: 4 },
        { name: "Figma", level: 4 },
      ],
    },
    {
      id: "3d",
      name: { en: "3D", fr: "3D" },
      suns: [1, 3],
      note: {
        en: "I find my way around space easily and picture volumes in my head. I trained as a 3D designer / artist (Pôle 3D, 2012 – 2014). This passion fits into the continuity of my career.",
        fr: "Je me repère bien dans l’espace et je visualise facilement les volumes dans ma tête. J’ai suivi une formation de concepteur / réalisateur 3D (Pôle 3D, 2012 – 2014). Cette passion s’inscrit dans la continuité de mon parcours.",
      },
      tools: [
        { name: "Blender", level: 4 },
        { name: "Three.js", level: 4 },
      ],
    },
    {
      id: "cad",
      name: { en: "CAD", fr: "CAO" },
      suns: [1],
      note: {
        en: "Knowing how to use the right tool to design.",
        fr: "Savoir utiliser le bon outil pour concevoir.",
      },
      tools: [
        { name: "Fusion360", level: 3 },
        { name: "Onshape", level: 5 },
      ],
    },
    {
      id: "drawing",
      name: { en: "Drawing", fr: "Dessin" },
      suns: [1, 3],
      note: {
        en: "I have always had a good command of drawing: I can draw in volume and keep proportions right.",
        fr: "J’ai toujours eu une bonne maîtrise du dessin : je sais dessiner en volume et respecter les proportions.",
      },
      tools: [
        { name: "Procreate", level: 5 },
        { name: "Illustrator", level: 5 },
        { name: "Photoshop", level: 5 },
      ],
    },
    {
      id: "3d-printing",
      name: { en: "3D printing", fr: "Impression 3D" },
      suns: [2],
      note: {
        en: "Turning a 3D object into something you can hold. A real passion, frustrating, but one that opens other horizons once mastered.",
        fr: "Transformer un objet 3D en objet palpable. Une vraie passion, frustrante, mais qui ouvre d’autres horizons une fois maîtrisée.",
      },
      tools: [
        { name: "FDM", level: 5 },
        { name: "Bambu Lab P1S", level: 5 },
        { name: "Bambu Studio", level: 4 },
        { name: "Prusa MK3S", level: 4 },
        { name: "PrusaSlicer", level: 4 },
      ],
    },
    {
      id: "electronics",
      name: { en: "Electronics", fr: "Électronique" },
      suns: [0, 2],
      note: {
        en: "Electronics are everywhere, and it is frustrating not to know how they work. I analyse, understand and design so I can build or repair the tools of my passions.",
        fr: "L’électronique est partout, et c’est frustrant de ne pas savoir comment elle fonctionne. J’analyse, je comprends et je conçois pour pouvoir fabriquer ou réparer les outils de mes passions.",
      },
      tools: [
        { name: "KiCad", level: 3 },
        { name: "Arduino", level: 3 },
      ],
    },
    {
      id: "watchmaking",
      name: { en: "Watchmaking", fr: "Horlogerie" },
      suns: [0, 2],
      note: {
        en: "A spring drives gears at a precise rate, with a principle that dates back to the Middle Ages! A passion of patience and meticulousness.",
        fr: "Un ressort fait tourner des engrenages à une cadence précise, avec un principe qui remonte au Moyen Âge ! Une passion de patience et de minutie.",
      },
      tools: [],
    },
    {
      id: "photography",
      name: { en: "Photography", fr: "Photographie" },
      suns: [3],
      note: {
        en: "A late passion, combining the very technical side of the camera with the chance to show the world what my eyes see.",
        fr: "Une passion tardive, qui allie le côté très technique de l’appareil photo et la possibilité de montrer au monde ce que mes yeux voient.",
      },
      tools: [
        { name: "Lightroom", level: 4 },
        { name: "Photoshop", level: 5 },
      ],
    },
    {
      id: "video",
      name: { en: "Video", fr: "Vidéo" },
      suns: [3],
      tools: [
        { name: "DaVinci Resolve", level: 4 },
        { name: "GoPro", level: 4 },
      ],
    },
    {
      id: "ai",
      name: { en: "AI", fr: "IA" },
      suns: [1, 3],
      tools: [
        { name: "Claude Code", level: 5 },
        { name: "Gemini", level: 5 },
        { name: "ChatGPT", level: 4 },
        { name: "Suno", level: 3 },
        { name: "Higgsfield", level: 4 },
      ],
    },
    {
      id: "mmorpg",
      name: { en: "MMORPG", fr: "MMORPG" },
      suns: [0, 1],
      note: {
        en: "My experience on World of Warcraft, Dofus and Star Wars: The Old Republic taught me teamwork and raid organisation.",
        fr: "Mon expérience sur World of Warcraft, Dofus et Star Wars: The Old Republic m’a appris l’esprit d’équipe et l’organisation de raids.",
      },
      tools: [
        { name: "World of Warcraft", level: 5 },
        { name: "Dofus", level: 5 },
        { name: "Star Wars: The Old Republic", level: 5 },
      ],
    },
  ],
};
