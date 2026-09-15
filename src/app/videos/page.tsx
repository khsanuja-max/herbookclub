import type { Metadata } from "next";
import Link from "next/link";
import coffeePhoto from "@/assets/photos/coffee-book-autumn-leaves.jpg";
import { BookCover } from "@/components/BookCover";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { bookAnchor, hasCover } from "@/lib/books";
import { formatDate, getVideos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Every book from every one of Roshi’s videos, with a note on each and where to buy or borrow it.",
};

export default async function VideosPage() {
  const videos = await getVideos();
  const coverFlags = await Promise.all(
    videos.map((video) =>
      Promise.all(video.books.map((book) => hasCover(book.isbn))),
    ),
  );

  return (
    <>
      <PageHero
        image={coffeePhoto}
        alt="A cup of black coffee on an open book surrounded by autumn leaves"
        eyebrow="Video companions"
        title="Every book from every video"
        intro="The full list of books from each video, with a note on each and where to buy or borrow it."
        focus="center 45%"
      />

      {videos.length === 0 ? (
        <ComingSoon>
          The shelves for each video are being stocked. Check back soon.
        </ComingSoon>
      ) : (
        <section className="page-container py-16 md:py-24">
          <ul className="divide-y divide-ink/15">
            {videos.map((video, index) => (
              <li
                key={video.slug}
                className="grid gap-8 py-12 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16"
              >
                <Link
                  href={`/videos/${video.slug}`}
                  className="group block"
                  aria-label={video.title}
                >
                  <VideoThumbnail
                    videoId={video.youtubeVideoId}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </Link>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-ember">
                    <time dateTime={video.date}>{formatDate(video.date)}</time>
                    {" · "}
                    {video.books.length} books
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
                    <Link
                      href={`/videos/${video.slug}`}
                      className="transition-colors hover:text-ember"
                    >
                      {video.title}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-[70ch] text-lg text-ink-soft lg:text-xl">
                    {video.summary}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-3">
                    {video.books.map((book, bookIndex) => (
                      <li key={book.isbn} className="w-16 sm:w-20">
                        <Link
                          href={`/videos/${video.slug}#${bookAnchor(book.isbn)}`}
                          className="block transition-transform hover:-translate-y-1"
                        >
                          <BookCover
                            isbn={book.isbn}
                            title={book.title}
                            author={book.author}
                            available={coverFlags[index][bookIndex]}
                            sizes="80px"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/videos/${video.slug}`}
                    className="mt-8 inline-block font-semibold text-ember underline decoration-ember/30 underline-offset-4 hover:decoration-ember"
                  >
                    See all the books →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
