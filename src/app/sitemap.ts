import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const PAGES = ["", "cv/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/${page}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [alt, `${SITE_URL}/${alt}/${page}`]),
        ),
      },
    })),
  );
}
