import { prisma } from "@/lib/db";
import type { TaskStatus } from "@prisma/client";

interface TaskFilters {
  projectId?: string;
  assigneeId?: string;
  status?: string;
}

export async function getTasks(organizationId: string, filters?: TaskFilters) {
  const where: Record<string, unknown> = {
    project: { organizationId },
  };

  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters?.status) where.status = filters.status;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignee: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map((t) => ({
    ...t,
    estimatedHours: t.estimatedHours ? Number(t.estimatedHours) : null,
    actualHours: t.actualHours ? Number(t.actualHours) : null,
  }));
}

export async function getTasksByUser(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { assigneeId: userId },
    include: {
      assignee: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true, status: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return tasks.map((t) => ({
    ...t,
    estimatedHours: t.estimatedHours ? Number(t.estimatedHours) : null,
    actualHours: t.actualHours ? Number(t.actualHours) : null,
  }));
}

export async function getDashboardTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { assigneeId: userId },
    include: {
      assignee: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return tasks.map((t) => ({
    ...t,
    estimatedHours: t.estimatedHours ? Number(t.estimatedHours) : null,
    actualHours: t.actualHours ? Number(t.actualHours) : null,
  }));
}

export async function getTasksSummary(organizationId: string) {
  const groups = await prisma.task.groupBy({
    by: ["status"],
    where: { project: { organizationId } },
    _count: { id: true },
  });

  const allStatuses: TaskStatus[] = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "DONE",
  ];

  const summary: Record<TaskStatus, number> = Object.fromEntries(
    allStatuses.map((s) => [s, 0]),
  ) as Record<TaskStatus, number>;

  for (const group of groups) {
    summary[group.status] = group._count.id;
  }

  return summary;
}
