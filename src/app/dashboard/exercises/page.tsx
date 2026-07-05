import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { epley1RM, isWorkingSet } from "@/lib/workout-stats";

type ExerciseAgg = {
  name: string;
  muscleGroup: string | null;
  sessions: number;
  lastDate: Date;
  maxWeight: number;
  best1RM: number;
};

export default async function ExercisesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const entries = await db.workoutLogEntry.findMany({
    where: { log: { userId: session.user.id } },
    include: { sets: true, log: { select: { date: true } } },
    orderBy: { log: { date: "desc" } },
  });

  const byName = new Map<string, ExerciseAgg>();
  for (const e of entries) {
    const key = e.name.toLowerCase();
    let agg = byName.get(key);
    if (!agg) {
      agg = { name: e.name, muscleGroup: e.muscleGroup, sessions: 0, lastDate: e.log.date, maxWeight: 0, best1RM: 0 };
      byName.set(key, agg);
    }
    agg.sessions++;
    if (e.log.date > agg.lastDate) agg.lastDate = e.log.date;
    for (const s of e.sets) {
      if (!isWorkingSet(s)) continue;
      agg.maxWeight = Math.max(agg.maxWeight, s.weight!);
      agg.best1RM = Math.max(agg.best1RM, epley1RM(s.weight!, s.reps!));
    }
  }

  const exercises = [...byName.values()].sort((a, b) => b.lastDate.getTime() - a.lastDate.getTime());

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">Exercise Stats</h1>
        <p className="mt-1 text-ash">Every exercise you&apos;ve logged, with your all-time bests. Tap one to see your progression.</p>
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-600 bg-ink-700 py-20 text-center">
          <p className="mb-4 text-5xl">📊</p>
          <h2 className="font-display text-2xl font-bold uppercase">Nothing logged yet</h2>
          <p className="mt-2 max-w-sm text-ash">Once you log workouts, your per-exercise records and charts will live here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-600">
          <div className="grid grid-cols-[1fr_5rem_5rem_5.5rem] gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2.5 text-[10px] uppercase tracking-widest text-ash sm:grid-cols-[1fr_6rem_6rem_6rem_7rem]">
            <span>Exercise</span>
            <span className="text-center">Sessions</span>
            <span className="text-center">Best lbs</span>
            <span className="hidden text-center sm:block">Est. 1RM</span>
            <span className="text-right">Last done</span>
          </div>
          {exercises.map((ex) => (
            <Link
              key={ex.name}
              href={`/dashboard/exercises/${encodeURIComponent(ex.name)}`}
              className="grid grid-cols-[1fr_5rem_5rem_5.5rem] items-center gap-2 border-b border-ink-600 bg-ink-700 px-4 py-3 text-sm transition last:border-0 hover:bg-ink-600 sm:grid-cols-[1fr_6rem_6rem_6rem_7rem]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-bone">{ex.name}</p>
                {ex.muscleGroup && <p className="text-[10px] uppercase tracking-wide text-ash">{ex.muscleGroup}</p>}
              </div>
              <span className="text-center text-ash">{ex.sessions}</span>
              <span className="text-center font-semibold fire-text">{ex.maxWeight > 0 ? ex.maxWeight : "–"}</span>
              <span className="hidden text-center text-ash sm:block">{ex.best1RM > 0 ? Math.round(ex.best1RM) : "–"}</span>
              <span className="text-right text-xs text-ash">{new Date(ex.lastDate).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
