"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, FileCheck2, Target, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type MilestoneItem = {
  id: string; name: string; description: string | null;
  dueDate: Date | null; completedAt: Date | null;
  status: string; progress: number;
  project: { id: string; name: string };
  _count: { tasks: number; deliverables: number };
};

const statusVariant: Record<string, "secondary" | "default" | "success" | "destructive"> = {
  pending: "secondary", in_progress: "default", completed: "success", delayed: "destructive",
};

const statusLabel: Record<string, string> = {
  pending: "Pending", in_progress: "In Progress", completed: "Completed", delayed: "Delayed",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isDelayed(dueDate: Date | null, completedAt: Date | null, status: string): boolean {
  if (status === "completed" || !dueDate) return false;
  return new Date(dueDate) < new Date();
}

const containerVariants = {
  hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function MilestonesDashboard({ milestones }: { milestones: MilestoneItem[] }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Milestones</p>
          <h1 className="text-3xl font-bold tracking-tight">Milestones</h1>
        </div>
        <p className="text-sm text-muted-foreground/50">{milestones.length} milestone{milestones.length !== 1 ? "s" : ""}</p>
      </div>

      {milestones.length === 0 ? (
        <EmptyState title="No milestones found" description="No milestones have been created yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {milestones.map((m) => {
            const delayed = isDelayed(m.dueDate, m.completedAt, m.status);
            return (
              <motion.div key={m.id} variants={cardVariants}>
                <Card className={cn(
                  "glass card-hover border-border/30 relative overflow-hidden",
                  delayed && "ring-1 ring-destructive/20",
                )}>
                  {delayed && (
                    <div className="absolute right-3 top-3">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{m.name}</CardTitle>
                          <p className="text-xs text-muted-foreground/50">{m.project.name}</p>
                        </div>
                      </div>
                      <Badge variant={statusVariant[m.status] ?? "secondary"} className="rounded-md">{statusLabel[m.status] ?? m.status}</Badge>
                    </div>
                    {m.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground/60">{m.description}</p>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-muted-foreground/60">Progress</span>
                        <span className="font-semibold text-primary">{m.progress}%</span>
                      </div>
                      <Progress value={m.progress} className="h-1.5" />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground/50">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{m._count.tasks} tasks</span>
                      <span className="flex items-center gap-1"><FileCheck2 className="h-3 w-3" />{m._count.deliverables} deliverables</span>
                    </div>
                    {m.dueDate && (
                      <p className={cn(
                        "flex items-center gap-1 text-xs",
                        delayed ? "text-destructive font-medium" : "text-muted-foreground/50",
                      )}>
                        <Calendar className="h-3 w-3" />Due {formatDate(m.dueDate)}
                      </p>
                    )}
                    {m.completedAt && (
                      <p className="flex items-center gap-1 text-xs text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />Completed {formatDate(m.completedAt)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export { MilestonesDashboard };
