import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import coffeePhoto from "@/assets/photos/coffee-book-autumn-leaves.jpg";
import { AmberRule } from "@/components/AmberRule";
import { BookCover } from "@/components/BookCover";
import { FindACopy } from "@/components/FindACopy";
import { Lamplight } from "@/components/Lamplight";
import { PageHero } from "@/components/PageHero";
import { VideoEmbed } from "@/components/VideoEmbed";
import { bookAnchor, hasCover } from "@/lib/books";
import { formatDate, getVideo, getVideos } from "@/lib/content";
import { textLink } from "@/lib/styles";

// Only the videos in /content/videos exist; any other address shows "not found".
export const dynamicParams = false;

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/videos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) return {};
  return { title: video.title, description: video.summary };
}

export default async function VideoCompanionPage({
  params,
}: PageProps<"/videos/[slug]">) {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) notFound();

  const coverFlags = await Promise.all(
    video.books.map((book) => hasCover(book.isbn)),
  );

  return (
    <>
      <PageHero
        image={coffeePhoto}
        alt="A cup of black coffee on an open book surrounded by autumn leaves"
        eyebrow={`Video companion · ${formatDate(video.date)}`}
        title={video.title}
        intro={`${video.books.length} books from this video, with Roshi’s notes and where to find each one.`}
        focus="center 45%"
      />

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="left" />
        <div className="reveal page-container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-24">
          <div>
            <p className="section-label">About this video</p>
            <p className="mt-6 font-serif text-3xl italic leading-snug text-balance sm:text-4xl lg:text-5xl">
              {video.summary}
            </p>
            <AmberRule className="mt-10 w-40" />
            <Link href="/videos" className={`${textLink} mt-10`}>
              ← All videos
            </Link>
          </div>
          <VideoEmbed videoId={video.youtubeVideoId} title={video.title} />
        </div>
      </section>

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="right" wash />
        <div className="page-container">
          <div className="reveal">
            <p className="section-label">The books</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
              Every book in this video
            </h2>
          </div>

          <ol className="mt-20 space-y-20 lg:space-y-28">
            {video.books.map((book, index) => (
              <li key={book.isbn} id={bookAnchor(book.isbn)} className="scroll-mt-8">
                {index > 0 && (
                  <AmberRule align="center" className="mb-20 lg:mb-28" />
                )}
                <div className="reveal grid gap-10 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-12 lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,280px)] lg:gap-16">
                  <BookCover
                    isbn={book.isbn}
                    title={book.title}
                    author={book.author}
                    available={coverFlags[index]}
                    sizes="(min-width: 1024px) 220px, 180px"
                    className="w-full max-w-[180px] lg:max-w-[220px]"
                  />

                  <div>
                    <p className="section-label">
                      Book {index + 1} of {video.books.length}
                    </p>
                    <h3 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl">
                      {book.title}
                    </h3>
                    <p className="mt-2 font-serif text-2xl italic text-glow-soft">
                      {book.author}
                    </p>
                    <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-glow/90 lg:text-xl">
                      {book.note}
                    </p>
                  </div>

                  <FindACopy
                    isbn={book.isbn}
                    className="sm:col-start-2 lg:col-start-auto"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
