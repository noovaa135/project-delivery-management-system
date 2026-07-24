"use client";

import { motion } from "framer-motion";
import { FileText, FolderKanban, MessageSquare, Download, Eye, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type ClientProject = {
  id: string; name: string; description: string | null;
  status: string; progress: number;
  startDate: Date | null; targetDate: Date | null;
};

type ClientDeliverable = {
  id: string; name: string; status: string;
  uploadedAt: Date | null;
  fileName: string | null;
};

type ClientPortalProps = {
  projects: ClientProject[];
  deliverables: ClientDeliverable[];
  clientName: string | null;
};

const statusVariant: Record<string, "secondary" | "success" | "destructive"> = {
  pending: "secondary", approved: "success", rejected: "destructive",
};

function getInitials(value: string) {
  return value.split(/\s|@/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ClientPortal({ projects, deliverables, clientName }: ClientPortalProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Client Portal</p>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome{clientName ? `, ${clientName}` : ""}
          </h1>
          <p className="mt-1.5 text-muted-foreground/60">
            Track your project progress and access deliverables.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-border/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <FolderKanban className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">Your Projects</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState title="No projects" description="You don't have any active projects yet." />
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border/20 bg-muted/10 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        {p.description && <p className="mt-0.5 text-sm text-muted-foreground/60">{p.description}</p>}
                      </div>
                      <Badge variant={p.status === "ACTIVE" ? "default" : "secondary"} className="rounded-md">{p.status}</Badge>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-muted-foreground/50">Progress</span>
                        <span className="font-medium text-primary">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5" />
                    </div>
                    {(p.startDate || p.targetDate) && (
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground/50">
                        {p.startDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Started {formatDate(p.startDate)}</span>}
                        {p.targetDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Due {formatDate(p.targetDate)}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">Deliverables</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {deliverables.length === 0 ? (
              <EmptyState title="No deliverables" description="Deliverables will appear here once uploaded." />
            ) : (
              <div className="space-y-3">
                {deliverables.map((d) => (
                  <div key={d.id} className="group flex items-center justify-between rounded-lg border border-border/20 bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{d.name}</p>
                        {d.uploadedAt && <p className="text-xs text-muted-foreground/50">{formatDate(d.uploadedAt)}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusVariant[d.status] ?? "secondary"} className="rounded-md text-[10px]">{d.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" disabled={!d.fileName}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground/50">Common tasks you can perform</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2 border-border/30" disabled>
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-normal">Send Message</span>
            </Button>
            <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2 border-border/30" disabled>
              <Eye className="h-5 w-5" />
              <span className="text-xs font-normal">View Reports</span>
            </Button>
            <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2 border-border/30" disabled>
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-xs font-normal">Approve Deliverable</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { ClientPortal };
