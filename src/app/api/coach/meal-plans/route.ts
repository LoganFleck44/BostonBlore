import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "trainer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { clientId, trainerId, planName, notes, totals, meals, existingId } = await req.json();

  if (existingId) {
    await db.mealPlan.update({ where: { id: existingId }, data: { isActive: false } });
  }

  const plan = await db.mealPlan.create({
    data: {
      name: planName,
      clientId,
      trainerId,
      notes: notes || null,
      isActive: true,
      calories: totals.calories ? parseInt(totals.calories) : null,
      protein: totals.protein ? parseInt(totals.protein) : null,
      carbs: totals.carbs ? parseInt(totals.carbs) : null,
      fat: totals.fat ? parseInt(totals.fat) : null,
      meals: {
        create: meals.map((m: any, order: number) => ({
          name: m.name,
          time: m.time || null,
          calories: m.calories ? parseInt(m.calories) : null,
          protein: m.protein ? parseInt(m.protein) : null,
          carbs: m.carbs ? parseInt(m.carbs) : null,
          fat: m.fat ? parseInt(m.fat) : null,
          foods: JSON.stringify(m.foods.filter((f: any) => f.name.trim())),
          order,
        })),
      },
    },
  });

  return NextResponse.json({ ok: true, planId: plan.id });
}
