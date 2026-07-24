import { ClientPortal } from "@/components/client-portal";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ClientPortalPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  const userId = session.user.id;
  if (!orgId) redirect("/sign-in");

  const [projects, deliverables] = await Promise.all([
    prisma.project.findMany({
      where: {
        organizationId,
        members: { some: { userId, role: "CLIENT" } },
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        targetDate: true,
        tasks: { select: { status: true } },
      },
    }),
    prisma.deliverable.findMany({
      where: {
        project: { organizationId, members: { some: { userId, role: "CLIENT" } } },
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        fileName: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const projectsWithProgress = projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.status === "DONE").length;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
      startDate: p.startDate,
      targetDate: p.targetDate,
    };
  });

  return (
    <ClientPortal
      projects={projectsWithProgress}
      deliverables={deliverables.map((d) => ({
        id: d.id,
        name: d.name,
        status: d.status,
        uploadedAt: d.createdAt,
        fileName: d.fileName,
      }))}
      clientName={session.user.name}
    />
  );
}
