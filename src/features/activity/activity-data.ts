import { prisma } from "@/lib/db";

export async function getRecentActivity(
  organizationId: string,
  limit?: number,
) {
  const activity = await prisma.activityLog.findMany({
    where: { project: { organizationId } },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit ?? 20,
  });

  return activity;
}

export async function getProjectActivity(projectId: string, limit?: number) {
  const activity = await prisma.activityLog.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit ?? 20,
  });

  return activity;
}
