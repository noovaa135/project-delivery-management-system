"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const TooltipContext = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
function useTooltip() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip must be used within a Tooltip provider");
  return ctx;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <TooltipContext.Provider value={{ open, setOpen }}><div className="relative inline-flex">{children}</div></TooltipContext.Provider>;
}

function TooltipTrigger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useTooltip();
  return <div className={cn("inline-flex", className)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} {...props} />;
}

function TooltipContent({ className, side = "right", ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "right" | "bottom" | "left" }) {
  const { open } = useTooltip();
  if (!open) return null;
  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  };
  return (
    <div className={cn("absolute z-50 animate-scale-in whitespace-nowrap rounded-xl border border-border/50 bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-lg", sideClasses[side], className)} {...props} />
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
