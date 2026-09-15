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
    <section className="relative isolate flex h-[48svh] max-h-[520px] min-h-[340px] items-end overflow-hidden bg-night">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="100vw"
        placeholder="blur"
        loading="eager"
        fetchPriority="high"
        className="-z-10 object-cover"
        style={{ objectPosition: focus }}
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/60 to-night/15"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-lamplight">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-balance text-glow sm:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-xl text-lg text-glow/85">{intro}</p>
        )}
      </div>
    </section>
  );
}
