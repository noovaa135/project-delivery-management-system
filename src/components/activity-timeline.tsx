"use client";

import { ClipboardList, FileCheck2, FolderKanban, Milestone, Receipt } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type ActivityItem = {
  id: string; action: string; entity: string; description: string | null;
  createdAt: Date; user: { name: string | null } | null;
};

const entityIcons: Record<string, typeof FolderKanban> = {
  project: FolderKanban, task: ClipboardList, milestone: Milestone,
  deliverable: FileCheck2, invoice: Receipt,
};

const entityColors: Record<string, string> = {
  project: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  task: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  milestone: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  deliverable: "bg-violet-500/10 text-violet-500 ring-violet-500/20",
  invoice: "bg-rose-500/10 text-rose-500 ring-rose-500/20",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return <EmptyState title="No activity yet" description="Activity will appear here as team members make changes." />;
  }

  return (
    <div className="relative space-y-0">
      {activities.map((activity, idx) => {
        const Icon = entityIcons[activity.entity] ?? FolderKanban;
        const isLast = idx === activities.length - 1;
        const colorClass = entityColors[activity.entity] ?? "bg-muted text-muted-foreground ring-border";

        return (
          <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-border/40 to-transparent" />}
            <div className={cn("relative z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl ring-1", colorClass)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{activity.user?.name ?? "System"}</p>
                <span className="text-xs text-muted-foreground/40">{timeAgo(activity.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground/60">
                {activity.action}
                {activity.description && <span className="ml-1 text-muted-foreground/40">&mdash; {activity.description}</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ActivityTimeline };
