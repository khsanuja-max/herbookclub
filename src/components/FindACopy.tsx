import { findCopyLinks } from "@/lib/books";

export function FindACopy({
  isbn,
  className = "",
}: {
  isbn: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs uppercase tracking-[0.25em] text-ember">
        Find a copy
      </h3>
      <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
        {findCopyLinks(isbn).map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-ember"
            >
              <span>
                <span className="block font-semibold">{link.label}</span>
                <span className="block text-sm text-ink-soft">{link.note}</span>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
