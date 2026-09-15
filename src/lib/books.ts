// Helpers for book covers and "find a copy" links, based on a book's ISBN.

export function coverUrl(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

/** The id used to link straight to a book on a video page, e.g. /videos/some-video#book-9780385534635 */
export function bookAnchor(isbn: string) {
  return `book-${isbn}`;
}

const coverChecks = new Map<string, Promise<boolean>>();

/**
 * Checks (when the site is built) whether Open Library has a cover for this ISBN.
 * Each ISBN is only checked once, however many pages show the book.
 * Only a definite "not found" counts as missing, so a network hiccup never hides a real cover.
 */
export function hasCover(isbn: string) {
  let check = coverChecks.get(isbn);
  if (!check) {
    check = fetch(coverUrl(isbn))
      .then((res) => res.status !== 404)
      .catch(() => true);
    coverChecks.set(isbn, check);
  }
  return check;
}

export function findCopyLinks(isbn: string) {
  return [
    {
      label: "Bookshop.org",
      note: "Buy from independent bookshops",
      href: `https://bookshop.org/search?keywords=${isbn}`,
    },
    {
      label: "WorldCat",
      note: "Find it in a library near you",
      href: `https://search.worldcat.org/search?q=bn:${isbn}`,
    },
    {
      label: "Open Library",
      note: "Borrow it online for free",
      href: `https://openlibrary.org/isbn/${isbn}`,
    },
  ];
}
