import type { Metadata } from "next";
import coffeePhoto from "@/assets/photos/coffee-book-autumn-leaves.jpg";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Videos",
};

export default function VideosPage() {
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
      <ComingSoon>
        The shelves for each video are being stocked. Check back soon.
      </ComingSoon>
    </>
  );
}
