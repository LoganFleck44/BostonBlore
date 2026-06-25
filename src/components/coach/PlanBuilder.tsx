"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type ExerciseInput = { name: string; sets: string; reps: string; rest: string; notes: string };
type DayInput = { dayNumber: number; label: string; isRest: boolean; exercises: ExerciseInput[] };

function emptyExercise(): ExerciseInput { return { name: "", sets: "3", reps: "8-12", rest: "90s", notes: "" }; }
function emptyDay(dayNumber: number): DayInput { return { dayNumber, label: DAY_LABELS[dayNumber], isRest: false, exercises: [emptyExercise()] }; }

export function PlanBuilder({ clientId, trainerId, existing }: { clientId: string; trainerId: string; existing: any }) {
  const router = useRouter();
  const [planName, setPlanName] = useState(existing?.name ?? "Custom Training Plan");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [days, setDays] = useState<DayInput[]>(
    existing?.days?.map((d: any) => ({
      dayNumber: d.dayNumber,
      label: d.label,
      isRest: d.isRest,
      exercises: d.exercises.length > 0 ? d.exercises.map((e: any) => ({ name: e.name, sets: String(e.sets), reps: e.reps, rest: e.rest ?? "", notes: e.notes ?? "" })) : [emptyExercise()],
    })) ?? [0, 1, 2, 3, 4].map(emptyDay)
  );
  const [saving, setSaving] = useState(false);

  function updateDay(i: number, patch: Partial<DayInput>) { setDays((d) => d.map((day, idx) => idx === i ? { ...day, ...patch } : day)); }
  function addDay() { const used = new Set(days.map((d) => d.dayNumber)); const next = [1,2,3,4,5,0,6].find((n) => !used.has(n)) ?? 0; setDays((d) => [...d, emptyDay(next)]); }
  function removeDay(i: number) { setDays((d) => d.filter((_, idx) => idx !== i)); }
  function addExercise(di: number) { updateDay(di, { exercises: [...days[di].exercises, emptyExercise()] }); }
  function updateExercise(di: number, ei: number, patch: Partial<ExerciseInput>) {
    const exs = days[di].exercises.map((e, i) => i === ei ? { ...e, ...patch } : e);
    updateDay(di, { exercises: exs });
  }
  function removeExercise(di: number, ei: number) { updateDay(di, { exercises: days[di].exercises.filter((_, i) => i !== ei) }); }

  async function save() {
    setSaving(true);
    await fetch("/api/coach/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, trainerId, planName, notes, days, existingId: existing?.id }),
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
          <input className={`${inputCls} w-full`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Focus on form this week…" />
        </div>
      </div>

      {days.map((day, di) => (
        <div key={di} className="rounded-2xl border border-ink-600 bg-ink-700 p-5">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <select className={`${inputCls} w-32`} value={day.dayNumber} onChange={(e) => updateDay(di, { dayNumber: parseInt(e.target.value), label: DAY_LABELS[parseInt(e.target.value)] })}>
              {DAY_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
            </select>
            <input className={`${inputCls} flex-1 min-w-32`} value={day.label} onChange={(e) => updateDay(di, { label: e.target.value })} placeholder="Session label e.g. Push" />
            <label className="flex items-center gap-2 text-sm text-ash cursor-pointer">
              <input type="checkbox" checked={day.isRest} onChange={(e) => updateDay(di, { isRest: e.target.checked })} className="accent-ember" />
              Rest day
            </label>
            <button onClick={() => removeDay(di)} className="text-xs text-ash hover:text-ember ml-auto">Remove</button>
          </div>

          {!day.isRest && (
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 text-[10px] uppercase tracking-widest text-ash px-1">
                <span className="col-span-2">Exercise</span><span>Sets</span><span>Reps</span><span>Rest</span>
              </div>
              {day.exercises.map((ex, ei) => (
                <div key={ei} className="grid grid-cols-5 gap-2 items-center">
                  <input className={`${inputCls} col-span-2`} value={ex.name} onChange={(e) => updateExercise(di, ei, { name: e.target.value })} placeholder="e.g. Bench Press" />
                  <input className={`${inputCls}`} value={ex.sets} onChange={(e) => updateExercise(di, ei, { sets: e.target.value })} placeholder="3" />
                  <input className={`${inputCls}`} value={ex.reps} onChange={(e) => updateExercise(di, ei, { reps: e.target.value })} placeholder="8-12" />
                  <div className="flex gap-1 items-center">
                    <input className={`${inputCls} flex-1`} value={ex.rest} onChange={(e) => updateExercise(di, ei, { rest: e.target.value })} placeholder="90s" />
                    <button onClick={() => removeExercise(di, ei)} className="text-ash hover:text-ember text-lg leading-none">×</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addExercise(di)} className="text-xs text-ember hover:underline mt-1">+ Add exercise</button>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" size="md" onClick={addDay}>+ Add Day</Button>
        <Button size="lg" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save Plan"}</Button>
      </div>
    </div>
  );
}
