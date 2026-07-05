/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `LogSet` table. All the data in the column will be lost.
  - You are about to drop the column `logId` on the `LogSet` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `WorkoutLog` table. All the data in the column will be lost.
  - You are about to drop the column `dayLabel` on the `WorkoutLog` table. All the data in the column will be lost.
  - Added the required column `entryId` to the `LogSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `WorkoutLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "WorkoutLogEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "WorkoutLogEntry_logId_fkey" FOREIGN KEY ("logId") REFERENCES "WorkoutLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entryId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "setType" TEXT NOT NULL DEFAULT 'normal',
    "weight" REAL,
    "reps" INTEGER,
    "rpe" REAL,
    "isPr" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "LogSet_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WorkoutLogEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LogSet" ("completed", "id", "reps", "setNumber", "weight") SELECT "completed", "id", "reps", "setNumber", "weight" FROM "LogSet";
DROP TABLE "LogSet";
ALTER TABLE "new_LogSet" RENAME TO "LogSet";
CREATE TABLE "new_WorkoutLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "totalVolume" REAL NOT NULL DEFAULT 0,
    "totalSets" INTEGER NOT NULL DEFAULT 0,
    "prCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutLog" ("date", "id", "notes", "planId", "userId") SELECT "date", "id", "notes", "planId", "userId" FROM "WorkoutLog";
DROP TABLE "WorkoutLog";
ALTER TABLE "new_WorkoutLog" RENAME TO "WorkoutLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
