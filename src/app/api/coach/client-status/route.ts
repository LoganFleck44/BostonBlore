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
  const action = String(body?.action || "");

  if (!clientId || !action) {
    return NextResponse.json({ error: "Client id is required." }, { status: 400 });
  }

  const existing = await db.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true, hasPaid: true, activatedAt: true },
  });

  if (!existing || existing.role !== "client") {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  let data:
    | {
        hasPaid?: boolean;
        engagementStatus?: string;
        activatedAt?: Date | null;
      }
    | null = null;

  if (action === "mark_paid") {
    data = {
      hasPaid: true,
      engagementStatus: "active",
      activatedAt: existing.hasPaid ? existing.activatedAt : new Date(),
    };
  } else if (action === "mark_unpaid") {
    data = {
      hasPaid: false,
      engagementStatus: "pending",
      activatedAt: null,
    };
  } else if (action === "set_inactive") {
    if (!existing.hasPaid) {
      return NextResponse.json(
        { error: "Only paid clients can be moved to inactive." },
        { status: 400 },
      );
    }
    data = { engagementStatus: "inactive" };
  } else if (action === "set_active") {
    if (!existing.hasPaid) {
      return NextResponse.json(
        { error: "Pending clients must be marked paid before activation." },
        { status: 400 },
      );
    }
    data = { engagementStatus: "active" };
  }

  if (!data) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const client = await db.user.update({
    where: { id: clientId },
    data,
    select: {
      id: true,
      hasPaid: true,
      engagementStatus: true,
      activatedAt: true,
    },
  });

  return NextResponse.json({ ok: true, client });
}

export async function DELETE(req: Request) {
  const authResult = await requireTrainerApi();
  if ("response" in authResult) {
    return authResult.response;
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") || "";

  if (!clientId) {
    return NextResponse.json({ error: "Client id is required." }, { status: 400 });
  }

  const existing = await db.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!existing || existing.role !== "client") {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  await db.user.delete({ where: { id: clientId } });

  return NextResponse.json({
    ok: true,
    deleted: {
      id: existing.id,
      name: existing.name,
      email: existing.email,
    },
  });
}
