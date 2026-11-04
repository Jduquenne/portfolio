import type { MapOrigin } from "@/lib/availability/types";

export const ORIGIN: MapOrigin = {
  id: "bailleul",
  name: { en: "Bailleul", fr: "Bailleul" },
  position: [50.738, 2.735],
};

export const RADIUS_KM = 45;

export const MOTION = {
  printSpeedPx: 2400,
  rapidSpeedPx: 8000,
  crumpleSeconds: 0.38,
  flySeconds: 0.42,
  startDelayMs: 1000,
} as const;
