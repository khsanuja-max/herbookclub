import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getAbout } from "@/lib/content";
import { getPhoto } from "@/lib/photos";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return { title: "About", description: about.summary };
}

export default async function AboutPage() {
  const about = await getAbout();
  const heroPhoto = getPhoto(about.photo);
  const [firstParagraph, ...otherParagraphs] = about.story;

  return (
    <>
      <PageHero
        image={heroPhoto.image}
        alt={heroPhoto.alt}
        eyebrow="About"
        title={about.title}
        intro={about.summary}
        focus="center 35%"
      />

      <section className="page-container grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <p className="text-xs uppercase tracking-[0.25em] text-ember lg:pt-4">
          The story
        </p>
        <div>
          {firstParagraph && (
            <p className="font-serif text-3xl leading-snug text-balance sm:text-4xl">
              {firstParagraph}
            </p>
          )}
          <div className="mt-8 max-w-[70ch] space-y-5 text-lg leading-relaxed text-ink-soft lg:text-xl">
            {otherParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 font-serif text-2xl italic text-ink">— Roshi</p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="page-container py-16 md:py-24">
          <h2 className="font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl">
            How the club works
          </h2>

          <ul className="mt-12 grid gap-10 md:grid-cols-3 lg:gap-12">
            {about.howItWorks.map((item) => {
              const photo = getPhoto(item.photo);
              return (
                <li key={item.href}>
                  <Link href={item.href} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-night">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        placeholder="blur"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl font-semibold leading-tight group-hover:text-ember">
                      {item.title} →
                    </h3>
                    <p className="mt-3 text-lg text-ink-soft">{item.text}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
