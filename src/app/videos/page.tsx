import type { Metadata } from "next";
import Link from "next/link";
import coffeePhoto from "@/assets/photos/coffee-book-autumn-leaves.jpg";
import { AmberRule } from "@/components/AmberRule";
import { BookCover } from "@/components/BookCover";
import { ComingSoon } from "@/components/ComingSoon";
import { Lamplight } from "@/components/Lamplight";
import { PageHero } from "@/components/PageHero";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { bookAnchor, hasCover } from "@/lib/books";
import { formatDate, getVideos } from "@/lib/content";
import { textLink } from "@/lib/styles";

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
        <section className="relative isolate py-20 md:py-32">
          <Lamplight glow="right" />
          <ul className="page-container space-y-20 lg:space-y-28">
            {videos.map((video, index) => (
              <li key={video.slug}>
                {index > 0 && (
                  <AmberRule align="center" className="mb-20 lg:mb-28" />
                )}
                <div className="reveal grid items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
                  <Link
                    href={`/videos/${video.slug}`}
                    className="group block"
                    aria-label={video.title}
                  >
                    <VideoThumbnail
                      videoId={video.youtubeVideoId}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </Link>

                  <div>
                    <p className="section-label">
                      <time dateTime={video.date}>{formatDate(video.date)}</time>
                      {" · "}
                      {video.books.length} books
                    </p>
                    <h2 className="mt-5 font-serif text-4xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                      <Link
                        href={`/videos/${video.slug}`}
                        className="transition-colors hover:text-gold"
                      >
                        {video.title}
                      </Link>
                    </h2>
                    <p className="mt-6 max-w-[60ch] font-serif text-2xl italic leading-snug text-glow-soft">
                      {video.summary}
                    </p>

                    <ul className="mt-8 flex flex-wrap gap-4">
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

                    <Link href={`/videos/${video.slug}`} className={`${textLink} mt-10`}>
                      See all the books →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
