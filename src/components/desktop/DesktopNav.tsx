import type { Section } from "@/types";

const sections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "logic", label: "Logic" },
  { id: "entropy", label: "Entropy" },
  { id: "contact", label: "Contact" },
];

export function DesktopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-sm border-b border-white/8">
      <span className="font-mono text-sm text-accent tracking-widest">
        jason.dev
      </span>
      <nav className="flex items-center gap-8">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="font-mono text-xs text-contrast/40 hover:text-contrast transition-colors tracking-widest uppercase"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
