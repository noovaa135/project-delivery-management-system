import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-1 ring-primary/20",
        secondary: "bg-muted text-muted-foreground ring-1 ring-border/50",
        destructive: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
        success: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
        warning: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
        outline: "text-foreground ring-1 ring-border/50",
        primary: "bg-primary text-primary-foreground shadow-sm",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
