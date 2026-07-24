import { TeamManagement } from "@/components/team-management";
import { getTeamMembers } from "@/features/projects/projects-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const members = await getTeamMembers(orgId);

  return <TeamManagement members={members} />;
}
