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
    <div className={`relative aspect-video text-glow ${className}`}>
      <div className="fade-edges absolute inset-0 overflow-hidden" aria-hidden="true">
        {videoId ? (
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <Image
            src={fairyLightsPhoto}
            alt=""
            fill
            sizes={sizes}
            placeholder="blur"
            className="object-cover opacity-60 transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
      </div>
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <span className="flex size-20 items-center justify-center rounded-full bg-night/60 shadow-[0_0_60px_rgba(232,192,122,0.35)] backdrop-blur-sm transition-transform group-hover:scale-105">
          <svg width="22" height="24" viewBox="0 0 20 22" aria-hidden="true">
            <path d="M2 1.5v19L19 11z" className="fill-gold" />
          </svg>
        </span>
        {!videoId && <span className="section-label">Video coming soon</span>}
      </span>
    </div>
  );
}
