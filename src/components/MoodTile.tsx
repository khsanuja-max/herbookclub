import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/photos";

type MoodTileProps = {
  href: string;
  label: string;
  line: string;
  photo: Photo;
  sizes: string;
  /** Tile shape, e.g. "aspect-[3/4]" (the default) or "aspect-video" */
  aspect?: string;
};

export function MoodTile({
  href,
  label,
  line,
  photo,
  sizes,
  aspect = "aspect-[3/4]",
}: MoodTileProps) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex h-full flex-col justify-end p-5 text-glow sm:p-6 xl:p-8 ${aspect}`}
    >
      <div
        className="fade-soft absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={photo.image}
          alt=""
          fill
          sizes={sizes}
          placeholder="blur"
          className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-linear-to-t from-night via-night/45 to-night/10" />
      </div>
      <span className="font-serif text-2xl font-semibold leading-[1.05] text-balance transition-colors group-hover:text-gold sm:text-3xl xl:text-4xl">
        {label}
      </span>
      <span className="mt-2 font-serif text-base italic text-glow/80 sm:mt-3 sm:text-lg xl:text-xl">
        {line}
      </span>
    </Link>
  );
}
