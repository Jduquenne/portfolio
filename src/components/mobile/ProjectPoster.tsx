"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface ProjectPosterProps {
  name: string;
  poster: string;
}

/** Still image only: there is no hover on a phone, and a clip would cost data and battery. */
export function ProjectPoster({ name, poster }: ProjectPosterProps) {
  const t = useTranslations("logic");

  return (
    <div className="relative aspect-video w-full overflow-hidden border-b border-white/8">
      <Image
        src={`${BASE_PATH}/previews/${poster}`}
        alt={t("preview_alt", { name })}
        fill
        sizes="100vw"
        className="object-cover"
        unoptimized
      />
    </div>
  );
}
