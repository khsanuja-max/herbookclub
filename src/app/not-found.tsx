import Link from "next/link";
import { AmberRule } from "@/components/AmberRule";
import { Lamplight } from "@/components/Lamplight";
import { primaryButton } from "@/lib/styles";

export default function NotFound() {
  return (
    <section className="relative isolate flex flex-1 items-center py-32">
      <Lamplight glow="center" />
      <div className="page-container text-center">
        <p className="section-label">Page not found</p>
        <h1 className="mt-6 font-serif text-6xl font-semibold leading-[0.95] text-balance sm:text-8xl">
          This shelf is empty
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl italic text-glow-soft sm:text-3xl">
          The page you were looking for isn’t here. It may have moved, or the
          address may be mistyped.
        </p>
        <AmberRule align="center" className="mx-auto mt-12 w-40" />
        <Link href="/" className={`${primaryButton} mt-12`}>
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
