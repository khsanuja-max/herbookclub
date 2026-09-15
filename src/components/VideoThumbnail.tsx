import Image from "next/image";
import fairyLightsPhoto from "@/assets/photos/hero-fairy-lights-book.jpg";

type VideoThumbnailProps = {
  /** YouTube video ID; empty shows a "coming soon" card */
  videoId?: string;
  sizes: string;
  className?: string;
};

export function VideoThumbnail({
  videoId,
  sizes,
  className = "",
}: VideoThumbnailProps) {
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-md bg-night text-glow ${className}`}
    >
      {videoId ? (
        <Image
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <>
          <Image
            src={fairyLightsPhoto}
            alt=""
            fill
            sizes={sizes}
            placeholder="blur"
            className="object-cover opacity-40 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-x-0 bottom-0 p-4 text-xs uppercase tracking-[0.25em] text-lamplight">
            Video coming soon
          </span>
        </>
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-glow/50 bg-night/40 backdrop-blur-sm">
          <svg width="18" height="20" viewBox="0 0 20 22" aria-hidden="true">
            <path d="M2 1.5v19L19 11z" className="fill-glow" />
          </svg>
        </span>
      </span>
    </div>
  );
}
