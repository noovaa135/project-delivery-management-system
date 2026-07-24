import { KanbanBoard } from "@/components/kanban-board";
import { getTasks } from "@/features/tasks/tasks-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function KanbanPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const tasks = await getTasks(orgId);

  return <KanbanBoard tasks={tasks} />;
}
