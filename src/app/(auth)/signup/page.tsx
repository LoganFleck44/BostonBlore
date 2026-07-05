"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { applicationPlans } from "@/lib/application";

const goals = [
  "Lose fat",
  "Build muscle",
  "Get stronger",
  "Improve health",
  "Compete / get on stage",
  "Not sure yet",
];
const experience = [
  "Complete beginner",
  "Some experience (< 1 year)",
  "Intermediate (1-3 years)",
  "Experienced (3+ years)",
];
const equipment = [
  "Commercial gym",
  "Home gym (weights)",
  "Minimal / bodyweight",
  "Unsure",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    goal: "",
    experience: "",
    equipment: "",
    injuries: "",
    dietPrefs: "",
    daysPerWeek: "4",
    planInterest: "",
  });

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!form.planInterest) {
      setError("Please choose a plan.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/login?application=1");
  }

  const field =
    "w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((progressStep) => (
          <div
            key={progressStep}
            className={`h-1 flex-1 rounded-full ${
              step >= progressStep ? "bg-ember" : "bg-ink-600"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <h1 className="font-display text-3xl font-bold uppercase">
            Create your account
          </h1>
          <p className="mt-1 text-ash">Step 1 of 3 - account details</p>
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full name</label>
                <input
                  className={field}
                  value={form.name}
                  onChange={(event) => set("name", event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className={field}
                  value={form.email}
                  onChange={(event) => set("email", event.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className={field}
                  value={form.password}
                  onChange={(event) => set("password", event.target.value)}
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Confirm password
                </label>
                <input
                  type="password"
                  className={field}
                  value={form.confirm}
                  onChange={(event) => set("confirm", event.target.value)}
                  placeholder="Repeat password"
                />
              </div>
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                if (!form.name || !form.email || !form.password || !form.confirm) {
                  setError("Please fill in all fields.");
                  return;
                }
                setError("");
                setStep(2);
              }}
            >
              Continue {"->"}
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="font-display text-3xl font-bold uppercase">
            Tell me about your goals
          </h1>
          <p className="mt-1 text-ash">Step 2 of 3 - your starting point</p>
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Primary goal</label>
              <div className="grid grid-cols-2 gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      form.goal === goal
                        ? "border-ember bg-ember/10 text-ember"
                        : "border-ink-600 hover:border-ash"
                    }`}
                    onClick={() => set("goal", goal)}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Training experience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {experience.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      form.experience === item
                        ? "border-ember bg-ember/10 text-ember"
                        : "border-ink-600 hover:border-ash"
                    }`}
                    onClick={() => set("experience", item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Equipment access</label>
              <div className="grid grid-cols-2 gap-2">
                {equipment.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      form.equipment === item
                        ? "border-ember bg-ember/10 text-ember"
                        : "border-ink-600 hover:border-ash"
                    }`}
                    onClick={() => set("equipment", item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Days per week you can train
                </label>
                <select
                  className={field}
                  value={form.daysPerWeek}
                  onChange={(event) => set("daysPerWeek", event.target.value)}
                >
                  {[2, 3, 4, 5, 6].map((days) => (
                    <option key={days} value={days}>
                      {days} days
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Dietary preferences
                </label>
                <input
                  className={field}
                  value={form.dietPrefs}
                  onChange={(event) => set("dietPrefs", event.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Any injuries or limitations?
              </label>
              <textarea
                className={field}
                rows={2}
                value={form.injuries}
                onChange={(event) => set("injuries", event.target.value)}
                placeholder="Optional"
              />
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                {"<-"} Back
              </Button>
              <Button size="lg" className="flex-1" onClick={() => setStep(3)}>
                Continue {"->"}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="font-display text-3xl font-bold uppercase">
            Choose your plan
          </h1>
          <p className="mt-1 text-ash">Step 3 of 3 - submit your application</p>
          <div className="mt-8 space-y-4">
            {applicationPlans.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => set("planInterest", plan.name)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  form.planInterest === plan.name
                    ? "border-ember bg-ember/10"
                    : "border-ink-600 bg-ink-700 hover:border-ash"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold uppercase">
                      {plan.name}
                    </h2>
                    <p className="mt-1 text-sm text-ash">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold fire-text">{plan.price}</p>
                    <p className="text-xs text-ash">{plan.cadence}</p>
                  </div>
                </div>
              </button>
            ))}
            <div className="rounded-2xl border border-ink-600 bg-ink-700 p-5 text-sm text-ash">
              You will not get instant client access after signing up. Boston will
              review your application, confirm payment manually, and then unlock
              your dashboard.
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                {"<-"} Back
              </Button>
              <Button
                size="lg"
                className="flex-1"
                disabled={loading}
                onClick={submit}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </>
      )}

      <p className="mt-6 text-center text-sm text-ash">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ember hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
