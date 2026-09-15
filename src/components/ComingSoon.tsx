import Link from "next/link";

export function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <section className="page-container py-20 lg:py-28">
      <p className="max-w-4xl font-serif text-2xl italic text-ink-soft sm:text-3xl lg:text-4xl">
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
