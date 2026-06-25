"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const clientLinks = [
  { href: "/dashboard", label: "Overview", icon: "⊞" },
  { href: "/dashboard/training", label: "Training", icon: "💪" },
  { href: "/dashboard/nutrition", label: "Nutrition", icon: "🥗" },
  { href: "/dashboard/progress", label: "Progress", icon: "📈" },
  { href: "/dashboard/checkin", label: "Check-In", icon: "✅" },
  { href: "/dashboard/messages", label: "Messages", icon: "💬" },
];

export function DashboardNav({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-600 bg-ink-800 lg:flex">
        <div className="border-b border-ink-600 px-5 py-5">
          <Link href="/" className="font-display text-lg font-bold uppercase">
            Boston<span className="fire-text">Blore</span>
          </Link>
          <p className="mt-0.5 text-xs text-ash">Coaching Platform</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {clientLinks.map((l) => {
            const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-ember/15 text-ember" : "text-ash hover:bg-ink-700 hover:text-bone"
                }`}
              >
                <span className="text-base">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-ink-600 px-4 py-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-ash">{user.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 text-xs text-ash hover:text-ember"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-ink-600 bg-ink-800 lg:hidden">
        {clientLinks.slice(0, 5).map((l) => {
          const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition ${active ? "text-ember" : "text-ash"}`}
            >
              <span className="text-lg">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
