"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const t = useTranslations("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const onScroll = () => setVisible(main.scrollTop > main.clientHeight * 0.6);
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#profile"
      aria-label={t("back_to_top")}
      className={cn(
        "fixed bottom-20 right-6 z-40 border border-white/8 bg-surface/90 p-2 text-contrast/50 backdrop-blur-sm transition-opacity hover:text-accent",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUp size={16} />
    </a>
  );
}
