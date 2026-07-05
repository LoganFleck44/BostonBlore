ALTER TABLE "User" ADD COLUMN "engagementStatus" TEXT NOT NULL DEFAULT 'pending';

UPDATE "User"
SET "engagementStatus" = CASE
  WHEN "role" = 'trainer' THEN 'active'
  WHEN "hasPaid" = true THEN 'active'
  ELSE 'pending'
END;
