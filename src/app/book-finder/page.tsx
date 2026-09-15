import type { Metadata } from "next";
import bookshopPhoto from "@/assets/photos/lamp-lit-bookshop-corner.jpg";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Book Finder",
};

export default function BookFinderPage() {
  return (
    <>
      <PageHero
        image={bookshopPhoto}
        alt="A lamp-lit reading corner in a bookshop, lined with shelves of books"
        eyebrow="Mood-based book finder"
        title="How do you want to feel?"
        intro="Skip the genres. Pick a mood and find your next book."
        focus="center 60%"
      />
      <ComingSoon>
        Comforting, mind-blowing, one-sitting, tear-jerking, up-all-night — the
        moods are being sorted. Check back soon.
      </ComingSoon>
    </>
  );
}
