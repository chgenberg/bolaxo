-- CreateTable
CREATE TABLE "InstantAnalysis" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "domain" TEXT,
    "orgNumber" TEXT,
    "locale" TEXT,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstantAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstantAnalysis_createdAt_idx" ON "InstantAnalysis"("createdAt");

