"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-20 bg-night text-glow">
      <div className="page-container flex h-20 items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-serif text-2xl font-semibold tracking-wide transition-colors hover:text-gold sm:text-3xl"
        >
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-sc text-lg lowercase tracking-[0.18em] transition-colors ${
                      active
                        ? "text-gold underline decoration-gold/50 underline-offset-8"
                        : "text-glow-soft hover:text-glow"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="flex items-center gap-2 rounded-full bg-hearth px-4 py-2 font-sc text-base lowercase tracking-[0.15em] text-glow md:hidden"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="fill-none stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M3 3l10 10M13 3L3 13" />
            ) : (
              <path d="M2 4h12M2 8h12M2 12h12" />
            )}
          </svg>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="page-container pb-8 md:hidden">
          <ul className="flex flex-col gap-1">
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`block py-3 font-serif text-3xl ${
                      active ? "text-gold" : "text-glow"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
