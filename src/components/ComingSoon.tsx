import Link from "next/link";
import { textLink } from "@/lib/styles";
import { Lamplight } from "./Lamplight";

export function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative isolate py-24 lg:py-36">
      <Lamplight glow="left" />
      <div className="reveal page-container">
        <p className="max-w-4xl font-serif text-3xl italic leading-snug text-glow-soft sm:text-4xl lg:text-5xl">
          {children}
        </p>
        <Link href="/" className={`${textLink} mt-10`}>
          ← Back to the home page
        </Link>
      </div>
    </section>
  );
}
