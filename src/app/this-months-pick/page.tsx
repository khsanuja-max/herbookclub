import type { Metadata } from "next";
import mugPhoto from "@/assets/photos/steaming-mug-windowsill.jpg";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "This Month’s Pick",
};

export default function ThisMonthsPickPage() {
  return (
    <>
      <PageHero
        image={mugPhoto}
        alt="Steam rising from a mug beside an open book on a sunny windowsill"
        eyebrow="This month’s pick"
        title="The book we’re all reading"
        intro="Roshi’s pick of the month, her review, and the video to go with it."
        focus="center 70%"
      />
      <ComingSoon>
        The kettle’s on and this month’s book is nearly ready. Check back soon.
      </ComingSoon>
    </>
  );
}
