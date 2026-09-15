import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/BookCover";
import { FindACopy } from "@/components/FindACopy";
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

      <nav aria-label="Moods" className="border-b border-ink/10 bg-parchment">
        <ul className="page-container flex gap-3 overflow-x-auto py-4">
          <li className="shrink-0">
            <Link
              href="/book-finder"
              className="block rounded-full border border-ink/20 px-4 py-2 text-sm whitespace-nowrap transition-colors hover:border-ember hover:text-ember"
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
                  className={`block rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                    active
                      ? "border-night bg-night text-glow"
                      : "border-ink/20 hover:border-ember hover:text-ember"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="page-container py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-ember">
          {books.length} {books.length === 1 ? "book" : "books"} for this mood
        </p>

        <ul className="mt-10 grid gap-x-12 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <li key={book.isbn}>
              <article className="flex h-full flex-col">
                <BookCover
                  isbn={book.isbn}
                  title={book.title}
                  author={book.author}
                  available={book.coverAvailable}
                  sizes="200px"
                  className="w-full max-w-[200px]"
                />
                <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-balance">
                  {book.title}
                </h2>
                <p className="mt-1 text-ink-soft">{book.author}</p>
                <p className="mt-4 font-serif text-xl italic leading-snug">
                  “{book.reason}”
                </p>
                {book.mention && (
                  <p className="mt-4 text-sm text-ink-soft">
                    Roshi talks about it in{" "}
                    <Link
                      href={book.mention.href}
                      className="text-ember underline decoration-ember/30 underline-offset-4 hover:decoration-ember"
                    >
                      {book.mention.label}
                    </Link>
                  </p>
                )}
                <FindACopy isbn={book.isbn} className="mt-6" />
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
