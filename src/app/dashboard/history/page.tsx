import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { fmtDuration, fmtVolume } from "@/lib/workout-stats";

const SET_TYPE_LABEL: Record<string, string> = { warmup: "W", drop: "D", failure: "F" };

export default async function HistoryPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const logs = await db.workoutLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 50,
    include: {
      entries: {
        orderBy: { order: "asc" },
        include: { sets: { orderBy: { setNumber: "asc" } } },
      },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Workout History</h1>
          <p className="mt-1 text-ash">{logs.length} logged workout{logs.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/dashboard/exercises" variant="outline" size="md">Exercise Stats</ButtonLink>
          <ButtonLink href="/dashboard/workout" size="md">+ Log Workout</ButtonLink>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-600 bg-ink-700 py-20 text-center">
          <p className="mb-4 text-5xl">🏋️</p>
          <h2 className="font-display text-2xl font-bold uppercase">No workouts yet</h2>
          <p className="mt-2 max-w-sm text-ash">Start your first workout from your training plan and it&apos;ll show up here.</p>
          <div className="mt-6">
            <ButtonLink href="/dashboard/training" size="lg">Go to Training</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <details key={log.id} className="group rounded-2xl border border-ink-600 bg-ink-700 open:border-ember/40">
              <summary className="cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold uppercase">{log.name}</h3>
                    <p className="mt-0.5 text-xs text-ash">
                      {new Date(log.date).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
                      {" · "}
                      {new Date(log.date).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  {log.prCount > 0 && (
                    <span className="shrink-0 rounded-full bg-ember/15 px-2.5 py-1 text-xs font-bold text-ember">
                      🏆 {log.prCount} PR{log.prCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-5 text-sm">
                  <Stat label="Duration" value={fmtDuration(log.durationSec)} />
                  <Stat label="Volume" value={fmtVolume(log.totalVolume)} />
                  <Stat label="Sets" value={String(log.totalSets)} />
                  <Stat label="Exercises" value={String(log.entries.length)} />
                </div>
                <p className="mt-2 text-xs text-ember opacity-70 group-open:hidden">Tap to see details ↓</p>
              </summary>

              <div className="border-t border-ink-600 p-5 pt-4">
                {log.notes && <p className="mb-4 text-sm italic text-ash">“{log.notes}”</p>}
                <div className="space-y-4">
                  {log.entries.map((entry) => (
                    <div key={entry.id}>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/dashboard/exercises/${encodeURIComponent(entry.name)}`}
                          className="text-sm font-semibold text-bone hover:text-ember"
                        >
                          {entry.name}
                        </Link>
                        {entry.muscleGroup && (
                          <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ash">{entry.muscleGroup}</span>
                        )}
                      </div>
                      {entry.notes && <p className="mt-0.5 text-xs italic text-ash">“{entry.notes}”</p>}
                      <div className="mt-1.5 space-y-1">
                        {entry.sets.filter((s) => s.completed).map((s, i) => (
                          <div key={s.id} className="flex items-center gap-3 rounded-md bg-ink-800 px-3 py-1.5 text-sm">
                            <span className={`w-5 text-center text-xs font-bold ${
                              s.setType === "warmup" ? "text-yellow-400" : s.setType === "drop" ? "text-purple-400" : s.setType === "failure" ? "text-red-400" : "text-ash"
                            }`}>
                              {SET_TYPE_LABEL[s.setType] ?? i + 1}
                            </span>
                            <span className="text-bone">
                              {s.weight != null && s.reps != null ? `${s.weight} lbs × ${s.reps}` : s.reps != null ? `${s.reps} reps` : "—"}
                            </span>
                            {s.rpe != null && <span className="text-xs text-ash">@ RPE {s.rpe}</span>}
                            {s.isPr && <span className="ml-auto text-xs font-bold text-ember">🏆 PR</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-ash">{label}</p>
      <p className="font-display font-bold">{value}</p>
    </div>
  );
}
