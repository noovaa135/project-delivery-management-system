import { ProjectsDashboard } from "@/components/projects-dashboard";
import { getProjects } from "@/features/projects/projects-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const projects = await getProjects(orgId);

  return <ProjectsDashboard projects={projects} />;
}
