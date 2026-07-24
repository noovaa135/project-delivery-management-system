import { prisma } from "@/lib/db";

export async function getMilestones(organizationId: string) {
  const milestones = await prisma.milestone.findMany({
    where: { project: { organizationId } },
    include: {
      project: {
        select: { id: true, name: true },
      },
      _count: {
        select: { tasks: true, deliverables: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return milestones.map((m) => ({
    ...m,
    progress: 0,
  }));
}

export async function getMilestonesByProject(projectId: string) {
  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    include: {
      project: {
        select: { id: true, name: true },
      },
      _count: {
        select: { tasks: true, deliverables: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return milestones.map((m) => ({
    ...m,
    progress: 0,
  }));
}

export async function getUpcomingMilestones(
  organizationId: string,
  limit?: number,
) {
  const milestones = await prisma.milestone.findMany({
    where: {
      project: { organizationId },
      completedAt: null,
      dueDate: { gte: new Date() },
    },
    include: {
      project: {
        select: { id: true, name: true },
      },
      _count: {
        select: { tasks: true, deliverables: true },
      },
    },
    orderBy: { dueDate: "asc" },
    take: limit ?? 10,
  });

  return milestones;
}
