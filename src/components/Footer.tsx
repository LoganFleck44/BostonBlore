import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-600 bg-ink-800">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="font-display text-2xl font-bold uppercase">
            Boston<span className="fire-text">Blore</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-ash">
            Drug-free results from a competitive natural athlete. Online training &
            nutrition coaching worldwide, with in-person training by enquiry.
          </p>
          <p className="mt-4 text-xs text-ash/60">Natural athlete · IFBB competitor</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-bone">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ash hover:text-ember">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-bone">
            Get Started
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/signup" className="text-ash hover:text-ember">
                Start Coaching
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-ash hover:text-ember">
                Book a Consult
              </Link>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-ash hover:text-ember">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="text-ash hover:text-ember">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="text-ash hover:text-ember">
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-600 px-5 py-5">
        <p className="mx-auto max-w-7xl text-xs text-ash">
          © {new Date().getFullYear()} {site.name}. All rights reserved. Natural athlete — no steroids, no shortcuts.
        </p>
      </div>
    </footer>
  );
}
