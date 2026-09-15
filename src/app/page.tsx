import Link from "next/link";
import heroPoster from "@/assets/photos/hero-rain-poster.jpg";
import { HeroVideo } from "@/components/HeroVideo";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="relative isolate flex h-[min(88svh,820px)] min-h-[560px] items-end overflow-hidden bg-night">
        <HeroVideo
          poster={heroPoster}
          alt="Raindrops on a window glowing in warm evening light"
          desktopSrc="/videos/hero-rain-1080.mp4"
          mobileSrc="/videos/hero-rain-540.mp4"
        />
        <div
          className="absolute inset-0 -z-10 bg-lamplight/25 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/55 to-night/45"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-r from-night/70 via-night/25 to-transparent"
          aria-hidden="true"
        />

        <div className="page-container pb-16 sm:pb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-lamplight sm:text-sm">
            Book club · Video picks
            <span className="hidden sm:inline"> · Reading nook</span>
          </p>
          <h1 className="mt-4 max-w-5xl font-serif text-6xl font-semibold leading-[0.95] text-balance text-glow sm:text-8xl lg:text-9xl">
            {site.name}
          </h1>
          <p className="mt-6 max-w-3xl font-serif text-2xl italic text-glow/85 sm:text-3xl lg:text-4xl">
            {site.tagline}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/this-months-pick"
              className="rounded-full bg-glow px-7 py-3.5 text-center font-semibold text-night transition-colors hover:bg-white"
            >
              This month’s pick
            </Link>
            <Link
              href="/book-finder"
              className="rounded-full border border-glow/60 px-7 py-3.5 text-center font-semibold text-glow transition-colors hover:bg-glow/10"
            >
              Find a book for your mood
            </Link>
          </div>
        </div>
      </section>

      <section className="page-container py-20 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 className="font-serif text-4xl font-semibold sm:text-5xl lg:text-7xl">
            Pull up a chair
          </h2>
          <p className="text-lg text-ink-soft lg:text-xl">
            Put the kettle on and stay a while. Here you’ll find the book the
            club is reading this month, every book from Roshi’s videos, and a
            finder that matches books to your mood.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-3 lg:gap-16">
          {site.nav.slice(0, 3).map((item) => (
            <li key={item.href} className="border-t border-ink/15 pt-6">
              <Link href={item.href} className="group block">
                <h3 className="font-serif text-2xl font-semibold group-hover:text-ember">
                  {item.label} →
                </h3>
                <p className="mt-2 text-ink-soft">{item.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
