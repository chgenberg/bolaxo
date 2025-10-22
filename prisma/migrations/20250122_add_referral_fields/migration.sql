-- AlterTable
ALTER TABLE "User" ADD COLUMN "referralCode" TEXT,
ADD COLUMN "referredBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

