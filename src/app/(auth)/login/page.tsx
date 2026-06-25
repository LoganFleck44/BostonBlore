"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Fetch session to get role then redirect
    const session = await fetch("/api/auth/session").then((r) => r.json());
    const role = session?.user?.role;
    router.push(role === "trainer" ? "/coach" : "/dashboard");
  }

  const field =
    "w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-3xl font-bold uppercase">Client Login</h1>
      <p className="mt-1 text-ash">Sign in to access your coaching dashboard.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input name="email" type="email" required className={field} placeholder="you@email.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input name="password" type="password" required className={field} placeholder="••••••••" />
        </div>

        {error && <p className="text-sm text-ember">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ash">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-ember hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
