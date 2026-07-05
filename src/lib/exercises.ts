// Exercise library (HEVY-style) — used for adding exercises during a live
// workout and for muscle-group analytics. Names are canonical display names.

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core",
  "Forearms",
  "Cardio",
  "Other",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EXERCISE_LIBRARY: { name: string; muscleGroup: MuscleGroup }[] = [
  // ── Chest ──────────────────────────────────────────────────────────────────
  { name: "Bench Press", muscleGroup: "Chest" },
  { name: "Incline Bench Press", muscleGroup: "Chest" },
  { name: "Decline Bench Press", muscleGroup: "Chest" },
  { name: "Dumbbell Bench Press", muscleGroup: "Chest" },
  { name: "Incline DB Press", muscleGroup: "Chest" },
  { name: "Machine Chest Press", muscleGroup: "Chest" },
  { name: "Smith Machine Bench Press", muscleGroup: "Chest" },
  { name: "Cable Fly", muscleGroup: "Chest" },
  { name: "Pec Deck", muscleGroup: "Chest" },
  { name: "Dumbbell Fly", muscleGroup: "Chest" },
  { name: "Push-Ups", muscleGroup: "Chest" },
  { name: "Dips", muscleGroup: "Chest" },

  // ── Back ───────────────────────────────────────────────────────────────────
  { name: "Deadlift", muscleGroup: "Back" },
  { name: "Barbell Row", muscleGroup: "Back" },
  { name: "Pendlay Row", muscleGroup: "Back" },
  { name: "Dumbbell Row", muscleGroup: "Back" },
  { name: "Cable Row", muscleGroup: "Back" },
  { name: "Seated Cable Row", muscleGroup: "Back" },
  { name: "T-Bar Row", muscleGroup: "Back" },
  { name: "Chest Supported Row", muscleGroup: "Back" },
  { name: "Machine Row", muscleGroup: "Back" },
  { name: "Pull-Ups", muscleGroup: "Back" },
  { name: "Chin-Ups", muscleGroup: "Back" },
  { name: "Lat Pulldown", muscleGroup: "Back" },
  { name: "Close Grip Lat Pulldown", muscleGroup: "Back" },
  { name: "Straight Arm Pulldown", muscleGroup: "Back" },
  { name: "Rack Pull", muscleGroup: "Back" },
  { name: "Back Extension", muscleGroup: "Back" },
  { name: "Shrugs", muscleGroup: "Back" },

  // ── Shoulders ──────────────────────────────────────────────────────────────
  { name: "Overhead Press", muscleGroup: "Shoulders" },
  { name: "Seated Barbell Press", muscleGroup: "Shoulders" },
  { name: "DB Shoulder Press", muscleGroup: "Shoulders" },
  { name: "Machine Shoulder Press", muscleGroup: "Shoulders" },
  { name: "Arnold Press", muscleGroup: "Shoulders" },
  { name: "Lateral Raises", muscleGroup: "Shoulders" },
  { name: "Cable Lateral Raise", muscleGroup: "Shoulders" },
  { name: "Machine Lateral Raise", muscleGroup: "Shoulders" },
  { name: "Front Raise", muscleGroup: "Shoulders" },
  { name: "Rear Delt Fly", muscleGroup: "Shoulders" },
  { name: "Reverse Pec Deck", muscleGroup: "Shoulders" },
  { name: "Face Pulls", muscleGroup: "Shoulders" },
  { name: "Upright Row", muscleGroup: "Shoulders" },

  // ── Biceps ─────────────────────────────────────────────────────────────────
  { name: "Bicep Curl", muscleGroup: "Biceps" },
  { name: "Barbell Curl", muscleGroup: "Biceps" },
  { name: "EZ Bar Curl", muscleGroup: "Biceps" },
  { name: "Dumbbell Curl", muscleGroup: "Biceps" },
  { name: "Hammer Curl", muscleGroup: "Biceps" },
  { name: "Incline Dumbbell Curl", muscleGroup: "Biceps" },
  { name: "Preacher Curl", muscleGroup: "Biceps" },
  { name: "Cable Curl", muscleGroup: "Biceps" },
  { name: "Concentration Curl", muscleGroup: "Biceps" },
  { name: "Spider Curl", muscleGroup: "Biceps" },

  // ── Triceps ────────────────────────────────────────────────────────────────
  { name: "Tricep Pushdown", muscleGroup: "Triceps" },
  { name: "Rope Pushdown", muscleGroup: "Triceps" },
  { name: "Overhead Tricep Extension", muscleGroup: "Triceps" },
  { name: "Cable Overhead Extension", muscleGroup: "Triceps" },
  { name: "Skull Crushers", muscleGroup: "Triceps" },
  { name: "Close Grip Bench Press", muscleGroup: "Triceps" },
  { name: "Tricep Dips", muscleGroup: "Triceps" },
  { name: "Tricep Kickback", muscleGroup: "Triceps" },
  { name: "JM Press", muscleGroup: "Triceps" },

  // ── Quads ──────────────────────────────────────────────────────────────────
  { name: "Squat", muscleGroup: "Quads" },
  { name: "Front Squat", muscleGroup: "Quads" },
  { name: "Hack Squat", muscleGroup: "Quads" },
  { name: "Smith Machine Squat", muscleGroup: "Quads" },
  { name: "Leg Press", muscleGroup: "Quads" },
  { name: "Leg Extension", muscleGroup: "Quads" },
  { name: "Bulgarian Split Squat", muscleGroup: "Quads" },
  { name: "Walking Lunges", muscleGroup: "Quads" },
  { name: "Goblet Squat", muscleGroup: "Quads" },
  { name: "Sissy Squat", muscleGroup: "Quads" },
  { name: "Step Ups", muscleGroup: "Quads" },

  // ── Hamstrings ─────────────────────────────────────────────────────────────
  { name: "Romanian Deadlift", muscleGroup: "Hamstrings" },
  { name: "Stiff Leg Deadlift", muscleGroup: "Hamstrings" },
  { name: "Leg Curl", muscleGroup: "Hamstrings" },
  { name: "Seated Leg Curl", muscleGroup: "Hamstrings" },
  { name: "Lying Leg Curl", muscleGroup: "Hamstrings" },
  { name: "Nordic Curl", muscleGroup: "Hamstrings" },
  { name: "Good Mornings", muscleGroup: "Hamstrings" },
  { name: "Glute Ham Raise", muscleGroup: "Hamstrings" },

  // ── Glutes ─────────────────────────────────────────────────────────────────
  { name: "Hip Thrust", muscleGroup: "Glutes" },
  { name: "Barbell Hip Thrust", muscleGroup: "Glutes" },
  { name: "Glute Bridge", muscleGroup: "Glutes" },
  { name: "Cable Kickback", muscleGroup: "Glutes" },
  { name: "Hip Abduction Machine", muscleGroup: "Glutes" },
  { name: "Sumo Deadlift", muscleGroup: "Glutes" },

  // ── Calves ─────────────────────────────────────────────────────────────────
  { name: "Calf Raises", muscleGroup: "Calves" },
  { name: "Standing Calf Raise", muscleGroup: "Calves" },
  { name: "Seated Calf Raise", muscleGroup: "Calves" },
  { name: "Leg Press Calf Raise", muscleGroup: "Calves" },

  // ── Core ───────────────────────────────────────────────────────────────────
  { name: "Plank", muscleGroup: "Core" },
  { name: "Crunches", muscleGroup: "Core" },
  { name: "Cable Crunch", muscleGroup: "Core" },
  { name: "Hanging Leg Raise", muscleGroup: "Core" },
  { name: "Hanging Knee Raise", muscleGroup: "Core" },
  { name: "Ab Wheel Rollout", muscleGroup: "Core" },
  { name: "Russian Twists", muscleGroup: "Core" },
  { name: "Side Plank", muscleGroup: "Core" },
  { name: "Sit-Ups", muscleGroup: "Core" },
  { name: "Decline Sit-Ups", muscleGroup: "Core" },

  // ── Forearms ───────────────────────────────────────────────────────────────
  { name: "Wrist Curl", muscleGroup: "Forearms" },
  { name: "Reverse Curl", muscleGroup: "Forearms" },
  { name: "Farmer's Walk", muscleGroup: "Forearms" },
  { name: "Dead Hang", muscleGroup: "Forearms" },

  // ── Cardio ─────────────────────────────────────────────────────────────────
  { name: "Treadmill", muscleGroup: "Cardio" },
  { name: "Incline Walk", muscleGroup: "Cardio" },
  { name: "Stairmaster", muscleGroup: "Cardio" },
  { name: "Rowing Machine", muscleGroup: "Cardio" },
  { name: "Assault Bike", muscleGroup: "Cardio" },
  { name: "Cycling", muscleGroup: "Cardio" },
  { name: "Elliptical", muscleGroup: "Cardio" },
  { name: "Jump Rope", muscleGroup: "Cardio" },
];

const byLowerName = new Map(
  EXERCISE_LIBRARY.map((e) => [e.name.toLowerCase(), e.muscleGroup])
);

// Best-effort muscle group lookup for coach-entered exercise names.
export function muscleGroupFor(name: string): MuscleGroup {
  const exact = byLowerName.get(name.trim().toLowerCase());
  if (exact) return exact;

  const n = name.toLowerCase();
  const rules: [RegExp, MuscleGroup][] = [
    [/bench|chest|fly|pec|push.?up|dip/, "Chest"],
    [/deadlift|row|pull.?up|chin.?up|pulldown|lat |shrug|back ext/, "Back"],
    [/shoulder|overhead|ohp|lateral|delt|face pull|arnold|upright/, "Shoulders"],
    [/curl.*(hammer|bicep|preacher|spider|concentration|ez|barbell|dumbbell|db|cable|incline)|bicep/, "Biceps"],
    [/tricep|pushdown|skull|close grip|kickback/, "Triceps"],
    [/squat|leg press|leg ext|lunge|step up/, "Quads"],
    [/rdl|romanian|leg curl|hamstring|nordic|good morning|glute ham/, "Hamstrings"],
    [/hip thrust|glute|abduct/, "Glutes"],
    [/calf/, "Calves"],
    [/plank|crunch|ab |abs|leg raise|sit.?up|russian/, "Core"],
    [/wrist|forearm|farmer|grip/, "Forearms"],
    [/treadmill|run|bike|cardio|row(ing)? machine|stair|elliptical|jump rope|walk/, "Cardio"],
    [/curl/, "Biceps"],
  ];
  for (const [re, group] of rules) {
    if (re.test(n)) return group;
  }
  return "Other";
}
