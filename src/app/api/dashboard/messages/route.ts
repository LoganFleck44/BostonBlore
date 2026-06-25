import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { toId, body } = await req.json();
  if (!toId || !body?.trim()) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const msg = await db.message.create({
    data: { fromId: session.user.id, toId, body },
    include: { from: { select: { name: true, role: true } } },
  });

  return NextResponse.json({
    id: msg.id,
    body: msg.body,
    createdAt: msg.createdAt.toISOString(),
    fromName: msg.from.name,
    isMe: true,
  });
}
