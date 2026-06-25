"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/coach", label: "Overview", icon: "⊞" },
  { href: "/coach/clients", label: "Clients", icon: "👥" },
  { href: "/coach/checkins", label: "Check-Ins", icon: "✅" },
  { href: "/coach/messages", label: "Messages", icon: "💬" },
];

export function CoachNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-600 bg-ink-800 lg:flex">
      <div className="border-b border-ink-600 px-5 py-5">
        <Link href="/" className="font-display text-lg font-bold uppercase">
          Boston<span className="fire-text">Blore</span>
        </Link>
        <p className="mt-0.5 text-xs text-ember font-semibold uppercase tracking-widest">Coach Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/coach" && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-ember/15 text-ember" : "text-ash hover:bg-ink-700 hover:text-bone"}`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-600 px-4 py-4">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-2 text-xs text-ash hover:text-ember">Sign out</button>
      </div>
    </aside>
  );
}
