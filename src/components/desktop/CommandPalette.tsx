"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations, type Locale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cv } from "@/lib/data/cv";
import { cn } from "@/lib/utils";

type CommandGroup = "navigate" | "actions" | "links";

interface PaletteCommand {
  id: string;
  group: CommandGroup;
  label: string;
  hint?: string;
  keepOpen?: boolean;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlay: () => void;
}

interface PaletteDialogProps {
  onOpenChange: (open: boolean) => void;
  onPlay: () => void;
  pendingRef: RefObject<(() => void) | null>;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
}

function scrollToTop() {
  document
    .getElementById("main")
    ?.scrollTo({ top: 0, behavior: scrollBehavior() });
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function PaletteDialog({ onOpenChange, onPlay, pendingRef }: PaletteDialogProps) {
  const t = useTranslations("palette");
  const tLang = useTranslations("language");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const nextLocale: Locale = locale === "fr" ? "en" : "fr";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(cv.contact.email);
      setNotice(t("email_copied"));
    } catch {
      setNotice(`${t("copy_failed")} ${cv.contact.email}`);
    }
  };

  const commands: PaletteCommand[] = [
    { id: "go_top", group: "navigate", label: t("go_top"), run: scrollToTop },
    {
      id: "go_experience",
      group: "navigate",
      label: t("go_experience"),
      run: () => scrollToSection("experience"),
    },
    {
      id: "go_projects",
      group: "navigate",
      label: t("go_projects"),
      run: () => scrollToSection("logic"),
    },
    {
      id: "go_passions",
      group: "navigate",
      label: t("go_passions"),
      run: () => scrollToSection("passions"),
    },
    { id: "play", group: "actions", label: t("play"), run: onPlay },
    {
      id: "switch_language",
      group: "actions",
      label: tLang("switch"),
      hint: nextLocale.toUpperCase(),
      run: () => router.replace(pathname, { locale: nextLocale }),
    },
    {
      id: "copy_email",
      group: "actions",
      label: t("copy_email"),
      keepOpen: true,
      run: () => {
        void copyEmail();
      },
    },
    {
      id: "open_cv",
      group: "links",
      label: t("open_cv"),
      run: () => router.push("/cv"),
    },
    {
      id: "open_cv_pdf",
      group: "links",
      label: t("open_cv_pdf"),
      hint: "↗",
      run: () => openExternal(`${base}/cv-${locale}.pdf`),
    },
    {
      id: "github",
      group: "links",
      label: tContact("github"),
      hint: "↗",
      run: () => openExternal(cv.contact.github),
    },
    {
      id: "linkedin",
      group: "links",
      label: tContact("linkedin"),
      hint: "↗",
      run: () => openExternal(cv.contact.linkedin),
    },
  ];

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? commands.filter((command) => command.label.toLowerCase().includes(needle))
    : commands;
  const active = Math.min(activeIndex, visible.length - 1);
  const activeCommand = visible[active];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, query]);

  const close = () => {
    opener?.focus();
    onOpenChange(false);
  };

  const execute = (command: PaletteCommand) => {
    if (command.keepOpen) {
      command.run();
      return;
    }
    pendingRef.current = command.run;
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown" && visible.length > 0) {
      event.preventDefault();
      setActiveIndex((active + 1) % visible.length);
    } else if (event.key === "ArrowUp" && visible.length > 0) {
      event.preventDefault();
      setActiveIndex((active - 1 + visible.length) % visible.length);
    } else if (event.key === "Enter" && activeCommand) {
      event.preventDefault();
      execute(activeCommand);
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  return (
    <motion.div
      key="palette-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={close}
      className="fixed inset-0 z-50 flex items-start justify-center bg-base/80 p-8 pt-32 backdrop-blur-sm"
    >
      <motion.div
        key="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("label")}
        tabIndex={-1}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        className="flex w-full max-w-lg flex-col border border-white/8 bg-surface"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-autocomplete="list"
          aria-activedescendant={
            activeCommand ? `palette-option-${activeCommand.id}` : undefined
          }
          aria-label={t("label")}
          placeholder={t("placeholder")}
          autoComplete="off"
          spellCheck={false}
          className="w-full border-b border-white/8 bg-transparent px-4 py-4 font-mono text-sm text-contrast caret-accent outline-none placeholder:text-contrast/40"
        />

        <ul
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label={t("label")}
          className="bento-scroll max-h-80 overflow-y-auto py-2"
        >
          {visible.length === 0 && (
            <li
              role="presentation"
              className="px-4 py-4 font-mono text-sm text-contrast/40"
            >
              {t("empty")}
            </li>
          )}
          {visible.map((command, index) => (
            <li key={command.id} role="presentation">
              {(index === 0 || visible[index - 1].group !== command.group) && (
                <span className="block px-4 pb-2 pt-4 font-mono text-xs uppercase tracking-widest text-contrast/24">
                  {t(`group_${command.group}`)}
                </span>
              )}
              <div
                id={`palette-option-${command.id}`}
                role="option"
                aria-selected={index === active}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => execute(command)}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-4 py-2 font-mono text-sm transition-colors",
                  index === active
                    ? "bg-white/[0.06] text-accent"
                    : "text-contrast/60",
                )}
              >
                <span>{command.label}</span>
                {command.hint && (
                  <span className="text-xs text-contrast/40">
                    {command.hint}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-white/8 px-4 py-2 font-mono text-xs text-contrast/40">
          <span>{t("hint")}</span>
          <span aria-live="polite" className="text-accent">
            {notice}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  onPlay,
}: CommandPaletteProps) {
  const pendingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // The chosen command runs once the palette is gone, so a modal it opens
  // captures the right element to give focus back to.
  const runPending = () => {
    const run = pendingRef.current;
    pendingRef.current = null;
    run?.();
  };

  return (
    <AnimatePresence onExitComplete={runPending}>
      {open && (
        <PaletteDialog
          key="palette"
          onOpenChange={onOpenChange}
          onPlay={onPlay}
          pendingRef={pendingRef}
        />
      )}
    </AnimatePresence>
  );
}
