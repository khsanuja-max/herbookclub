import type { Metadata } from "next";
import mugPhoto from "@/assets/photos/steaming-mug-windowsill.jpg";
import { BookCover } from "@/components/BookCover";
import { PageHero } from "@/components/PageHero";
import { VideoEmbed } from "@/components/VideoEmbed";
import { findCopyLinks, hasCover } from "@/lib/books";
import { getThisMonthsPick } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const pick = await getThisMonthsPick();
  return {
    title: "This Month’s Pick",
    description: `${pick.month}: ${pick.title} by ${pick.author}. ${pick.headline}`,
  };
}

export default async function ThisMonthsPickPage() {
  const pick = await getThisMonthsPick();
  const coverAvailable = await hasCover(pick.isbn);
  const copyLinks = findCopyLinks(pick.isbn);

  return (
    <>
      <PageHero
        image={mugPhoto}
        alt="Steam rising from a mug beside an open book on a sunny windowsill"
        eyebrow={`This month’s pick · ${pick.month}`}
        title={pick.title}
        intro={`by ${pick.author}`}
        focus="center 70%"
      />

      <section className="page-container grid gap-12 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-24">
        <div className="md:sticky md:top-8 md:self-start">
          <BookCover
            isbn={pick.isbn}
            title={pick.title}
            author={pick.author}
            available={coverAvailable}
            sizes="(min-width: 768px) 360px, 260px"
            className="mx-auto w-full max-w-[260px] md:max-w-[360px]"
          />

          <div className="mx-auto mt-8 max-w-[360px]">
            <h2 className="text-xs uppercase tracking-[0.25em] text-ember">
              Find a copy
            </h2>
            <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
              {copyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-ember"
                  >
                    <span>
                      <span className="block font-semibold">{link.label}</span>
                      <span className="block text-sm text-ink-soft">
                        {link.note}
                      </span>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <article>
          <p className="text-xs uppercase tracking-[0.25em] text-ember">
            Roshi’s review
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            {pick.headline}
          </h2>
          <div className="mt-8 max-w-[80ch] space-y-5 text-lg leading-relaxed text-ink-soft lg:text-xl">
            {pick.review.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 font-serif text-2xl italic text-ink">— Roshi</p>
        </article>
      </section>

      <section className="bg-parchment">
        <div className="page-container grid gap-8 py-16 md:py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-24">
          <div>
            <h2 className="font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Watch the video
            </h2>
            <p className="mt-3 text-lg text-ink-soft lg:text-xl">
              Roshi’s spoiler-free thoughts on {pick.title}.
            </p>
          </div>
          <div>
            <VideoEmbed
              videoId={pick.youtubeVideoId}
              title={`Roshi on ${pick.title}`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
