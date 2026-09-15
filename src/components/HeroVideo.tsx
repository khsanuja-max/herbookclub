"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  /** Still frame shown straight away, and kept for reduced-motion or data-saver visitors */
  poster: StaticImageData;
  alt: string;
  /** MP4 for laptops and larger screens */
  desktopSrc: string;
  /** Smaller MP4 for phones */
  mobileSrc: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroVideo({
  poster,
  alt,
  desktopSrc,
  mobileSrc,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = (navigator as NavigatorWithConnection).connection
      ?.saveData;
    if (reduceMotion || saveData) return;

    const onPlaying = () => {
      video.dataset.ready = "true";
    };
    video.addEventListener("playing", onPlaying);
    video.muted = true;
    video.src = window.matchMedia("(max-width: 768px)").matches
      ? mobileSrc
      : desktopSrc;
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [desktopSrc, mobileSrc]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="100vw"
        placeholder="blur"
        loading="eager"
        fetchPriority="high"
        className="-z-10 object-cover motion-safe:animate-drift"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="peer absolute inset-0 -z-10 size-full object-cover opacity-0 transition-opacity duration-[1500ms] data-[ready=true]:opacity-100 motion-safe:animate-drift"
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute right-4 bottom-4 z-10 hidden size-11 items-center justify-center rounded-full bg-night/60 text-glow backdrop-blur-sm transition-colors peer-data-[ready=true]:flex hover:bg-night hover:text-gold sm:right-8 sm:bottom-8"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          {paused ? (
            <path d="M3 1.5v11L12.5 7z" className="fill-current" />
          ) : (
            <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" className="fill-current" />
          )}
        </svg>
      </button>
    </>
  );
}
