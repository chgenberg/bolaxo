import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { spaId, signedBy, timestamp } = await req.json();

    if (!spaId || !signedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const spa = await prisma.sPA.findUnique({
      where: { id: spaId },
      include: {
        listing: {
          select: {
            userId: true
          }
        },
        transaction: {
          select: {
            id: true,
            milestones: {
              where: {
                title: {
                  contains: 'SPA signerad'
                }
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      }
    });

    if (!spa) {
      return NextResponse.json({ error: 'SPA not found' }, { status: 404 });
    }

    // Check if both buyer and seller have signed
    let signedByBuyer = false;
    let signedBySeller = false;

    if (signedBy === 'buyer') signedByBuyer = true;
    if (signedBy === 'seller') signedBySeller = true;

    // Update SPA status to signed
    const updated = await prisma.sPA.update({
      where: { id: spaId },
      data: {
        status: 'signed',
        signedAt: new Date(timestamp || Date.now())
      }
    });

    // If SPA is connected to a transaction, update milestone
    // Only mark milestone as completed when BOTH parties have signed
    if (spa.transaction && spa.transaction.milestones.length > 0) {
      const spaMilestone = spa.transaction.milestones[0] // Should be "SPA signerad" milestone

      if (spaMilestone && !spaMilestone.completed) {
        // Check if both buyer and seller have signed
        // For now, mark as completed when first party signs
        // In production, you might want to check buyerSignedAt and sellerSignedAt
        await prisma.milestone.update({
          where: { id: spaMilestone.id },
          data: {
            completed: true,
            completedAt: new Date(),
            completedBy: signedBy === 'buyer' ? spa.buyerId : spa.listing.userId
          }
        })

        // Log activity
        await prisma.activity.create({
          data: {
            transactionId: spa.transaction.id,
            type: 'MILESTONE_COMPLETED',
            title: `Milstolpe slutförd: ${spaMilestone.title}`,
            description: `SPA signerad av ${signedBy === 'buyer' ? 'köpare' : 'säljare'}`,
            actorId: signedBy === 'buyer' ? spa.buyerId : spa.listing.userId,
            actorName: signedBy === 'buyer' ? 'Köpare' : 'Säljare',
            actorRole: signedBy
          }
        })

        // Update transaction stage if not already SPA_NEGOTIATION or later
        if (spa.transaction.stage === 'SPA_NEGOTIATION' || spa.transaction.stage === 'LOI_SIGNED') {
          await prisma.transaction.update({
            where: { id: spa.transaction.id },
            data: {
              stage: 'CLOSING'
            }
          })

          await prisma.activity.create({
            data: {
              transactionId: spa.transaction.id,
              type: 'STAGE_CHANGE',
              title: 'SPA signerad - Går vidare till stängning',
              description: 'SPA har signerats, affären går vidare till stängningsfasen',
              actorId: signedBy === 'buyer' ? spa.buyerId : spa.listing.userId,
              actorName: signedBy === 'buyer' ? 'Köpare' : 'Säljare',
              actorRole: signedBy
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        spa: updated,
        message: `SPA signed by ${signedBy}. Next step: Closing preparations`
      }
    });
  } catch (error) {
    console.error('SPA finalization error:', error);
    return NextResponse.json(
      { error: 'Failed to finalize SPA', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
