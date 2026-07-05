import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ExerciseChart } from "@/components/dashboard/ExerciseChart";
import { epley1RM, isWorkingSet, fmtVolume } from "@/lib/workout-stats";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);

  const entries = await db.workoutLogEntry.findMany({
    where: { log: { userId: session.user.id } },
    include: { sets: { orderBy: { setNumber: "asc" } }, log: { select: { id: true, name: true, date: true } } },
    orderBy: { log: { date: "asc" } },
  });
  const matching = entries.filter((e) => e.name.toLowerCase() === name.toLowerCase());
  if (matching.length === 0) notFound();

  const displayName = matching[matching.length - 1].name;
  const muscleGroup = matching[matching.length - 1].muscleGroup;

  // All-time records + per-session chart points
  let maxWeight = 0, best1RM = 0, bestSetVolume = 0, totalReps = 0, totalVolume = 0, totalSets = 0;
  const points: { date: string; maxWeight: number; est1RM: number; volume: number }[] = [];
  for (const e of matching) {
    let sMax = 0, s1RM = 0, sVol = 0;
    for (const set of e.sets) {
      if (!isWorkingSet(set)) continue;
      sMax = Math.max(sMax, set.weight!);
      s1RM = Math.max(s1RM, epley1RM(set.weight!, set.reps!));
      sVol += set.weight! * set.reps!;
      totalReps += set.reps!;
      totalSets++;
      bestSetVolume = Math.max(bestSetVolume, set.weight! * set.reps!);
    }
    maxWeight = Math.max(maxWeight, sMax);
    best1RM = Math.max(best1RM, s1RM);
    totalVolume += sVol;
    if (sMax > 0) {
      points.push({ date: e.log.date.toISOString(), maxWeight: sMax, est1RM: Math.round(s1RM), volume: sVol });
    }
  }

  const recent = [...matching].reverse().slice(0, 10);

  return (
    <div>
      <Link href="/dashboard/exercises" className="text-xs text-ash hover:text-ember">← All exercises</Link>
      <div className="mb-6 mt-1 flex items-center gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">{displayName}</h1>
        {muscleGroup && <span className="rounded-full bg-ink-700 px-3 py-1 text-xs uppercase tracking-wide text-ash">{muscleGroup}</span>}
      </div>

      {/* Records — HEVY exercise detail style */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Heaviest Weight", value: maxWeight > 0 ? `${maxWeight} lbs` : "–" },
          { label: "Est. 1RM", value: best1RM > 0 ? `${Math.round(best1RM)} lbs` : "–" },
          { label: "Best Set Volume", value: bestSetVolume > 0 ? fmtVolume(bestSetVolume) : "–" },
          { label: "Total Volume", value: totalVolume > 0 ? fmtVolume(totalVolume) : "–" },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-ink-600 bg-ink-700 p-4 text-center">
            <p className="font-display text-xl font-bold fire-text">{r.value}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ash">{r.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-3 text-center sm:grid-cols-3">
        {[
          { label: "Sessions", value: matching.length },
          { label: "Working Sets", value: totalSets },
          { label: "Total Reps", value: totalReps },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-ink-600 bg-ink-700 px-4 py-3">
            <span className="font-display text-lg font-bold">{r.value}</span>
            <span className="ml-2 text-xs uppercase tracking-widest text-ash">{r.label}</span>
          </div>
        ))}
      </div>

      {/* Progression charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-4 font-display text-lg font-semibold uppercase">Heaviest Weight</h2>
          <ExerciseChart points={points} dataKey="maxWeight" unit="lbs" />
        </div>
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-4 font-display text-lg font-semibold uppercase">Session Volume</h2>
          <ExerciseChart points={points} dataKey="volume" unit="lbs" />
        </div>
      </div>

      {/* Recent history */}
      <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
        <h2 className="mb-4 font-display text-lg font-semibold uppercase">Recent History</h2>
        <div className="space-y-4">
          {recent.map((e) => (
            <div key={e.id}>
              <p className="text-xs text-ash">
                {new Date(e.log.date).toLocaleDateString("en-CA", { weekday: "short", month: "long", day: "numeric" })}
                {" · "}{e.log.name}
              </p>
              <div className="mt-1.5 space-y-1">
                {e.sets.filter((s) => s.completed).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-md bg-ink-800 px-3 py-1.5 text-sm">
                    <span className={`w-5 text-center text-xs font-bold ${
                      s.setType === "warmup" ? "text-yellow-400" : s.setType === "drop" ? "text-purple-400" : s.setType === "failure" ? "text-red-400" : "text-ash"
                    }`}>
                      {s.setType === "warmup" ? "W" : s.setType === "drop" ? "D" : s.setType === "failure" ? "F" : i + 1}
                    </span>
                    <span className="text-bone">{s.weight != null && s.reps != null ? `${s.weight} lbs × ${s.reps}` : s.reps != null ? `${s.reps} reps` : "—"}</span>
                    {s.rpe != null && <span className="text-xs text-ash">@ RPE {s.rpe}</span>}
                    {s.isPr && <span className="ml-auto text-xs font-bold text-ember">🏆 PR</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
