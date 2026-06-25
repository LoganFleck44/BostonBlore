import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function CoachOverviewPage() {
  const session = await auth();

  const [clients, pendingCheckIns, unreadMessages] = await Promise.all([
    db.user.count({ where: { role: "client" } }),
    db.checkIn.count({ where: { trainerReply: null } }),
    db.message.count({ where: { to: { role: "trainer" }, isRead: false } }),
  ]);

  const recentClients = await db.user.findMany({
    where: { role: "client" },
    include: { profile: true, checkIns: { orderBy: { date: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold uppercase">
        Coach Dashboard
      </h1>
      <p className="mb-8 text-ash">Here's what needs your attention today.</p>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-ink-600 bg-ink-700 p-5">
          <p className="text-xs uppercase tracking-widest text-ash">Total Clients</p>
          <p className="mt-1 font-display text-3xl font-bold fire-text">{clients}</p>
        </div>
        <Link href="/coach/checkins" className="rounded-xl border bg-ink-700 p-5 transition hover:border-ember/50 border-ink-600">
          <p className="text-xs uppercase tracking-widest text-ash">Pending Check-Ins</p>
          <p className={`mt-1 font-display text-3xl font-bold ${pendingCheckIns > 0 ? "text-ember" : "text-bone"}`}>{pendingCheckIns}</p>
          {pendingCheckIns > 0 && <p className="text-xs text-ember">Need your reply →</p>}
        </Link>
        <Link href="/coach/messages" className="rounded-xl border bg-ink-700 p-5 transition hover:border-ember/50 border-ink-600">
          <p className="text-xs uppercase tracking-widest text-ash">Unread Messages</p>
          <p className={`mt-1 font-display text-3xl font-bold ${unreadMessages > 0 ? "text-ember" : "text-bone"}`}>{unreadMessages}</p>
          {unreadMessages > 0 && <p className="text-xs text-ember">New messages →</p>}
        </Link>
      </div>

      {/* Recent clients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold uppercase">Recent Clients</h2>
          <Link href="/coach/clients" className="text-sm text-ember hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {recentClients.map((c) => {
            const lastCheckIn = c.checkIns[0];
            const daysSince = lastCheckIn ? Math.floor((Date.now() - new Date(lastCheckIn.date).getTime()) / 86400000) : null;
            return (
              <Link key={c.id} href={`/coach/clients/${c.id}`}
                className="flex items-center justify-between rounded-xl border border-ink-600 bg-ink-700 px-5 py-4 hover:border-ember/40 transition">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ash">{c.profile?.goal ?? "No goal set"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ash">
                    {daysSince === null ? "No check-in yet" : `Checked in ${daysSince}d ago`}
                  </p>
                  {lastCheckIn && !lastCheckIn.trainerReply && (
                    <p className="text-xs text-ember font-semibold">Awaiting reply</p>
                  )}
                </div>
              </Link>
            );
          })}
          {recentClients.length === 0 && <p className="text-ash text-sm">No clients yet — share your signup link.</p>}
        </div>
      </div>
    </div>
  );
}
