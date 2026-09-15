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
      className={`relative aspect-[2/3] overflow-hidden rounded-sm bg-night shadow-[0_30px_60px_-30px_rgba(28,22,19,0.6)] ${className}`}
    >
      {failed ? (
        <div
          role="img"
          aria-label={`${title} by ${author}`}
          className="flex h-full flex-col justify-between border border-glow/15 p-6 text-glow"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-lamplight">
            Roshi’s Book Club
          </span>
          <span className="font-serif text-3xl font-semibold leading-tight text-balance">
            {title}
          </span>
          <span className="text-sm text-glow/75">{author}</span>
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
