import { db } from "@/lib/db";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await db.user.findMany({
    where: { role: "client" },
    include: {
      profile: true,
      workoutPlans: { where: { isActive: true }, select: { name: true } },
      mealPlans: { where: { isActive: true }, select: { name: true } },
      checkIns: { orderBy: { date: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold uppercase">Clients</h1>
      <div className="overflow-hidden rounded-2xl border border-ink-600">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-600 bg-ink-800">
            <tr>
              {["Client", "Goal", "Training Plan", "Meal Plan", "Last Check-In"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-ash">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-600 bg-ink-700">
            {clients.map((c) => {
              const lastCI = c.checkIns[0];
              const daysSince = lastCI ? Math.floor((Date.now() - new Date(lastCI.date).getTime()) / 86400000) : null;
              return (
                <tr key={c.id} className="hover:bg-ink-600 transition">
                  <td className="px-4 py-3">
                    <Link href={`/coach/clients/${c.id}`} className="font-medium hover:text-ember">{c.name}</Link>
                    <p className="text-xs text-ash">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ash">{c.profile?.goal ?? "–"}</td>
                  <td className="px-4 py-3">{c.workoutPlans[0]?.name ?? <Link href={`/coach/clients/${c.id}/plan`} className="text-ember text-xs hover:underline">+ Assign</Link>}</td>
                  <td className="px-4 py-3">{c.mealPlans[0]?.name ?? <Link href={`/coach/clients/${c.id}/meal`} className="text-ember text-xs hover:underline">+ Assign</Link>}</td>
                  <td className="px-4 py-3 text-ash">
                    {daysSince === null ? "Never" : `${daysSince}d ago`}
                    {lastCI && !lastCI.trainerReply && <span className="ml-2 text-ember text-xs">● Reply</span>}
                  </td>
                </tr>
              );
            })}
            {clients.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ash">No clients yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
