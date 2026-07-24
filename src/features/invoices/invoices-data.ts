import { prisma } from "@/lib/db";
import type { InvoiceStatus } from "@prisma/client";

export async function getInvoices(organizationId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { project: { organizationId } },
    include: {
      project: {
        select: { id: true, name: true },
      },
      client: {
        select: { id: true, name: true, email: true },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map((inv) => ({
    ...inv,
    amount: Number(inv.amount),
    tax: Number(inv.tax),
    total: Number(inv.total),
    payments: inv.payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
    })),
  }));
}

export async function getInvoiceById(id: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: {
        select: { id: true, name: true },
      },
      client: {
        select: { id: true, name: true, email: true },
      },
      payments: {
        orderBy: { paidAt: "desc" },
      },
    },
  });

  if (!invoice) return null;

  return {
    ...invoice,
    amount: Number(invoice.amount),
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    payments: invoice.payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
    })),
  };
}

export async function getInvoicesSummary(organizationId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { project: { organizationId } },
    select: { status: true, total: true },
  });

  const allStatuses: InvoiceStatus[] = [
    "DRAFT",
    "SENT",
    "PAID",
    "OVERDUE",
    "CANCELLED",
  ];

  const summary: Record<InvoiceStatus, { count: number; total: number }> =
    Object.fromEntries(
      allStatuses.map((s) => [s, { count: 0, total: 0 }]),
    ) as Record<InvoiceStatus, { count: number; total: number }>;

  for (const inv of invoices) {
    summary[inv.status].count += 1;
    summary[inv.status].total += Number(inv.total);
  }

  return summary;
}
