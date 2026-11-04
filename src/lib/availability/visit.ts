const SEEN_KEY = "availability-map-seen";

/**
 * True the first time it is asked in a browser session, false after. The full
 * drawing plays once; later page views, and language switches, show it done.
 */
export function consumeFirstVisit(): boolean {
  try {
    if (sessionStorage.getItem(SEEN_KEY) === "1") return false;
    sessionStorage.setItem(SEEN_KEY, "1");
    return true;
  } catch {
    return false;
  }
}
