import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DD_STANDARD_CHECKLIST = [
  // Accounting
  { category: 'accounting', title: 'Review audited financials', priority: 'high', daysOut: 5 },
  { category: 'accounting', title: 'Tax returns analysis', priority: 'high', daysOut: 7 },
  { category: 'accounting', title: 'Accounts receivable aging', priority: 'medium', daysOut: 10 },
  { category: 'accounting', title: 'Inventory valuation', priority: 'medium', daysOut: 10 },
  
  // Legal
  { category: 'legal', title: 'Corporate governance review', priority: 'high', daysOut: 5 },
  { category: 'legal', title: 'Material contracts review', priority: 'high', daysOut: 7 },
  { category: 'legal', title: 'Litigation history check', priority: 'high', daysOut: 10 },
  { category: 'legal', title: 'Employment agreements review', priority: 'medium', daysOut: 12 },
  
  // IT
  { category: 'it', title: 'IT infrastructure assessment', priority: 'high', daysOut: 7 },
  { category: 'it', title: 'Cybersecurity review', priority: 'high', daysOut: 10 },
  { category: 'it', title: 'Software licensing audit', priority: 'medium', daysOut: 12 },
  
  // Financial
  { category: 'financial', title: 'Cash flow analysis', priority: 'high', daysOut: 5 },
  { category: 'financial', title: 'Debt obligations review', priority: 'high', daysOut: 7 },
  { category: 'financial', title: 'Working capital analysis', priority: 'high', daysOut: 10 },
  
  // Operations
  { category: 'operations', title: 'Supply chain assessment', priority: 'medium', daysOut: 10 },
  { category: 'operations', title: 'Key customer review', priority: 'high', daysOut: 12 },
  { category: 'operations', title: 'Key supplier review', priority: 'medium', daysOut: 12 },
  
  // HR
  { category: 'hr', title: 'Employee agreements', priority: 'medium', daysOut: 10 },
  { category: 'hr', title: 'Pension obligations', priority: 'medium', daysOut: 12 },
];

export async function POST(req: NextRequest) {
  try {
    const { listingId, buyerId, targetCompleteDays = 30 } = await req.json();

    if (!listingId || !buyerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Calculate target completion date
    const targetCompleteDate = new Date();
    targetCompleteDate.setDate(targetCompleteDate.getDate() + targetCompleteDays);

    // Create DD Project
    const ddProject = await prisma.dDProject.create({
      data: {
        listingId,
        buyerId,
        targetCompleteDate,
        status: 'planning',
      },
    });

    // Create tasks from standard checklist
    const tasks = await Promise.all(
      DD_STANDARD_CHECKLIST.map((item) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + item.daysOut);

        return prisma.dDTask.create({
          data: {
            ddProjectId: ddProject.id,
            title: item.title,
            category: item.category,
            priority: item.priority,
            dueDate,
            status: 'open',
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        project: ddProject,
        tasks: tasks.length,
        tasksByCategory: groupByCategory(tasks),
      },
    });
  } catch (error) {
    console.error('DD project creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create DD project',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function groupByCategory(tasks: any[]): Record<string, number> {
  return tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}
