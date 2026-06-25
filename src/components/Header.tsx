"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { nav, site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ink/90 backdrop-blur border-b border-ink-600"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-tight">
          Boston<span className="fire-text">Blore</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ash transition-colors hover:text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/login" variant="ghost" size="md">
            Client Login
          </ButtonLink>
          <ButtonLink href="/signup" variant="primary" size="md">
            Start Coaching
          </ButtonLink>
        </div>

        <button
          className="lg:hidden text-bone"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-600 bg-ink/95 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-ash hover:bg-ink-700 hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <ButtonLink href="/login" variant="outline" size="lg" onClick={() => setOpen(false)}>
                Client Login
              </ButtonLink>
              <ButtonLink href="/signup" variant="primary" size="lg" onClick={() => setOpen(false)}>
                Start Coaching
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
