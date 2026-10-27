import fr from "../../messages/fr.json";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${routing.defaultLocale}/`;
const canonical = `${SITE_URL}/${routing.defaultLocale}/`;
const ogImage = `${SITE_URL}/og.png`;
const { title, description } = fr.meta;

/**
 * Static redirect stub for `/`. Crawlers that ignore the meta-refresh (LinkedIn,
 * Slack…) still read the Open Graph tags here, so the shared root URL previews.
 */
export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jason Duquenne" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </head>
      <body>
        <a href={target}>{title}</a>
      </body>
    </html>
  );
}
