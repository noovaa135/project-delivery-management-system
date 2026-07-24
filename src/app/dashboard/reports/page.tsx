import { ReportsDashboard } from "@/components/reports-dashboard";
import { getReportMetrics, getProjectHealthDistribution, getBudgetSummary } from "@/features/reports/reports-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const [metrics, healthDist, budgetSummary] = await Promise.all([
    getReportMetrics(orgId),
    getProjectHealthDistribution(orgId),
    getBudgetSummary(orgId),
  ]);

  const healthDistribution = Object.entries(healthDist).map(([health, count]) => ({ health, count }));
  const totalRevenue = metrics.totalInvoiced;
  const paidInvoices = 0;
  const outstandingRevenue = metrics.totalInvoiced;

  return (
    <ReportsDashboard
      metrics={{ ...metrics, totalRevenue, paidInvoices, outstandingRevenue }}
      healthDistribution={healthDistribution}
      budgetSummary={{
        totalBudget: budgetSummary.reduce((s, p) => s + p.budget, 0),
        totalSpent: budgetSummary.reduce((s, p) => s + p.utilization * p.budget / 100, 0),
      }}
    />
  );
}
