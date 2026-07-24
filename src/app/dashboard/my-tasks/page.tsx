import { TasksDashboard } from "@/components/tasks-dashboard";
import { getDashboardTasks } from "@/features/tasks/tasks-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function MyTasksPage() {
  const session = await requireSession();
  const userId = session.user.id;
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const tasks = await getDashboardTasks(userId);

  return <TasksDashboard tasks={tasks} />;
}
