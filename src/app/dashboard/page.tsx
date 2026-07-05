import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { WeeklyVolumeChart } from "@/components/dashboard/WeeklyVolumeChart";
import { weeklyStreak, fmtVolume } from "@/lib/workout-stats";

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday
  return x;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      workoutPlans: { where: { isActive: true }, include: { days: { include: { exercises: true } } } },
      mealPlans: { where: { isActive: true }, include: { meals: true } },
      checkIns: { orderBy: { date: "desc" }, take: 1 },
      progressEntries: { orderBy: { date: "desc" }, take: 1 },
    },
  });

  if (!user) redirect("/login");

  // eslint-disable-next-line react-hooks/purity -- server component: evaluated once per request
  const now = Date.now();

  // ── Workout analytics (HEVY-style) ──
  const since = new Date();
  since.setDate(since.getDate() - 8 * 7);
  const logs = await db.workoutLog.findMany({
    where: { userId: user.id, date: { gte: since } },
    orderBy: { date: "desc" },
    include: { entries: { include: { sets: { where: { isPr: true } } } } },
  });
  const allDates = await db.workoutLog.findMany({
    where: { userId: user.id },
    select: { date: true },
  });

  const thisWeekStart = startOfWeek(new Date());
  const thisWeekLogs = logs.filter((l) => l.date >= thisWeekStart);
  const weekVolume = thisWeekLogs.reduce((a, l) => a + l.totalVolume, 0);
  const streak = weeklyStreak(allDates.map((d) => d.date));
  const prs30d = logs
    .filter((l) => l.date.getTime() > now - 30 * 86400000)
    .reduce((a, l) => a + l.prCount, 0);

  // Last 8 weeks volume chart
  const MS_WEEK = 7 * 86400000;
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(thisWeekStart.getTime() - (7 - i) * MS_WEEK);
    const end = new Date(start.getTime() + MS_WEEK);
    const inWeek = logs.filter((l) => l.date >= start && l.date < end);
    return {
      label: start.toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
      volume: Math.round(inWeek.reduce((a, l) => a + l.totalVolume, 0)),
      workouts: inWeek.length,
    };
  });

  // Sets per muscle group this week (HEVY signature chart)
  const muscleSets = new Map<string, number>();
  const weekEntries = await db.workoutLogEntry.findMany({
    where: { logId: { in: thisWeekLogs.map((l) => l.id) } },
    include: { sets: true },
  });
  for (const e of weekEntries) {
    const working = e.sets.filter((s) => s.completed && s.setType !== "warmup").length;
    if (working === 0) continue;
    const g = e.muscleGroup ?? "Other";
    muscleSets.set(g, (muscleSets.get(g) ?? 0) + working);
  }
  const muscleSplit = [...muscleSets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxMuscleSets = muscleSplit[0]?.[1] ?? 1;

  // Recent PRs
  const recentPrs = logs
    .flatMap((l) =>
      l.entries.flatMap((e) =>
        e.sets.map((s) => ({ exercise: e.name, weight: s.weight, reps: s.reps, date: l.date }))
      )
    )
    .slice(0, 5);

  const activePlan = user.workoutPlans[0];
  const activeMealPlan = user.mealPlans[0];
  const lastCheckIn = user.checkIns[0];
  const latestProgress = user.progressEntries[0];

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const todayDay = activePlan?.days.find((d) => d.dayNumber === dayOfWeek);

  const daysSinceCheckIn = lastCheckIn
    ? Math.floor((now - new Date(lastCheckIn.date).getTime()) / 86400000)
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold uppercase">
          Welcome back, <span className="fire-text">{user.name.split(" ")[0]}</span>
        </h1>
        <p className="mt-1 text-ash">Here&apos;s where things stand today.</p>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Plan" value={activePlan?.name ?? "None yet"} sub={activePlan ? `${activePlan.days.length} days / week` : "Waiting on coach"} />
        <StatCard label="Meal Plan" value={activeMealPlan?.name ?? "None yet"} sub={activeMealPlan ? `${activeMealPlan.calories ?? "–"} kcal target` : "Waiting on coach"} />
        <StatCard label="Last Check-In" value={lastCheckIn ? `${daysSinceCheckIn}d ago` : "None yet"} sub={lastCheckIn ? (lastCheckIn.trainerReply ? "✓ Boston replied" : "Awaiting reply") : "Submit your first one"} />
        <StatCard label="Current Weight" value={latestProgress?.weight ? `${latestProgress.weight} lbs` : "–"} sub={latestProgress ? new Date(latestProgress.date).toLocaleDateString() : "Log in Progress"} />
      </div>

      {/* Workout analytics (HEVY-style) */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold uppercase">This Week</h2>
          <Link href="/dashboard/history" className="text-sm text-ember hover:underline">Workout history →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Workouts" value={String(thisWeekLogs.length)} sub={thisWeekLogs.length > 0 ? "Keep it rolling" : "Time to train"} />
          <StatCard label="Week Streak" value={streak > 0 ? `${streak} 🔥` : "0"} sub={streak > 0 ? "Consecutive training weeks" : "Start one this week"} />
          <StatCard label="Volume This Week" value={fmtVolume(weekVolume)} sub="Working sets only" />
          <StatCard label="PRs (30 days)" value={prs30d > 0 ? `${prs30d} 🏆` : "0"} sub={prs30d > 0 ? "New personal records" : "Chase a new record"} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5 lg:col-span-2">
            <h3 className="mb-4 font-display text-lg font-semibold uppercase">Weekly Volume</h3>
            <WeeklyVolumeChart weeks={weeks} />
          </div>
          <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
            <h3 className="mb-4 font-display text-lg font-semibold uppercase">Sets Per Muscle</h3>
            {muscleSplit.length === 0 ? (
              <p className="text-sm text-ash">Complete a workout this week to see your muscle split.</p>
            ) : (
              <div className="space-y-3">
                {muscleSplit.map(([group, sets]) => (
                  <div key={group}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="uppercase tracking-wide text-ash">{group}</span>
                      <span className="font-semibold text-bone">{sets} sets</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-ink-800">
                      <div className="h-full rounded-full bg-ember" style={{ width: `${(sets / maxMuscleSets) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {recentPrs.length > 0 && (
          <div className="mt-4 rounded-2xl border border-ember/30 bg-ember/5 p-5">
            <h3 className="font-display text-lg font-semibold uppercase text-ember">🏆 Recent PRs</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentPrs.map((pr, i) => (
                <Link key={i} href={`/dashboard/exercises/${encodeURIComponent(pr.exercise)}`}
                  className="flex items-center justify-between rounded-lg bg-ink-800/70 px-4 py-2.5 text-sm hover:bg-ink-800">
                  <span className="font-medium">{pr.exercise}</span>
                  <span className="text-ash">{pr.weight != null && pr.reps != null ? `${pr.weight} × ${pr.reps}` : ""}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Today's workout */}
      <div className="mt-8 rounded-2xl border border-ink-600 bg-ink-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold uppercase">Today&apos;s Session</h2>
          <Link href="/dashboard/training" className="text-sm text-ember hover:underline">View full plan →</Link>
        </div>
        {todayDay ? (
          todayDay.isRest ? (
            <p className="mt-4 text-ash">Rest day — recovery is part of the plan.</p>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="font-semibold">{todayDay.label}</p>
              {todayDay.exercises.slice(0, 4).map((ex) => (
                <div key={ex.id} className="flex items-center justify-between rounded-lg bg-ink-800 px-4 py-2.5 text-sm">
                  <span>{ex.name}</span>
                  <span className="text-ash">{ex.sets} × {ex.reps}</span>
                </div>
              ))}
              {todayDay.exercises.length > 4 && (
                <p className="text-xs text-ash">+{todayDay.exercises.length - 4} more — <Link href="/dashboard/training" className="text-ember hover:underline">see all</Link></p>
              )}
              <div className="pt-2">
                <ButtonLink href={`/dashboard/workout?day=${todayDay.id}`} size="md">▶ Start Today&apos;s Workout</ButtonLink>
              </div>
            </div>
          )
        ) : !activePlan ? (
          <p className="mt-4 text-ash">Your training plan is on its way — Boston will assign it shortly.</p>
        ) : (
          <p className="mt-4 text-ash">No session scheduled today.</p>
        )}
      </div>

      {/* Check-in prompt */}
      {(!lastCheckIn || (daysSinceCheckIn ?? 0) >= 6) && (
        <div className="mt-6 rounded-2xl border border-ember/40 bg-ember/10 p-6">
          <h2 className="font-display text-lg font-semibold uppercase text-ember">Weekly Check-In Due</h2>
          <p className="mt-1 text-sm text-bone">
            {lastCheckIn ? "It's been a week — time to check in with Boston so he can adjust your plan." : "Submit your first weekly check-in so Boston can start fine-tuning your plan."}
          </p>
          <div className="mt-4">
            <ButtonLink href="/dashboard/checkin" size="md">Submit Check-In</ButtonLink>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <QuickLink href="/dashboard/training" icon="💪" label="View Training Split" />
        <QuickLink href="/dashboard/nutrition" icon="🥗" label="View Meal Plan" />
        <QuickLink href="/dashboard/messages" icon="💬" label="Message Boston" />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-700 p-5">
      <p className="text-xs uppercase tracking-widest text-ash">{label}</p>
      <p className="mt-1.5 font-display text-xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-ash">{sub}</p>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-ink-600 bg-ink-700 px-4 py-3.5 text-sm font-medium hover:border-ember/50 hover:text-ember transition">
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}
