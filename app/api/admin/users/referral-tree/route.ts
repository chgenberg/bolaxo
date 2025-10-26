import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Fetch the user and all referrals
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        referralCode: true,
        referredBy: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all users who used this user's referral code
    const referrals = await prisma.user.findMany({
      where: { referredBy: user.referralCode },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        referralCode: true,
      }
    })

    // Get referrer if this user was referred
    const referrer = user.referredBy
      ? await prisma.user.findFirst({
        where: { referralCode: user.referredBy },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        }
      })
      : null

    // Get all indirect referrals (referrals of referrals)
    let indirectReferrals: any[] = []
    if (referrals.length > 0) {
      indirectReferrals = await prisma.user.findMany({
        where: {
          referredBy: {
            in: referrals.map(r => r.referralCode).filter(Boolean) as string[]
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          referredBy: true,
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        referrer,
        directReferrals: referrals,
        indirectReferrals,
        stats: {
          directReferralCount: referrals.length,
          indirectReferralCount: indirectReferrals.length,
          totalReferrals: referrals.length + indirectReferrals.length,
        }
      }
    })
  } catch (error) {
    console.error('Error fetching referral tree:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral tree' },
      { status: 500 }
    )
  }
}
