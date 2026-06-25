import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Food = { name: string; amount: string; calories?: number; protein?: number; carbs?: number; fat?: number };

export default async function NutritionPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const plan = await db.mealPlan.findFirst({
    where: { clientId: session.user.id, isActive: true },
    include: { meals: { orderBy: { order: "asc" } } },
  });

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl mb-4">🥗</p>
        <h2 className="font-display text-2xl font-bold uppercase">Nutrition plan coming soon</h2>
        <p className="mt-2 text-ash max-w-sm">Boston will set up your custom meal plan shortly. In the meantime, focus on hitting your protein target.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{plan.name}</h1>
        {plan.notes && <p className="mt-1 text-ash">{plan.notes}</p>}
      </div>

      {/* Daily targets */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Calories", val: plan.calories, unit: "kcal", color: "text-flame" },
          { label: "Protein", val: plan.protein, unit: "g", color: "text-ember" },
          { label: "Carbs", val: plan.carbs, unit: "g", color: "text-gold" },
          { label: "Fat", val: plan.fat, unit: "g", color: "text-ash" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-ink-600 bg-ink-700 p-4 text-center">
            <p className={`font-display text-2xl font-bold ${m.color}`}>{m.val ?? "–"}{m.val ? m.unit : ""}</p>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-ash">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {plan.meals.map((meal) => {
          let foods: Food[] = [];
          try { foods = JSON.parse(meal.foods); } catch {}
          return (
            <div key={meal.id} className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold uppercase">{meal.name}</h3>
                {meal.time && <span className="text-sm text-ash">{meal.time}</span>}
              </div>
              {meal.calories && (
                <p className="mt-0.5 text-sm text-ash">{meal.calories} kcal · {meal.protein}g protein</p>
              )}
              {foods.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {foods.map((f, i) => (
                    <li key={i} className="flex items-center justify-between rounded-lg bg-ink-800 px-4 py-2.5 text-sm">
                      <span>{f.name}</span>
                      <span className="text-ash">{f.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
