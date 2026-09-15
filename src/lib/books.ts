// Helpers for book covers and "find a copy" links, based on a book's ISBN.

export function coverUrl(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

/**
 * Checks (when the site is built) whether Open Library has a cover for this ISBN.
 * Only a definite "not found" counts as missing, so a network hiccup never hides a real cover.
 */
export async function hasCover(isbn: string) {
  try {
    const res = await fetch(coverUrl(isbn));
    return res.status !== 404;
  } catch {
    return true;
  }
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
