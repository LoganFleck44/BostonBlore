"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CheckInReplyForm({ checkInId }: { checkInId: string }) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  async function send() {
    if (!reply.trim()) return;
    setSaving(true);
    await fetch("/api/coach/checkin-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkInId, reply }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="mt-2 flex gap-2">
      <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2}
        placeholder="Reply to this check-in…"
        className="flex-1 resize-none rounded-lg border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none" />
      <Button size="md" onClick={send} disabled={saving || !reply.trim()}>{saving ? "Sending…" : "Reply"}</Button>
    </div>
  );
}
