-- Add new financial fields
ALTER TABLE "Listing" ADD COLUMN "revenue3Years" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "revenueGrowthRate" DOUBLE PRECISION;
ALTER TABLE "Listing" ADD COLUMN "askingPrice" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "profitMargin" DOUBLE PRECISION;
ALTER TABLE "Listing" ADD COLUMN "grossMargin" DOUBLE PRECISION;
ALTER TABLE "Listing" ADD COLUMN "companyAge" INTEGER;

-- Add balance sheet fields
ALTER TABLE "Listing" ADD COLUMN "cash" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "accountsReceivable" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "inventory" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "totalAssets" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "totalLiabilities" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "shortTermDebt" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "longTermDebt" INTEGER;

-- Add operating costs fields
ALTER TABLE "Listing" ADD COLUMN "operatingCosts" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "salaries" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "rentCosts" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "marketingCosts" INTEGER;
ALTER TABLE "Listing" ADD COLUMN "otherOperatingCosts" INTEGER;

-- Add qualitative fields
ALTER TABLE "Listing" ADD COLUMN "competitiveAdvantages" TEXT;
ALTER TABLE "Listing" ADD COLUMN "regulatoryLicenses" TEXT;
ALTER TABLE "Listing" ADD COLUMN "paymentTerms" TEXT;
ALTER TABLE "Listing" ADD COLUMN "idealBuyer" TEXT;
ALTER TABLE "Listing" ADD COLUMN "customerConcentrationRisk" TEXT;
