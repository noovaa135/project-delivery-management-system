import { prisma } from "@/lib/db";

export async function getReportMetrics(organizationId: string) {
  const [
    projectCount,
    taskCounts,
    invoiceAgg,
    activeProjects,
    completedProjects,
  ] = await Promise.all([
    prisma.project.count({ where: { organizationId } }),
    prisma.task.groupBy({
      by: ["status"],
      where: { project: { organizationId } },
      _count: { id: true },
    }),
    prisma.invoice.aggregate({
      where: { project: { organizationId } },
      _sum: { total: true, tax: true, amount: true },
    }),
    prisma.project.count({
      where: { organizationId, status: "ACTIVE" },
    }),
    prisma.project.count({
      where: { organizationId, status: "COMPLETED" },
    }),
  ]);

  const totalTasks = taskCounts.reduce(
    (sum, g) => sum + g._count.id,
    0,
  );
  const completedTasks =
    taskCounts.find((g) => g.status === "DONE")?._count.id ?? 0;

  return {
    totalProjects: projectCount,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    totalInvoiced: Number(invoiceAgg._sum.total ?? 0),
    totalTax: Number(invoiceAgg._sum.tax ?? 0),
    totalAmount: Number(invoiceAgg._sum.amount ?? 0),
  };
}

export async function getProjectHealthDistribution(
  organizationId: string,
) {
  const groups = await prisma.project.groupBy({
    by: ["health"],
    where: { organizationId },
    _count: { id: true },
  });

  return Object.fromEntries(
    groups.map((g) => [g.health, g._count.id]),
  );
}

export async function getBudgetSummary(organizationId: string) {
  const projects = await prisma.project.findMany({
    where: {
      organizationId,
      budget: { not: null },
    },
    select: {
      id: true,
      name: true,
      budget: true,
      tasks: {
        select: { actualHours: true },
      },
    },
  });

  return projects.map((p) => {
    const budget = Number(p.budget ?? 0);
    const totalActualHours = p.tasks.reduce(
      (sum, t) => sum + Number(t.actualHours ?? 0),
      0,
    );

    return {
      id: p.id,
      name: p.name,
      budget,
      actualSpend: totalActualHours,
      remaining: budget - totalActualHours,
      utilization:
        budget > 0
          ? Math.round((totalActualHours / budget) * 10000) / 100
          : 0,
    };
  });
}
