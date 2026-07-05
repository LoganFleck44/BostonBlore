"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md text-ash">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const session = await fetch("/api/auth/session").then((response) => response.json());
    const role = session?.user?.role;
    const hasPaid = Boolean(session?.user?.hasPaid);
    router.push(role === "trainer" ? "/coach" : hasPaid ? "/dashboard" : "/application-status");
  }

  const field =
    "w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-3xl font-bold uppercase">Client Login</h1>
      <p className="mt-1 text-ash">Sign in to access your coaching dashboard.</p>
      {searchParams.get("application") === "1" && (
        <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-bone">
          Your application is in. Check your email for the confirmation, then sign in any time to see your status.
        </div>
      )}
      {searchParams.get("reset") === "1" && (
        <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-bone">
          Your password has been reset. You can sign in now.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className={field}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            className={field}
            placeholder="Enter your password"
          />
        </div>
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="text-ember hover:underline">
            Forgot your password?
          </Link>
        </div>

        {error && <p className="text-sm text-ember">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ash">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-ember hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
