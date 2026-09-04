import type { CvData } from "@/components/cv/CvDocument";
import { cv, localize } from "@/lib/data/cv";
import { age, experienceYears, stripUrl } from "@/lib/utils";

/** Minimal shape of a next-intl translator scoped to the `cv` namespace. */
export interface CvTranslator {
  (key: string): string;
  (key: string, values: Record<string, number | string>): string;
}

/** Flattens the localized `cv.ts` source into the plain strings the PDF needs. */
export function buildCvData(
  locale: string,
  t: CvTranslator,
  avatarSrc: string,
): CvData {
  const experiencePeriod = (
    period: string,
    current: boolean | undefined,
  ): string => {
    const years = experienceYears(period, current);
    const base = current ? `${period} — ${t("present")}` : period;
    return years !== null ? `${base} · ${t("duration", { years })}` : base;
  };

  return {
    name: cv.identity.name,
    subtitle: localize(cv.identity.subtitle, locale),
    age: t("age", { years: age(cv.identity.birthDate) }),
    city: cv.identity.city,
    thesis: localize(cv.identity.description, locale),
    avatarSrc,
    contact: {
      email: cv.contact.email,
      github: cv.contact.github,
      githubDisplay: stripUrl(cv.contact.github),
      linkedin: cv.contact.linkedin,
      linkedinDisplay: stripUrl(cv.contact.linkedin),
    },
    stack: cv.stack.map((category) => ({
      label: localize(category.label, locale),
      items: category.items.join(" · "),
    })),
    passions: cv.passions.map((passion) => ({
      title: localize(passion.title, locale),
      label: localize(passion.label, locale),
    })),
    languages: cv.identity.languages.map((language) => ({
      name: localize(language.name, locale),
      level: localize(language.level, locale),
    })),
    licence: t("licence", { cat: cv.identity.drivingLicence }),
    experiences: cv.experiences.map((exp) => ({
      role: localize(exp.role, locale),
      company: localize(exp.company, locale),
      description: localize(exp.description, locale),
      stack: exp.stack.join(" · "),
      period: experiencePeriod(exp.period, exp.current),
    })),
    education: cv.education.map((entry) => ({
      title: localize(entry.title, locale),
      school: entry.school,
      period: entry.period,
    })),
    labels: {
      contact: t("section_contact"),
      stack: t("section_stack"),
      passions: t("section_passions"),
      experience: t("section_experience"),
      education: t("section_education"),
      languages: t("section_languages"),
      licence: t("section_licence"),
      projects: t("section_projects"),
      projectsHint: t("projects_hint"),
      available: t("available"),
    },
  };
}
