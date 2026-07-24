"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type TabsContextType = { value: string; onValueChange: (value: string) => void };
const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs must be used within a Tabs provider");
  return ctx;
}

function Tabs({ defaultValue, onValueChange, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { defaultValue: string; onValueChange?: (value: string) => void }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, onValueChange: (v: string) => { setValue(v); onValueChange?.(v); } }}>
      <div className={cn("", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center gap-1 rounded-xl bg-muted/50 p-1", className)} {...props} />;
}

function TabsTrigger({ className, value, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: selected, onValueChange } = useTabs();
  const isActive = selected === value;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, value, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value: selected } = useTabs();
  if (selected !== value) return null;
  return <div className={cn("mt-2", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
