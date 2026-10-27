import fr from "../../../messages/fr.json";
import en from "../../../messages/en.json";
import { cv, localize } from "@/lib/data/cv";
import type { GitHubRepo, Locale } from "@/types";

interface NoScriptContentProps {
  locale: Locale;
  repos: GitHubRepo[];
}

const LINK = "text-accent underline underline-offset-2";

/**
 * The page picks its layout in the browser, so the static HTML would otherwise
 * hold no text. This is what a visitor or a crawler without JavaScript gets.
 */
export function NoScriptContent({ locale, repos }: NoScriptContentProps) {
  const messages = locale === "fr" ? fr : en;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <noscript>
      <main
        id="main"
        className="mx-auto flex max-w-3xl flex-col gap-8 p-8 font-sans text-contrast"
      >
        <p className="font-mono text-xs text-contrast/50">
          {messages.noscript.notice}
        </p>

        <header className="flex flex-col gap-2">
          <h1 className="font-mono text-3xl font-bold">{cv.identity.name}</h1>
          <p className="text-contrast/70">
            {localize(cv.identity.subtitle, locale)}
          </p>
          <p>{localize(cv.identity.description, locale)}</p>
          <p className="flex flex-wrap gap-4 font-mono text-sm">
            <a className={LINK} href={`mailto:${cv.contact.email}`}>
              {cv.contact.email}
            </a>
            <a className={LINK} href={cv.contact.github}>
              {messages.contact.github}
            </a>
            <a className={LINK} href={cv.contact.linkedin}>
              {messages.contact.linkedin}
            </a>
            <a className={LINK} href={`${base}/${locale}/cv/`}>
              {messages.contact.cv}
            </a>
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xl">
            {messages.experience.section_label}
          </h2>
          {cv.experiences.map((exp) => (
            <article key={`${exp.period}-${exp.company.en}`} className="flex flex-col gap-2">
              <h3 className="font-mono font-bold">
                {localize(exp.role, locale)} · {localize(exp.company, locale)} ·{" "}
                {exp.period}
              </h3>
              <p className="text-contrast/70">
                {localize(exp.description, locale)}
              </p>
              <p className="font-mono text-xs text-contrast/50">
                {exp.stack.join(" · ")}
              </p>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xl">{messages.cv.section_stack}</h2>
          {cv.stack.map((category) => (
            <p key={category.label.en}>
              <span className="font-mono font-bold">
                {localize(category.label, locale)}:
              </span>{" "}
              {category.items.join(" · ")}
            </p>
          ))}
        </section>

        {repos.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-mono text-xl">{messages.logic.projects_title}</h2>
            {repos.map((repo) => (
              <article key={repo.id} className="flex flex-col gap-1">
                <h3 className="font-mono font-bold">
                  <a className={LINK} href={repo.html_url}>
                    {repo.name}
                  </a>
                </h3>
                {repo.description && (
                  <p className="text-contrast/70">{repo.description}</p>
                )}
              </article>
            ))}
          </section>
        )}
      </main>
    </noscript>
  );
}
