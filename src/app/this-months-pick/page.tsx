import type { Metadata } from "next";
import mugPhoto from "@/assets/photos/steaming-mug-windowsill.jpg";
import { AmberRule } from "@/components/AmberRule";
import { BookCover } from "@/components/BookCover";
import { FindACopy } from "@/components/FindACopy";
import { Lamplight } from "@/components/Lamplight";
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

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="left" />
        <div className="page-container grid gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-28">
          <div className="md:sticky md:top-8 md:self-start">
            <div className="reveal">
              <BookCover
                isbn={pick.isbn}
                title={pick.title}
                author={pick.author}
                available={coverAvailable}
                sizes="(min-width: 768px) 360px, 260px"
                className="mx-auto w-full max-w-[260px] md:max-w-[360px]"
              />
              <FindACopy isbn={pick.isbn} className="mx-auto mt-14 max-w-[360px]" />
            </div>
          </div>

          <article className="reveal">
            <p className="section-label">Roshi’s review</p>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl lg:text-7xl">
              {pick.headline}
            </h2>
            <AmberRule className="mt-10 w-40" />
            <div className="mt-10 max-w-[70ch] space-y-6 text-lg leading-relaxed text-glow-soft lg:text-xl">
              {pick.review.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-10 font-serif text-3xl italic text-gold">— Roshi</p>
          </article>
        </div>
      </section>

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="right" wash />
        <div className="reveal page-container grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-24">
          <div>
            <p className="section-label">The video</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
              Watch the video
            </h2>
            <p className="mt-6 font-serif text-2xl italic text-glow-soft">
              Roshi’s spoiler-free thoughts on {pick.title}.
            </p>
          </div>
          <VideoEmbed
            videoId={pick.youtubeVideoId}
            title={`Roshi on ${pick.title}`}
          />
        </div>
      </section>
    </>
  );
}
