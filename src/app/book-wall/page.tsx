import type { Metadata } from "next";
import { AmberRule } from "@/components/AmberRule";
import { BookWall } from "@/components/BookWall";
import { Lamplight } from "@/components/Lamplight";
import { getWallBooks } from "@/lib/wall";

export const metadata: Metadata = {
  title: "The Book Wall",
  description:
    "Every book from Roshi’s videos and monthly picks on one wall. Pick them up, move them around and open one to find your next read.",
};

export default async function BookWallPage() {
  const books = await getWallBooks();

  return (
    <>
      <section className="relative isolate pt-16 pb-10 lg:pt-24 lg:pb-14">
        <Lamplight glow="left" />
        <div className="page-container grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <p className="section-label">Every book, one wall</p>
            <h1 className="mt-5 font-serif text-6xl font-semibold leading-[0.9] sm:text-8xl lg:text-9xl">
              The Book Wall
            </h1>
          </div>
          <div>
            <p className="font-serif text-2xl italic leading-snug text-glow-soft lg:text-3xl">
              Every book from Roshi’s videos and monthly picks, all in one
              place. Pick one up and move it around — the others will make
              room.
            </p>
            <p className="mt-4 text-glow-soft">
              Click or tap a cover to open it.
            </p>
            <AmberRule className="mt-8 w-40" />
          </div>
        </div>
      </section>

      <section
        aria-label="The Book Wall"
        data-book-previews={books.filter((book) => book.preview.hasPreview).length}
        className="relative isolate pb-24 lg:pb-36"
      >
        <div className="page-container">
          <BookWall books={books} />
          <p className="mt-6 text-center font-sc text-base lowercase tracking-[0.2em] text-glow-soft">
            {books.length} books on the wall
          </p>
        </div>
      </section>
    </>
  );
}
