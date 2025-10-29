-- Add SME automation tables
ALTER TABLE "Listing" ADD COLUMN "advisorId" TEXT;

CREATE TABLE "FinancialData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL UNIQUE,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "uploadedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "normalizedEBITDA" REAL,
    "addBacks" TEXT,
    "workingCapital" REAL,
    "lastReviewedAt" TIMESTAMP,
    "reviewedByAdvisor" TEXT,
    "dataQuality" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "FinancialData_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE
);

CREATE TABLE "FinancialYear" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "financialDataId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "revenue" REAL NOT NULL,
    "costs" REAL NOT NULL,
    "ebitda" REAL NOT NULL,
    "ebit" REAL NOT NULL,
    "netIncome" REAL NOT NULL,
    "assets" REAL,
    "liabilities" REAL,
    "equity" REAL,
    "operatingCF" REAL,
    "investingCF" REAL,
    "financingCF" REAL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinancialYear_financialDataId_fkey" FOREIGN KEY ("financialDataId") REFERENCES "FinancialData" ("id") ON DELETE CASCADE
);

CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "importance" TEXT NOT NULL DEFAULT 'medium',
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "description" TEXT,
    "counterparty" TEXT,
    "startDate" TIMESTAMP,
    "endDate" TIMESTAMP,
    "terminationNotice" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "riskDescription" TEXT,
    "uploadedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Agreement_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE
);

CREATE TABLE "DataRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL UNIQUE,
    "structure" TEXT NOT NULL,
    "accessRules" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "DataRoom_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE
);

CREATE TABLE "DataRoomAccess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataRoomId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "filePath" TEXT,
    "fileName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataRoomAccess_dataRoomId_fkey" FOREIGN KEY ("dataRoomId") REFERENCES "DataRoom" ("id") ON DELETE CASCADE
);

CREATE TABLE "TeaserIM" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionnaire" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pptxUrl" TEXT,
    "generatedAt" TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "TeaserIM_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE
);

CREATE TABLE "NDASignature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "buyerName" TEXT,
    "templateVersion" TEXT NOT NULL DEFAULT 'v1',
    "customTerms" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "signedAt" TIMESTAMP,
    "signedUrl" TEXT,
    "bankIdRef" TEXT,
    "sentAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" TIMESTAMP,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "NDASignature_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE
);

CREATE TABLE "HandoffPack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL UNIQUE,
    "overview" TEXT NOT NULL,
    "zipUrl" TEXT,
    "zipGeneratedAt" TIMESTAMP,
    "advisorEmail" TEXT,
    "advisorName" TEXT,
    "handoffAt" TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "HandoffPack_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "FinancialYear_financialDataId_year_key" ON "FinancialYear"("financialDataId", "year");
CREATE INDEX "FinancialYear_financialDataId_idx" ON "FinancialYear"("financialDataId");
CREATE INDEX "FinancialData_listingId_idx" ON "FinancialData"("listingId");
CREATE INDEX "FinancialData_dataQuality_idx" ON "FinancialData"("dataQuality");
CREATE INDEX "Agreement_listingId_idx" ON "Agreement"("listingId");
CREATE INDEX "Agreement_type_idx" ON "Agreement"("type");
CREATE INDEX "Agreement_riskLevel_idx" ON "Agreement"("riskLevel");
CREATE INDEX "DataRoom_listingId_idx" ON "DataRoom"("listingId");
CREATE INDEX "DataRoomAccess_dataRoomId_idx" ON "DataRoomAccess"("dataRoomId");
CREATE INDEX "DataRoomAccess_buyerId_idx" ON "DataRoomAccess"("buyerId");
CREATE INDEX "DataRoomAccess_createdAt_idx" ON "DataRoomAccess"("createdAt");
CREATE INDEX "TeaserIM_listingId_idx" ON "TeaserIM"("listingId");
CREATE INDEX "TeaserIM_type_idx" ON "TeaserIM"("type");
CREATE INDEX "TeaserIM_status_idx" ON "TeaserIM"("status");
CREATE INDEX "NDASignature_listingId_idx" ON "NDASignature"("listingId");
CREATE INDEX "NDASignature_buyerId_idx" ON "NDASignature"("buyerId");
CREATE INDEX "NDASignature_status_idx" ON "NDASignature"("status");
CREATE INDEX "HandoffPack_listingId_idx" ON "HandoffPack"("listingId");
CREATE INDEX "HandoffPack_status_idx" ON "HandoffPack"("status");
