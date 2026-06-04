export function cn(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDuration(period: string, locale: string): string | null {
  const parts = period.split(/\s*[–—\-]+\s*/);
  if (parts.length !== 2) return null;
  const start = parseInt(parts[0]);
  const end = parseInt(parts[1]);
  if (isNaN(start) || isNaN(end)) return null;
  const years = end - start;
  if (years <= 0) return null;
  return locale === "fr"
    ? `${years} an${years > 1 ? "s" : ""}`
    : `${years} year${years > 1 ? "s" : ""}`;
}

export function relativeTime(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const days = Math.floor(diff / 86400000);
  if (days < 1) return rtf.format(-Math.floor(diff / 3600000), "hour");
  if (days < 30) return rtf.format(-days, "day");
  if (days < 365) return rtf.format(-Math.floor(days / 30), "month");
  return rtf.format(-Math.floor(days / 365), "year");
}
