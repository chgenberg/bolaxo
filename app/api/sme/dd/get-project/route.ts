import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const listingId = searchParams.get('listingId');

    if (!projectId && !listingId) {
      return NextResponse.json(
        { error: 'Missing projectId or listingId' },
        { status: 400 }
      );
    }

    // Fetch project
    const project = await prisma.dDProject.findFirst({
      where: projectId ? { id: projectId } : { listingId: listingId! },
      include: {
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
        findings: {
          orderBy: { severity: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Calculate metrics
    const metrics = calculateMetrics(project);

    return NextResponse.json({
      success: true,
      data: {
        project,
        metrics,
        tasksByStatus: groupByStatus(project.tasks),
        tasksByCategory: groupByCategory(project.tasks),
        findingsBySeverity: groupBySeverity(project.findings),
        overdueTasks: project.tasks.filter(
          (t) => t.dueDate < new Date() && t.status !== 'complete'
        ),
        nextMilestones: getNextMilestones(project.tasks),
      },
    });
  } catch (error) {
    console.error('DD project fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch DD project',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function calculateMetrics(project: any) {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t: any) => t.status === 'complete').length;
  const completionPercent = Math.round((completedTasks / totalTasks) * 100);

  const totalFindings = project.findings.length;
  const unresolvedFindings = project.findings.filter((f: any) => !f.resolved).length;

  const criticalFindings = project.findings.filter((f: any) => f.severity === 'critical').length;
  const highFindings = project.findings.filter((f: any) => f.severity === 'high').length;

  const now = new Date();
  const overdueTasks = project.tasks.filter(
    (t: any) => t.dueDate < now && t.status !== 'complete'
  ).length;

  return {
    totalTasks,
    completedTasks,
    completionPercent,
    totalFindings,
    unresolvedFindings,
    criticalFindings,
    highFindings,
    overdueTasks,
    riskLevel:
      criticalFindings > 0 ? 'critical' : highFindings >= 3 ? 'high' : 'medium',
  };
}

function groupByStatus(tasks: any[]): Record<string, number> {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
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

function groupBySeverity(findings: any[]): Record<string, number> {
  return findings.reduce(
    (acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

function getNextMilestones(tasks: any[]) {
  return tasks
    .filter((t) => t.status !== 'complete')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5)
    .map((t) => ({
      title: t.title,
      dueDate: t.dueDate,
      category: t.category,
      priority: t.priority,
      daysUntil: Math.floor(
        (t.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));
}
