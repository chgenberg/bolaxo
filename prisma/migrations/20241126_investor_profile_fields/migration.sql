-- Add new fields to BuyerProfile for investor profile wizard

-- Step 1: Basic Info fields
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'Sverige';
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "orgNo" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "linkedin" TEXT;

-- Step 2: Investor Profile fields
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "investorDescription" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "targetTypeText" TEXT;

-- Step 4: Company Status (array of status IDs)
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "companyStatus" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- Step 5: Investment range and profitability
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "investMin" INTEGER;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "investMax" INTEGER;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "profitabilityLevels" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 6: Ownership preferences
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "ownership" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 7: Deal preferences
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "situations" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "ownerStay" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "earnOut" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "takeOverLoans" TEXT;

-- Step 8: Verification
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "verificationMethod" TEXT;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);

-- Profile completion tracking
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "profileComplete" BOOLEAN DEFAULT false;
ALTER TABLE "BuyerProfile" ADD COLUMN IF NOT EXISTS "completedSteps" INTEGER DEFAULT 0;

-- Add index for profile completion status
CREATE INDEX IF NOT EXISTS "BuyerProfile_profileComplete_idx" ON "BuyerProfile"("profileComplete");

