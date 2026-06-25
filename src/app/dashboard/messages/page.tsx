import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MessageThread } from "@/components/dashboard/MessageThread";

export default async function MessagesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Find trainer(s)
  const trainer = await db.user.findFirst({ where: { role: "trainer" } });

  const messages = trainer
    ? await db.message.findMany({
        where: {
          OR: [
            { fromId: session.user.id, toId: trainer.id },
            { fromId: trainer.id, toId: session.user.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: { from: { select: { name: true, role: true } } },
      })
    : [];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="mb-4 font-display text-3xl font-bold uppercase shrink-0">
        Messages {trainer ? `— Boston` : ""}
      </h1>
      {!trainer ? (
        <p className="text-ash">No trainer assigned yet.</p>
      ) : (
        <MessageThread
          messages={messages.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt.toISOString(), fromName: m.from.name, isMe: m.fromId === session.user.id }))}
          trainerId={trainer.id}
        />
      )}
    </div>
  );
}
