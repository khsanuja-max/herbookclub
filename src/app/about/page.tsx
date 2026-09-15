import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmberRule } from "@/components/AmberRule";
import { Lamplight } from "@/components/Lamplight";
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

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="left" />
        <div className="reveal page-container grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-24">
          <div>
            <p className="section-label lg:pt-4">The story</p>
            <AmberRule className="mt-6 w-32" />
          </div>
          <div>
            {firstParagraph && (
              <p className="font-serif text-3xl leading-snug text-balance sm:text-4xl lg:text-5xl">
                {firstParagraph}
              </p>
            )}
            <div className="mt-10 max-w-[70ch] space-y-6 text-lg leading-relaxed text-glow-soft lg:text-xl">
              {otherParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-10 font-serif text-3xl italic text-gold">— Roshi</p>
          </div>
        </div>
      </section>

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="right" wash />
        <div className="page-container">
          <div className="reveal">
            <p className="section-label">How it works</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
              How the club works
            </h2>
          </div>

          <ul className="mt-16 grid gap-16 md:grid-cols-3 lg:gap-12">
            {about.howItWorks.map((item) => {
              const photo = getPhoto(item.photo);
              return (
                <li key={item.href} className="reveal">
                  <Link href={item.href} className="group block">
                    <div className="fade-edges relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        placeholder="blur"
                        className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl font-semibold leading-tight transition-colors group-hover:text-gold lg:text-4xl">
                      {item.title} →
                    </h3>
                    <p className="mt-3 text-lg text-glow-soft">{item.text}</p>
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
