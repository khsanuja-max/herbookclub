import Image from "next/image";
import Link from "next/link";
import heroPoster from "@/assets/photos/hero-rain-poster.jpg";
import { AmberRule } from "@/components/AmberRule";
import { BookCover } from "@/components/BookCover";
import { CandleGlow } from "@/components/CandleGlow";
import { HeroVideo } from "@/components/HeroVideo";
import { Lamplight } from "@/components/Lamplight";
import { MoodGrid } from "@/components/MoodGrid";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { bookAnchor, hasCover } from "@/lib/books";
import {
  formatDate,
  getAbout,
  getMoods,
  getThisMonthsPick,
  getVideos,
  type VideoBook,
  type VideoCompanion,
} from "@/lib/content";
import { getPhoto } from "@/lib/photos";
import { site } from "@/lib/site";
import { primaryButton, textLink } from "@/lib/styles";
import { getWallTeaser } from "@/lib/wall";

const SHELF_SIZE = 8;

/** Where each cover sits in the Book Wall teaser: position, tilt, and how far it drifts on hover. */
const TEASER_LAYOUT = [
  { left: "3%", top: "20%", rotate: -9, dx: -10, dy: -6 },
  { left: "19%", top: "3%", rotate: 6, dx: -6, dy: -12 },
  { left: "38%", top: "22%", rotate: -4, dx: 0, dy: -8 },
  { left: "56%", top: "5%", rotate: 8, dx: 8, dy: -12 },
  { left: "73%", top: "24%", rotate: -7, dx: 12, dy: -4 },
  { left: "12%", top: "50%", rotate: 5, dx: -10, dy: 10 },
  { left: "50%", top: "52%", rotate: -10, dx: 8, dy: 12 },
];

/**
 * Books from the video pages for "Recently on the shelf", with no repeats.
 * Books not already shown under "Latest video" come first, so the two sections
 * don't show the same covers side by side.
 */
function buildShelf(videos: VideoCompanion[], latestIsbns: Set<string>) {
  const seen = new Set<string>();
  const books: (VideoBook & { href: string })[] = [];

  for (const video of videos) {
    for (const book of video.books) {
      if (seen.has(book.isbn)) continue;
      seen.add(book.isbn);
      books.push({
        ...book,
        href: `/videos/${video.slug}#${bookAnchor(book.isbn)}`,
      });
    }
  }

  const fresh = books.filter((book) => !latestIsbns.has(book.isbn));
  const repeats = books.filter((book) => latestIsbns.has(book.isbn));
  return [...fresh, ...repeats].slice(0, SHELF_SIZE);
}

export default async function Home() {
  const [pick, videos, moods, about, wall] = await Promise.all([
    getThisMonthsPick(),
    getVideos(),
    getMoods(),
    getAbout(),
    getWallTeaser(TEASER_LAYOUT.length),
  ]);

  const latest = videos.at(0);
  const latestIsbns = new Set(latest?.books.map((book) => book.isbn));
  const shelf = buildShelf(videos, latestIsbns);

  const [pickCover, latestCovers, shelfCovers] = await Promise.all([
    hasCover(pick.isbn),
    Promise.all((latest?.books ?? []).map((book) => hasCover(book.isbn))),
    Promise.all(shelf.map((book) => hasCover(book.isbn))),
  ]);

  const aboutPhoto = getPhoto(about.photo);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate flex h-[75svh] min-h-[640px] items-end overflow-hidden">
        <HeroVideo
          poster={heroPoster}
          alt="Raindrops on a window glowing in warm evening light"
          desktopSrc="/videos/hero-rain-1080.mp4"
          mobileSrc="/videos/hero-rain-540.mp4"
        />
        <div
          className="absolute inset-0 -z-10 bg-amber/25 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/35 to-night/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-r from-night/60 via-night/15 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-night to-transparent"
          aria-hidden="true"
        />
        <CandleGlow className="-left-[15%] bottom-0 -z-10 h-3/4" />

        <div className="page-container pb-28 sm:pb-32">
          <p className="section-label">
            Book club · Video picks
            <span className="hidden sm:inline"> · Reading nook</span>
          </p>
          <h1 className="mt-5 font-serif text-6xl font-semibold leading-[0.9] text-balance sm:text-8xl lg:text-9xl 2xl:text-[9.5rem]">
            {site.name}
          </h1>
          <p className="mt-8 max-w-3xl font-serif text-2xl italic text-glow/85 sm:text-3xl lg:text-4xl">
            {site.tagline}
          </p>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <Link href="/this-months-pick" className={primaryButton}>
              This month’s pick
            </Link>
            <Link href="/book-finder" className={`${textLink} self-center`}>
              Find a book for your mood →
            </Link>
          </div>
        </div>

        <a
          href="#pull-up-a-chair"
          aria-label="Scroll down"
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-glow/70 transition-colors hover:text-gold"
        >
          <span className="font-sc text-sm lowercase tracking-[0.3em]">
            Scroll
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="fill-none stroke-current motion-safe:animate-nudge"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* Opening */}
      <section
        id="pull-up-a-chair"
        className="relative isolate py-24 lg:py-36"
      >
        <Lamplight glow="right" />
        <div className="reveal page-container grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div>
            <p className="section-label">Welcome</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
              Pull up a chair
            </h2>
            <AmberRule className="mt-10 w-40" />
          </div>
          <p className="drop-cap font-serif text-2xl leading-relaxed text-glow/90 lg:mt-4 lg:text-3xl">
            Put the kettle on and stay a while. Here you’ll find the book the
            club is reading this month, every book from Roshi’s videos, and a
            finder that matches books to your mood.
          </p>
        </div>
      </section>

      {/* 2. This Month's Pick */}
      <section id="pick" className="relative isolate py-24 lg:py-36">
        <Lamplight glow="left" wash />
        <div className="reveal page-container grid items-center gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-28">
          <BookCover
            isbn={pick.isbn}
            title={pick.title}
            author={pick.author}
            available={pickCover}
            sizes="(min-width: 768px) 340px, 260px"
            className="mx-auto w-full max-w-[260px] md:max-w-[340px]"
          />
          <div>
            <p className="section-label">
              This month’s pick · {pick.month}
            </p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-8xl">
              {pick.title}
            </h2>
            <p className="mt-5 font-serif text-2xl italic text-glow-soft lg:text-3xl">
              by {pick.author}
            </p>
            <AmberRule className="mt-10 w-40" />
            <p className="mt-10 max-w-3xl font-serif text-3xl italic leading-snug text-gold lg:text-4xl">
              “{pick.headline}”
            </p>
            <Link href="/this-months-pick" className={`${primaryButton} mt-12`}>
              Read Roshi’s review
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Moods */}
      <section id="moods" className="relative isolate py-24 lg:py-36">
        <Lamplight glow="center" />
        <div className="page-container">
          <div className="reveal">
            <p className="section-label">Find a book for your mood</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
              How do you want to feel?
            </h2>
            <p className="mt-6 max-w-3xl font-serif text-2xl italic text-glow-soft lg:text-3xl">
              Skip the genres. Choose a mood and find your next book.
            </p>
            <AmberRule className="mt-10 w-40" />
          </div>
          <div className="reveal mt-16">
            <MoodGrid moods={moods} />
          </div>
        </div>
      </section>

      {/* Literary interlude */}
      <section id="quote" className="relative isolate overflow-hidden py-28 lg:py-44">
        <CandleGlow className="top-0 left-1/2 -z-10 h-full -translate-x-1/2" />
        <figure className="reveal page-container text-center">
          <AmberRule align="center" className="mx-auto w-40" />
          <blockquote className="mt-12 font-serif text-4xl italic leading-[1.15] text-balance sm:text-6xl lg:text-7xl">
            <p>
              “There is no Frigate like a Book
              <br />
              To take us Lands away”
            </p>
          </blockquote>
          <figcaption className="section-label mt-10">Emily Dickinson</figcaption>
          <AmberRule align="center" className="mx-auto mt-12 w-40" />
        </figure>
      </section>

      {/* The Book Wall teaser */}
      <section id="book-wall" className="relative isolate overflow-hidden py-24 lg:py-36">
        <Lamplight glow="left" wash />
        <div className="reveal page-container grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div>
            <p className="section-label">Every book, one wall</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
              The Book Wall
            </h2>
            <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-glow-soft lg:text-3xl">
              All {wall.total} books from Roshi’s videos and picks on one wall.
              Pick them up, push them around and see where they land.
            </p>
            <AmberRule className="mt-10 w-40" />
            <Link href="/book-wall" className={`${primaryButton} mt-12`}>
              Open the Book Wall
            </Link>
          </div>

          <Link
            href="/book-wall"
            tabIndex={-1}
            aria-hidden="true"
            className="group relative isolate mx-auto block aspect-[4/3] w-full max-w-2xl"
          >
            <div
              aria-hidden="true"
              className="wall-surface fade-edges pointer-events-none absolute inset-0 -z-10"
            />
            {wall.covers.map((book, index) => {
              const spot = TEASER_LAYOUT[index];
              return (
                <div
                  key={book.isbn}
                  className="absolute w-[24%] [transform:rotate(var(--tilt))] transition-transform duration-700 ease-out group-hover:[transform:translate(var(--dx),var(--dy))_rotate(var(--tilt))] motion-reduce:transition-none"
                  style={
                    {
                      left: spot.left,
                      top: spot.top,
                      // The first cover (this month's pick) sits on top of the pile
                      zIndex: wall.covers.length - index,
                      "--tilt": `${spot.rotate}deg`,
                      "--dx": `${spot.dx}px`,
                      "--dy": `${spot.dy}px`,
                    } as React.CSSProperties
                  }
                >
                  <BookCover
                    isbn={book.isbn}
                    title={book.title}
                    author={book.author}
                    available={book.coverAvailable}
                    sizes="(min-width: 1024px) 170px, 24vw"
                  />
                </div>
              );
            })}
          </Link>
        </div>
      </section>

      {/* 4. Latest video */}
      {latest && (
        <section id="latest-video" className="relative isolate py-24 lg:py-36">
          <Lamplight glow="right" wash />
          <div className="reveal page-container grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
            <Link
              href={`/videos/${latest.slug}`}
              className="group block"
              aria-label={`Watch: ${latest.title}`}
            >
              <VideoThumbnail
                videoId={latest.youtubeVideoId}
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </Link>
            <div>
              <p className="section-label">
                Latest video ·{" "}
                <time dateTime={latest.date}>{formatDate(latest.date)}</time>
              </p>
              <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                <Link
                  href={`/videos/${latest.slug}`}
                  className="transition-colors hover:text-gold"
                >
                  {latest.title}
                </Link>
              </h2>
              <p className="mt-6 font-serif text-2xl italic leading-snug text-glow-soft">
                {latest.summary}
              </p>

              <p className="section-label mt-10">Books in this video</p>
              <ul className="mt-5 flex flex-wrap gap-4">
                {latest.books.map((book, index) => (
                  <li key={book.isbn} className="w-16 sm:w-20">
                    <Link
                      href={`/videos/${latest.slug}#${bookAnchor(book.isbn)}`}
                      className="block transition-transform hover:-translate-y-1"
                    >
                      <BookCover
                        isbn={book.isbn}
                        title={book.title}
                        author={book.author}
                        available={latestCovers[index]}
                        sizes="80px"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link href={`/videos/${latest.slug}`} className={`${textLink} mt-10`}>
                See all the books →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Recently on the shelf */}
      {shelf.length > 0 && (
        <section id="shelf" className="relative isolate py-24 lg:py-36">
          <Lamplight glow="left" />
          <div className="page-container">
            <div className="reveal flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="section-label">From Roshi’s videos</p>
                <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
                  Recently on the shelf
                </h2>
              </div>
              <Link href="/videos" className={textLink}>
                All videos →
              </Link>
            </div>

            <ul className="reveal fade-x shelf-scroll mt-16 flex snap-x snap-mandatory scroll-px-[8%] gap-8 overflow-x-auto px-[8%] pb-8 lg:gap-12">
              {shelf.map((book, index) => (
                <li key={book.isbn} className="w-36 shrink-0 snap-start sm:w-44 lg:w-52">
                  <Link href={book.href} className="group block">
                    <BookCover
                      isbn={book.isbn}
                      title={book.title}
                      author={book.author}
                      available={shelfCovers[index]}
                      sizes="(min-width: 1024px) 208px, 176px"
                      className="transition-transform duration-500 group-hover:-translate-y-2 motion-reduce:transition-none"
                    />
                    <p className="mt-6 font-serif text-xl font-semibold leading-tight text-balance transition-colors group-hover:text-gold">
                      {book.title}
                    </p>
                    <p className="mt-1 font-serif text-base italic text-glow-soft">
                      {book.author}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 6. About teaser */}
      <section id="about-teaser" className="relative isolate py-24 lg:py-36">
        <Lamplight glow="right" wash />
        <div className="reveal page-container grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div className="fade-edges relative mx-auto aspect-[4/5] w-full max-w-md">
            <Image
              src={aboutPhoto.image}
              alt={aboutPhoto.alt}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
          <div>
            <p className="section-label">About the club</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
              {about.title}
            </h2>
            <AmberRule className="mt-10 w-40" />
            <p className="mt-10 max-w-3xl font-serif text-2xl italic leading-snug text-glow/90 lg:text-3xl">
              {about.summary}
            </p>
            <Link href="/about" className={`${textLink} mt-10`}>
              Read Roshi’s story →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
