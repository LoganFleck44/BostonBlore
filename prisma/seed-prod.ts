import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashSync } from "bcryptjs";

// Production seed: creates ONLY the trainer (Boston) account. No demo clients,
// no demo passwords. Run once against the live database.
//
//   TRAINER_PASSWORD=<strong-password> npm run seed:prod
//
// Optional overrides: TRAINER_EMAIL, TRAINER_NAME.

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const db = new PrismaClient({ adapter } as never);

async function main() {
  const email = (process.env.TRAINER_EMAIL || "boston@bostonblore.com").toLowerCase();
  const name = process.env.TRAINER_NAME || "Boston Blore";
  const password = process.env.TRAINER_PASSWORD;

  if (!password || password.length < 8) {
    console.error("✗ TRAINER_PASSWORD env var is required (min 8 characters).");
    console.error("  Example: TRAINER_PASSWORD='your-strong-password' npm run seed:prod");
    process.exit(1);
  }

  const trainer = await db.user.upsert({
    where: { email },
    update: { name, password: hashSync(password, 12), role: "trainer" },
    create: { email, name, password: hashSync(password, 12), role: "trainer" },
  });

  console.log(`✅ Trainer account ready: ${trainer.email}`);
  console.log("   (No demo clients were created.)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
