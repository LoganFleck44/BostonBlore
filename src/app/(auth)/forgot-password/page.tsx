"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Could not send reset instructions.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  const field =
    "w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-3xl font-bold uppercase">Reset password</h1>
      <p className="mt-1 text-ash">
        Enter the email on your account and we&apos;ll send you a reset link.
      </p>

      {done ? (
        <div className="mt-8 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-4 text-sm text-bone">
          If that email exists in the system, reset instructions are on the way.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className={field}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
            />
          </div>
          {error && <p className="text-sm text-ember">{error}</p>}
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ash">
        <Link href="/login" className="font-medium text-ember hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
