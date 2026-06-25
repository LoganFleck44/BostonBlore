import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProgressLogger } from "@/components/dashboard/ProgressLogger";
import { ProgressChart } from "@/components/dashboard/ProgressChart";

export default async function ProgressPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const entries = await db.progressEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  const latest = entries[entries.length - 1];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold uppercase">Progress</h1>

      {/* Latest stats */}
      {latest && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Weight", val: latest.weight ? `${latest.weight} lbs` : "–" },
            { label: "Body Fat", val: latest.bodyFat ? `${latest.bodyFat}%` : "–" },
            { label: "Waist", val: latest.waist ? `${latest.waist}"` : "–" },
            { label: "Arms", val: latest.arms ? `${latest.arms}"` : "–" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-ink-600 bg-ink-700 p-4 text-center">
              <p className="font-display text-2xl font-bold fire-text">{m.val}</p>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-ash">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Weight chart */}
      {entries.length > 1 && (
        <div className="mb-6 rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-4 font-display text-lg font-semibold uppercase">Weight Over Time</h2>
          <ProgressChart entries={entries.map((e) => ({ date: e.date.toISOString(), weight: e.weight }))} />
        </div>
      )}

      {/* Log new entry */}
      <div className="rounded-2xl border border-ink-600 bg-ink-700 p-6">
        <h2 className="mb-5 font-display text-xl font-semibold uppercase">Log Today's Stats</h2>
        <ProgressLogger />
      </div>
    </div>
  );
}
