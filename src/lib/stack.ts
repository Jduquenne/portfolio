import { cv } from "@/lib/data/cv";

export interface StackUsage {
  /** How many listed experiences use the technology */
  roles: number;
  /** Start year of the earliest one */
  since: number;
}

/** Where a technology shows up in the experiences, or null when none lists it. */
export function stackUsage(tech: string): StackUsage | null {
  const used = cv.experiences.filter((exp) => exp.stack.includes(tech));
  if (used.length === 0) return null;

  const years = used
    .map((exp) => parseInt(exp.period, 10))
    .filter((year) => Number.isFinite(year));
  if (years.length === 0) return null;

  return { roles: used.length, since: Math.min(...years) };
}
