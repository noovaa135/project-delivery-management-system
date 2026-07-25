"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, CheckCircle2, Clock, FolderKanban, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import type { DeliveryHealth } from "@/components/status-badge";

type ProjectItem = {
  id: string; name: string; description: string | null;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  health: string; startDate: Date | null; targetDate: Date | null; budget: number | null;
  _count: { tasks: number; milestones: number; invoices: number };
};

const statusTabs = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Planning", value: "PLANNING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "On Hold", value: "ON_HOLD" },
] as const;

const priorityBadge: Record<string, "secondary" | "default" | "warning" | "destructive"> = {
  LOW: "secondary", MEDIUM: "default", HIGH: "warning", CRITICAL: "destructive",
};

const healthBarColors: Record<string, string> = {
  on_track: "from-emerald-500 to-emerald-400",
  at_risk: "from-amber-500 to-amber-400",
  blocked: "from-rose-500 to-rose-400",
};

const containerVariants = {
  hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function ProjectsDashboard({ projects }: { projects: ProjectItem[] }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const filtered = activeTab === "ALL" ? projects : projects.filter((p) => p.status === activeTab);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Projects</p>
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground/50">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</p>
          <Button className="rounded-xl h-9 gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No projects found" description="There are no projects matching the selected filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => {
            const healthOk = ["on_track", "at_risk", "blocked"].includes(project.health)
              ? (project.health as DeliveryHealth) : "on_track";
            return (
              <motion.div key={project.id} variants={cardVariants}>
                <Card className="glass card-hover group relative overflow-hidden border-border/30">
                  <div className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    healthBarColors[project.health] ?? "from-gray-500 to-gray-400",
                  )} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                          <FolderKanban className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <p className="text-xs text-muted-foreground/50">{project.status.replace("_", " ")}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl min-w-[160px]">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {project.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground/60 mt-2">{project.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge health={healthOk} />
                      <Badge variant={priorityBadge[project.priority]} className="rounded-md">{project.priority}</Badge>
                    </div>
                    <Progress value={project.health === "on_track" ? 85 : project.health === "at_risk" ? 50 : 25} className="h-1.5" />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/50">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{project._count.tasks} tasks</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{project._count.milestones} milestones</span>
                    </div>
                    {(project.startDate || project.targetDate) && (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                        {project.startDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(project.startDate)}</span>}
                        {project.targetDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(project.targetDate)}</span>}
                      </div>
                    )}
                    {project.budget != null && (
                      <p className="text-xs text-muted-foreground/50">
                        Budget: {new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(project.budget)}
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

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export { ProjectsDashboard };
