"use client";

import Image from "next/image";
import { useState } from "react";
import { coverUrl } from "@/lib/books";

type BookCoverProps = {
  isbn: string;
  title: string;
  author: string;
  /** Result of the build-time cover check; false shows the fallback straight away */
  available?: boolean;
  sizes: string;
  className?: string;
};

export function BookCover({
  isbn,
  title,
  author,
  available = true,
  sizes,
  className = "",
}: BookCoverProps) {
  const [failed, setFailed] = useState(!available);

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-sm bg-smoke shadow-[0_30px_70px_-25px_rgba(217,150,74,0.45)] ${className}`}
    >
      {failed ? (
        <div
          role="img"
          aria-label={`${title} by ${author}`}
          className="flex h-full flex-col justify-between bg-linear-to-b from-smoke to-hearth p-5 text-glow"
        >
          <span className="font-sc text-xs lowercase tracking-[0.25em] text-amber">
            Roshi’s Book Club
          </span>
          <span className="font-serif text-2xl font-semibold leading-tight text-balance">
            {title}
          </span>
          <span className="font-serif text-base italic text-glow-soft">
            {author}
          </span>
        </div>
      ) : (
        <Image
          src={coverUrl(isbn)}
          alt={`Cover of ${title} by ${author}`}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
