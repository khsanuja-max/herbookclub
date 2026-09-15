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
    <span className="flex size-16 items-center justify-center rounded-full border border-glow/50 bg-night/40 backdrop-blur-sm">
      <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
        <path d="M2 1.5v19L19 11z" className="fill-glow" />
      </svg>
    </span>
  );
}

export function VideoEmbed({ videoId, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const frame =
    "relative aspect-video w-full overflow-hidden rounded-md bg-night text-glow";

  if (!videoId) {
    return (
      <div className={frame}>
        <Image
          src={fairyLightsPhoto}
          alt=""
          fill
          sizes="(min-width: 896px) 848px, 100vw"
          placeholder="blur"
          className="object-cover opacity-40"
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <PlayIcon />
          <p className="font-serif text-3xl font-semibold">Video coming soon</p>
          <p className="text-glow/75">Roshi’s YouTube channel is on its way.</p>
        </div>
      </div>
    );
  }

  if (playing) {
    return (
      <div className={frame}>
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
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 896px) 848px, 100vw"
        className="object-cover transition-opacity group-hover:opacity-80"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <PlayIcon />
      </span>
    </button>
  );
}
