"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LightsOut } from "@/components/shared/LightsOut";

interface PlayModalProps {
  open: boolean;
  onClose: () => void;
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 240, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.12 } },
};

export function PlayModal({ open, onClose }: PlayModalProps) {
  const t = useTranslations("toy");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const main = document.querySelector("main");
    if (main) main.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (main) main.style.overflow = "";
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="play-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 p-8 backdrop-blur-sm"
        >
          <motion.div
            ref={panelRef}
            key="play-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t("label")}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[480px]"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute -right-3 -top-3 z-10 border border-white/8 bg-surface p-1.5 text-contrast/50 transition-colors hover:border-accent/30 hover:text-accent"
            >
              <X size={14} />
            </button>
            <LightsOut />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
