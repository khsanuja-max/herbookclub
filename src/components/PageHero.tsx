import Image, { type StaticImageData } from "next/image";

type PageHeroProps = {
  image: StaticImageData;
  alt: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Which part of the photo to keep in view, e.g. "center 30%" */
  focus?: string;
};

export function PageHero({
  image,
  alt,
  eyebrow,
  title,
  intro,
  focus = "center",
}: PageHeroProps) {
  return (
    <section className="relative isolate flex h-[62svh] max-h-[680px] min-h-[440px] items-end overflow-hidden">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="100vw"
        placeholder="blur"
        loading="eager"
        fetchPriority="high"
        className="-z-10 object-cover motion-safe:animate-drift"
        style={{ objectPosition: focus }}
      />
      <div
        className="absolute inset-0 -z-10 bg-amber/15 mix-blend-multiply"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/45 to-night/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-night/65 via-night/20 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-night to-transparent"
        aria-hidden="true"
      />

      <div className="page-container pb-14 lg:pb-20">
        <p className="section-label">{eyebrow}</p>
        <h1 className="mt-4 max-w-6xl font-serif text-5xl font-semibold leading-[0.95] text-balance sm:text-7xl lg:text-8xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-3xl font-serif text-2xl italic text-glow/85 sm:text-3xl">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
