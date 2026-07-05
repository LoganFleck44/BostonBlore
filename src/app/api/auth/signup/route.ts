import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { isValidApplicationPlan } from "@/lib/application";
import { sendSignupInquiryEmail, sendSignupThankYouEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.name || !body?.planInterest) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!isValidApplicationPlan(body.planInterest)) {
    return NextResponse.json({ error: "Please choose a valid plan." }, { status: 400 });
  }

  const email = String(body.email).trim().toLowerCase();
  const name = String(body.name).trim();
  const planInterest = String(body.planInterest);
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const hashed = await hash(body.password, 12);
  const daysPerWeek = Number.parseInt(String(body.daysPerWeek || "4"), 10);

  const user = await db.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: "client",
      hasPaid: false,
      planInterest,
      inquirySubmittedAt: new Date(),
      profile: {
        create: {
          goal: body.goal || null,
          experience: body.experience || null,
          equipment: body.equipment || null,
          injuries: body.injuries || null,
          dietPrefs: body.dietPrefs || null,
          daysPerWeek: Number.isFinite(daysPerWeek) ? daysPerWeek : 4,
          onboardingDone: true,
        },
      },
    },
  });
  const emailResults = await Promise.allSettled([
    sendSignupThankYouEmail({ email, name, planInterest }),
    sendSignupInquiryEmail({
      email,
      name,
      planInterest,
      goal: body.goal || null,
      experience: body.experience || null,
      equipment: body.equipment || null,
      injuries: body.injuries || null,
      dietPrefs: body.dietPrefs || null,
      daysPerWeek: Number.isFinite(daysPerWeek) ? daysPerWeek : 4,
    }),
  ]);

  emailResults.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error("Signup email failed", {
        type: index === 0 ? "client-thank-you" : "coach-inquiry",
        email,
        reason: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
