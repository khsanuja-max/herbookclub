"use client";

import type MatterJS from "matter-js";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WallBook } from "@/lib/wall";
import { BookCover } from "./BookCover";
import { OpenBook, type CoverState } from "./OpenBook";

type Matter = typeof MatterJS;

/** Pointer movement below this many pixels counts as a click, not a drag. */
const CLICK_DISTANCE = 8;
const MAX_TILT = (8 * Math.PI) / 180;

/** matter-js keeps its event handlers on the mouse object; the type definitions don't list them. */
type MouseHandlers = {
  mousemove: EventListener;
  mousedown: EventListener;
  mouseup: EventListener;
  mousewheel: EventListener;
};

type WallController = {
  pause: () => void;
  resume: () => void;
  /** Current rotation of a cover, in radians */
  getAngle: (isbn: string) => number;
  destroy: () => void;
};

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** The ISBN in a #book-<ISBN> address, if it's a book on the wall. */
function isbnFromHash(books: WallBook[]) {
  const match = window.location.hash.match(/^#book-([0-9Xx]{10,13})$/);
  return match && books.some((book) => book.isbn === match[1]) ? match[1] : null;
}

/**
 * Starts the physics wall: one body per cover, no gravity, walls around the edges,
 * and a mouse/touch constraint for dragging.
 */
function startWall(
  Matter: Matter,
  container: HTMLDivElement,
  elements: HTMLAnchorElement[],
  onOpen: (isbn: string) => void,
): WallController {
  const { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Sleeping } =
    Matter;

  // Calmer movement on phones and small screens
  const calm =
    window.matchMedia("(pointer: coarse)").matches || container.clientWidth < 768;

  // Switch from the resting grid to free positions (placed below, before the browser paints)
  container.dataset.physics = "on";

  let width = container.clientWidth;
  let height = container.clientHeight;
  const sizes = elements.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));

  const engine = Engine.create({
    gravity: { x: 0, y: 0, scale: 0 },
    enableSleeping: true,
  });

  // Scatter the covers over a loose grid, with a little jitter and tilt
  const count = elements.length;
  const cols = Math.max(1, Math.round(Math.sqrt((count * width) / height)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cellW = width / cols;
  const cellH = height / rows;
  const slots = shuffle(Array.from({ length: cols * rows }, (_, i) => i));
  const spread = (amount: number) => (Math.random() * 2 - 1) * amount;

  const bodies = elements.map((_, i) => {
    const { w, h } = sizes[i];
    const col = slots[i] % cols;
    const row = Math.floor(slots[i] / cols);
    const x = cellW * (col + 0.5) + spread(Math.max(0, (cellW - w) / 2) * 0.7);
    const y = cellH * (row + 0.5) + spread(Math.max(0, (cellH - h) / 2) * 0.7);
    return Bodies.rectangle(x, y, w, h, {
      angle: spread(MAX_TILT),
      frictionAir: calm ? 0.09 : 0.04,
      friction: 0.08,
      restitution: 0.2,
      density: 0.0015,
      chamfer: { radius: 4 },
    });
  });
  Composite.add(engine.world, bodies);
  const bodyByIsbn = new Map(
    elements.map((element, i) => [element.dataset.wallBook ?? "", bodies[i]]),
  );

  // Fixed walls just outside the container
  let walls: MatterJS.Body[] = [];
  const buildWalls = () => {
    if (walls.length > 0) Composite.remove(engine.world, walls);
    const t = 400;
    walls = [
      Bodies.rectangle(width / 2, -t / 2, width + t * 2, t, { isStatic: true }),
      Bodies.rectangle(width / 2, height + t / 2, width + t * 2, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, height / 2, t, height + t * 2, { isStatic: true }),
      Bodies.rectangle(width + t / 2, height / 2, t, height + t * 2, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
  };
  buildWalls();

  // Dragging with mouse or touch
  const mouse = Mouse.create(container);
  const handlers = mouse as unknown as MouseHandlers;
  // matter-js cancels the mouse wheel over the wall; give it back so the page still scrolls
  container.removeEventListener("wheel", handlers.mousewheel);
  // Releasing the mouse outside the wall should still let go of the book
  const releaseOutside = (event: MouseEvent) => {
    if (event.target instanceof Node && container.contains(event.target)) return;
    handlers.mouseup(event);
  };
  window.addEventListener("mouseup", releaseOutside);

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
  });
  Composite.add(engine.world, mouseConstraint);

  // The book being dragged rises above the others
  let topLayer = 1;
  const elementByBody = new Map(bodies.map((body, i) => [body.id, elements[i]]));
  Events.on(mouseConstraint, "startdrag", (event: unknown) => {
    const { body } = event as { body: MatterJS.Body };
    const element = elementByBody.get(body.id);
    if (element) element.style.zIndex = String(++topLayer);
  });

  // Tell a click from a drag
  let press: { x: number; y: number; link: HTMLAnchorElement } | null = null;
  const onPointerDown = (event: PointerEvent) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-wall-book]");
    press = link ? { x: event.clientX, y: event.clientY, link } : null;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!press) return;
    const { x, y, link } = press;
    press = null;
    if (Math.hypot(event.clientX - x, event.clientY - y) < CLICK_DISTANCE) {
      const isbn = link.dataset.wallBook;
      if (isbn) onOpen(isbn);
    }
  };
  const onPointerCancel = () => {
    press = null;
  };
  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);

  // Copy each body's position and rotation onto its cover
  const sync = () => {
    bodies.forEach((body, i) => {
      const { w, h } = sizes[i];
      elements[i].style.transform = `translate3d(${body.position.x - w / 2}px, ${
        body.position.y - h / 2
      }px, 0) rotate(${body.angle}rad)`;
    });
  };

  // Animation loop, paused when the wall is off-screen, the tab is hidden, or a book is open
  let frame = 0;
  let onScreen = true;
  let tabVisible = !document.hidden;
  let paused = false;

  const tick = () => {
    Engine.update(engine, 1000 / 60);
    sync();
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!frame && onScreen && tabVisible && !paused) frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
    else stop();
  });
  intersection.observe(container);

  const onVisibility = () => {
    tabVisible = !document.hidden;
    if (tabVisible) start();
    else stop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // Keep the walls and books inside the container when the window is resized
  const resize = new ResizeObserver(() => {
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight;
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    buildWalls();
    bodies.forEach((body, i) => {
      const { w, h } = sizes[i];
      Body.setPosition(body, {
        x: Math.min(Math.max(body.position.x, w / 2), width - w / 2),
        y: Math.min(Math.max(body.position.y, h / 2), height - h / 2),
      });
      Sleeping.set(body, false);
    });
    sync();
  });
  resize.observe(container);

  sync();
  start();

  return {
    pause: () => {
      paused = true;
      stop();
    },
    resume: () => {
      paused = false;
      start();
    },
    getAngle: (isbn) => bodyByIsbn.get(isbn)?.angle ?? 0,
    destroy: () => {
      stop();
      intersection.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("mouseup", releaseOutside);
      container.removeEventListener("mousemove", handlers.mousemove);
      container.removeEventListener("mousedown", handlers.mousedown);
      container.removeEventListener("mouseup", handlers.mouseup);
      container.removeEventListener("touchmove", handlers.mousemove);
      container.removeEventListener("touchstart", handlers.mousedown);
      container.removeEventListener("touchend", handlers.mouseup);
      Events.off(mouseConstraint, "startdrag");
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      container.dataset.physics = "off";
      elements.forEach((element) => {
        element.style.transform = "";
        element.style.zIndex = "";
      });
    },
  };
}

export function BookWall({ books }: { books: WallBook[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<WallController | null>(null);
  const openIsbnRef = useRef<string | null>(null);
  /** Whether opening the book added a #book- entry to the browser history */
  const pushedRef = useRef(false);

  const [openIsbn, setOpenIsbn] = useState<string | null>(null);
  const [trail, setTrail] = useState<string[]>([]);
  const [closeRequested, setCloseRequested] = useState(false);

  const booksByIsbn = useMemo(
    () => new Map(books.map((book) => [book.isbn, book])),
    [books],
  );

  const coverElement = useCallback(
    (isbn: string) =>
      containerRef.current?.querySelector<HTMLAnchorElement>(
        `a[data-wall-book="${isbn}"]`,
      ) ?? null,
    [],
  );

  const openBook = useCallback(
    (isbn: string, fromHistory = false) => {
      if (openIsbnRef.current || !booksByIsbn.has(isbn)) return;
      if (fromHistory) {
        pushedRef.current = false;
      } else {
        window.history.pushState(window.history.state, "", `#book-${isbn}`);
        pushedRef.current = true;
      }
      controllerRef.current?.pause();
      const cover = coverElement(isbn);
      if (cover) cover.style.visibility = "hidden";
      openIsbnRef.current = isbn;
      setOpenIsbn(isbn);
      setTrail([isbn]);
      setCloseRequested(false);
    },
    [booksByIsbn, coverElement],
  );

  const getCoverState = useCallback(
    (isbn: string): CoverState | null => {
      const element = coverElement(isbn);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: element.offsetWidth,
        angle: controllerRef.current?.getAngle(isbn) ?? 0,
      };
    },
    [coverElement],
  );

  const handleFollow = useCallback(
    (isbn: string) => {
      const previous = openIsbnRef.current;
      if (previous) {
        const previousCover = coverElement(previous);
        if (previousCover) previousCover.style.visibility = "";
      }
      const nextCover = coverElement(isbn);
      if (nextCover) nextCover.style.visibility = "hidden";
      window.history.replaceState(window.history.state, "", `#book-${isbn}`);
      openIsbnRef.current = isbn;
      setOpenIsbn(isbn);
      setTrail((current) => [...current, isbn]);
    },
    [coverElement],
  );

  const handleClosed = useCallback(() => {
    const isbn = openIsbnRef.current;
    const cover = isbn ? coverElement(isbn) : null;
    if (cover) cover.style.visibility = "";
    openIsbnRef.current = null;
    setOpenIsbn(null);
    setTrail([]);
    setCloseRequested(false);
    controllerRef.current?.resume();

    if (window.location.hash.startsWith("#book-")) {
      if (pushedRef.current) window.history.back();
      else
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.search,
        );
    }
    pushedRef.current = false;
    cover?.focus({ preventScroll: true });
  }, [coverElement]);

  // Start the physics (unless the visitor prefers reduced motion), then open any book in the address
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    const openFromAddress = () => {
      const isbn = isbnFromHash(books);
      if (isbn) openBook(isbn, true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(openFromAddress);
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }

    import("matter-js").then((module) => {
      if (cancelled) return;
      const elements = Array.from(
        container.querySelectorAll<HTMLAnchorElement>("a[data-wall-book]"),
      );
      controllerRef.current = startWall(module.default, container, elements, (isbn) =>
        openBook(isbn),
      );
      openFromAddress();
    });

    return () => {
      cancelled = true;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [books, openBook]);

  // The back and forward buttons close and reopen books
  useEffect(() => {
    const onPopState = () => {
      const isbn = isbnFromHash(books);
      if (!isbn && openIsbnRef.current) setCloseRequested(true);
      else if (isbn && !openIsbnRef.current) openBook(isbn, true);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [books, openBook]);

  const openBookData = openIsbn ? (booksByIsbn.get(openIsbn) ?? null) : null;

  return (
    <>
      <div
        ref={containerRef}
        data-physics="off"
        className="group/wall relative isolate grid h-[70svh] max-h-[900px] min-h-[480px] grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-center justify-items-center gap-6 overflow-hidden p-6 data-[physics=on]:touch-none sm:h-[85svh] sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:gap-10 sm:p-10"
      >
        {/* The wall's surface fades into the room, so it has no visible edge */}
        <div
          aria-hidden="true"
          className="wall-surface fade-edges pointer-events-none absolute inset-0 -z-10"
        />
        {books.map((book) => (
          <Link
            key={book.isbn}
            href={book.mention.href}
            data-wall-book={book.isbn}
            draggable={false}
            aria-label={`Open ${book.title} by ${book.author}`}
            onClick={(event) => {
              event.preventDefault();
              // With physics on, mouse and touch clicks are handled by the wall (so a drag never opens a book)
              if (event.detail > 0 && event.currentTarget.closest('[data-physics="on"]')) return;
              openBook(book.isbn);
            }}
            className="group/book block w-[96px] select-none will-change-transform sm:w-[130px] [&_img]:pointer-events-none group-data-[physics=on]/wall:absolute group-data-[physics=on]/wall:top-0 group-data-[physics=on]/wall:left-0 group-data-[physics=on]/wall:cursor-grab group-data-[physics=on]/wall:active:cursor-grabbing"
          >
            <BookCover
              isbn={book.isbn}
              title={book.title}
              author={book.author}
              available={book.coverAvailable}
              sizes="130px"
              className="transition-shadow duration-500 group-hover/book:shadow-[0_0_70px_-10px_rgba(232,192,122,0.65)] group-focus-visible/book:shadow-[0_0_70px_-10px_rgba(232,192,122,0.65)]"
            />
          </Link>
        ))}
      </div>

      {openBookData && (
        <OpenBook
          book={openBookData}
          books={booksByIsbn}
          trail={trail.flatMap((isbn) => booksByIsbn.get(isbn) ?? [])}
          getCoverState={getCoverState}
          onFollow={handleFollow}
          onClosed={handleClosed}
          closeRequested={closeRequested}
        />
      )}
    </>
  );
}
