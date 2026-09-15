// The Book Wall: every book from this month's pick and the video pages, with no repeats,
// plus the "if you loved this, try…" connections from content/connections.json
// and whether Google Books has a preview of each one.

import { cache } from "react";
import connectionsData from "../../content/connections.json";
import { bookAnchor, hasCover } from "./books";
import { getThisMonthsPick, getVideos } from "./content";
import { getBookPreview, type BookPreview } from "./googleBooks";

type ConnectionsFile = Record<string, { isbn: string; why: string }[]>;

export type WallConnection = {
  isbn: string;
  title: string;
  author: string;
  why: string;
};

export type WallBook = {
  isbn: string;
  title: string;
  author: string;
  /** Roshi's words about the book: her video note, or her headline for the monthly pick */
  note: string;
  /** Where Roshi talks about the book on the site */
  mention: { label: string; href: string };
  coverAvailable: boolean;
  /** Google Books preview, checked when the site is built */
  preview: { hasPreview: boolean; volumeId: string | null };
  connections: WallConnection[];
};

type BaseBook = Omit<WallBook, "coverAvailable" | "preview" | "connections">;

/** Stops the build with a clear message if connections.json mentions a book that isn't on the wall. */
function checkConnections(
  connections: ConnectionsFile,
  books: Map<string, BaseBook>,
) {
  const problems: string[] = [];

  for (const [isbn, links] of Object.entries(connections)) {
    if (!books.has(isbn)) {
      problems.push(`"${isbn}" is not a book on the wall`);
    }
    for (const link of links) {
      if (!books.has(link.isbn)) {
        problems.push(`"${isbn}" links to "${link.isbn}", which is not a book on the wall`);
      } else if (link.isbn === isbn) {
        problems.push(`"${isbn}" links to itself`);
      }
    }
  }

  if (problems.length > 0) {
    const onTheWall = [...books.values()]
      .map((book) => `${book.isbn} (${book.title})`)
      .join(", ");
    throw new Error(
      `content/connections.json has a problem:\n- ${problems.join("\n- ")}\nBooks on the wall: ${onTheWall}`,
    );
  }
}

let previewSummaryLogged = false;

/** Prints the Google Books preview results once in the build output. */
function logPreviewSummary(books: BaseBook[], previews: BookPreview[]) {
  if (previewSummaryLogged) return;
  previewSummaryLogged = true;

  const count = previews.filter((preview) => preview.hasPreview).length;
  const countries = [
    ...new Set(previews.map((preview) => preview.country).filter(Boolean)),
  ];
  const lines = books.map((book, index) => {
    const preview = previews[index];
    if (preview.hasPreview) {
      return `  ✓ ${book.title} (${book.isbn}) — preview, volume ${preview.volumeId}`;
    }
    if (preview.problem) {
      return `  ! ${book.title} (${book.isbn}) — no preview (${preview.problem})`;
    }
    return `  · ${book.title} (${book.isbn}) — no preview`;
  });

  console.log(
    [
      `Google Books previews: ${count} of ${books.length} books` +
        (countries.length ? ` (checked from ${countries.join(", ")})` : ""),
      ...lines,
    ].join("\n"),
  );

  if (previews.some((preview) => preview.problem)) {
    console.warn(
      "Google Books: some checks could not be completed, so those books will open with Roshi's words instead of a preview.",
    );
  }
}

export const getWallBooks = cache(async (): Promise<WallBook[]> => {
  const [pick, videos] = await Promise.all([getThisMonthsPick(), getVideos()]);
  const books = new Map<string, BaseBook>();

  books.set(pick.isbn, {
    isbn: pick.isbn,
    title: pick.title,
    author: pick.author,
    note: pick.headline,
    mention: { label: "This month’s pick", href: "/this-months-pick" },
  });

  // Videos are newest first, so each book points to the newest video that mentions it.
  for (const video of videos) {
    for (const book of video.books) {
      if (books.has(book.isbn)) continue;
      books.set(book.isbn, {
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        note: book.note,
        mention: {
          label: video.title,
          href: `/videos/${video.slug}#${bookAnchor(book.isbn)}`,
        },
      });
    }
  }

  const connections: ConnectionsFile = connectionsData;
  checkConnections(connections, books);

  const list = [...books.values()];
  const [coverFlags, previews] = await Promise.all([
    Promise.all(list.map((book) => hasCover(book.isbn))),
    Promise.all(list.map((book) => getBookPreview(book.isbn))),
  ]);
  logPreviewSummary(list, previews);

  return list.map((book, index) => ({
    ...book,
    coverAvailable: coverFlags[index],
    preview: {
      hasPreview: previews[index].hasPreview,
      volumeId: previews[index].volumeId,
    },
    connections: (connections[book.isbn] ?? []).map((link) => {
      const target = books.get(link.isbn)!;
      return {
        isbn: link.isbn,
        title: target.title,
        author: target.author,
        why: link.why,
      };
    }),
  }));
});
