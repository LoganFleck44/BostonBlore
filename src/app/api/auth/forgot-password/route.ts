import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  try {
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    console.error("Password reset email failed", {
      email: user.email,
      reason: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "We could not send the reset email right now." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
