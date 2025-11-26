-- CreateTable
CREATE TABLE IF NOT EXISTS "SellerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT DEFAULT 'Sverige',
    "city" TEXT,
    "sellerType" TEXT,
    "orgId" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "sellerDescription" TEXT,
    "situationText" TEXT,
    "regions" TEXT[],
    "branches" TEXT[],
    "companyStatus" INTEGER[],
    "verificationMethod" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SellerProfile_userId_key" ON "SellerProfile"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SellerProfile_userId_idx" ON "SellerProfile"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SellerProfile_profileComplete_idx" ON "SellerProfile"("profileComplete");

-- AddForeignKey
ALTER TABLE "SellerProfile" ADD CONSTRAINT "SellerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

