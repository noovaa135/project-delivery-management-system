"use client";

import { motion } from "framer-motion";
import { Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type TeamMember = {
  id: string;
  user: { id: string; name: string | null; email: string | null; image: string | null };
  role: string;
};

const roleVariant: Record<string, "destructive" | "default" | "secondary" | "success" | "warning"> = {
  SYSTEM_ADMIN: "destructive", PROJECT_MANAGER: "default", TEAM_MEMBER: "secondary", CLIENT: "success", STAKEHOLDER: "warning",
};

const roleColors: Record<string, string> = {
  SYSTEM_ADMIN: "from-rose-500 to-rose-400",
  PROJECT_MANAGER: "from-blue-500 to-blue-400",
  TEAM_MEMBER: "from-gray-500 to-gray-400",
  CLIENT: "from-emerald-500 to-emerald-400",
  STAKEHOLDER: "from-amber-500 to-amber-400",
};

function getInitials(value: string) {
  return value.split(/\s|@/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function TeamManagement({ members }: { members: TeamMember[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Team</p>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground/50">{members.length} member{members.length !== 1 ? "s" : ""}</p>
          <Button className="rounded-xl h-9 gap-2">
            <UserPlus className="h-4 w-4" /> Invite Member
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState title="No team members" description="Invite team members to collaborate on projects." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="glass card-hover border-border/30 group relative">
                <CardContent className="pt-6">
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl min-w-[160px]">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Project</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-border/30">
                      <AvatarFallback className={cn(
                        "bg-gradient-to-br text-white text-sm font-semibold",
                        roleColors[m.role] ?? "from-gray-500 to-gray-400",
                      )}>
                        {getInitials(m.user.name ?? m.user.email ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{m.user.name ?? "Unnamed"}</p>
                      <p className="truncate text-xs text-muted-foreground/50">{m.user.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-500">Online</span>
                    <span className="ml-auto">
                      <Badge variant={roleVariant[m.role] ?? "secondary"} className="rounded-md">{m.role.replace("_", " ")}</Badge>
                    </span>
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

export { TeamManagement };
