import type { Metadata } from "next";
import { MoodTile } from "@/components/MoodTile";
import { PageHero } from "@/components/PageHero";
import { getMoods } from "@/lib/content";
import { getPhoto } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Book Finder",
  description:
    "Skip the genres. Choose how you want to feel and find your next book.",
};

export default async function BookFinderPage() {
  const moods = await getMoods();
  const lastTileAlone = moods.length % 2 === 1;

  return (
    <>
      <PageHero
        image={getPhoto("lamp-lit-bookshop-corner").image}
        alt={getPhoto("lamp-lit-bookshop-corner").alt}
        eyebrow="Mood-based book finder"
        title="How do you want to feel?"
        intro="Skip the genres. Pick a mood and find your next book."
        focus="center 60%"
      />

      <section className="page-container py-16 md:py-24">
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {moods.map((mood, index) => {
            const spansRow = lastTileAlone && index === moods.length - 1;
            return (
              <li
                key={mood.id}
                className={spansRow ? "col-span-2 lg:col-span-1" : undefined}
              >
                <MoodTile
                  href={`/book-finder/${mood.id}`}
                  label={mood.label}
                  line={mood.line}
                  photo={getPhoto(mood.photo)}
                  sizes={
                    spansRow
                      ? "(min-width: 1024px) 20vw, 100vw"
                      : "(min-width: 1024px) 20vw, 50vw"
                  }
                  aspect={
                    spansRow ? "aspect-video lg:aspect-[3/4]" : "aspect-[3/4]"
                  }
                />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
