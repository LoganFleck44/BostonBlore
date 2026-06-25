import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "trainer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId, trainerId, planName, notes, days, existingId } = await req.json();

  // Deactivate old plan if exists
  if (existingId) {
    await db.workoutPlan.update({ where: { id: existingId }, data: { isActive: false } });
  }

  const plan = await db.workoutPlan.create({
    data: {
      name: planName,
      clientId,
      trainerId,
      notes: notes || null,
      isActive: true,
      days: {
        create: days.map((d: any, order: number) => ({
          dayNumber: d.dayNumber,
          label: d.label,
          isRest: d.isRest,
          order,
          exercises: d.isRest ? undefined : {
            create: d.exercises
              .filter((e: any) => e.name.trim())
              .map((e: any, eOrder: number) => ({
                name: e.name,
                sets: parseInt(e.sets) || 3,
                reps: e.reps,
                rest: e.rest || null,
                notes: e.notes || null,
                order: eOrder,
              })),
          },
        })),
      },
    },
  });

  return NextResponse.json({ ok: true, planId: plan.id });
}
