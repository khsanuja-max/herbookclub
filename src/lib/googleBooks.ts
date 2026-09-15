// Checks, when the site is built, whether Google Books has a preview of a book that
// can be shown on this site. Uses the GOOGLE_BOOKS_API_KEY environment variable and
// never runs in visitors' browsers.

export type BookPreview = {
  /** Google has viewable pages (PARTIAL or ALL_PAGES) that may be embedded on other sites */
  hasPreview: boolean;
  /** Google Books volume ID: the edition with the preview, or else the first edition found */
  volumeId: string | null;
  /** The country Google judged the check to come from, e.g. "US" (previews can vary by country) */
  country: string | null;
  /** Why the check couldn't be completed (missing key, quota, network), if it failed */
  problem?: string;
};

type Volume = {
  id: string;
  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
  };
};

/**
 * Google Books sometimes answers with a temporary error (503) or a rate limit (429).
 * Retry with growing pauses: 1.5s, 3s, 6s, 12s.
 */
const RETRY_DELAYS_MS = [1500, 3000, 6000, 12000];

/** Short pause between books, so checks go one at a time rather than all at once. */
const GAP_BETWEEN_BOOKS_MS = 250;

const checks = new Map<string, Promise<BookPreview>>();
let queue: Promise<unknown> = Promise.resolve();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchVolumes(isbn: string, key: string): Promise<Volume[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
    isbn,
  )}&key=${encodeURIComponent(key)}&fields=items(id,accessInfo(country,viewability,embeddable))`;

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as { items?: Volume[] };
      return data.items ?? [];
    }
    const temporary = res.status === 429 || res.status >= 500;
    if (temporary && attempt < RETRY_DELAYS_MS.length) {
      await wait(RETRY_DELAYS_MS[attempt]);
      continue;
    }
    throw new Error(
      `Google Books answered ${res.status}${attempt > 0 ? ` after ${attempt + 1} tries` : ""}`,
    );
  }
}

async function checkPreview(isbn: string): Promise<BookPreview> {
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  if (!key) {
    return {
      hasPreview: false,
      volumeId: null,
      country: null,
      problem: "GOOGLE_BOOKS_API_KEY is not set",
    };
  }

  try {
    const volumes = await fetchVolumes(isbn, key);
    const withPreview = volumes.find(
      (volume) =>
        (volume.accessInfo?.viewability === "PARTIAL" ||
          volume.accessInfo?.viewability === "ALL_PAGES") &&
        volume.accessInfo?.embeddable === true,
    );
    const chosen = withPreview ?? volumes[0];
    return {
      hasPreview: Boolean(withPreview),
      volumeId: chosen?.id ?? null,
      country: chosen?.accessInfo?.country ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      hasPreview: false,
      volumeId: null,
      country: null,
      // Never let the key appear in a build log
      problem: message.replaceAll(key, "[key hidden]"),
    };
  }
}

/**
 * Whether Google Books has an embeddable preview for this ISBN.
 * Each ISBN is checked once per build, books are checked one at a time,
 * and a check that still fails after retrying simply counts as "no preview".
 */
export function getBookPreview(isbn: string) {
  let check = checks.get(isbn);
  if (!check) {
    const run = queue.then(async () => {
      const result = await checkPreview(isbn);
      await wait(GAP_BETWEEN_BOOKS_MS);
      return result;
    });
    queue = run.catch(() => undefined);
    check = run;
    checks.set(isbn, check);
  }
  return check;
}
