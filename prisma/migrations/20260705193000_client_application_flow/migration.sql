-- AlterTable
ALTER TABLE "User" ADD COLUMN "hasPaid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "planInterest" TEXT;
ALTER TABLE "User" ADD COLUMN "inquirySubmittedAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "activatedAt" DATETIME;

-- Existing users are already established accounts and should keep access.
UPDATE "User"
SET "hasPaid" = true,
    "activatedAt" = COALESCE("activatedAt", CURRENT_TIMESTAMP)
WHERE "role" IN ('trainer', 'client');

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
