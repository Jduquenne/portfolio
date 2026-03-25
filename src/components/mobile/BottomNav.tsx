import type { Section } from "@/types";

const sections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "logic", label: "Logic" },
  { id: "entropy", label: "Entropy" },
  { id: "contact", label: "Contact" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-white/8 flex items-center justify-around px-8">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="font-mono text-xs text-contrast/40 hover:text-accent transition-colors"
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
