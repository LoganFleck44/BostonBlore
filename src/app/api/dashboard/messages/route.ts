import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireActiveClientApi } from "@/lib/auth-guards";

export async function POST(req: Request) {
  const authResult = await requireActiveClientApi();
  if ("response" in authResult) return authResult.response;
  const { session } = authResult;
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
