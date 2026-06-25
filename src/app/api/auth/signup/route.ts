import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.name) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const exists = await db.user.findUnique({ where: { email: body.email } });
  if (exists) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const hashed = await hash(body.password, 12);

  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashed,
      role: "client",
      profile: {
        create: {
          goal: body.goal || null,
          experience: body.experience || null,
          equipment: body.equipment || null,
          injuries: body.injuries || null,
          dietPrefs: body.dietPrefs || null,
          daysPerWeek: parseInt(body.daysPerWeek || "4"),
          onboardingDone: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
