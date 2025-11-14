-- CreateTable
CREATE TABLE "PrefillMetric" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "fieldsFilled" INTEGER NOT NULL,
    "totalFields" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrefillMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrefillMetric_source_idx" ON "PrefillMetric"("source");

-- CreateIndex
CREATE INDEX "PrefillMetric_createdAt_idx" ON "PrefillMetric"("createdAt");

