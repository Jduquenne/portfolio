import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import fr from "../../../messages/fr.json";
import en from "../../../messages/en.json";
import { routing } from "@/i18n/routing";
import { cv } from "@/lib/data/cv";
import { geistMono, inter } from "@/app/fonts";
import "../globals.css";

const siteUrl = "https://jduquenne.github.io/portfolio";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = (locale === "fr" ? fr : en).meta;
  const pageUrl = `${siteUrl}/${locale}/`;
  const ogImage = `${siteUrl}/og.png`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: { fr: `${siteUrl}/fr/`, en: `${siteUrl}/en/` },
    },
    openGraph: {
      type: "website",
      siteName: "Jason Duquenne",
      title,
      description,
      url: pageUrl,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = locale === "fr" ? fr : en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jason Duquenne",
    url: `${siteUrl}/${locale}/`,
    jobTitle: "Fullstack Developer",
    description: messages.meta.description,
    image: `${siteUrl}/og.png`,
    email: cv.contact.email,
    sameAs: [cv.contact.github, cv.contact.linkedin],
    knowsAbout: ["TypeScript", "Next.js", "React", "Three.js", "WebGL"],
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-accent"
        >
          {messages.a11y.skip_to_content}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
