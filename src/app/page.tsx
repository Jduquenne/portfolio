import { routing } from "@/i18n/routing";

const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${routing.defaultLocale}/`;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
      </head>
      <body>
        <a href={target}>Jason Duquenne — Portfolio</a>
      </body>
    </html>
  );
}
