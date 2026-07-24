"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Clock, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type KanbanTask = {
  id: string; title: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: Date | null;
  assignee: { name: string | null; email: string | null } | null;
  project: { name: string };
};

const columns = [
  { id: "TODO", label: "To Do", color: "border-t-gray-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-t-blue-500" },
  { id: "IN_REVIEW", label: "In Review", color: "border-t-amber-500" },
  { id: "DONE", label: "Done", color: "border-t-emerald-500" },
] as const;

const priorityBadge: Record<string, "secondary" | "default" | "warning" | "destructive"> = {
  LOW: "secondary", MEDIUM: "default", HIGH: "warning", CRITICAL: "destructive",
};

function getInitials(value: string) {
  return value.split(/\s|@/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function KanbanBoard({ tasks }: { tasks: KanbanTask[] }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [board, setBoard] = useState(() => {
    const grouped: Record<string, KanbanTask[]> = { TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] };
    for (const t of tasks) {
      if (grouped[t.status]) grouped[t.status].push(t);
    }
    return grouped;
  });

  const handleDragStart = (taskId: string) => {
    setDraggedId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (!draggedId) return;
    setBoard((prev) => {
      const newBoard = { ...prev };
      let draggedTask: KanbanTask | null = null;
      for (const key of Object.keys(newBoard)) {
        const idx = newBoard[key].findIndex((t) => t.id === draggedId);
        if (idx !== -1) {
          draggedTask = { ...newBoard[key][idx], status: status as KanbanTask["status"] };
          newBoard[key] = [...newBoard[key].slice(0, idx), ...newBoard[key].slice(idx + 1)];
          break;
        }
      }
      if (draggedTask) {
        newBoard[status] = [...newBoard[status], draggedTask];
      }
      return newBoard;
    });
    setDraggedId(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Kanban</p>
          <h1 className="text-3xl font-bold tracking-tight">Board</h1>
        </div>
        <Button className="rounded-xl h-9 gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.id)}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", col.color.replace("border-t-", "bg-"))} />
                <h3 className="text-sm font-semibold">{col.label}</h3>
              </div>
              <span className="text-xs text-muted-foreground/50">{board[col.id]?.length ?? 0}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {(board[col.id] ?? []).map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className={cn(
                    "cursor-grab active:cursor-grabbing rounded-lg border border-border/30 bg-card p-3 shadow-sm transition-all hover:border-border/50",
                    draggedId === task.id && "opacity-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 rounded-md opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={priorityBadge[task.priority]} className="rounded-sm text-[10px] px-1.5 py-0">{task.priority}</Badge>
                    <span className="text-xs text-muted-foreground/40">{task.project.name}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {task.assignee ? (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-[8px] font-semibold text-primary">
                            {getInitials(task.assignee.name ?? task.assignee.email ?? "U")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted/30" />
                      )}
                    </div>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                        <Clock className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/30 p-3 text-xs text-muted-foreground/50 transition-colors hover:border-border/50 hover:text-muted-foreground/70">
                <Plus className="h-3.5 w-3.5" /> Add Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export { KanbanBoard };
