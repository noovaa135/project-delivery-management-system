import { InvoicesDashboard } from "@/components/invoices-dashboard";
import { getInvoices } from "@/features/invoices/invoices-data";
import { requireSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;
  if (!orgId) redirect("/sign-in");

  const invoices = await getInvoices(orgId);

  return <InvoicesDashboard invoices={invoices} />;
}
