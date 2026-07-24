"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Download, FileText, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type DeliverableItem = {
  id: string; name: string; description: string | null;
  status: string; fileName: string | null; fileSize: number | null;
  uploadedBy: { name: string | null } | null;
  project: { name: string }; milestone: { name: string } | null;
};

const statusTabs = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

const statusVariant: Record<string, "secondary" | "success" | "destructive"> = {
  pending: "secondary", approved: "success", rejected: "destructive",
};

function getInitials(value: string) {
  return value.split(/\s|@/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DeliverablesDashboard({ deliverables }: { deliverables: DeliverableItem[] }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const filtered = activeTab === "ALL" ? deliverables : deliverables.filter((d) => d.status === activeTab);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Deliverables</p>
          <h1 className="text-3xl font-bold tracking-tight">Deliverables</h1>
        </div>
        <p className="text-sm text-muted-foreground/50">{filtered.length} deliverable{filtered.length !== 1 ? "s" : ""}</p>
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
        <EmptyState title="No deliverables found" description="No deliverables match the selected filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="glass card-hover border-border/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{d.name}</CardTitle>
                        <p className="text-xs text-muted-foreground/50">{d.project.name}</p>
                      </div>
                    </div>
                    <Badge variant={statusVariant[d.status] ?? "secondary"} className="rounded-md">{d.status}</Badge>
                  </div>
                  {d.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground/60">{d.description}</p>}
                </CardHeader>
                <CardContent className="space-y-3">
                  {d.milestone && <p className="text-xs text-muted-foreground/50">Milestone: {d.milestone.name}</p>}
                  {d.fileName && (
                    <div className="flex items-center gap-2 rounded-lg border border-border/20 bg-muted/20 p-2.5 text-xs">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      <span className="min-w-0 flex-1 truncate">{d.fileName}</span>
                      {d.fileSize != null && <span className="shrink-0 text-muted-foreground/40">{formatFileSize(d.fileSize)}</span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {d.uploadedBy ? (
                      <span className="flex items-center gap-2 text-xs text-muted-foreground/50">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-[9px] font-semibold text-primary">
                          {getInitials(d.uploadedBy.name ?? "U")}
                        </div>
                        {d.uploadedBy.name ?? "Unknown"}
                      </span>
                    ) : <span />}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground/50" disabled>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg h-8 gap-1.5" disabled>
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export { DeliverablesDashboard };
