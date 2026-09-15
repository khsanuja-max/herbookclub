"use client";

import { useEffect, useRef, useState } from "react";

type GoogleBooksViewerInstance = {
  load: (
    identifier: string,
    notFoundCallback?: () => void,
    successCallback?: () => void,
  ) => void;
  resize: () => void;
};

type GoogleBooksApi = {
  books: {
    load: (options?: Record<string, unknown>) => void;
    setOnLoadCallback: (callback: () => void) => void;
    DefaultViewer: new (element: Element) => GoogleBooksViewerInstance;
  };
};

declare global {
  interface Window {
    google?: GoogleBooksApi;
  }
}

/** Give up on a preview that hasn't appeared after this long. */
const TIMEOUT_MS = 8000;

let apiPromise: Promise<GoogleBooksApi> | null = null;

/** Loads Google's Embedded Viewer script once, the first time a preview is opened. */
function loadGoogleBooks(): Promise<GoogleBooksApi> {
  if (!apiPromise) {
    apiPromise = new Promise<GoogleBooksApi>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://www.google.com/books/jsapi.js";
      script.async = true;
      script.onload = () => {
        const google = window.google;
        if (!google?.books) {
          reject(new Error("Google Books viewer is unavailable"));
          return;
        }
        google.books.load();
        google.books.setOnLoadCallback(() => resolve(google));
      };
      script.onerror = () => reject(new Error("Google Books viewer failed to load"));
      document.head.appendChild(script);
    });
    // Let a later open try again if loading failed
    apiPromise.catch(() => {
      apiPromise = null;
    });
  }
  return apiPromise;
}

type GoogleBooksViewerProps = {
  isbn: string;
  /** Called if the preview can't be shown (not embeddable, blocked in this country, or too slow) */
  onFail: () => void;
};

export function GoogleBooksViewer({ isbn, onFail }: GoogleBooksViewerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const onFailRef = useRef(onFail);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onFailRef.current = onFail;
  });

  useEffect(() => {
    let settled = false;
    let viewer: GoogleBooksViewerInstance | null = null;

    const fail = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      onFailRef.current();
    };
    const timer = window.setTimeout(fail, TIMEOUT_MS);

    loadGoogleBooks()
      .then((google) => {
        if (settled || !canvasRef.current) return;
        viewer = new google.books.DefaultViewer(canvasRef.current);
        viewer.load(`ISBN:${isbn}`, fail, () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          setReady(true);
        });
      })
      .catch(fail);

    const onResize = () => viewer?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [isbn]);

  return (
    <div className="relative size-full">
      <div ref={canvasRef} className="size-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif text-xl italic text-ink-soft motion-safe:animate-pulse">
            Opening the pages…
          </p>
        </div>
      )}
    </div>
  );
}
