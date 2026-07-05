// Shared workout math (HEVY-style): estimated 1RM, volume, PR detection,
// duration formatting, and streak calculation.

export type SetInput = {
  setType: string; // "warmup" | "normal" | "drop" | "failure"
  weight: number | null;
  reps: number | null;
  completed?: boolean;
};

// Epley formula — same approach HEVY uses for projected 1RM.
export function epley1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

// Working sets = completed, non-warmup sets with real weight+reps.
export function isWorkingSet(s: SetInput): s is SetInput & { weight: number; reps: number } {
  return (
    (s.completed ?? true) &&
    s.setType !== "warmup" &&
    typeof s.weight === "number" &&
    s.weight > 0 &&
    typeof s.reps === "number" &&
    s.reps > 0
  );
}

export function setVolume(s: SetInput): number {
  return isWorkingSet(s) ? s.weight * s.reps : 0;
}

export function totalVolume(sets: SetInput[]): number {
  return sets.reduce((acc, s) => acc + setVolume(s), 0);
}

export function fmtVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k lbs`;
  return `${Math.round(v)} lbs`;
}

export function fmtDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export type ExerciseBests = {
  maxWeight: number;
  max1RM: number;
  maxSetVolume: number;
};

// PR labels for a new set measured against historical bests.
export function detectPrs(
  set: { weight: number; reps: number },
  bests: ExerciseBests
): string[] {
  const prs: string[] = [];
  if (set.weight > bests.maxWeight) prs.push("Weight");
  if (epley1RM(set.weight, set.reps) > bests.max1RM) prs.push("1RM");
  if (set.weight * set.reps > bests.maxSetVolume) prs.push("Volume");
  return prs;
}

// HEVY-style weekly streak: consecutive weeks (ending this week or last week)
// with at least one workout. Weeks start Monday.
export function weeklyStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const weekStart = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = (x.getDay() + 6) % 7; // Mon = 0
    x.setDate(x.getDate() - day);
    return x.getTime();
  };
  const weeks = new Set(dates.map(weekStart));
  const MS_WEEK = 7 * 24 * 60 * 60 * 1000;
  let cursor = weekStart(new Date());
  // Streak may still be alive if this week has no workout yet — start from last week.
  if (!weeks.has(cursor)) cursor -= MS_WEEK;
  let streak = 0;
  while (weeks.has(cursor)) {
    streak++;
    cursor -= MS_WEEK;
  }
  return streak;
}

// Parse a rest string from the plan ("90s", "2 min", "2-3 min") into seconds.
export function parseRestSeconds(rest: string | null | undefined): number {
  if (!rest) return 90;
  const r = rest.toLowerCase();
  const range = r.match(/(\d+)\s*-\s*(\d+)\s*min/);
  if (range) return Math.round(((+range[1] + +range[2]) / 2) * 60);
  const min = r.match(/(\d+(?:\.\d+)?)\s*m/);
  if (min) return Math.round(+min[1] * 60);
  const sec = r.match(/(\d+)\s*s/);
  if (sec) return +sec[1];
  const bare = r.match(/^(\d+)$/);
  if (bare) return +bare[1];
  return 90;
}
