"use client";

import { motion } from "framer-motion";
import { BadgeDollarSign, BarChart3, CheckCircle2, FolderKanban, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/metric-card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type ReportMetrics = {
  totalProjects: number; activeProjects: number; completedProjects: number;
  totalTasks: number; completedTasks: number;
  totalInvoices: number; paidInvoices: number;
  totalRevenue: number; outstandingRevenue: number;
};
type HealthItem = { health: string; count: number };
type BudgetSummary = { totalBudget: number; totalSpent: number };

const healthColors: Record<string, string> = {
  on_track: "from-emerald-500 to-emerald-400",
  at_risk: "from-amber-500 to-amber-400",
  blocked: "from-rose-500 to-rose-400",
};

const healthLabels: Record<string, string> = {
  on_track: "On Track", at_risk: "At Risk", blocked: "Blocked",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(value);

function ReportsDashboard({
  metrics, healthDistribution, budgetSummary,
}: {
  metrics: ReportMetrics; healthDistribution: HealthItem[]; budgetSummary: BudgetSummary;
}) {
  const completionRate = metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0;
  const budgetUtilization = budgetSummary.totalBudget > 0 ? Math.round((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground/60">Reports</p>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Projects" value={String(metrics.totalProjects)} helper={`${metrics.activeProjects} active, ${metrics.completedProjects} completed`} icon={FolderKanban} />
        <MetricCard label="Task Completion" value={`${completionRate}%`} helper={`${metrics.completedTasks} of ${metrics.totalTasks} tasks done`} icon={CheckCircle2} trend={{ value: "This quarter", positive: completionRate >= 50 }} />
        <MetricCard label="Total Revenue" value={formatCurrency(metrics.totalRevenue)} helper={`${metrics.paidInvoices} invoices paid`} icon={BadgeDollarSign} />
        <MetricCard label="Outstanding" value={formatCurrency(metrics.outstandingRevenue)} helper="Awaiting payment" icon={BarChart3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-border/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Project Health</CardTitle>
          </CardHeader>
          <CardContent>
            {healthDistribution.length === 0 ? (
              <EmptyState title="No health data" description="Health data appears once projects are created." />
            ) : (
              <div className="space-y-4">
                {healthDistribution.map((item) => (
                  <div key={item.health}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-muted-foreground/70">{healthLabels[item.health] ?? item.health}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted/30">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", healthColors[item.health] ?? "from-gray-500")}
                        style={{ width: `${(item.count / Math.max(...healthDistribution.map((h) => h.count), 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground/50">Total Budget</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(budgetSummary.totalBudget)}</p>
              </div>
              <div className="rounded-xl bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground/50">Total Spent</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(budgetSummary.totalSpent)}</p>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-muted-foreground/60">Utilization</span>
                <span className={cn("font-medium", budgetUtilization > 90 ? "text-destructive" : budgetUtilization > 70 ? "text-amber-500" : "text-emerald-500")}>{budgetUtilization}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted/30">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                    budgetUtilization > 90 ? "from-destructive to-destructive/80" : budgetUtilization > 70 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400",
                  )}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass lg:col-span-2 border-border/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray={`${completionRate * 2.64} 264`} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <span className="absolute text-2xl font-bold">{completionRate}%</span>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-muted-foreground/60">Completed Tasks</span>
                    <span className="font-medium text-emerald-500">{metrics.completedTasks}</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-muted-foreground/60">Total Tasks</span>
                    <span className="font-medium">{metrics.totalTasks}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted/30">
                    <div className="h-full w-full rounded-full bg-muted-foreground/10" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground/50">
                  <TrendingUp className={cn("h-4 w-4", completionRate >= 50 ? "text-emerald-500" : "text-destructive")} />
                  <span>{completionRate >= 50 ? "Above average completion rate" : "Below average completion rate"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export { ReportsDashboard };
