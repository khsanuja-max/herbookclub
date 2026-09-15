import Image from "next/image";
import Link from "next/link";
import candlePhoto from "@/assets/photos/candle-plaid-blanket.jpg";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-night text-glow">
      <Image
        src={candlePhoto}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover opacity-40"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-b from-night via-night/85 to-night/60"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl font-semibold">{site.name}</p>
          <p className="mt-2 font-serif text-xl italic text-glow/80">
            {site.tagline}
          </p>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.25em] text-lamplight">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-glow/85 transition-colors hover:text-glow"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.25em] text-lamplight">
            Watch
          </h2>
          <a
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-glow/85 transition-colors hover:text-glow"
          >
            Roshi on YouTube ↗
          </a>
        </div>
      </div>

      <div className="border-t border-glow/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-glow/60 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>
            Photos from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-glow/30 underline-offset-4 hover:text-glow"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
