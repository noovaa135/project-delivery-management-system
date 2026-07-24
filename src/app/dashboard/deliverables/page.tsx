import { DeliverablesDashboard } from "@/components/deliverables-dashboard";
import { getDeliverables } from "@/features/deliverables/deliverables-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function DeliverablesPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const deliverables = await getDeliverables(orgId);

  return <DeliverablesDashboard deliverables={deliverables} />;
}
