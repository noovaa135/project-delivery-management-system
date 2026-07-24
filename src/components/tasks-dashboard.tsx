"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type TaskItem = {
  id: string; title: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: Date | null;
  assignee: { name: string | null; email: string | null } | null;
  project: { id: string; name: string };
};

const statusTabs = [
  { label: "All", value: "ALL" },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Done", value: "DONE" },
] as const;

const statusBadge: Record<string, "secondary" | "default" | "warning" | "success"> = {
  TODO: "secondary", IN_PROGRESS: "default", IN_REVIEW: "warning", DONE: "success",
};

const priorityBadge: Record<string, "secondary" | "default" | "warning" | "destructive"> = {
  LOW: "secondary", MEDIUM: "default", HIGH: "warning", CRITICAL: "destructive",
};

function getInitials(value: string) {
  return value.split(/\s|@/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function isOverdue(date: Date): boolean {
  return new Date(date) < new Date();
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TasksDashboard({ tasks }: { tasks: TaskItem[] }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const filtered = activeTab === "ALL" ? tasks : tasks.filter((t) => t.status === activeTab);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Tasks</p>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        </div>
        <p className="text-sm text-muted-foreground/50">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>
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
        <EmptyState title="No tasks found" description="No tasks match the selected filter." />
      ) : (
        <Card className="glass overflow-hidden border-border/30">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/20">
                  <TableHead className="w-[35%]">Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task, i) => {
                  const overdue = task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 transition-colors hover:bg-muted/20 cursor-pointer"
                    >
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell><Badge variant={statusBadge[task.status]} className="rounded-md">{task.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell><Badge variant={priorityBadge[task.priority]} className="rounded-md">{task.priority}</Badge></TableCell>
                      <TableCell>
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-[10px] font-semibold text-primary">
                              {getInitials(task.assignee.name ?? task.assignee.email ?? "U")}
                            </div>
                            <span className="text-sm">{task.assignee.name ?? task.assignee.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <span className={cn(
                            "flex items-center gap-1 text-sm",
                            overdue ? "text-destructive font-medium" : "text-muted-foreground/60"
                          )}>
                            {overdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                            {formatDate(task.dueDate)}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground/60">{task.project.name}</TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

export { TasksDashboard };
