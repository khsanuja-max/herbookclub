import Link from "next/link";

export function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <p className="max-w-2xl font-serif text-2xl italic text-ink-soft sm:text-3xl">
        {children}
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-ember underline decoration-ember/30 underline-offset-4 hover:decoration-ember"
      >
        ← Back to the home page
      </Link>
    </section>
  );
}
