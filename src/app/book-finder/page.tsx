import type { Metadata } from "next";
import Link from "next/link";
import { AmberRule } from "@/components/AmberRule";
import { Lamplight } from "@/components/Lamplight";
import { MoodGrid } from "@/components/MoodGrid";
import { PageHero } from "@/components/PageHero";
import { getMoods } from "@/lib/content";
import { getPhoto } from "@/lib/photos";
import { textLink } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Book Finder",
  description:
    "Skip the genres. Choose how you want to feel and find your next book.",
};

export default async function BookFinderPage() {
  const moods = await getMoods();
  const heroPhoto = getPhoto("lamp-lit-bookshop-corner");

  return (
    <>
      <PageHero
        image={heroPhoto.image}
        alt={heroPhoto.alt}
        eyebrow="Mood-based book finder"
        title="How do you want to feel?"
        intro="Skip the genres. Pick a mood and find your next book."
        focus="center 60%"
      />

      <section className="relative isolate py-20 md:py-32">
        <Lamplight glow="center" />
        <div className="reveal page-container">
          <MoodGrid moods={moods} />
        </div>
      </section>

      <section className="relative isolate pb-24 lg:pb-36">
        <div className="reveal page-container text-center">
          <AmberRule align="center" className="mx-auto w-40" />
          <p className="mt-10 font-serif text-3xl italic text-glow-soft sm:text-4xl">
            Not sure how you feel?
          </p>
          <Link href="/book-wall" className={`${textLink} mt-6`}>
            Wander the Book Wall instead →
          </Link>
        </div>
      </section>
    </>
  );
}
