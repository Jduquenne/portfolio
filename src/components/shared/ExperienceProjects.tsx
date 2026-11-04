import { ArrowUpRight } from "lucide-react";
import { localize } from "@/lib/data/cv";
import type { CVExperienceProject } from "@/lib/data/cv";

interface ExperienceProjectsProps {
  projects: CVExperienceProject[];
  locale: string;
}

export function ExperienceProjects({
  projects,
  locale,
}: ExperienceProjectsProps) {
  return (
    <ul className="flex flex-col gap-4 mb-4">
      {projects.map((project) => (
        <li
          key={project.label}
          className="flex flex-col gap-1 border-l border-white/8 pl-4"
        >
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-1 py-1 font-mono text-xs text-accent/80 transition-colors hover:text-accent"
          >
            {project.label}
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </a>
          <p className="font-sans text-sm text-contrast/70 leading-relaxed">
            {localize(project.description, locale)}
          </p>
        </li>
      ))}
    </ul>
  );
}
