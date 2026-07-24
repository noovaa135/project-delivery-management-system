"use client";

import { motion } from "framer-motion";
import { Activity, CalendarCheck, FolderKanban, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { ActivityTimeline } from "@/components/activity-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OverviewMetrics = { activeProjects: number; tasksDue: number; upcomingMilestones: number; projectHealth: number };
type ActivityItem = { id: string; action: string; entity: string; description: string | null; createdAt: Date; user: { name: string | null } | null };
type ProgressItem = { id: string; name: string; progress: number; totalTasks: number; completedTasks: number };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function OverviewDashboard({
  userName,
  metrics,
  activities,
  progress,
}: {
  userName: string | null;
  metrics: OverviewMetrics;
  activities: ActivityItem[];
  progress: ProgressItem[];
}) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div variants={itemVariants}>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            All systems operational
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{userName ? `, ${userName}` : ""}
          </h1>
          <p className="mt-1.5 text-muted-foreground/60">
            Here&apos;s what&apos;s happening across your projects today.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button asChild className="rounded-xl gap-2">
            <Link href="/dashboard/projects">
              <FolderKanban className="h-4 w-4" />
              View All Projects
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Projects" value={String(metrics.activeProjects)} helper="Currently in progress" icon={FolderKanban} trend={{ value: "12%", positive: true }} />
        <MetricCard label="Tasks Due" value={String(metrics.tasksDue)} helper="Assigned to you" icon={Activity} trend={{ value: "3", positive: false }} />
        <MetricCard label="Upcoming Milestones" value={String(metrics.upcomingMilestones)} helper="Across all projects" icon={CalendarCheck} />
        <MetricCard label="Project Health" value={`${metrics.projectHealth}%`} helper="On-track projects" icon={TrendingUp} trend={{ value: "5%", positive: true }} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="glass border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Badge variant="secondary" className="rounded-full text-xs">{activities.length} events</Badge>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>

        <Card className="glass border-border/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {progress.length === 0 ? (
              <p className="text-sm text-muted-foreground/50">No projects with tasks yet.</p>
            ) : (
              progress.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-sm font-semibold text-primary">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground/50">
                    {p.completedTasks}/{p.totalTasks} tasks completed
                  </p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export { OverviewDashboard };
