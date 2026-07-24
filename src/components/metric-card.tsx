import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MetricCardTrend = { value: string; positive: boolean };

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: MetricCardTrend;
  className?: string;
  children?: React.ReactNode;
};

function MetricCard({ label, value, helper, icon: Icon, trend, className, children }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm stat-card card-hover overflow-hidden", className)}>
        <div className="flex flex-row items-center justify-between p-5 pb-2">
          <p className="text-sm font-medium text-muted-foreground/70">{label}</p>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
        <div className="p-5 pt-0">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            {trend && (
              <span className={cn("text-xs font-medium", trend.positive ? "text-emerald-500" : "text-destructive")}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
            )}
          </div>
          {helper && <p className="mt-1 text-sm text-muted-foreground/50">{helper}</p>}
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export { MetricCard };
export type { MetricCardTrend };
