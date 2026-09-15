import Image from "next/image";
import Link from "next/link";
import candlePhoto from "@/assets/photos/candle-plaid-blanket.jpg";
import { site } from "@/lib/site";
import { AmberRule } from "./AmberRule";
import { Lamplight } from "./Lamplight";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden pt-10 text-glow">
      <Lamplight glow="center" />
      <Image
        src={candlePhoto}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        className="fade-edges -z-10 object-cover opacity-20"
      />

      <div className="page-container">
        <AmberRule align="center" />
      </div>

      <div className="page-container grid gap-12 py-20 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl font-semibold lg:text-5xl">
            {site.name}
          </p>
          <p className="mt-3 font-serif text-2xl italic text-glow-soft">
            {site.tagline}
          </p>
        </div>

        <div>
          <h2 className="section-label">Explore</h2>
          <ul className="mt-5 space-y-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-lg text-glow-soft transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="section-label">Watch</h2>
          <a
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-lg text-glow-soft transition-colors hover:text-gold"
          >
            Roshi on YouTube ↗
          </a>
        </div>
      </div>

      <div className="page-container pb-10">
        <AmberRule align="center" />
        <div className="mt-6 flex flex-col gap-2 text-sm text-glow-soft sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>
            Photos from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-glow-soft/40 underline-offset-4 hover:text-gold"
            >
              Unsplash
            </a>{" "}
            and{" "}
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-glow-soft/40 underline-offset-4 hover:text-gold"
            >
              Pexels
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
