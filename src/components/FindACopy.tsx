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
      <h3 className="section-label">Find a copy</h3>
      <ul className="mt-4 space-y-4">
        {findCopyLinks(isbn).map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <span className="flex items-baseline gap-2 font-serif text-xl font-semibold text-glow transition-colors group-hover:text-gold">
                {link.label}
                <span aria-hidden="true" className="text-sm text-amber">
                  ↗
                </span>
              </span>
              <span className="block text-sm text-glow-soft">{link.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
