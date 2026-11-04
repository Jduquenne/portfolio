"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { cv, localize } from "@/lib/data/cv";
import { age } from "@/lib/utils";

/** The photo, and beside it the name, the role, the age and whether he is available. */
export function ProfileIdentity() {
  const locale = useLocale();
  const tcv = useTranslations("cv");
  const roleLines = localize(cv.identity.subtitle, locale).split(" · ");

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-40 shrink-0 [@media(min-height:900px)]:size-44">
        <div className="size-full overflow-hidden border border-white/12">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/avatar.webp`}
            alt={cv.identity.name}
            width={176}
            height={176}
            className="size-full object-cover"
            priority
            loading="eager"
          />
        </div>
        <div className="absolute top-0 left-0 size-3 border-t border-l border-accent/60" />
        <div className="absolute top-0 right-0 size-3 border-t border-r border-accent/60" />
        <div className="absolute bottom-0 left-0 size-3 border-b border-l border-accent/60" />
        <div className="absolute bottom-0 right-0 size-3 border-b border-r border-accent/60" />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="font-mono text-2xl font-bold text-contrast">
          {cv.identity.name}
        </h1>
        <p className="flex flex-col font-sans text-sm text-contrast/70">
          {roleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <p className="font-mono text-sm text-contrast/70">
          {tcv("age", { years: age(cv.identity.birthDate) })}
        </p>
        <div className="pt-1">
          <AvailabilityBadge />
        </div>
      </div>
    </div>
  );
}
