export interface StackCategory {
  label: string;
  items: string[];
}

export const stack: StackCategory[] = [
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
];
