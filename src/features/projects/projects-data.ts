import { prisma } from "@/lib/db";
import type { ProjectStatus } from "@prisma/client";

export async function getProjects(organizationId: string) {
  const projects = await prisma.project.findMany({
    where: { organizationId },
    include: {
      _count: {
        select: {
          tasks: true,
          milestones: true,
          invoices: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects.map((p) => ({
    ...p,
    budget: p.budget ? Number(p.budget) : null,
    taskCount: p._count.tasks,
    milestoneCount: p._count.milestones,
    invoiceCount: p._count.invoices,
  }));
}

export async function getProjectById(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      milestones: {
        orderBy: { dueDate: "asc" },
      },
      tasks: {
        include: {
          assignee: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) return null;

  const { members, milestones, tasks, ...rest } = project;
  return {
    ...rest,
    budget: rest.budget ? Number(rest.budget) : null,
    members,
    milestones,
    tasks,
  };
}

export async function getTeamMembers(organizationId: string) {
  const members = await prisma.projectMember.findMany({
    where: { project: { organizationId } },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return members.map((m) => ({
    id: m.id,
    role: m.role,
    user: {
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
    },
  }));
}

export async function getProjectsSummary(organizationId: string) {
  const groups = await prisma.project.groupBy({
    by: ["status"],
    where: { organizationId },
    _count: { id: true },
  });

  const allStatuses: ProjectStatus[] = [
    "PLANNING",
    "ACTIVE",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED",
  ];

  const summary: Record<ProjectStatus, number> = Object.fromEntries(
    allStatuses.map((s) => [s, 0]),
  ) as Record<ProjectStatus, number>;

  for (const group of groups) {
    summary[group.status] = group._count.id;
  }

  return summary;
}
