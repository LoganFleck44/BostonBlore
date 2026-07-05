import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { CheckInReplyForm } from "@/components/coach/CheckInReplyForm";
import { fmtDuration, fmtVolume } from "@/lib/workout-stats";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const client = await db.user.findUnique({
    where: { id },
    include: {
      profile: true,
      workoutPlans: { where: { isActive: true }, include: { days: { include: { exercises: true } } } },
      mealPlans: { where: { isActive: true }, include: { meals: true } },
      checkIns: { orderBy: { date: "desc" }, take: 5 },
      progressEntries: { orderBy: { date: "desc" }, take: 5 },
    },
  });

  if (!client || client.role !== "client") notFound();

  const plan = client.workoutPlans[0];
  const mealPlan = client.mealPlans[0];

  const recentWorkouts = await db.workoutLog.findMany({
    where: { userId: id },
    orderBy: { date: "desc" },
    take: 6,
    include: {
      entries: {
        orderBy: { order: "asc" },
        include: { sets: { orderBy: { setNumber: "asc" } } },
      },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link href="/coach/clients" className="text-xs text-ash hover:text-ember">← All clients</Link>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase">{client.name}</h1>
          <p className="text-ash">{client.email}</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={`/coach/clients/${id}/plan`} variant="outline" size="md">
            {plan ? "Edit Plan" : "+ Assign Plan"}
          </ButtonLink>
          <ButtonLink href={`/coach/clients/${id}/meal`} variant="outline" size="md">
            {mealPlan ? "Edit Meals" : "+ Assign Meals"}
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold uppercase">Profile</h2>
          {[
            ["Goal", client.profile?.goal],
            ["Experience", client.profile?.experience],
            ["Equipment", client.profile?.equipment],
            ["Days/week", client.profile?.daysPerWeek],
            ["Diet prefs", client.profile?.dietPrefs],
            ["Injuries", client.profile?.injuries],
          ].map(([k, v]) => v && (
            <div key={k as string} className="flex justify-between py-1.5 border-b border-ink-600 last:border-0 text-sm">
              <span className="text-ash">{k}</span>
              <span className="text-right max-w-[60%]">{v}</span>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold uppercase">Progress</h2>
          {client.progressEntries.length > 0 ? (
            <div className="space-y-2">
              {client.progressEntries.map((e) => (
                <div key={e.id} className="text-sm border-b border-ink-600 pb-2 last:border-0">
                  <p className="text-xs text-ash">{new Date(e.date).toLocaleDateString()}</p>
                  <div className="flex gap-3 mt-0.5">
                    {e.weight && <span>{e.weight} lbs</span>}
                    {e.bodyFat && <span>{e.bodyFat}% BF</span>}
                    {e.waist && <span>Waist: {e.waist}&quot;</span>}
                  </div>
                  {e.notes && <p className="text-xs text-ash italic mt-0.5">{e.notes}</p>}
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-ash">No progress logged yet.</p>}
        </div>

        {/* Current plans summary */}
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold uppercase">Active Plans</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-ash">Training</p>
              <p className="font-medium">{plan?.name ?? "None assigned"}</p>
              {plan && <p className="text-xs text-ash">{plan.days.length} days</p>}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ash">Nutrition</p>
              <p className="font-medium">{mealPlan?.name ?? "None assigned"}</p>
              {mealPlan && <p className="text-xs text-ash">{mealPlan.calories} kcal · {mealPlan.protein}g protein</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Logged workouts (HEVY-style tracking) */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold uppercase">Recent Workouts</h2>
        {recentWorkouts.length === 0 ? (
          <p className="text-ash">No workouts logged yet.</p>
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((log) => (
              <details key={log.id} className="group rounded-2xl border border-ink-600 bg-ink-700 open:border-ember/40">
                <summary className="cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-display font-semibold uppercase">{log.name}</span>
                      <span className="ml-3 text-xs text-ash">
                        {new Date(log.date).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ash">
                      <span>{fmtDuration(log.durationSec)}</span>
                      <span>{fmtVolume(log.totalVolume)}</span>
                      <span>{log.totalSets} sets</span>
                      {log.prCount > 0 && <span className="font-bold text-ember">🏆 {log.prCount} PR{log.prCount > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                </summary>
                <div className="border-t border-ink-600 px-5 py-4">
                  {log.notes && <p className="mb-3 text-sm italic text-ash">&ldquo;{log.notes}&rdquo;</p>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {log.entries.map((entry) => (
                      <div key={entry.id} className="rounded-lg bg-ink-800 p-3">
                        <p className="text-sm font-semibold">{entry.name}</p>
                        <div className="mt-1 space-y-0.5">
                          {entry.sets.filter((s) => s.completed).map((s, i) => (
                            <p key={s.id} className="text-xs text-ash">
                              <span className={s.setType === "warmup" ? "text-yellow-400" : s.setType === "drop" ? "text-purple-400" : s.setType === "failure" ? "text-red-400" : ""}>
                                {s.setType === "warmup" ? "W" : s.setType === "drop" ? "D" : s.setType === "failure" ? "F" : `${i + 1}`}
                              </span>
                              {" · "}
                              {s.weight != null && s.reps != null ? `${s.weight} lbs × ${s.reps}` : s.reps != null ? `${s.reps} reps` : "—"}
                              {s.rpe != null && ` @ ${s.rpe}`}
                              {s.isPr && <span className="ml-1 text-ember">🏆</span>}
                            </p>
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

      {/* Check-ins */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold uppercase">Check-Ins</h2>
        <div className="space-y-4">
          {client.checkIns.map((ci) => (
            <div key={ci.id} className={`rounded-2xl border p-5 ${!ci.trainerReply ? "border-ember/40 bg-ember/5" : "border-ink-600 bg-ink-700"}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{new Date(ci.date).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}</p>
                <div className="flex gap-3 text-xs text-ash">
                  <span>Energy: {ci.energyLevel}/10</span>
                  <span>Training: {ci.trainingAdhere}/10</span>
                  <span>Nutrition: {ci.nutritionAdhere}/10</span>
                </div>
              </div>
              {ci.wins && <p className="text-sm mb-1"><span className="text-green-400 font-medium">Win:</span> {ci.wins}</p>}
              {ci.struggles && <p className="text-sm mb-1"><span className="text-ember font-medium">Struggle:</span> {ci.struggles}</p>}
              {ci.questions && <p className="text-sm mb-3"><span className="text-gold font-medium">Question:</span> {ci.questions}</p>}

              {ci.trainerReply ? (
                <div className="mt-2 rounded-lg border border-ink-600 bg-ink-800 p-3 text-sm">
                  <p className="text-xs font-semibold text-ember uppercase tracking-wide">Your reply</p>
                  <p className="mt-1">{ci.trainerReply}</p>
                </div>
              ) : session && (
                <CheckInReplyForm checkInId={ci.id} />
              )}
            </div>
          ))}
          {client.checkIns.length === 0 && <p className="text-ash">No check-ins submitted yet.</p>}
        </div>
      </div>
    </div>
  );
}
