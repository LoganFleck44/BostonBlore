import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "trainer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { checkInId, reply } = await req.json();
  await db.checkIn.update({ where: { id: checkInId }, data: { trainerReply: reply, repliedAt: new Date(), isRead: false } });
  return NextResponse.json({ ok: true });
}
