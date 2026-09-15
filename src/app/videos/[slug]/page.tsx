import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import coffeePhoto from "@/assets/photos/coffee-book-autumn-leaves.jpg";
import { BookCover } from "@/components/BookCover";
import { FindACopy } from "@/components/FindACopy";
import { PageHero } from "@/components/PageHero";
import { VideoEmbed } from "@/components/VideoEmbed";
import { bookAnchor, hasCover } from "@/lib/books";
import { formatDate, getVideo, getVideos } from "@/lib/content";

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

      <section className="page-container grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-24">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ember">
            About this video
          </p>
          <p className="mt-4 font-serif text-2xl leading-snug text-balance sm:text-3xl lg:text-4xl">
            {video.summary}
          </p>
          <Link
            href="/videos"
            className="mt-8 inline-block text-ember underline decoration-ember/30 underline-offset-4 hover:decoration-ember"
          >
            ← All videos
          </Link>
        </div>
        <VideoEmbed videoId={video.youtubeVideoId} title={video.title} />
      </section>

      <section className="bg-parchment">
        <div className="page-container py-16 md:py-24">
          <h2 className="font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl">
            The books
          </h2>

          <ol className="mt-12">
            {video.books.map((book, index) => (
              <li
                key={book.isbn}
                id={bookAnchor(book.isbn)}
                className="grid scroll-mt-8 gap-6 border-t border-ink/15 py-10 last:pb-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,300px)] lg:gap-16"
              >
                <BookCover
                  isbn={book.isbn}
                  title={book.title}
                  author={book.author}
                  available={coverFlags[index]}
                  sizes="(min-width: 1024px) 200px, 160px"
                  className="w-full max-w-[160px] lg:max-w-[200px]"
                />

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-ember">
                    Book {index + 1} of {video.books.length}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-lg text-ink-soft">{book.author}</p>
                  <p className="mt-5 max-w-[65ch] text-lg leading-relaxed lg:text-xl">
                    {book.note}
                  </p>
                </div>

                <FindACopy
                  isbn={book.isbn}
                  className="sm:col-start-2 lg:col-start-auto"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
