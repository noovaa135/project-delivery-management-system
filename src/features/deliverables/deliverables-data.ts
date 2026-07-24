import { prisma } from "@/lib/db";

export async function getDeliverables(organizationId: string) {
  const deliverables = await prisma.deliverable.findMany({
    where: { project: { organizationId } },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
      milestone: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return deliverables;
}

export async function getDeliverablesByProject(projectId: string) {
  const deliverables = await prisma.deliverable.findMany({
    where: { projectId },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
      milestone: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return deliverables;
}

export async function getDeliverableById(id: string) {
  const deliverable = await prisma.deliverable.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true, image: true },
      },
      project: {
        select: { id: true, name: true },
      },
      milestone: {
        select: { id: true, name: true },
      },
    },
  });

  return deliverable;
}
