"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { RepoPreview } from "@/types";

const HOVER_INTENT_MS = 150;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface ProjectPreviewProps {
  name: string;
  preview: RepoPreview;
  active: boolean;
}

function savesData() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

/**
 * Poster at rest. The clip is only requested after the card has been hovered
 * or focused for a moment, then plays muted and fades over the poster.
 */
export function ProjectPreview({ name, preview, active }: ProjectPreviewProps) {
  const t = useTranslations("logic");
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { clip } = preview;

  useEffect(() => {
    if (!active || !clip || armed || reduceMotion) return;

    const timer = setTimeout(() => {
      if (!savesData()) setArmed(true);
    }, HOVER_INTENT_MS);
    return () => clearTimeout(timer);
  }, [active, clip, armed, reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active, armed]);

  return (
    <div className="relative w-56 shrink-0 overflow-hidden border border-white/8">
      <Image
        src={`${BASE_PATH}/previews/${preview.thumb}`}
        alt={t("preview_alt", { name })}
        fill
        sizes="224px"
        className="object-cover"
        unoptimized
      />
      {armed && clip && (
        <video
          ref={videoRef}
          src={`${BASE_PATH}/previews/${clip}`}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
