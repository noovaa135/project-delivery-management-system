import { OverviewDashboard } from "@/components/overview-dashboard";
import { getOverviewActivity, getOverviewMetrics, getOverviewProgress } from "@/features/overview/overview-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await requireSession();
  const userId = session.user.id;
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const [metrics, activities, progress] = await Promise.all([
    getOverviewMetrics(userId, orgId),
    getOverviewActivity(orgId),
    getOverviewProgress(orgId),
  ]);

  const timelineActivities = activities.map((a) => ({
    id: a.id,
    action: a.action,
    entity: a.entity,
    description: a.description,
    createdAt: a.createdAt,
    user: a.user ? { name: a.user.name } : null,
  }));

  return (
    <OverviewDashboard
      userName={session.user.name}
      metrics={metrics}
      activities={timelineActivities}
      progress={progress}
    />
  );
}
