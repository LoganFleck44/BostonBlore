import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { WorkoutLogger, type InitialExercise, type PreviousMap } from "@/components/dashboard/WorkoutLogger";
import { parseRestSeconds } from "@/lib/workout-stats";

export default async function LiveWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = session.user.id;
  const { day: dayId } = await searchParams;

  // Previous performance per exercise name (most recent logged entry wins) —
  // powers the HEVY-style "previous" column and placeholder autofill.
  const recentEntries = await db.workoutLogEntry.findMany({
    where: { log: { userId } },
    include: {
      sets: { orderBy: { setNumber: "asc" } },
      log: { select: { date: true } },
    },
    orderBy: { log: { date: "desc" } },
    take: 200,
  });
  const previous: PreviousMap = {};
  for (const e of recentEntries) {
    const key = e.name.toLowerCase();
    if (!previous[key]) {
      previous[key] = e.sets
        .filter((s) => s.completed)
        .map((s) => ({ weight: s.weight, reps: s.reps, setType: s.setType }));
    }
  }

  // Starting from a plan day?
  let workoutName = "Freestyle Workout";
  let planId: string | null = null;
  let initialExercises: InitialExercise[] = [];

  if (dayId) {
    const day = await db.workoutDay.findFirst({
      where: { id: dayId, plan: { clientId: userId, isActive: true } },
      include: { exercises: { orderBy: { order: "asc" } }, plan: true },
    });
    if (day && !day.isRest) {
      workoutName = day.label;
      planId = day.planId;
      initialExercises = day.exercises.map((ex) => ({
        name: ex.name,
        restSec: parseRestSeconds(ex.rest),
        planNotes: ex.notes,
        targetReps: ex.reps,
        targetSets: ex.sets,
      }));
    }
  }

  return (
    <WorkoutLogger
      workoutName={workoutName}
      planId={planId}
      initialExercises={initialExercises}
      previous={previous}
    />
  );
}
