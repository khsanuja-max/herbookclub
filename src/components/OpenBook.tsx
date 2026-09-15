"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { findCopyLinks } from "@/lib/books";
import type { WallBook } from "@/lib/wall";
import { AmberRule } from "./AmberRule";
import { BookCover } from "./BookCover";
import { GoogleBooksViewer } from "./GoogleBooksViewer";

/** Where a cover sits on the wall, in viewport pixels (angle in radians). */
export type CoverState = {
  centerX: number;
  centerY: number;
  width: number;
  angle: number;
};

type OpenBookProps = {
  book: WallBook;
  books: Map<string, WallBook>;
  /** Books followed so far, ending with the open one */
  trail: WallBook[];
  getCoverState: (isbn: string) => CoverState | null;
  /** Called once the current book has closed, to open a connected book */
  onFollow: (isbn: string) => void;
  /** Called once the book has returned to the wall */
  onClosed: () => void;
  /** Set by the wall when the book should close (e.g. the back button) */
  closeRequested: boolean;
};

type Layout = { singlePage: boolean; pageWidth: number; pageHeight: number };

/** Page size for the open book: a two-page spread on tablets and laptops, one page on phones. */
function computeLayout(vw: number, vh: number): Layout {
  const singlePage = vw < 768;
  let pageWidth: number;
  if (singlePage) {
    pageWidth = Math.min(vw - 48, 460);
  } else if (vw >= 1024) {
    const gutter = vw >= 1536 ? 80 : 64;
    const available = vw - gutter * 2 - 380 - 56;
    pageWidth = Math.min(available / 2, (vh - 140) / 1.5, 400);
  } else {
    pageWidth = Math.min((vw - 80) / 2, (vh * 0.75) / 1.5, 340);
  }
  pageWidth = Math.max(Math.floor(pageWidth), singlePage ? 240 : 200);
  return { singlePage, pageWidth, pageHeight: Math.round(pageWidth * 1.5) };
}

/** Animation timings in milliseconds, shorter on phones. */
function timings(singlePage: boolean) {
  return singlePage
    ? {
        lift: 500, settle: 0, flip: 500, flipAngle: 120,
        contentDelay: 300, contentDuration: 300, columnDelay: 350, columnDuration: 300,
        fadeOut: 200, shutDelay: 150, shut: 400, flyBackDelay: 400, flyBack: 400,
      }
    : {
        lift: 700, settle: 200, flip: 800, flipAngle: 160,
        contentDelay: 500, contentDuration: 400, columnDelay: 600, columnDuration: 400,
        fadeOut: 300, shutDelay: 200, shut: 700, flyBackDelay: 700, flyBack: 600,
      };
}

const FULL_CLIP = "inset(0% 0% 0% 0%)";
const RIGHT_PAGE_CLIP = "inset(0% 0% 0% 50%)";
const AT_REST = "translate(0px, 0px) rotate(0deg) scale(1)";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs a Web Animation, keeps its end state, and resolves when it finishes (or is interrupted). */
async function play(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  const animation = element.animate(keyframes, { fill: "both", ...options });
  try {
    await animation.finished;
    animation.commitStyles();
    animation.cancel();
  } catch {
    // Interrupted
  }
}

function BookPages({ book, singlePage }: { book: WallBook; singlePage: boolean }) {
  const [viewerFailed, setViewerFailed] = useState(false);

  if (book.preview.hasPreview && !viewerFailed) {
    return (
      <div className="absolute inset-0 py-5 pr-5 pl-7 sm:py-7 sm:pr-7 sm:pl-9">
        <GoogleBooksViewer isbn={book.isbn} onFail={() => setViewerFailed(true)} />
      </div>
    );
  }

  const pageScroll = singlePage ? "" : "overflow-y-auto";

  return (
    <div
      className={`absolute inset-0 ${singlePage ? "overflow-y-auto" : "grid grid-cols-2"}`}
    >
      <div className={`${pageScroll} py-8 pr-7 pl-9 sm:py-10 sm:pr-10 sm:pl-12`}>
        <p className="font-sc text-sm lowercase tracking-[0.22em] text-sepia">
          Roshi’s words
        </p>
        {book.words.headline && (
          <p className="mt-4 font-serif text-2xl font-semibold italic leading-snug text-ink">
            “{book.words.headline}”
          </p>
        )}
        <div className="mt-4 space-y-4 font-serif text-lg italic leading-relaxed text-ink">
          {book.words.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 font-serif text-xl italic text-sepia">— Roshi</p>
      </div>

      <div className={`${pageScroll} py-8 pr-8 pl-9 sm:py-10 sm:pr-10`}>
        {viewerFailed && book.preview.volumeId && (
          <a
            href={`https://books.google.com/books?id=${book.preview.volumeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-flex items-center gap-2 bg-[#8b2b24] py-2 pr-9 pl-4 font-sc text-sm lowercase tracking-[0.16em] text-[#f7ecd8] [clip-path:polygon(0_0,100%_0,90%_50%,100%_100%,0_100%)] hover:bg-[#a3352c]"
          >
            Read on Google Books ↗
          </a>
        )}
        <p className="font-sc text-sm lowercase tracking-[0.22em] text-sepia">
          Where to find it
        </p>
        <ul className="mt-4 space-y-4">
          {findCopyLinks(book.isbn).map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="flex items-baseline gap-2 font-serif text-xl font-semibold text-ink transition-colors group-hover:text-sepia">
                  {link.label}
                  <span aria-hidden="true" className="text-sm text-sepia">
                    ↗
                  </span>
                </span>
                <span className="block text-sm text-ink-soft">{link.note}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm leading-relaxed text-ink-soft">
          Roshi talks about it in{" "}
          <Link
            href={book.mention.href}
            className="text-sepia underline decoration-sepia/40 underline-offset-4 hover:decoration-sepia"
          >
            {book.mention.label}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function OpenBook({
  book,
  books,
  trail,
  getCoverState,
  onFollow,
  onClosed,
  closeRequested,
}: OpenBookProps) {
  const titleId = useId();
  const [layout, setLayout] = useState(() =>
    computeLayout(window.innerWidth, window.innerHeight),
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLButtonElement>(null);
  const columnRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const runRef = useRef(0);
  const busyRef = useRef(true);
  const pendingCloseRef = useRef(false);
  const openedOnceRef = useRef(false);

  const { singlePage, pageWidth, pageHeight } = layout;

  const getElements = () => {
    const dialog = dialogRef.current;
    const backdrop = backdropRef.current;
    const stage = stageRef.current;
    const spread = spreadRef.current;
    const content = contentRef.current;
    const ribbon = ribbonRef.current;
    const column = columnRef.current;
    const bookEl = bookRef.current;
    const cover = coverRef.current;
    if (!dialog || !backdrop || !stage || !spread || !content || !ribbon || !column || !bookEl || !cover) {
      return null;
    }
    return { dialog, backdrop, stage, spread, content, ribbon, column, bookEl, cover };
  };

  // Keep the page behind the book still
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onResize = () => setLayout(computeLayout(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /** Puts the closed book over the right-hand page (or the single page on phones). */
  const placeBook = useCallback(() => {
    const slot = slotRef.current;
    const bookEl = bookRef.current;
    if (!slot || !bookEl) return;
    bookEl.style.left = `${slot.offsetLeft + (singlePage ? 0 : pageWidth)}px`;
    bookEl.style.top = `${slot.offsetTop}px`;
    bookEl.style.width = `${pageWidth}px`;
    bookEl.style.height = `${pageHeight}px`;
  }, [singlePage, pageWidth, pageHeight]);

  useLayoutEffect(() => {
    placeBook();
  }, [placeBook]);

  /** The transform that makes the closed book sit exactly over its cover on the wall. */
  const wallTransform = useCallback(
    (isbn: string) => {
      const state = getCoverState(isbn);
      const stage = stageRef.current;
      const bookEl = bookRef.current;
      if (!state || !stage || !bookEl) return "translate(0px, 40px) rotate(0deg) scale(0.4)";
      const stageRect = stage.getBoundingClientRect();
      const dx = state.centerX - stageRect.left - (bookEl.offsetLeft + pageWidth / 2);
      const dy = state.centerY - stageRect.top - (bookEl.offsetTop + pageHeight / 2);
      const scale = state.width / pageWidth;
      return `translate(${dx}px, ${dy}px) rotate(${state.angle}rad) scale(${scale})`;
    },
    [getCoverState, pageWidth, pageHeight],
  );

  const runClose = useCallback(async () => {
    const e = getElements();
    if (!e) return;
    if (busyRef.current) {
      pendingCloseRef.current = true;
      return;
    }
    busyRef.current = true;
    pendingCloseRef.current = false;
    const token = ++runRef.current;
    const t = timings(singlePage);
    const halfClip = singlePage ? FULL_CLIP : RIGHT_PAGE_CLIP;

    if (prefersReducedMotion()) {
      await play(e.dialog, [{ opacity: 1 }, { opacity: 0 }], { duration: 250 });
      if (token === runRef.current) onClosed();
      return;
    }

    const home = wallTransform(book.isbn);
    await Promise.all([
      play(e.content, [{ opacity: 1 }, { opacity: 0 }], { duration: t.fadeOut }),
      play(e.column, [{ opacity: 1 }, { opacity: 0 }], { duration: t.fadeOut }),
      play(e.ribbon, [{ opacity: 1 }, { opacity: 0 }], { duration: t.fadeOut }),
      play(
        e.cover,
        [
          { opacity: 1, transform: `rotateY(${-t.flipAngle}deg)` },
          { opacity: 1, transform: "rotateY(0deg)" },
        ],
        { delay: t.shutDelay, duration: t.shut, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
      ),
      play(
        e.spread,
        [{ opacity: 1, clipPath: FULL_CLIP }, { offset: 0.7, opacity: 1 }, { opacity: 0, clipPath: halfClip }],
        { delay: t.shutDelay, duration: t.shut },
      ),
      play(e.bookEl, [{ opacity: 1, transform: AT_REST }, { opacity: 1, transform: home }], {
        delay: t.flyBackDelay,
        duration: t.flyBack,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      }),
      play(e.backdrop, [{ opacity: 1 }, { opacity: 0 }], {
        delay: t.flyBackDelay,
        duration: t.flyBack,
      }),
    ]);
    if (token === runRef.current) onClosed();
  }, [book.isbn, onClosed, singlePage, wallTransform]);

  const runCloseRef = useRef(runClose);
  useLayoutEffect(() => {
    runCloseRef.current = runClose;
  });

  const runOpen = useCallback(
    async (isbn: string) => {
      const e = getElements();
      if (!e) return;
      const token = ++runRef.current;
      busyRef.current = true;
      const firstOpen = !openedOnceRef.current;
      openedOnceRef.current = true;
      const t = timings(singlePage);
      const halfClip = singlePage ? FULL_CLIP : RIGHT_PAGE_CLIP;
      e.dialog.focus({ preventScroll: true });

      const finish = () => {
        busyRef.current = false;
        e.ribbon.focus({ preventScroll: true });
        if (pendingCloseRef.current) void runCloseRef.current();
      };

      if (prefersReducedMotion()) {
        Object.assign(e.bookEl.style, { opacity: "0" });
        Object.assign(e.spread.style, { opacity: "1", clipPath: FULL_CLIP });
        Object.assign(e.ribbon.style, { opacity: "1", transform: "none" });
        Object.assign(e.column.style, { transform: "none" });
        if (firstOpen) {
          Object.assign(e.backdrop.style, { opacity: "1" });
          Object.assign(e.content.style, { opacity: "1" });
          Object.assign(e.column.style, { opacity: "1" });
          await play(e.dialog, [{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
        } else {
          await Promise.all([
            play(e.content, [{ opacity: 0 }, { opacity: 1 }], { duration: 250 }),
            play(e.column, [{ opacity: 0 }, { opacity: 1 }], { duration: 250 }),
          ]);
        }
        if (token === runRef.current) finish();
        return;
      }

      Object.assign(e.cover.style, { opacity: "1", transform: "rotateY(0deg)" });
      Object.assign(e.spread.style, { opacity: "0", clipPath: halfClip });
      Object.assign(e.content.style, { opacity: "0" });
      Object.assign(e.column.style, { opacity: "0" });
      Object.assign(e.ribbon.style, { opacity: "0" });

      if (firstOpen) {
        void play(e.backdrop, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
      }

      // Lift: glide from the wall, grow, and turn to a gentle angle (with a little spring)
      await play(
        e.bookEl,
        [
          { opacity: 1, transform: wallTransform(isbn) },
          { offset: 0.75, opacity: 1, transform: "translate(0px, 0px) rotate(-4deg) scale(1.03)" },
          { opacity: 1, transform: "translate(0px, 0px) rotate(-3deg) scale(1)" },
        ],
        { duration: t.lift, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
      if (token !== runRef.current) return;

      // Settle
      let tilt = -3;
      if (t.settle) {
        await play(
          e.bookEl,
          [
            { transform: "translate(0px, 0px) rotate(-3deg) scale(1)" },
            { transform: "translate(0px, 0px) rotate(-1deg) scale(1)" },
          ],
          { duration: t.settle, easing: "ease-out" },
        );
        if (token !== runRef.current) return;
        tilt = -1;
      }

      // Open: the cover swings on its left edge while the pages appear beneath it
      await Promise.all([
        play(
          e.bookEl,
          [{ transform: `translate(0px, 0px) rotate(${tilt}deg) scale(1)` }, { transform: AT_REST }],
          { duration: t.flip, easing: "ease-out" },
        ),
        play(e.cover, [{ transform: "rotateY(0deg)" }, { transform: `rotateY(${-t.flipAngle}deg)` }], {
          duration: t.flip,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }),
        play(
          e.spread,
          [{ opacity: 0, clipPath: halfClip }, { offset: 0.25, opacity: 1 }, { opacity: 1, clipPath: FULL_CLIP }],
          { duration: t.flip, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        ),
        play(e.content, [{ opacity: 0 }, { opacity: 1 }], {
          delay: t.contentDelay,
          duration: t.contentDuration,
        }),
        play(
          e.column,
          [
            { opacity: 0, transform: "translateY(24px)" },
            { opacity: 1, transform: "translateY(0px)" },
          ],
          { delay: t.columnDelay, duration: t.columnDuration, easing: "ease-out" },
        ),
        play(
          e.ribbon,
          [
            { opacity: 0, transform: "translateY(-32px)" },
            { opacity: 1, transform: "translateY(0px)" },
          ],
          { delay: t.columnDelay, duration: t.columnDuration, easing: "ease-out" },
        ),
      ]);
      if (token !== runRef.current) return;

      // The swung cover gives way to the flat pages, with its edge still showing at the left
      await play(e.cover, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
      if (token === runRef.current) finish();
    },
    [singlePage, wallTransform],
  );

  const runFollow = useCallback(
    async (nextIsbn: string) => {
      if (busyRef.current || nextIsbn === book.isbn) return;
      const e = getElements();
      if (!e) return;
      busyRef.current = true;
      const token = ++runRef.current;
      const t = timings(singlePage);
      const halfClip = singlePage ? FULL_CLIP : RIGHT_PAGE_CLIP;

      if (prefersReducedMotion()) {
        await Promise.all([
          play(e.content, [{ opacity: 1 }, { opacity: 0 }], { duration: 125 }),
          play(e.column, [{ opacity: 1 }, { opacity: 0 }], { duration: 125 }),
        ]);
        if (token === runRef.current) onFollow(nextIsbn);
        return;
      }

      const shut = Math.round(t.shut * 0.7);
      await Promise.all([
        play(e.content, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }),
        play(e.column, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }),
        play(e.ribbon, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }),
        play(
          e.cover,
          [
            { opacity: 1, transform: `rotateY(${-t.flipAngle}deg)` },
            { opacity: 1, transform: "rotateY(0deg)" },
          ],
          { delay: 200, duration: shut, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
        ),
        play(
          e.spread,
          [{ opacity: 1, clipPath: FULL_CLIP }, { offset: 0.7, opacity: 1 }, { opacity: 0, clipPath: halfClip }],
          { delay: 200, duration: shut },
        ),
        play(
          e.bookEl,
          [
            { opacity: 1, transform: AT_REST },
            { opacity: 0, transform: "translate(0px, 0px) rotate(0deg) scale(0.96)" },
          ],
          { delay: 200 + shut, duration: 200 },
        ),
      ]);
      if (token === runRef.current) onFollow(nextIsbn);
    },
    [book.isbn, onFollow, singlePage],
  );

  const runOpenRef = useRef(runOpen);
  useLayoutEffect(() => {
    runOpenRef.current = runOpen;
  });

  // Open this book (again whenever a connection is followed)
  useLayoutEffect(() => {
    void runOpenRef.current(book.isbn);
  }, [book.isbn]);

  useEffect(() => {
    if (closeRequested) void runCloseRef.current();
  }, [closeRequested]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      void runClose();
      return;
    }
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), iframe"),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain text-glow outline-none"
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="fixed inset-0 bg-night/75 backdrop-blur-md"
        style={{ opacity: 0 }}
      />

      <div
        ref={stageRef}
        onClick={(event) => {
          if (event.target === event.currentTarget) void runClose();
        }}
        className="page-container relative flex min-h-full flex-col items-center justify-center gap-10 py-20 lg:flex-row lg:gap-14"
      >
        <div
          ref={slotRef}
          className="relative shrink-0"
          style={{ width: singlePage ? pageWidth : pageWidth * 2, height: pageHeight }}
        >
          <div
            ref={spreadRef}
            className="book-paper absolute inset-0 overflow-hidden rounded-[3px] shadow-[0_60px_140px_-40px_rgba(0,0,0,0.95)]"
            style={{ opacity: 0 }}
          >
            {/* The cover's edge stays visible at the left, like an open hardback */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 z-10 w-3 overflow-hidden shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)]"
            >
              <div style={{ width: pageWidth }}>
                <BookCover
                  isbn={book.isbn}
                  title={book.title}
                  author={book.author}
                  available={book.coverAvailable}
                  sizes={`${pageWidth}px`}
                />
              </div>
            </div>
            {!singlePage && (
              <div
                aria-hidden="true"
                className="page-crease pointer-events-none absolute inset-y-0 left-1/2 z-10 w-24 -translate-x-1/2"
              />
            )}
            <div ref={contentRef} className="absolute inset-0" style={{ opacity: 0 }}>
              <BookPages key={book.isbn} book={book} singlePage={singlePage} />
            </div>
          </div>

          <button
            ref={ribbonRef}
            type="button"
            onClick={() => void runClose()}
            className="group absolute right-4 bottom-[calc(100%-2.75rem)] z-20 flex flex-col items-end rounded-sm sm:right-5"
            style={{ opacity: 0 }}
          >
            {/* The label sits above the book; only the ribbon's tail hangs into the page's top margin */}
            <span className="mb-2 rounded-full bg-night/90 px-3 py-1.5 font-sc text-sm lowercase tracking-[0.18em] whitespace-nowrap text-glow shadow-lg transition-colors group-hover:text-gold">
              Close the book
            </span>
            <span
              aria-hidden="true"
              className="mr-3 block h-14 w-7 bg-[#8b2b24] shadow-[0_6px_14px_rgba(0,0,0,0.45)] transition-transform [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] group-hover:translate-y-1"
            />
          </button>
        </div>

        <aside
          ref={columnRef}
          className="w-full max-w-md lg:w-[380px] lg:max-w-none"
          style={{ opacity: 0 }}
        >
          {trail.length > 1 && (
            <p className="mb-8 text-sm leading-relaxed text-glow-soft">
              <span className="font-sc lowercase tracking-[0.2em] text-amber">
                Your trail:{" "}
              </span>
              {trail.map((item) => item.title).join(" → ")}
            </p>
          )}
          <p className="section-label">From the Book Wall</p>
          <h2
            id={titleId}
            className="mt-4 font-serif text-4xl font-semibold leading-[1.02] text-balance sm:text-5xl"
          >
            {book.title}
          </h2>
          <p className="mt-3 font-serif text-2xl italic text-glow-soft">{book.author}</p>
          <AmberRule className="mt-8 w-32" />

          {book.connections.length > 0 && (
            <>
              <h3 className="section-label mt-8">If you loved this, try…</h3>
              <ul className="mt-5 space-y-5">
                {book.connections.map((link) => {
                  const target = books.get(link.isbn);
                  return (
                    <li key={link.isbn}>
                      <button
                        type="button"
                        onClick={() => void runFollow(link.isbn)}
                        className="group flex w-full items-start gap-4 text-left"
                      >
                        <span className="w-14 shrink-0">
                          {target && (
                            <BookCover
                              isbn={target.isbn}
                              title={target.title}
                              author={target.author}
                              available={target.coverAvailable}
                              sizes="56px"
                              className="transition-transform group-hover:-translate-y-1"
                            />
                          )}
                        </span>
                        <span>
                          <span className="block font-serif text-xl font-semibold leading-tight transition-colors group-hover:text-gold">
                            {link.title}
                          </span>
                          <span className="mt-1 block text-sm leading-snug text-glow-soft">
                            {link.why}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </aside>

        {/* The closed book that lifts from the wall, then opens */}
        <div
          ref={bookRef}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ perspective: "2200px", opacity: 0 }}
        >
          <div
            ref={coverRef}
            className="relative size-full [transform-style:preserve-3d]"
            style={{ transformOrigin: "left center" }}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <BookCover
                isbn={book.isbn}
                title={book.title}
                author={book.author}
                available={book.coverAvailable}
                sizes={`${pageWidth}px`}
                className="size-full"
              />
            </div>
            <div className="book-paper absolute inset-0 rounded-sm [backface-visibility:hidden] [transform:rotateY(180deg)]" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
