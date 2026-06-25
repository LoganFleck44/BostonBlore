import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { CoachMessageThread } from "@/components/coach/CoachMessageThread";

export default async function CoachMessagesPage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const session = await auth();
  const { client: clientId } = await searchParams;

  const clients = await db.user.findMany({
    where: { role: "client" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const activeClient = clientId ? clients.find((c) => c.id === clientId) : clients[0];

  const messages = activeClient && session
    ? await db.message.findMany({
        where: {
          OR: [
            { fromId: session.user.id, toId: activeClient.id },
            { fromId: activeClient.id, toId: session.user.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: { from: { select: { name: true, role: true } } },
      })
    : [];

  return (
    <div className="flex gap-5 h-[calc(100vh-8rem)]">
      {/* Client list */}
      <div className="w-48 shrink-0 overflow-y-auto">
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-ash">Clients</h2>
        <div className="space-y-1">
          {clients.map((c) => (
            <Link key={c.id} href={`/coach/messages?client=${c.id}`}
              className={`block rounded-lg px-3 py-2.5 text-sm transition ${activeClient?.id === c.id ? "bg-ember/15 text-ember" : "text-ash hover:bg-ink-700 hover:text-bone"}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeClient && session ? (
          <>
            <h1 className="mb-3 font-display text-xl font-bold uppercase shrink-0">{activeClient.name}</h1>
            <CoachMessageThread
              messages={messages.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt.toISOString(), fromName: m.from.name, isMe: m.fromId === session.user.id }))}
              toId={activeClient.id}
            />
          </>
        ) : (
          <p className="text-ash">Select a client to view messages.</p>
        )}
      </div>
    </div>
  );
}
