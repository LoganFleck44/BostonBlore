"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

// Resize an uploaded image client-side and return a compressed JPEG data URL,
// so we can store the progress photo directly without a separate file service.
function resizeToDataUrl(file: File, maxDim = 900, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function CheckInForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [form, setForm] = useState<{
    energyLevel: number; trainingAdhere: number; nutritionAdhere: number;
    weight: string; photoUrl: string; wins: string; struggles: string; questions: string;
  }>({ energyLevel: 7, trainingAdhere: 7, nutritionAdhere: 7, weight: "", photoUrl: "", wins: "", struggles: "", questions: "" });

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    try {
      const dataUrl = await resizeToDataUrl(file);
      setForm((f) => ({ ...f, photoUrl: dataUrl }));
    } catch {
      setPhotoError("Couldn't process that image. Try another one.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      weight: form.weight.trim() === "" ? null : parseFloat(form.weight),
      photoUrl: form.photoUrl || null,
    };
    await fetch("/api/dashboard/checkin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
        <label className="mb-1.5 block text-sm font-medium">Current weight (lbs)</label>
        <div className="flex items-center gap-3">
          <div className="relative max-w-[180px]">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              className={`${field} pr-12`}
              placeholder="e.g. 182"
              value={form.weight}
              onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ash">lbs</span>
          </div>
          <span className="text-sm text-ash">Log it each week to track your trend.</span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Progress photo</label>
        <div className="flex items-start gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-sm font-medium text-bone transition hover:border-ember">
            <span>{form.photoUrl ? "Change photo" : "📷 Upload photo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
          </label>
          {form.photoUrl && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.photoUrl} alt="Progress photo preview" className="h-24 w-24 rounded-lg border border-ink-600 object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, photoUrl: "" }))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-ink-600 bg-ink-800 text-xs text-ash hover:text-ember"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {photoError && <p className="mt-1.5 text-xs text-ember">{photoError}</p>}
      </div>

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
