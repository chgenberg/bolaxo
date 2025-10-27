# Seeding Database with 20 Mock Objects

## Overview

The database is now configured to hold all 20 mock objects as real listings with proper metadata. To populate your database, run the seed script.

## How to Seed

### Option 1: Using Prisma CLI (Recommended)

```bash
npx prisma db seed
```

This will:
1. Create 3 demo users (seller, buyer, advisor)
2. Create sample valuations
3. Create a sample transaction with all related documents and milestones
4. Create unique seller accounts for all 20 mock objects
5. Insert all 20 listings into the database with proper metadata

### Option 2: Manual TypeScript Execution

```bash
npx ts-node prisma/seed.ts
```

## What Gets Created

### Users (23 total)
- **demo.seller@bolaxo.se** - Main demo seller
- **demo.buyer@bolaxo.se** - Demo buyer account
- **advisor@bolaxo.se** - Demo advisor
- **seller-obj-001@bolaxo.se** through **seller-obj-020@bolaxo.se** - One seller per listing

### Listings (20 total)
All 20 mock objects from `data/mockObjects.ts` get inserted with:
- Full company information (name, org number, address)
- Financial data (revenue, EBITDA, pricing)
- Descriptions, strengths, and risks
- Images and metadata
- Status: active, Package: pro
- Proper seller relationships

### Demo Data
- 3 valuations
- 1 transaction (obj-001) with all documents, milestones, payments, and activity

## After Seeding

1. **Search page** (`/sok`) will now pull from the real database
2. **Individual listings** (`/objekt/[id]`) will load from database
3. **Seller dashboard** can be accessed to edit listings
4. **All filters** will work with real data from the database

## Test Accounts

After seeding, you can log in with:
- Email: Any of the created accounts above
- Magic link: Will be sent to email (no password needed)

Or test with seller account:
- Email: `seller-obj-001@bolaxo.se`
- Log in to see/edit the listing

## Database Schema

The Listing model includes all necessary fields:
- Company information (name, org number, website)
- Location data (city, region, address)
- Financial data (revenue, EBITDA, employees, pricing)
- Content (description, strengths, risks, why selling)
- Media (images)
- Status and package information
- Timestamps and user relationships

## Resetting Database

To clear everything and reseed:

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate from migrations
3. Automatically run seed.ts

⚠️ Warning: This will delete all data!

## Troubleshooting

### "Migration failed"
- Make sure DATABASE_URL is set in .env.local
- Check that PostgreSQL is running
- Run: `npx prisma migrate deploy` first

### "Seed failed"
- Check that mockObjects.ts exists and is properly imported
- Ensure all timestamps in mockObjects are Date objects
- Run `npx prisma generate` to regenerate Prisma client

### "Listings not showing"
- Check that seed completed successfully
- Verify `/api/listings?status=active` returns data
- Check database directly: `npx prisma studio`
