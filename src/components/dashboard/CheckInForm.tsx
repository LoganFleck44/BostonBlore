"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CheckInForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ energyLevel: 7, trainingAdhere: 7, nutritionAdhere: 7, wins: "", struggles: "", questions: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/dashboard/checkin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const field = "w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none";

  if (saved) return (
    <div className="text-center py-6">
      <p className="text-4xl">✅</p>
      <p className="mt-3 font-display text-lg font-semibold uppercase">Check-in submitted!</p>
      <p className="mt-1 text-sm text-ash">Boston will review it and reply shortly.</p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {[
        { key: "energyLevel", label: "Energy & recovery this week" },
        { key: "trainingAdhere", label: "Training adherence" },
        { key: "nutritionAdhere", label: "Nutrition adherence" },
      ].map((s) => (
        <div key={s.key}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{s.label}</label>
            <span className="font-display text-xl font-bold fire-text">{form[s.key as keyof typeof form]}/10</span>
          </div>
          <input type="range" min={1} max={10} value={form[s.key as keyof typeof form] as number}
            onChange={(e) => setForm((f) => ({ ...f, [s.key]: parseInt(e.target.value) }))}
            className="w-full accent-ember" />
          <div className="mt-1 flex justify-between text-xs text-ash">
            <span>1 — Rough week</span>
            <span>10 — Perfect</span>
          </div>
        </div>
      ))}

      <div>
        <label className="mb-1.5 block text-sm font-medium">Wins this week</label>
        <textarea rows={2} className={field} placeholder="PRs, consistency, good nutrition days…"
          value={form.wins} onChange={(e) => setForm((f) => ({ ...f, wins: e.target.value }))} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Struggles or challenges</label>
        <textarea rows={2} className={field} placeholder="What was hard? Life stuff, fatigue, cravings…"
          value={form.struggles} onChange={(e) => setForm((f) => ({ ...f, struggles: e.target.value }))} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Questions for Boston</label>
        <textarea rows={2} className={field} placeholder="Anything you want to ask or flag…"
          value={form.questions} onChange={(e) => setForm((f) => ({ ...f, questions: e.target.value }))} />
      </div>

      <Button type="submit" size="lg" disabled={saving}>{saving ? "Submitting…" : "Submit Check-In"}</Button>
    </form>
  );
}
