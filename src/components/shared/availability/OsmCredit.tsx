"use client";

import { useTranslations } from "next-intl";

const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

interface OsmCreditProps {
  className?: string;
}

/** The attribution the route data is licensed under (ODbL). */
export function OsmCredit({ className }: OsmCreditProps) {
  const t = useTranslations("availability");

  return (
    <p className={className}>
      {t.rich("credit", {
        link: (chunks) => (
          <a
            href={OSM_COPYRIGHT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-accent"
          >
            {chunks}
          </a>
        ),
      })}
    </p>
  );
}
