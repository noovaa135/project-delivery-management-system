import { MilestonesDashboard } from "@/components/milestones-dashboard";
import { getMilestones } from "@/features/milestones/milestones-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function MilestonesPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const milestones = await getMilestones(orgId);

  return <MilestonesDashboard milestones={milestones} />;
}
