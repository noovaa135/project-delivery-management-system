"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Boxes,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FolderKanban,
  Kanban,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Milestone,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Kanban", href: "/dashboard/kanban", icon: Kanban },
  { label: "My Tasks", href: "/dashboard/my-tasks", icon: ClipboardList },
  { label: "Milestones", href: "/dashboard/milestones", icon: Milestone },
  { label: "Deliverables", href: "/dashboard/deliverables", icon: FileCheck2 },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Invoices", href: "/dashboard/invoices", icon: CreditCard },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    organizationName?: string | null;
  };
};

const sidebarVariants = {
  expanded: { width: 256 },
  collapsed: { width: 68 },
};

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.03)_0%,_transparent_50%)]">
      <motion.aside
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="hidden border-r border-sidebar-muted bg-sidebar lg:flex lg:flex-col"
      >
        <SidebarContent pathname={pathname} collapsed={collapsed} onNavClick={() => {}} />
      </motion.aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SidebarContent pathname={pathname} collapsed={false} onNavClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-nav sticky top-0 z-30">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <motion.div
              initial={false}
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden text-muted-foreground/60 hover:text-foreground lg:inline-flex"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </motion.div>

            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
              <div className="flex h-9 items-center rounded-xl border border-border/30 bg-muted/30 px-9 text-sm text-muted-foreground/50">
                Search projects, tasks, people...
              </div>
              <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-border/30 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground/50 lg:inline-flex">
                ⌘K
              </kbd>
            </div>

            <div className="flex flex-1 items-center justify-end gap-1">
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" className="text-muted-foreground/60 hover:text-foreground hover:bg-muted/50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quick Create</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground/60 hover:text-foreground hover:bg-muted/50">
                    <Bell className="h-4 w-4" />
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-nav"
                    >
                      3
                    </motion.span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" className="text-muted-foreground/60 hover:text-foreground hover:bg-muted/50" onClick={toggleTheme}>
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-2 gap-2 rounded-full px-2 hover:bg-muted/50">
                    <Avatar className="h-8 w-8 ring-2 ring-border/40">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-semibold">
                        {getInitials(user.name ?? user.email ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium leading-tight">{user.name ?? "User"}</p>
                      <p className="text-xs text-muted-foreground/50">{user.email ?? ""}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl border-border/50">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold">
                          {getInitials(user.name ?? user.email ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name ?? "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/team">
                      <Users className="mr-2 h-4 w-4" />
                      Team
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="p-4 sm:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  collapsed,
  onNavClick,
}: {
  pathname: string;
  collapsed: boolean;
  onNavClick: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex h-16 items-center",
        collapsed ? "justify-center px-2" : "gap-3 px-5",
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
          <Boxes className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">PDMS</div>
            <div className="truncate text-[11px] text-sidebar-foreground/40">Delivery Platform</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2" aria-label="Main navigation">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  onClick={onNavClick}
                  className={cn(
                    "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-2 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground/80",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary shadow-sm shadow-primary/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
                  )} />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      <div className={cn(
        "border-t border-sidebar-muted p-2",
        collapsed && "flex flex-col items-center",
      )}>
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm text-sidebar-foreground/30 transition-colors hover:text-sidebar-foreground/60",
            collapsed && "justify-center px-2",
          )}
        >
          <LifeBuoy className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-3">Help & Support</span>}
        </Link>
        {!collapsed && (
          <p className="mt-2 px-3 text-[10px] text-sidebar-foreground/20">
            PDMS v1.0
          </p>
        )}
      </div>
    </div>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
