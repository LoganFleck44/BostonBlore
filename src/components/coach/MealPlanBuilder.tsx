"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type FoodItem = { name: string; amount: string; calories: string; protein: string };
type MealInput = { name: string; time: string; calories: string; protein: string; carbs: string; fat: string; foods: FoodItem[] };

function emptyFood(): FoodItem { return { name: "", amount: "", calories: "", protein: "" }; }
function emptyMeal(name = ""): MealInput { return { name, time: "", calories: "", protein: "", carbs: "", fat: "", foods: [emptyFood()] }; }

export function MealPlanBuilder({ clientId, trainerId, existing }: { clientId: string; trainerId: string; existing: any }) {
  const router = useRouter();
  const [planName, setPlanName] = useState(existing?.name ?? "Custom Meal Plan");
  const [totals, setTotals] = useState({ calories: existing?.calories?.toString() ?? "", protein: existing?.protein?.toString() ?? "", carbs: existing?.carbs?.toString() ?? "", fat: existing?.fat?.toString() ?? "" });
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [meals, setMeals] = useState<MealInput[]>(
    existing?.meals?.map((m: any) => {
      let foods: FoodItem[] = [emptyFood()];
      try { foods = JSON.parse(m.foods); } catch {}
      return { name: m.name, time: m.time ?? "", calories: m.calories?.toString() ?? "", protein: m.protein?.toString() ?? "", carbs: m.carbs?.toString() ?? "", fat: m.fat?.toString() ?? "", foods };
    }) ?? ["Breakfast", "Lunch", "Dinner"].map(emptyMeal)
  );
  const [saving, setSaving] = useState(false);

  function updateMeal(i: number, patch: Partial<MealInput>) { setMeals((m) => m.map((meal, idx) => idx === i ? { ...meal, ...patch } : meal)); }
  function addFood(mi: number) { updateMeal(mi, { foods: [...meals[mi].foods, emptyFood()] }); }
  function updateFood(mi: number, fi: number, patch: Partial<FoodItem>) {
    const foods = meals[mi].foods.map((f, i) => i === fi ? { ...f, ...patch } : f);
    updateMeal(mi, { foods });
  }

  async function save() {
    setSaving(true);
    await fetch("/api/coach/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, trainerId, planName, notes, totals, meals, existingId: existing?.id }),
    });
    setSaving(false);
    router.push(`/coach/clients/${clientId}`);
    router.refresh();
  }

  const inputCls = "rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-ash">Plan Name</label>
          <input className={`${inputCls} w-full`} value={planName} onChange={(e) => setPlanName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ash">Notes for client</label>
          <input className={`${inputCls} w-full`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional coaching note…" />
        </div>
      </div>

      {/* Daily targets */}
      <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
        <h3 className="mb-3 font-display text-lg font-semibold uppercase">Daily Targets</h3>
        <div className="grid grid-cols-4 gap-3">
          {[["calories", "Calories (kcal)"], ["protein", "Protein (g)"], ["carbs", "Carbs (g)"], ["fat", "Fat (g)"]].map(([k, l]) => (
            <div key={k}>
              <label className="mb-1 block text-xs text-ash">{l}</label>
              <input type="number" className={`${inputCls} w-full`} value={totals[k as keyof typeof totals]} onChange={(e) => setTotals((t) => ({ ...t, [k]: e.target.value }))} placeholder="0" />
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      {meals.map((meal, mi) => (
        <div key={mi} className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <div className="flex gap-3 mb-4 flex-wrap">
            <input className={`${inputCls} flex-1 min-w-32`} value={meal.name} onChange={(e) => updateMeal(mi, { name: e.target.value })} placeholder="Meal name e.g. Breakfast" />
            <input className={`${inputCls} w-28`} value={meal.time} onChange={(e) => updateMeal(mi, { time: e.target.value })} placeholder="7:00 AM" />
            <input type="number" className={`${inputCls} w-24`} value={meal.calories} onChange={(e) => updateMeal(mi, { calories: e.target.value })} placeholder="kcal" />
            <input type="number" className={`${inputCls} w-20`} value={meal.protein} onChange={(e) => updateMeal(mi, { protein: e.target.value })} placeholder="P (g)" />
            <button onClick={() => setMeals((m) => m.filter((_, i) => i !== mi))} className="text-xs text-ash hover:text-ember ml-auto">Remove</button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-[10px] uppercase tracking-widest text-ash px-1">
              <span className="col-span-2">Food</span><span>Amount</span><span>Cals</span>
            </div>
            {meal.foods.map((f, fi) => (
              <div key={fi} className="grid grid-cols-4 gap-2">
                <input className={`${inputCls} col-span-2`} value={f.name} onChange={(e) => updateFood(mi, fi, { name: e.target.value })} placeholder="e.g. Chicken breast" />
                <input className={inputCls} value={f.amount} onChange={(e) => updateFood(mi, fi, { amount: e.target.value })} placeholder="150g" />
                <input type="number" className={inputCls} value={f.calories} onChange={(e) => updateFood(mi, fi, { calories: e.target.value })} placeholder="0" />
              </div>
            ))}
            <button onClick={() => addFood(mi)} className="text-xs text-ember hover:underline">+ Add food</button>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" size="md" onClick={() => setMeals((m) => [...m, emptyMeal()])}>+ Add Meal</Button>
        <Button size="lg" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save Meal Plan"}</Button>
      </div>
    </div>
  );
}
