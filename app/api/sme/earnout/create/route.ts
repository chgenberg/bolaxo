import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      sellerId,
      buyerId,
      spaId,
      totalEarnoutAmount, // Max earnout in SEK
      period, // Months (usually 36)
      kpiType, // revenue, ebitda, gross_profit
      kpiTargets, // {year1: 10000000, year2: 12000000, year3: 14000000}
    } = await req.json();

    if (
      !listingId ||
      !sellerId ||
      !buyerId ||
      !totalEarnoutAmount ||
      !period ||
      !kpiType ||
      !kpiTargets
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate earnout end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + period);

    // Create earnout
    const earnout = await prisma.earnOut.create({
      data: {
        listingId,
        sellerId,
        buyerId,
        spaId: spaId || undefined,
        totalEarnoutAmount,
        period,
        startDate,
        endDate,
        kpiType,
        kpiTarget: kpiTargets,
        status: 'active',
      },
    });

    // Create payment records for each year
    const years = Object.keys(kpiTargets).length;
    const payments = await Promise.all(
      Array.from({ length: years }, (_, i) => {
        const year = new Date().getFullYear() + i + 1;
        return prisma.earnoutPayment.create({
          data: {
            earnOutId: earnout.id,
            period: i + 1,
            year,
            targetKPI: kpiTargets[`year${i + 1}`] || 0,
            actualKPI: 0,
            achievementPercent: 0,
            earnedAmount: 0,
            status: 'pending',
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        earnout,
        payments: payments.length,
        summary: {
          totalEarnout: totalEarnoutAmount,
          period: `${period} months`,
          endDate,
          kpiType,
          yearsTracked: years,
        },
      },
    });
  } catch (error) {
    console.error('Earnout creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create earnout structure',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
