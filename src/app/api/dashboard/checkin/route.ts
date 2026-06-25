import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.checkIn.create({ data: { userId: session.user.id, energyLevel: body.energyLevel, trainingAdhere: body.trainingAdhere, nutritionAdhere: body.nutritionAdhere, wins: body.wins || null, struggles: body.struggles || null, questions: body.questions || null } });
  return NextResponse.json({ ok: true });
}
