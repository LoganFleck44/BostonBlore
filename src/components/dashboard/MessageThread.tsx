"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Msg = { id: string; body: string; createdAt: string; fromName: string; isMe: boolean };

export function MessageThread({ messages: initial, trainerId }: { messages: Msg[]; trainerId: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    const res = await fetch("/api/dashboard/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toId: trainerId, body }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((m) => [...m, msg]);
      setBody("");
    }
    setSending(false);
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-ink-600 bg-ink-700">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-ash mt-8">No messages yet — say hi to Boston!</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${m.isMe ? "bg-ember text-white" : "bg-ink-800 text-bone"}`}>
              {!m.isMe && <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-flame">{m.fromName}</p>}
              <p className="leading-relaxed">{m.body}</p>
              <p className={`mt-1 text-[10px] ${m.isMe ? "text-white/60" : "text-ash"}`}>
                {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-ink-600 p-3 flex gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
          placeholder="Message Boston…"
          className="flex-1 resize-none rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none"
        />
        <Button size="md" onClick={send} disabled={sending || !body.trim()}>Send</Button>
      </div>
    </div>
  );
}
