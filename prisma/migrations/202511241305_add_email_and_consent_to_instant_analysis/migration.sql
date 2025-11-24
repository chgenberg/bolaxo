-- Add optional email and consent tracking to instant analysis records
ALTER TABLE "InstantAnalysis"
ADD COLUMN     "email" TEXT,
ADD COLUMN     "hasConsented" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "InstantAnalysis_email_idx" ON "InstantAnalysis"("email");

