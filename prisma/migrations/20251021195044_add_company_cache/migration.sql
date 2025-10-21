-- CreateTable
CREATE TABLE "Valuation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "companyName" TEXT,
    "industry" TEXT,
    "inputJson" JSONB NOT NULL,
    "resultJson" JSONB NOT NULL,
    "mostLikely" INTEGER NOT NULL,
    "minValue" INTEGER NOT NULL,
    "maxValue" INTEGER NOT NULL,

    CONSTRAINT "Valuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyCache" (
    "id" TEXT NOT NULL,
    "orgNumber" TEXT,
    "websiteUrl" TEXT,
    "enrichedData" JSONB NOT NULL,
    "scrapedPages" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCache_orgNumber_key" ON "CompanyCache"("orgNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCache_websiteUrl_key" ON "CompanyCache"("websiteUrl");
