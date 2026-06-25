import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MealPlanBuilder } from "@/components/coach/MealPlanBuilder";

export default async function AssignMealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "trainer") notFound();

  const client = await db.user.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!client) notFound();

  const existing = await db.mealPlan.findFirst({
    where: { clientId: id, isActive: true },
    include: { meals: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <Link href={`/coach/clients/${id}`} className="text-xs text-ash hover:text-ember">← Back to {client.name}</Link>
      <h1 className="mt-1 mb-6 font-display text-3xl font-bold uppercase">
        {existing ? "Edit" : "Assign"} Meal Plan — {client.name}
      </h1>
      <MealPlanBuilder clientId={id} trainerId={session.user.id} existing={existing} />
    </div>
  );
}
