import type { Metadata } from "next";
import catPhoto from "@/assets/photos/cat-asleep-on-book.jpg";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={catPhoto}
        alt="A grey cat asleep with its chin resting on a thick book"
        eyebrow="About"
        title="About the club"
        intro="Who Roshi is, why she started the club, and how you can join in."
        focus="center 35%"
      />
      <ComingSoon>
        Roshi’s story is being written (the cat is supervising). Check back
        soon.
      </ComingSoon>
    </>
  );
}
