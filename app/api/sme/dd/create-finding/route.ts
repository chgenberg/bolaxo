import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { ddProjectId, title, description, category, severity, riskAssessment, relatedTask } = await req.json();

    if (!ddProjectId || !title || !description || !category || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const finding = await prisma.dDFinding.create({
      data: {
        ddProjectId,
        title,
        description,
        category,
        severity,
        riskAssessment,
        relatedTask,
        resolved: false
      }
    });

    return NextResponse.json({
      success: true,
      data: finding
    });
  } catch (error) {
    console.error('DD finding creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create finding', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
