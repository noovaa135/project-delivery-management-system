import { CalendarView } from "@/components/calendar-view";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function CalendarPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const [tasks, milestones, deliverables] = await Promise.all([
    prisma.task.findMany({
      where: { project: { organizationId }, dueDate: { not: null } },
      select: { id: true, title: true, dueDate: true, project: { select: { name: true } } },
      take: 50,
    }),
    prisma.milestone.findMany({
      where: { project: { organizationId }, dueDate: { not: null } },
      select: { id: true, name: true, dueDate: true, project: { select: { name: true } } },
      take: 50,
    }),
    prisma.deliverable.findMany({
      where: { project: { organizationId } },
      select: { id: true, name: true, createdAt: true, project: { select: { name: true } } },
      take: 50,
    }),
  ]);

  const events = [
    ...tasks.map((t) => ({
      id: t.id,
      title: t.title,
      date: t.dueDate!,
      type: "task" as const,
      project: t.project.name,
    })),
    ...milestones.map((m) => ({
      id: m.id,
      title: m.name,
      date: m.dueDate!,
      type: "milestone" as const,
      project: m.project.name,
    })),
    ...deliverables.map((d) => ({
      id: d.id,
      title: d.name,
      date: d.createdAt,
      type: "deliverable" as const,
      project: d.project.name,
    })),
  ];

  return <CalendarView events={events} />;
}
