import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmberRule } from "@/components/AmberRule";
import { BookCover } from "@/components/BookCover";
import { FindACopy } from "@/components/FindACopy";
import { Lamplight } from "@/components/Lamplight";
import { PageHero } from "@/components/PageHero";
import { hasCover } from "@/lib/books";
import { getBookMention, getMood, getMoods } from "@/lib/content";
import { getPhoto } from "@/lib/photos";

// Only the moods in content/moods.json exist; any other address shows "not found".
export const dynamicParams = false;

export async function generateStaticParams() {
  const moods = await getMoods();
  return moods.map((mood) => ({ mood: mood.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/book-finder/[mood]">): Promise<Metadata> {
  const { mood: id } = await params;
  const mood = await getMood(id);
  if (!mood) return {};
  return {
    title: `${mood.label} · Book Finder`,
    description: mood.line,
  };
}

export default async function MoodPage({
  params,
}: PageProps<"/book-finder/[mood]">) {
  const { mood: id } = await params;
  const [mood, moods] = await Promise.all([getMood(id), getMoods()]);
  if (!mood) notFound();

  const photo = getPhoto(mood.photo);
  const books = await Promise.all(
    mood.books.map(async (book) => ({
      ...book,
      coverAvailable: await hasCover(book.isbn),
      mention: await getBookMention(book.isbn),
    })),
  );

  return (
    <>
      <PageHero
        image={photo.image}
        alt={photo.alt}
        eyebrow="Book Finder"
        title={mood.label}
        intro={mood.line}
      />

      <nav aria-label="Moods">
        <ul className="page-container shelf-scroll flex gap-8 overflow-x-auto py-6 lg:gap-10">
          <li className="shrink-0">
            <Link
              href="/book-finder"
              className="font-sc text-lg lowercase tracking-[0.15em] whitespace-nowrap text-glow-soft transition-colors hover:text-gold"
            >
              ← All moods
            </Link>
          </li>
          {moods.map((item) => {
            const active = item.id === mood.id;
            return (
              <li key={item.id} className="shrink-0">
                <Link
                  href={`/book-finder/${item.id}`}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`font-sc text-lg lowercase tracking-[0.15em] whitespace-nowrap transition-colors ${
                    active
                      ? "text-gold underline decoration-gold/60 underline-offset-8"
                      : "text-glow-soft hover:text-glow"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="page-container">
          <AmberRule align="center" />
        </div>
      </nav>

      <section className="relative isolate py-20 md:py-28">
        <Lamplight glow="right" />
        <div className="page-container">
          <p className="section-label">
            {books.length} {books.length === 1 ? "book" : "books"} for this mood
          </p>

          <ul className="mt-14 grid gap-x-16 gap-y-24 sm:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <li key={book.isbn} className="reveal">
                <article className="flex h-full flex-col">
                  <BookCover
                    isbn={book.isbn}
                    title={book.title}
                    author={book.author}
                    available={book.coverAvailable}
                    sizes="220px"
                    className="w-full max-w-[220px]"
                  />
                  <h2 className="mt-8 font-serif text-4xl font-semibold leading-[1.05] text-balance">
                    {book.title}
                  </h2>
                  <p className="mt-2 font-serif text-xl italic text-glow-soft">
                    {book.author}
                  </p>
                  <p className="mt-5 font-serif text-2xl italic leading-snug text-glow">
                    “{book.reason}”
                  </p>
                  {book.mention && (
                    <p className="mt-5 text-glow-soft">
                      Roshi talks about it in{" "}
                      <Link
                        href={book.mention.href}
                        className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-glow"
                      >
                        {book.mention.label}
                      </Link>
                    </p>
                  )}
                  <FindACopy isbn={book.isbn} className="mt-8" />
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
