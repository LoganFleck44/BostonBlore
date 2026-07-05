import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashSync } from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const db = new PrismaClient({ adapter } as never);

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Trainer: Boston ────────────────────────────────────────────────────────
  const boston = await db.user.upsert({
    where: { email: "boston@bostonblore.com" },
    update: {},
    create: {
      email: "boston@bostonblore.com",
      name: "Boston Blore",
      password: hashSync("coach123", 12),
      role: "trainer",
      hasPaid: true,
      activatedAt: new Date(),
    },
  });
  console.log("✓ Trainer:", boston.email);

  // ─── Client 1: Jordan ───────────────────────────────────────────────────────
  const jordan = await db.user.upsert({
    where: { email: "jordan@demo.com" },
    update: {},
    create: {
      email: "jordan@demo.com",
      name: "Jordan Mitchell",
      password: hashSync("client123", 12),
      role: "client",
      hasPaid: true,
      planInterest: "Full Coaching",
      inquirySubmittedAt: new Date(),
      activatedAt: new Date(),
      profile: {
        create: {
          goal: "Lose fat",
          experience: "Intermediate (1–3 years)",
          equipment: "Commercial gym",
          daysPerWeek: 4,
          currentWeight: 195,
          targetWeight: 175,
          onboardingDone: true,
        },
      },
    },
  });
  console.log("✓ Client:", jordan.email);

  // Assign workout plan to Jordan
  const existingPlan = await db.workoutPlan.findFirst({ where: { clientId: jordan.id, isActive: true } });
  if (!existingPlan) {
    await db.workoutPlan.create({
      data: {
        name: "4-Day Upper/Lower",
        clientId: jordan.id,
        trainerId: boston.id,
        isActive: true,
        notes: "Focus on form over weight. Rest 90s between sets.",
        days: {
          create: [
            {
              dayNumber: 1, label: "Upper A", isRest: false, order: 0,
              exercises: {
                create: [
                  { name: "Bench Press", sets: 4, reps: "6-8", rest: "2 min", order: 0 },
                  { name: "Barbell Row", sets: 4, reps: "6-8", rest: "2 min", order: 1 },
                  { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90s", order: 2 },
                  { name: "Pull-Ups", sets: 3, reps: "AMRAP", rest: "90s", order: 3 },
                  { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60s", order: 4 },
                ],
              },
            },
            {
              dayNumber: 2, label: "Lower A", isRest: false, order: 1,
              exercises: {
                create: [
                  { name: "Squat", sets: 4, reps: "6-8", rest: "2 min", order: 0 },
                  { name: "Romanian Deadlift", sets: 3, reps: "8-10", rest: "90s", order: 1 },
                  { name: "Leg Press", sets: 3, reps: "10-12", rest: "90s", order: 2 },
                  { name: "Leg Curl", sets: 3, reps: "10-12", rest: "60s", order: 3 },
                  { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60s", order: 4 },
                ],
              },
            },
            { dayNumber: 3, label: "Rest", isRest: true, order: 2, exercises: { create: [] } },
            {
              dayNumber: 4, label: "Upper B", isRest: false, order: 3,
              exercises: {
                create: [
                  { name: "Incline DB Press", sets: 4, reps: "8-10", rest: "90s", order: 0 },
                  { name: "Cable Row", sets: 4, reps: "10-12", rest: "90s", order: 1 },
                  { name: "DB Shoulder Press", sets: 3, reps: "10-12", rest: "75s", order: 2 },
                  { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "75s", order: 3 },
                  { name: "Bicep Curl", sets: 3, reps: "12-15", rest: "60s", order: 4 },
                  { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "60s", order: 5 },
                ],
              },
            },
            {
              dayNumber: 5, label: "Lower B", isRest: false, order: 4,
              exercises: {
                create: [
                  { name: "Deadlift", sets: 4, reps: "4-6", rest: "2-3 min", order: 0 },
                  { name: "Bulgarian Split Squat", sets: 3, reps: "10-12 each", rest: "90s", order: 1 },
                  { name: "Leg Extension", sets: 3, reps: "12-15", rest: "60s", order: 2 },
                  { name: "Seated Leg Curl", sets: 3, reps: "12-15", rest: "60s", order: 3 },
                ],
              },
            },
            { dayNumber: 6, label: "Rest", isRest: true, order: 5, exercises: { create: [] } },
            { dayNumber: 0, label: "Rest", isRest: true, order: 6, exercises: { create: [] } },
          ],
        },
      },
    });
    console.log("✓ Training plan assigned to Jordan");
  }

  // Meal plan for Jordan
  const existingMeal = await db.mealPlan.findFirst({ where: { clientId: jordan.id, isActive: true } });
  if (!existingMeal) {
    await db.mealPlan.create({
      data: {
        name: "2400 kcal Fat Loss",
        clientId: jordan.id,
        trainerId: boston.id,
        isActive: true,
        calories: 2400,
        protein: 200,
        carbs: 240,
        fat: 70,
        notes: "Eat protein at every meal. Carbs around training. Save fat for later in the day.",
        meals: {
          create: [
            { name: "Breakfast", time: "7:00 AM", calories: 550, protein: 45, carbs: 55, fat: 14, order: 0, foods: JSON.stringify([{ name: "Greek yogurt (2% fat)", amount: "250g", calories: 160, protein: 20 }, { name: "Oats", amount: "80g dry", calories: 290, protein: 10 }, { name: "Blueberries", amount: "100g", calories: 55, protein: 0 }, { name: "Whey protein", amount: "1 scoop", calories: 120, protein: 25 }]) },
            { name: "Lunch", time: "12:30 PM", calories: 650, protein: 55, carbs: 65, fat: 18, order: 1, foods: JSON.stringify([{ name: "Chicken breast (grilled)", amount: "180g", calories: 280, protein: 55 }, { name: "White rice (cooked)", amount: "180g", calories: 230, protein: 5 }, { name: "Broccoli", amount: "150g", calories: 50, protein: 4 }, { name: "Olive oil", amount: "1 tbsp", calories: 120, protein: 0 }]) },
            { name: "Pre-Workout", time: "3:30 PM", calories: 380, protein: 30, carbs: 50, fat: 5, order: 2, foods: JSON.stringify([{ name: "Rice cakes", amount: "4 pieces", calories: 140, protein: 3 }, { name: "Peanut butter", amount: "1 tbsp", calories: 95, protein: 4 }, { name: "Whey shake", amount: "1 scoop + water", calories: 120, protein: 25 }]) },
            { name: "Dinner", time: "7:00 PM", calories: 650, protein: 55, carbs: 55, fat: 20, order: 3, foods: JSON.stringify([{ name: "Lean ground beef (93%)", amount: "200g", calories: 300, protein: 45 }, { name: "Sweet potato", amount: "200g cooked", calories: 180, protein: 3 }, { name: "Mixed vegetables", amount: "200g", calories: 70, protein: 4 }, { name: "Shredded cheese", amount: "30g", calories: 100, protein: 6 }]) },
            { name: "Evening Snack", time: "9:00 PM", calories: 250, protein: 25, carbs: 15, fat: 10, order: 4, foods: JSON.stringify([{ name: "Cottage cheese (2%)", amount: "200g", calories: 180, protein: 24 }, { name: "Almonds", amount: "15g", calories: 90, protein: 3 }]) },
          ],
        },
      },
    });
    console.log("✓ Meal plan assigned to Jordan");
  }

  // Progress entries for Jordan
  const hasProgress = await db.progressEntry.findFirst({ where: { userId: jordan.id } });
  if (!hasProgress) {
    const now = Date.now();
    for (let i = 8; i >= 0; i--) {
      const date = new Date(now - i * 7 * 24 * 60 * 60 * 1000);
      await db.progressEntry.create({ data: { userId: jordan.id, date, weight: 195 - (8 - i) * 0.8, waist: 38 - (8 - i) * 0.2 } });
    }
    console.log("✓ Progress entries added for Jordan");
  }

  // Check-in + reply for Jordan
  const hasCheckIn = await db.checkIn.findFirst({ where: { userId: jordan.id } });
  if (!hasCheckIn) {
    await db.checkIn.create({
      data: {
        userId: jordan.id,
        energyLevel: 7,
        trainingAdhere: 9,
        nutritionAdhere: 7,
        wins: "Hit all 4 sessions, PR'd my bench by 5 lbs",
        struggles: "Nutrition was a bit off on the weekend — social stuff",
        questions: "Should I adjust calories on rest days?",
        trainerReply: "Great week — consistency is everything right now. On rest days you can drop carbs by about 50-75g and keep protein the same. Don't stress the weekends too much, you're trending in the right direction.",
        repliedAt: new Date(),
      },
    });
    console.log("✓ Check-in + reply added for Jordan");
  }

  // ─── Client 2: Alex ─────────────────────────────────────────────────────────
  const alex = await db.user.upsert({
    where: { email: "alex@demo.com" },
    update: {},
    create: {
      email: "alex@demo.com",
      name: "Alex Thompson",
      password: hashSync("client123", 12),
      role: "client",
      hasPaid: false,
      planInterest: "Online Training",
      inquirySubmittedAt: new Date(),
      profile: {
        create: {
          goal: "Build muscle",
          experience: "Beginner",
          equipment: "Commercial gym",
          daysPerWeek: 3,
          currentWeight: 155,
          onboardingDone: true,
        },
      },
    },
  });
  console.log("✓ Client:", alex.email);

  // ─── Logged workouts for Jordan (HEVY-style tracking history) ──────────────
  const hasWorkouts = await db.workoutLog.findFirst({ where: { userId: jordan.id } });
  if (!hasWorkouts) {
    // Baseline working weights; each week adds a little (progressive overload)
    const program: Record<string, { name: string; muscleGroup: string; base: number; reps: number; sets: number; inc: number }[]> = {
      "Upper A": [
        { name: "Bench Press", muscleGroup: "Chest", base: 175, reps: 8, sets: 4, inc: 5 },
        { name: "Barbell Row", muscleGroup: "Back", base: 155, reps: 8, sets: 4, inc: 5 },
        { name: "Overhead Press", muscleGroup: "Shoulders", base: 95, reps: 9, sets: 3, inc: 2.5 },
        { name: "Pull-Ups", muscleGroup: "Back", base: 0, reps: 8, sets: 3, inc: 0 },
        { name: "Lateral Raises", muscleGroup: "Shoulders", base: 20, reps: 13, sets: 3, inc: 0 },
      ],
      "Lower A": [
        { name: "Squat", muscleGroup: "Quads", base: 225, reps: 7, sets: 4, inc: 10 },
        { name: "Romanian Deadlift", muscleGroup: "Hamstrings", base: 185, reps: 9, sets: 3, inc: 5 },
        { name: "Leg Press", muscleGroup: "Quads", base: 360, reps: 11, sets: 3, inc: 10 },
        { name: "Leg Curl", muscleGroup: "Hamstrings", base: 110, reps: 11, sets: 3, inc: 5 },
        { name: "Calf Raises", muscleGroup: "Calves", base: 180, reps: 16, sets: 4, inc: 0 },
      ],
      "Upper B": [
        { name: "Incline DB Press", muscleGroup: "Chest", base: 65, reps: 9, sets: 4, inc: 2.5 },
        { name: "Cable Row", muscleGroup: "Back", base: 150, reps: 11, sets: 4, inc: 5 },
        { name: "DB Shoulder Press", muscleGroup: "Shoulders", base: 50, reps: 11, sets: 3, inc: 2.5 },
        { name: "Lat Pulldown", muscleGroup: "Back", base: 140, reps: 11, sets: 3, inc: 5 },
        { name: "Bicep Curl", muscleGroup: "Biceps", base: 30, reps: 13, sets: 3, inc: 0 },
        { name: "Tricep Pushdown", muscleGroup: "Triceps", base: 60, reps: 13, sets: 3, inc: 2.5 },
      ],
      "Lower B": [
        { name: "Deadlift", muscleGroup: "Back", base: 295, reps: 5, sets: 4, inc: 10 },
        { name: "Bulgarian Split Squat", muscleGroup: "Quads", base: 45, reps: 11, sets: 3, inc: 0 },
        { name: "Leg Extension", muscleGroup: "Quads", base: 130, reps: 13, sets: 3, inc: 5 },
        { name: "Seated Leg Curl", muscleGroup: "Hamstrings", base: 115, reps: 13, sets: 3, inc: 5 },
      ],
    };
    // Day-of-week offsets within each training week (Mon=Upper A … Fri=Lower B)
    const schedule: [string, number][] = [["Upper A", 0], ["Lower A", 1], ["Upper B", 3], ["Lower B", 4]];

    // Anchor: Monday three weeks back
    const monday = new Date();
    monday.setHours(17, 30, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) - 21);

    for (let week = 0; week < 3; week++) {
      for (const [label, offset] of schedule) {
        const date = new Date(monday.getTime() + (week * 7 + offset) * 86400000);
        if (date > new Date()) continue;
        const exercises = program[label];
        let totalVolume = 0;
        let totalSets = 0;
        let prCount = 0;

        const entriesData = exercises.map((ex, order) => {
          const weight = ex.base + ex.inc * week;
          const isLastWeek = week === 2;
          const sets = Array.from({ length: ex.sets }, (_, j) => {
            const topSet = j === ex.sets - 1;
            const reps = topSet ? ex.reps + 1 : ex.reps;
            const isPr = isLastWeek && topSet && ex.inc > 0;
            if (isPr) prCount++;
            if (weight > 0) totalVolume += weight * reps;
            totalSets++;
            return {
              setNumber: j + 1,
              setType: "normal",
              weight: weight > 0 ? weight : null,
              reps,
              rpe: topSet ? 9 : 7.5,
              completed: true,
              isPr,
            };
          });
          return { name: ex.name, muscleGroup: ex.muscleGroup, order, sets: { create: sets } };
        });

        await db.workoutLog.create({
          data: {
            userId: jordan.id,
            name: label,
            date,
            durationSec: 3300 + Math.round(Math.random() * 900),
            totalVolume,
            totalSets,
            prCount,
            entries: { create: entriesData },
          },
        });
      }
    }
    console.log("✓ 3 weeks of logged workouts added for Jordan");
  }

  // Message thread
  const hasMsg = await db.message.findFirst({ where: { fromId: jordan.id } });
  if (!hasMsg) {
    await db.message.create({ data: { fromId: jordan.id, toId: boston.id, body: "Hey Boston! Just finished Upper A — felt strong today. Bench went up 5 lbs from last week.", isRead: true } });
    await db.message.create({ data: { fromId: boston.id, toId: jordan.id, body: "That's what I like to hear! Keep the same weight next session and see if you can get a cleaner rep. We'll push it again the following week.", isRead: true } });
    await db.message.create({ data: { fromId: jordan.id, toId: boston.id, body: "Will do. Quick question — is it OK to add some cardio after my lower sessions or should I keep it separate?", isRead: false } });
    console.log("✓ Message thread added");
  }

  console.log("\n✅ Seed complete!\n");
  console.log("  Trainer login:  boston@bostonblore.com  /  coach123");
  console.log("  Client 1:       jordan@demo.com         /  client123");
  console.log("  Client 2:       alex@demo.com           /  client123\n");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
