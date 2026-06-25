"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const goals = ["Lose fat", "Build muscle", "Get stronger", "Improve health", "Compete / get on stage", "Not sure yet"];
const experience = ["Complete beginner", "Some experience (< 1 year)", "Intermediate (1–3 years)", "Experienced (3+ years)"];
const equipment = ["Commercial gym", "Home gym (weights)", "Minimal / bodyweight", "Unsure"];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
    goal: "", experience: "", equipment: "", injuries: "", dietPrefs: "", daysPerWeek: "4",
  });

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit() {
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true); setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Something went wrong.");
      setLoading(false);
      return;
    }
    router.push("/login?registered=1");
  }

  const field =
    "w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="mb-8 flex gap-2">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? "bg-ember" : "bg-ink-600"}`} />
        ))}
      </div>

      {step === 1 && (
        <>
          <h1 className="font-display text-3xl font-bold uppercase">Create your account</h1>
          <p className="mt-1 text-ash">Step 1 of 2 — account details</p>
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full name</label>
                <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Password</label>
                <input type="password" className={field} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Confirm password</label>
                <input type="password" className={field} value={form.confirm} onChange={(e) => set("confirm", e.target.value)} placeholder="Repeat password" />
              </div>
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <Button size="lg" className="w-full" onClick={() => {
              if (!form.name || !form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
              setError(""); setStep(2);
            }}>
              Continue →
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="font-display text-3xl font-bold uppercase">Tell me about your goals</h1>
          <p className="mt-1 text-ash">Step 2 of 2 — so I can build the right plan for you</p>
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Primary goal</label>
              <div className="grid grid-cols-2 gap-2">
                {goals.map((g) => (
                  <button key={g} type="button"
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${form.goal === g ? "border-ember bg-ember/10 text-ember" : "border-ink-600 hover:border-ash"}`}
                    onClick={() => set("goal", g)}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Training experience</label>
              <div className="grid grid-cols-2 gap-2">
                {experience.map((e) => (
                  <button key={e} type="button"
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${form.experience === e ? "border-ember bg-ember/10 text-ember" : "border-ink-600 hover:border-ash"}`}
                    onClick={() => set("experience", e)}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Equipment access</label>
              <div className="grid grid-cols-2 gap-2">
                {equipment.map((e) => (
                  <button key={e} type="button"
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${form.equipment === e ? "border-ember bg-ember/10 text-ember" : "border-ink-600 hover:border-ash"}`}
                    onClick={() => set("equipment", e)}>{e}</button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Days per week you can train</label>
                <select className={field} value={form.daysPerWeek} onChange={(e) => set("daysPerWeek", e.target.value)}>
                  {[2,3,4,5,6].map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Dietary preferences (optional)</label>
                <input className={field} value={form.dietPrefs} onChange={(e) => set("dietPrefs", e.target.value)} placeholder="e.g. no dairy, vegetarian…" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Any injuries or limitations? (optional)</label>
              <textarea className={field} rows={2} value={form.injuries} onChange={(e) => set("injuries", e.target.value)} placeholder="e.g. bad knees, shoulder issues…" />
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
              <Button size="lg" className="flex-1" disabled={loading} onClick={submit}>
                {loading ? "Creating account…" : "Create Account"}
              </Button>
            </div>
          </div>
        </>
      )}

      <p className="mt-6 text-center text-sm text-ash">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ember hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
