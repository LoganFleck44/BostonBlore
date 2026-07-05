import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { CheckInReplyForm } from "@/components/coach/CheckInReplyForm";
import { ClientPaymentToggle } from "@/components/coach/ClientPaymentToggle";
import { fmtDuration, fmtVolume } from "@/lib/workout-stats";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const client = await db.user.findUnique({
    where: { id },
    include: {
      profile: true,
      workoutPlans: {
        where: { isActive: true },
        include: { days: { include: { exercises: true } } },
      },
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
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link href="/coach/clients" className="text-xs text-ash hover:text-ember">
            Back to all clients
          </Link>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase">{client.name}</h1>
          <p className="text-ash">{client.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                client.engagementStatus === "active"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : client.engagementStatus === "inactive"
                    ? "bg-sky-500/15 text-sky-300"
                    : "bg-gold/15 text-gold"
              }`}
            >
              {client.engagementStatus === "active"
                ? "Active client"
                : client.engagementStatus === "inactive"
                  ? "Inactive client"
                  : "Pending payment"}
            </span>
            {client.planInterest && (
              <span className="rounded-full border border-ink-600 px-3 py-1 text-xs uppercase tracking-widest text-ash">
                {client.planInterest}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ClientPaymentToggle
            clientId={id}
            clientName={client.name}
            hasPaid={client.hasPaid}
            engagementStatus={client.engagementStatus as "pending" | "active" | "inactive"}
          />
          <ButtonLink href={`/coach/clients/${id}/plan`} variant="outline" size="md">
            {plan ? "Edit Plan" : "+ Assign Plan"}
          </ButtonLink>
          <ButtonLink href={`/coach/clients/${id}/meal`} variant="outline" size="md">
            {mealPlan ? "Edit Meals" : "+ Assign Meals"}
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold uppercase">Client Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-ink-600 py-1.5">
              <span className="text-ash">Payment</span>
              <span>{client.hasPaid ? "Confirmed" : "Waiting on e-transfer"}</span>
            </div>
            <div className="flex justify-between border-b border-ink-600 py-1.5">
              <span className="text-ash">Lifecycle</span>
              <span className="capitalize">{client.engagementStatus}</span>
            </div>
            <div className="flex justify-between border-b border-ink-600 py-1.5">
              <span className="text-ash">Plan selected</span>
              <span>{client.planInterest ?? "-"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ash">Applied</span>
              <span>
                {client.inquirySubmittedAt
                  ? new Date(client.inquirySubmittedAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold uppercase">Profile</h2>
          {[
            ["Goal", client.profile?.goal],
            ["Experience", client.profile?.experience],
            ["Equipment", client.profile?.equipment],
            ["Days/week", client.profile?.daysPerWeek],
            ["Diet prefs", client.profile?.dietPrefs],
            ["Injuries", client.profile?.injuries],
          ].map(
            ([key, value]) =>
              value && (
                <div
                  key={key as string}
                  className="flex justify-between border-b border-ink-600 py-1.5 text-sm last:border-0"
                >
                  <span className="text-ash">{key}</span>
                  <span className="max-w-[60%] text-right">{value}</span>
                </div>
              ),
          )}
        </div>

        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold uppercase">Progress</h2>
          {client.progressEntries.length > 0 ? (
            <div className="space-y-2">
              {client.progressEntries.map((entry) => (
                <div key={entry.id} className="border-b border-ink-600 pb-2 text-sm last:border-0">
                  <p className="text-xs text-ash">{new Date(entry.date).toLocaleDateString()}</p>
                  <div className="mt-0.5 flex gap-3">
                    {entry.weight && <span>{entry.weight} lbs</span>}
                    {entry.bodyFat && <span>{entry.bodyFat}% BF</span>}
                    {entry.waist && <span>Waist: {entry.waist}&quot;</span>}
                  </div>
                  {entry.notes && <p className="mt-0.5 text-xs italic text-ash">{entry.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ash">No progress logged yet.</p>
          )}
        </div>

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
              {mealPlan && (
                <p className="text-xs text-ash">
                  {mealPlan.calories} kcal · {mealPlan.protein}g protein
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold uppercase">Recent Workouts</h2>
        {recentWorkouts.length === 0 ? (
          <p className="text-ash">No workouts logged yet.</p>
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((log) => (
              <details
                key={log.id}
                className="group rounded-2xl border border-ink-600 bg-ink-700 open:border-ember/40"
              >
                <summary className="cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-display font-semibold uppercase">{log.name}</span>
                      <span className="ml-3 text-xs text-ash">
                        {new Date(log.date).toLocaleDateString("en-CA", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ash">
                      <span>{fmtDuration(log.durationSec)}</span>
                      <span>{fmtVolume(log.totalVolume)}</span>
                      <span>{log.totalSets} sets</span>
                      {log.prCount > 0 && (
                        <span className="font-bold text-ember">
                          PRs: {log.prCount}
                        </span>
                      )}
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
                          {entry.sets
                            .filter((set) => set.completed)
                            .map((set, index) => (
                              <p key={set.id} className="text-xs text-ash">
                                <span>
                                  {set.setType === "warmup"
                                    ? "W"
                                    : set.setType === "drop"
                                      ? "D"
                                      : set.setType === "failure"
                                        ? "F"
                                        : `${index + 1}`}
                                </span>
                                {" · "}
                                {set.weight != null && set.reps != null
                                  ? `${set.weight} lbs x ${set.reps}`
                                  : set.reps != null
                                    ? `${set.reps} reps`
                                    : "-"}
                                {set.rpe != null && ` @ ${set.rpe}`}
                                {set.isPr && <span className="ml-1 text-ember">PR</span>}
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

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold uppercase">Check-Ins</h2>
        <div className="space-y-4">
          {client.checkIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className={`rounded-2xl border p-5 ${
                !checkIn.trainerReply ? "border-ember/40 bg-ember/5" : "border-ink-600 bg-ink-700"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">
                  {new Date(checkIn.date).toLocaleDateString("en-CA", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex gap-3 text-xs text-ash">
                  <span>Energy: {checkIn.energyLevel}/10</span>
                  <span>Training: {checkIn.trainingAdhere}/10</span>
                  <span>Nutrition: {checkIn.nutritionAdhere}/10</span>
                </div>
              </div>
              {checkIn.wins && (
                <p className="mb-1 text-sm">
                  <span className="font-medium text-green-400">Win:</span> {checkIn.wins}
                </p>
              )}
              {checkIn.struggles && (
                <p className="mb-1 text-sm">
                  <span className="font-medium text-ember">Struggle:</span> {checkIn.struggles}
                </p>
              )}
              {checkIn.questions && (
                <p className="mb-3 text-sm">
                  <span className="font-medium text-gold">Question:</span> {checkIn.questions}
                </p>
              )}

              {checkIn.trainerReply ? (
                <div className="mt-2 rounded-lg border border-ink-600 bg-ink-800 p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ember">
                    Your reply
                  </p>
                  <p className="mt-1">{checkIn.trainerReply}</p>
                </div>
              ) : (
                session && <CheckInReplyForm checkInId={checkIn.id} />
              )}
            </div>
          ))}
          {client.checkIns.length === 0 && <p className="text-ash">No check-ins submitted yet.</p>}
        </div>
      </div>
    </div>
  );
}
