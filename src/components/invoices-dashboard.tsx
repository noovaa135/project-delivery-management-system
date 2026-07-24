"use client";

import { motion } from "framer-motion";
import { Banknote, Calendar, Clock, CreditCard, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { EmptyState } from "@/components/empty-state";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PaymentItem = { amount: number; paidAt: Date; method: string | null };
type InvoiceItem = {
  id: string; invoiceNumber: string; description: string | null;
  amount: number; tax: number; total: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  dueDate: Date | null; paidAt: Date | null;
  project: { name: string }; client: { name: string | null } | null;
  payments: PaymentItem[];
};

const statusVariant: Record<string, "secondary" | "default" | "success" | "destructive"> = {
  DRAFT: "secondary", SENT: "default", PAID: "success", OVERDUE: "destructive", CANCELLED: "secondary",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(value);

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function InvoicesDashboard({ invoices }: { invoices: InvoiceItem[] }) {
  const totalOutstanding = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);
  const totalCollected = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Invoices</p>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        </div>
        <p className="text-sm text-muted-foreground/50">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total Outstanding" value={formatCurrency(totalOutstanding)} helper="Unpaid invoices" icon={CreditCard} />
        <MetricCard label="Overdue" value={formatCurrency(totalOverdue)} helper="Past due invoices" icon={Clock} trend={{ value: "Requires attention", positive: totalOverdue === 0 }} />
        <MetricCard label="Total Collected" value={formatCurrency(totalCollected)} helper="Paid invoices this quarter" icon={Banknote} />
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No invoices found" description="No invoices have been created yet." />
      ) : (
        <div className="space-y-3">
          {invoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={cn(
                "glass card-hover border-border/30",
                inv.status === "OVERDUE" && "ring-1 ring-destructive/20",
              )}>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold">{inv.invoiceNumber}</p>
                        <Badge variant={statusVariant[inv.status]} className="rounded-md">{inv.status}</Badge>
                      </div>
                      {inv.description && <p className="text-sm text-muted-foreground/60">{inv.description}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                        <span>{inv.project.name}</span>
                        {inv.client && <span>Client: {inv.client.name}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold tracking-tight">{formatCurrency(inv.total)}</p>
                      <p className="text-xs text-muted-foreground/50">
                        Amount: {formatCurrency(inv.amount)}{inv.tax > 0 && ` | Tax: ${formatCurrency(inv.tax)}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/50">
                    {inv.dueDate && (
                      <span className={cn(
                        "flex items-center gap-1",
                        inv.status === "OVERDUE" && "text-destructive font-medium",
                      )}>
                        <Calendar className="h-3 w-3" />Due {formatDate(inv.dueDate)}
                      </span>
                    )}
                    {inv.paidAt && (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <Banknote className="h-3 w-3" />Paid {formatDate(inv.paidAt)}
                      </span>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto h-7 rounded-lg gap-1.5 text-muted-foreground/50" disabled>
                      <Download className="h-3 w-3" /> PDF
                    </Button>
                  </div>
                  {inv.payments.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground/50">Payment History</p>
                        {inv.payments.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground/50">
                            <Clock className="h-3 w-3" />
                            <span>{formatCurrency(p.amount)} on {formatDate(p.paidAt)}</span>
                            {p.method && <span>via {p.method}</span>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export { InvoicesDashboard };
