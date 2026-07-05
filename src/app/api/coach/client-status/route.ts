import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireTrainerApi } from "@/lib/auth-guards";

export async function PATCH(req: Request) {
  const authResult = await requireTrainerApi();
  if ("response" in authResult) {
    return authResult.response;
  }

  const body = await req.json().catch(() => null);
  const clientId = String(body?.clientId || "");
  const hasPaid = Boolean(body?.hasPaid);

  if (!clientId) {
    return NextResponse.json({ error: "Client id is required." }, { status: 400 });
  }

  const existing = await db.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true },
  });

  if (!existing || existing.role !== "client") {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  const client = await db.user.update({
    where: { id: clientId },
    data: {
      hasPaid,
      activatedAt: hasPaid ? new Date() : null,
    },
    select: {
      id: true,
      hasPaid: true,
      activatedAt: true,
    },
  });

  return NextResponse.json({ ok: true, client });
}
