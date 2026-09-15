"use client";

import Image from "next/image";
import { useState } from "react";
import fairyLightsPhoto from "@/assets/photos/hero-fairy-lights-book.jpg";

type VideoEmbedProps = {
  /** YouTube video ID; leave empty to show the "coming soon" card */
  videoId?: string;
  title: string;
};

function PlayIcon() {
  return (
    <span className="flex size-20 items-center justify-center rounded-full bg-night/60 shadow-[0_0_60px_rgba(232,192,122,0.35)] backdrop-blur-sm">
      <svg width="22" height="24" viewBox="0 0 20 22" aria-hidden="true">
        <path d="M2 1.5v19L19 11z" className="fill-gold" />
      </svg>
    </span>
  );
}

export function VideoEmbed({ videoId, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const frame = "relative aspect-video w-full text-glow";

  if (!videoId) {
    return (
      <div className={frame}>
        <div className="fade-edges absolute inset-0" aria-hidden="true">
          <Image
            src={fairyLightsPhoto}
            alt=""
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            placeholder="blur"
            className="object-cover opacity-60"
          />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <PlayIcon />
          <p className="font-serif text-3xl font-semibold sm:text-4xl">
            Video coming soon
          </p>
          <p className="font-serif text-xl italic text-glow-soft">
            Roshi’s YouTube channel is on its way.
          </p>
        </div>
      </div>
    );
  }

  if (playing) {
    return (
      <div
        className={`${frame} overflow-hidden rounded-md shadow-[0_40px_120px_-40px_rgba(217,150,74,0.5)]`}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={`${frame} group block cursor-pointer`}
    >
      <span className="fade-edges absolute inset-0" aria-hidden="true">
        <Image
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-opacity group-hover:opacity-80"
        />
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        <PlayIcon />
      </span>
    </button>
  );
}
