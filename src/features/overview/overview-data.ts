import { prisma } from "@/lib/db";

export async function getOverviewMetrics(
  userId: string,
  organizationId: string,
) {
  const [
    activeProjects,
    tasksDue,
    upcomingMilestonesCount,
    healthGroups,
  ] = await Promise.all([
    prisma.project.count({
      where: { organizationId, status: "ACTIVE" },
    }),
    prisma.task.count({
      where: {
        assigneeId: userId,
        status: { not: "DONE" },
        dueDate: { not: null },
      },
    }),
    prisma.milestone.count({
      where: {
        project: { organizationId },
        completedAt: null,
        dueDate: { gte: new Date() },
      },
    }),
    prisma.project.groupBy({
      by: ["health"],
      where: { organizationId },
      _count: { id: true },
    }),
  ]);

  const totalHealthProjects = healthGroups.reduce(
    (sum, g) => sum + g._count.id,
    0,
  );
  const onTrack =
    healthGroups.find((g) => g.health === "on-track")?._count.id ?? 0;
  const healthPercentage =
    totalHealthProjects > 0
      ? Math.round((onTrack / totalHealthProjects) * 100)
      : 0;

  return {
    activeProjects,
    tasksDue,
    upcomingMilestones: upcomingMilestonesCount,
    projectHealth: healthPercentage,
  };
}

export async function getOverviewActivity(organizationId: string) {
  const activity = await prisma.activityLog.findMany({
    where: { project: { organizationId } },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return activity;
}

export async function getOverviewProgress(organizationId: string) {
  const projects = await prisma.project.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      tasks: {
        select: { status: true },
      },
    },
  });

  return projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.status === "DONE").length;
    return {
      id: p.id,
      name: p.name,
      totalTasks: total,
      completedTasks: done,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });
}
