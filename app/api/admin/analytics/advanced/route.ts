import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// Advanced Analytics API with Cohort, Funnel, and Retention Analysis

// GET - Fetch advanced analytics data
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const metric = searchParams.get('metric') || 'cohort' // cohort, funnel, retention, all
    const dateRange = searchParams.get('dateRange') || '30' // days

    const daysBack = parseInt(dateRange)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    let response: any = {}

    // 1. COHORT ANALYSIS - Group users by signup date
    if (metric === 'cohort' || metric === 'all') {
      const cohorts: Record<string, any> = {}
      
      // Get users grouped by signup week
      const users = await prisma.user.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          listings: {
            select: { id: true, createdAt: true }
          }
        }
      })

      // Group by week
      users.forEach(user => {
        const week = new Date(user.createdAt)
        week.setDate(week.getDate() - week.getDay())
        const cohortKey = week.toISOString().split('T')[0]

        if (!cohorts[cohortKey]) {
          cohorts[cohortKey] = {
            week: cohortKey,
            totalUsers: 0,
            sellers: 0,
            buyers: 0,
            withListings: 0,
            avgListingsPerUser: 0,
            totalListings: 0
          }
        }

        cohorts[cohortKey].totalUsers++
        if (user.role === 'seller') cohorts[cohortKey].sellers++
        if (user.role === 'buyer') cohorts[cohortKey].buyers++
        if (user.listings.length > 0) cohorts[cohortKey].withListings++
        cohorts[cohortKey].totalListings += user.listings.length
      })

      Object.keys(cohorts).forEach(key => {
        cohorts[key].avgListingsPerUser = cohorts[key].totalUsers > 0 
          ? (cohorts[key].totalListings / cohorts[key].totalUsers).toFixed(2)
          : 0
      })

      response.cohort = {
        data: Object.values(cohorts),
        summary: {
          totalCohorts: Object.keys(cohorts).length,
          totalNewUsers: users.length,
          avgUsersPerCohort: (users.length / Object.keys(cohorts).length).toFixed(0),
          conversionToSeller: ((users.filter(u => u.role === 'seller').length / users.length) * 100).toFixed(1) + '%'
        }
      }
    }

    // 2. FUNNEL ANALYSIS - User journey
    if (metric === 'funnel' || metric === 'all') {
      // Get users in each stage of the funnel
      const allUsers = await prisma.user.count()
      const verifiedUsers = await prisma.user.count({
        where: { verified: true }
      })
      const bankIdVerifiedUsers = await prisma.user.count({
        where: { bankIdVerified: true }
      })
      const sellersWithListings = await prisma.user.count({
        where: {
          AND: [
            { role: 'seller' },
            { listings: { some: {} } }
          ]
        }
      })
      const sellersWithActiveListings = await prisma.user.count({
        where: {
          AND: [
            { role: 'seller' },
            { listings: { some: { status: 'active' } } }
          ]
        }
      })
      const sellersWithSales = await prisma.user.count({
        where: {
          AND: [
            { role: 'seller' },
            { listings: { some: { status: 'sold' } } }
          ]
        }
      })

      const stages = [
        { stage: 'Signed Up', count: allUsers, percentage: 100 },
        { stage: 'Email Verified', count: verifiedUsers, percentage: (verifiedUsers / allUsers * 100).toFixed(1) },
        { stage: 'BankID Verified', count: bankIdVerifiedUsers, percentage: (bankIdVerifiedUsers / allUsers * 100).toFixed(1) },
        { stage: 'Created Listing', count: sellersWithListings, percentage: (sellersWithListings / allUsers * 100).toFixed(1) },
        { stage: 'Active Listing', count: sellersWithActiveListings, percentage: (sellersWithActiveListings / allUsers * 100).toFixed(1) },
        { stage: 'Completed Sale', count: sellersWithSales, percentage: (sellersWithSales / allUsers * 100).toFixed(1) },
      ]

      response.funnel = {
        stages,
        dropoffAnalysis: stages.map((stage, idx) => ({
          stage: stage.stage,
          users: stage.count,
          dropoff: idx > 0 ? stages[idx - 1].count - stage.count : 0,
          dropoffRate: idx > 0 ? (((stages[idx - 1].count - stage.count) / stages[idx - 1].count) * 100).toFixed(1) + '%' : 'N/A'
        }))
      }
    }

    // 3. RETENTION ANALYSIS - How many users return
    if (metric === 'retention' || metric === 'all') {
      const retentionCohorts: Record<string, any> = {}

      // Get all transactions to understand engagement
      const allTransactions = await prisma.transaction.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          sellerId: true,
          createdAt: true
        }
      })

      // Group users by signup week and track repeat engagement
      const userEngagement: Record<string, any> = {}
      allTransactions.forEach(tx => {
        const userId = tx.sellerId
        if (!userEngagement[userId]) {
          userEngagement[userId] = {
            signupDate: tx.createdAt,
            transactions: 0,
            lastActive: tx.createdAt
          }
        }
        userEngagement[userId].transactions++
        userEngagement[userId].lastActive = new Date(Math.max(
          new Date(userEngagement[userId].lastActive).getTime(),
          new Date(tx.createdAt).getTime()
        ))
      })

      // Calculate retention by cohort
      const cohortRetention: Record<string, any> = {}
      Object.entries(userEngagement).forEach(([userId, data]) => {
        const signupWeek = new Date(data.signupDate)
        signupWeek.setDate(signupWeek.getDate() - signupWeek.getDay())
        const cohortKey = signupWeek.toISOString().split('T')[0]

        if (!cohortRetention[cohortKey]) {
          cohortRetention[cohortKey] = {
            week: cohortKey,
            daysSinceSignup: Math.floor((Date.now() - new Date(data.signupDate).getTime()) / (1000 * 60 * 60 * 24)),
            oneTransaction: 0,
            multipleTransactions: 0,
            activeThisWeek: 0,
            activeLastWeek: 0,
            activeTwoWeeksAgo: 0
          }
        }

        if (data.transactions >= 1) cohortRetention[cohortKey].oneTransaction++
        if (data.transactions > 1) cohortRetention[cohortKey].multipleTransactions++

        const daysSinceLastActive = Math.floor((Date.now() - new Date(data.lastActive).getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceLastActive <= 7) cohortRetention[cohortKey].activeThisWeek++
        if (daysSinceLastActive <= 14) cohortRetention[cohortKey].activeLastWeek++
        if (daysSinceLastActive <= 21) cohortRetention[cohortKey].activeTwoWeeksAgo++
      })

      response.retention = {
        data: Object.values(cohortRetention),
        summary: {
          totalActiveSellers: Object.keys(userEngagement).length,
          avgTransactionsPerSeller: (allTransactions.length / Object.keys(userEngagement).length).toFixed(2),
          repeatedTransactionRate: ((Object.values(userEngagement).filter((u: any) => u.transactions > 1).length / Object.keys(userEngagement).length) * 100).toFixed(1) + '%'
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: response,
      dateRange: `Last ${daysBack} days`
    })
  } catch (error) {
    console.error('Error fetching advanced analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advanced analytics' },
      { status: 500 }
    )
  }
}
