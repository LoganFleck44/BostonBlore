"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ProgressLogger() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const payload = {
      weight: data.weight ? parseFloat(data.weight as string) : null,
      bodyFat: data.bodyFat ? parseFloat(data.bodyFat as string) : null,
      waist: data.waist ? parseFloat(data.waist as string) : null,
      chest: data.chest ? parseFloat(data.chest as string) : null,
      arms: data.arms ? parseFloat(data.arms as string) : null,
      hips: data.hips ? parseFloat(data.hips as string) : null,
      notes: data.notes || null,
    };
    await fetch("/api/dashboard/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const field = "w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none";

  if (saved) return <p className="text-sm text-ember font-semibold">✓ Logged! Great work staying consistent.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { name: "weight", label: "Weight (lbs)", placeholder: "185" },
          { name: "bodyFat", label: "Body Fat %", placeholder: "15" },
          { name: "chest", label: "Chest (in)", placeholder: "40" },
          { name: "waist", label: "Waist (in)", placeholder: "32" },
          { name: "arms", label: "Arms (in)", placeholder: "15" },
          { name: "hips", label: "Hips (in)", placeholder: "38" },
        ].map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-xs font-medium text-ash">{f.label}</label>
            <input name={f.name} type="number" step="0.1" className={field} placeholder={f.placeholder} />
          </div>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ash">Notes (optional)</label>
        <textarea name="notes" rows={2} className={field} placeholder="How are you feeling? Any PRs?" />
      </div>
      <Button type="submit" size="md" disabled={saving}>{saving ? "Saving…" : "Log Stats"}</Button>
    </form>
  );
}
