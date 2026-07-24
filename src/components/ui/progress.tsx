"use client";

import { cn } from "@/lib/utils";

function Progress({ className, value = 0, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: number }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted/50", className)} {...props}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export { Progress };
