import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { GitHubRepo } from "@/types";

const PREVIEW_DIR = path.join(process.cwd(), "public", "previews");

/**
 * Attaches each repo's preview files, matched by repo name, and reports the
 * files that match none of the listed repos (renamed, removed, or not recent enough).
 */
export function withPreviews(repos: GitHubRepo[]): GitHubRepo[] {
  if (!existsSync(PREVIEW_DIR)) return repos;

  const files = new Set(readdirSync(PREVIEW_DIR));
  const used = new Set<string>();

  const result = repos.map((repo) => {
    const poster = `${repo.name}.webp`;
    if (!files.has(poster)) return repo;

    const thumb = `${repo.name}.thumb.webp`;
    const clip = `${repo.name}.mp4`;
    const hasThumb = files.has(thumb);
    const hasClip = files.has(clip);
    used.add(poster);
    if (hasThumb) used.add(thumb);
    if (hasClip) used.add(clip);

    return {
      ...repo,
      preview: {
        poster,
        thumb: hasThumb ? thumb : poster,
        clip: hasClip ? clip : null,
      },
    };
  });

  const unused = [...files].filter((file) => !used.has(file));
  if (unused.length > 0) {
    console.warn(`[previews] not used by the listed repos: ${unused.join(", ")}`);
  }

  return result;
}
