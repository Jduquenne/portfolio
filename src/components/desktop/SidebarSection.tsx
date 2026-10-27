import type { ReactNode } from "react";

interface SidebarSectionProps {
  label: string;
  children: ReactNode;
}

/** A labelled block: the title and its hairline echo the section headings of the main area. */
export function SidebarSection({ label, children }: SidebarSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 font-mono text-xs uppercase tracking-widest text-contrast/50">
          {label}
        </h2>
        <div className="h-px flex-1 bg-white/8" />
      </div>
      {children}
    </section>
  );
}
