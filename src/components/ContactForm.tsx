"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const goals = ["Lose fat", "Build muscle", "Compete / get on stage", "General health", "Not sure yet"];
const interests = ["Online coaching", "Nutrition coaching", "In-person training"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-ember/40 bg-ember/10 p-8 text-center">
        <h3 className="font-display text-2xl font-bold uppercase">Message sent</h3>
        <p className="mt-2 text-ash">
          Thanks for reaching out — I'll get back to you within 1–2 days. Watch your inbox.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-ink-600 bg-ink-800 px-4 py-3 text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name</label>
          <input name="name" required className={field} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input name="email" type="email" required className={field} placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Primary goal</label>
          <select name="goal" className={field} defaultValue="">
            <option value="" disabled>Select a goal</option>
            {goals.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Interested in</label>
          <select name="interest" className={field} defaultValue="">
            <option value="" disabled>Select coaching type</option>
            {interests.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea name="message" rows={5} className={field} placeholder="Tell me about your goals, experience, and timeline..." />
      </div>
      {status === "error" && (
        <p className="text-sm text-ember">Something went wrong. Please try again or email me directly.</p>
      )}
      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
