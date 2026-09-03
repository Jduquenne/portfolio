export function cn(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function stripUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function yearsBetween(period: string): number | null {
  const parts = period.split(/\s*[–—\-]+\s*/);
  if (parts.length !== 2) return null;
  const start = parseInt(parts[0], 10);
  const end = parseInt(parts[1], 10);
  if (isNaN(start) || isNaN(end)) return null;
  const years = end - start;
  return years > 0 ? years : null;
}

export function experienceYears(
  period: string,
  current?: boolean,
): number | null {
  if (!current) return yearsBetween(period);
  const start = parseInt(period, 10);
  if (isNaN(start)) return null;
  const years = new Date().getFullYear() - start;
  return years > 0 ? years : null;
}

export function age(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }
  return years;
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
