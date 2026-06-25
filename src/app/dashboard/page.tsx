import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

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

  const activePlan = user.workoutPlans[0];
  const activeMealPlan = user.mealPlans[0];
  const lastCheckIn = user.checkIns[0];
  const latestProgress = user.progressEntries[0];

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const todayDay = activePlan?.days.find((d) => d.dayNumber === dayOfWeek);

  const daysSinceCheckIn = lastCheckIn
    ? Math.floor((Date.now() - new Date(lastCheckIn.date).getTime()) / 86400000)
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold uppercase">
          Welcome back, <span className="fire-text">{user.name.split(" ")[0]}</span>
        </h1>
        <p className="mt-1 text-ash">Here's where things stand today.</p>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Plan" value={activePlan?.name ?? "None yet"} sub={activePlan ? `${activePlan.days.length} days / week` : "Waiting on coach"} />
        <StatCard label="Meal Plan" value={activeMealPlan?.name ?? "None yet"} sub={activeMealPlan ? `${activeMealPlan.calories ?? "–"} kcal target` : "Waiting on coach"} />
        <StatCard label="Last Check-In" value={lastCheckIn ? `${daysSinceCheckIn}d ago` : "None yet"} sub={lastCheckIn ? (lastCheckIn.trainerReply ? "✓ Boston replied" : "Awaiting reply") : "Submit your first one"} />
        <StatCard label="Current Weight" value={latestProgress?.weight ? `${latestProgress.weight} lbs` : "–"} sub={latestProgress ? new Date(latestProgress.date).toLocaleDateString() : "Log in Progress"} />
      </div>

      {/* Today's workout */}
      <div className="mt-8 rounded-2xl border border-ink-600 bg-ink-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold uppercase">Today's Session</h2>
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
