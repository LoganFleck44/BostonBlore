import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { epley1RM, isWorkingSet, totalVolume, detectPrs } from "@/lib/workout-stats";
import { muscleGroupFor } from "@/lib/exercises";

const SetSchema = z.object({
  setNumber: z.number().int().min(1),
  setType: z.enum(["warmup", "normal", "drop", "failure"]).default("normal"),
  weight: z.number().min(0).nullable(),
  reps: z.number().int().min(0).nullable(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  completed: z.boolean().default(true),
});

const EntrySchema = z.object({
  name: z.string().trim().min(1).max(80),
  order: z.number().int().min(0),
  notes: z.string().max(500).nullable().optional(),
  sets: z.array(SetSchema).min(1).max(30),
});

const WorkoutSchema = z.object({
  name: z.string().trim().min(1).max(80),
  planId: z.string().nullable().optional(),
  durationSec: z.number().int().min(0).max(24 * 3600),
  notes: z.string().max(1000).nullable().optional(),
  entries: z.array(EntrySchema).min(1).max(30),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = WorkoutSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid workout data", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const userId = session.user.id;

  // Historical bests per exercise name (case-insensitive) for PR detection.
  // SQLite string filters are case-sensitive, so fetch the user's entries and
  // bucket by lowercased name (dataset is small — one coach's clients).
  const names = [...new Set(body.entries.map((e) => e.name.toLowerCase()))];
  const allPast = await db.workoutLogEntry.findMany({
    where: { log: { userId } },
    include: { sets: true },
  });

  const bests = new Map<string, { maxWeight: number; max1RM: number; maxSetVolume: number }>();
  for (const n of names) bests.set(n, { maxWeight: 0, max1RM: 0, maxSetVolume: 0 });
  for (const entry of allPast) {
    const key = entry.name.toLowerCase();
    if (!bests.has(key)) continue;
    const b = bests.get(key)!;
    for (const s of entry.sets) {
      if (!isWorkingSet(s)) continue;
      b.maxWeight = Math.max(b.maxWeight, s.weight!);
      b.max1RM = Math.max(b.max1RM, epley1RM(s.weight!, s.reps!));
      b.maxSetVolume = Math.max(b.maxSetVolume, s.weight! * s.reps!);
    }
  }

  // Detect PRs: per exercise, flag the best qualifying set(s).
  const prSummaries: { exercise: string; kinds: string[]; weight: number; reps: number }[] = [];
  const prSetKeys = new Set<string>(); // `${entryOrder}:${setNumber}`
  for (const entry of body.entries) {
    const b = bests.get(entry.name.toLowerCase())!;
    let bestPr: { kinds: string[]; weight: number; reps: number; setNumber: number } | null = null;
    for (const s of entry.sets) {
      if (!isWorkingSet(s)) continue;
      const kinds = detectPrs({ weight: s.weight!, reps: s.reps! }, b);
      if (kinds.length === 0) continue;
      if (!bestPr || kinds.length > bestPr.kinds.length || s.weight! * s.reps! > bestPr.weight * bestPr.reps) {
        bestPr = { kinds, weight: s.weight!, reps: s.reps!, setNumber: s.setNumber };
      }
    }
    if (bestPr) {
      prSummaries.push({ exercise: entry.name, kinds: bestPr.kinds, weight: bestPr.weight, reps: bestPr.reps });
      prSetKeys.add(`${entry.order}:${bestPr.setNumber}`);
    }
  }

  // Count completed working sets — bodyweight sets (no weight) still count.
  const completedSets = body.entries
    .flatMap((e) => e.sets)
    .filter((s) => s.completed && s.setType !== "warmup" && (s.reps ?? 0) > 0);
  const volume = totalVolume(body.entries.flatMap((e) => e.sets));

  // Validate planId belongs to this user if provided.
  let planId: string | null = null;
  if (body.planId) {
    const plan = await db.workoutPlan.findFirst({ where: { id: body.planId, clientId: userId } });
    planId = plan?.id ?? null;
  }

  const log = await db.workoutLog.create({
    data: {
      userId,
      planId,
      name: body.name,
      durationSec: body.durationSec,
      notes: body.notes || null,
      totalVolume: volume,
      totalSets: completedSets.length,
      prCount: prSummaries.length,
      entries: {
        create: body.entries.map((e) => ({
          name: e.name,
          muscleGroup: muscleGroupFor(e.name),
          order: e.order,
          notes: e.notes || null,
          sets: {
            create: e.sets.map((s) => ({
              setNumber: s.setNumber,
              setType: s.setType,
              weight: s.weight,
              reps: s.reps,
              rpe: s.rpe ?? null,
              completed: s.completed,
              isPr: prSetKeys.has(`${e.order}:${s.setNumber}`),
            })),
          },
        })),
      },
    },
  });

  return NextResponse.json({
    ok: true,
    id: log.id,
    summary: {
      durationSec: body.durationSec,
      totalVolume: volume,
      totalSets: completedSets.length,
      prs: prSummaries,
    },
  });
}
