import { Fragment } from "react";
import type { CVExperienceLink } from "@/lib/data/cv";

interface ExperienceDescriptionProps {
  text: string;
  links?: CVExperienceLink[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Renders an experience description, turning any mention of a linked project
 * name into an anchor to its live site.
 */
export function ExperienceDescription({
  text,
  links,
}: ExperienceDescriptionProps) {
  if (!links || links.length === 0) return <>{text}</>;

  const pattern = new RegExp(
    `(${links.map((link) => escapeRegExp(link.label)).join("|")})`,
  );

  return (
    <>
      {text.split(pattern).map((part, i) => {
        const link = links.find((entry) => entry.label === part);
        return link ? (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/80 hover:text-accent underline underline-offset-2 decoration-accent/30 transition-colors"
          >
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
