import fr from "../../messages/fr.json";
import en from "../../messages/en.json";
import { geistMono, inter } from "@/app/fonts";
import { routing } from "@/i18n/routing";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const copy = { fr: fr.not_found, en: en.not_found };

/** Static `404.html`: the visitor's locale is unknown, so both are shown. */
export default function NotFound() {
  return (
    <html
      lang={routing.defaultLocale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <main
          id="main"
          className="grid-backdrop flex min-h-full flex-col items-center justify-center gap-8 p-8 text-center font-sans text-contrast"
        >
          <h1 className="font-mono text-5xl text-accent">404</h1>
          {routing.locales.map((locale) => (
            <section key={locale} lang={locale} className="flex flex-col gap-2">
              <h2 className="font-mono text-xl">{copy[locale].title}</h2>
              <p className="text-sm text-contrast/70">
                {copy[locale].description}
              </p>
              <a
                href={`${base}/${locale}/`}
                className="font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors duration-200 hover:text-accent"
              >
                {copy[locale].back}
              </a>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}
