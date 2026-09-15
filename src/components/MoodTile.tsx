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
      className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-md bg-night p-5 text-glow sm:p-6 ${aspect}`}
    >
      <Image
        src={photo.image}
        alt=""
        fill
        sizes={sizes}
        placeholder="blur"
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
      />
      <span
        className="absolute inset-0 -z-10 bg-linear-to-t from-night/95 via-night/60 to-night/20"
        aria-hidden="true"
      />
      <span className="font-serif text-2xl font-semibold leading-tight text-balance sm:text-3xl">
        {label}
      </span>
      <span className="mt-2 text-sm text-glow/80 sm:text-base">{line}</span>
    </Link>
  );
}
