-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamMember_transactionId_idx" ON "TeamMember"("transactionId");

-- CreateIndex
CREATE INDEX "TeamMember_email_idx" ON "TeamMember"("email");

-- CreateIndex
CREATE INDEX "TeamMember_status_idx" ON "TeamMember"("status");
