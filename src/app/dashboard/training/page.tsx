import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";

export default async function TrainingPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const plans = await db.workoutPlan.findMany({
    where: { clientId: session.user.id, isActive: true },
    include: { days: { include: { exercises: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
  });

  const plan = plans[0];

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl mb-4">💪</p>
        <h2 className="font-display text-2xl font-bold uppercase">Your plan is on its way</h2>
        <p className="mt-2 text-ash max-w-sm">Boston will assign your custom training split shortly. Check back soon.</p>
      </div>
    );
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayNum = new Date().getDay();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">{plan.name}</h1>
          {plan.notes && <p className="mt-1 text-ash">{plan.notes}</p>}
        </div>
      </div>

      <div className="space-y-4">
        {plan.days.map((day) => {
          const isToday = day.dayNumber === todayNum;
          return (
            <div key={day.id} className={`rounded-2xl border p-5 ${isToday ? "border-ember/50 bg-ember/5" : "border-ink-600 bg-ink-700"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${isToday ? "bg-ember text-white" : "bg-ink-600 text-ash"}`}>
                    {days[day.dayNumber]}
                  </span>
                  <h3 className="font-display text-lg font-semibold uppercase">{day.label}</h3>
                  {isToday && <span className="text-xs text-ember">Today</span>}
                </div>
                {day.isRest && <span className="text-xs text-ash italic">Rest day</span>}
              </div>

              {!day.isRest && day.exercises.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-4 gap-2 px-1 text-[10px] uppercase tracking-widest text-ash">
                    <span className="col-span-2">Exercise</span>
                    <span className="text-center">Sets × Reps</span>
                    <span className="text-center">Rest</span>
                  </div>
                  {day.exercises.map((ex) => (
                    <div key={ex.id} className="grid grid-cols-4 gap-2 rounded-lg bg-ink-800 px-4 py-3 text-sm">
                      <div className="col-span-2">
                        <p className="font-medium">{ex.name}</p>
                        {ex.notes && <p className="text-xs text-ash">{ex.notes}</p>}
                      </div>
                      <p className="text-center text-ash">{ex.sets} × {ex.reps}</p>
                      <p className="text-center text-ash">{ex.rest ?? "–"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
