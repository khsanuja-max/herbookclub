import type { Metadata } from "next";
import { Lamplight } from "@/components/Lamplight";
import { MoodGrid } from "@/components/MoodGrid";
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
    </>
  );
}
