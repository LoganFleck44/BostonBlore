import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireActiveClientApi } from "@/lib/auth-guards";

export async function POST(req: Request) {
  const authResult = await requireActiveClientApi();
  if ("response" in authResult) return authResult.response;
  const { session } = authResult;
  const body = await req.json();
  const weight = typeof body.weight === "number" && !Number.isNaN(body.weight) ? body.weight : null;
  const photoUrl = typeof body.photoUrl === "string" && body.photoUrl.startsWith("data:image/") ? body.photoUrl : null;
  await db.checkIn.create({ data: { userId: session.user.id, energyLevel: body.energyLevel, trainingAdhere: body.trainingAdhere, nutritionAdhere: body.nutritionAdhere, weight, photoUrl, wins: body.wins || null, struggles: body.struggles || null, questions: body.questions || null } });
  return NextResponse.json({ ok: true });
}
