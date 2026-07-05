import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireActiveClientApi } from "@/lib/auth-guards";

export async function POST(req: Request) {
  const authResult = await requireActiveClientApi();
  if ("response" in authResult) return authResult.response;
  const { session } = authResult;
  const body = await req.json();
  await db.progressEntry.create({ data: { userId: session.user.id, ...body } });
  return NextResponse.json({ ok: true });
}
