import type { Metadata } from "next";
import mugPhoto from "@/assets/photos/steaming-mug-windowsill.jpg";
import { BookCover } from "@/components/BookCover";
import { FindACopy } from "@/components/FindACopy";
import { PageHero } from "@/components/PageHero";
import { VideoEmbed } from "@/components/VideoEmbed";
import { hasCover } from "@/lib/books";
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
          <FindACopy isbn={pick.isbn} className="mx-auto mt-8 max-w-[360px]" />
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
