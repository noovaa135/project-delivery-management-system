"use client";

import { motion } from "framer-motion";
import { Building, Eye, EyeOff, Lock, Mail, User, Bell, Shield, Palette, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";

function SettingsPage({ user }: { user: { name?: string | null; email?: string | null; role?: string | null; organizationName?: string | null } }) {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div>
        <p className="text-sm font-medium text-muted-foreground/60">Settings</p>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Card className="glass border-border/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile</CardTitle>
              <p className="text-sm text-muted-foreground/50">Your personal information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground/70">Name</label>
              <Input value={user.name ?? ""} readOnly className="rounded-xl bg-muted/20 border-border/30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground/70">Email</label>
              <Input value={user.email ?? ""} readOnly className="rounded-xl bg-muted/20 border-border/30" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground/50" />
            <span className="text-sm text-muted-foreground/50">Role:</span>
            <Badge variant="default" className="rounded-md">{user.role ?? "N/A"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Organization</CardTitle>
              <p className="text-sm text-muted-foreground/50">Your workspace details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground/70">Organization Name</label>
            <Input value={user.organizationName ?? "Default Workspace"} readOnly className="rounded-xl bg-muted/20 border-border/30 max-w-md" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <p className="text-sm text-muted-foreground/50">Customize your theme</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  theme === t
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/30 text-muted-foreground hover:border-border/50",
                )}
              >
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-lg",
                  t === "dark" ? "bg-foreground text-background" : "bg-background text-foreground border",
                )}>
                  {t === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </div>
                {t === "dark" ? "Dark Mode" : "Light Mode"}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <p className="text-sm text-muted-foreground/50">Manage your notification preferences</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Email notifications", "Push notifications", "Weekly digest", "Monthly report"].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <div className="flex h-5 w-5 items-center justify-center rounded-md border border-border/30 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="glass border-border/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Security</CardTitle>
              <p className="text-sm text-muted-foreground/50">Update your password</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground/70">Current Password</label>
            <Input type="password" placeholder="Enter current password" className="rounded-xl border-border/30 max-w-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground/70">New Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Enter new password" className="rounded-xl border-border/30" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground/70">Confirm Password</label>
              <Input type="password" placeholder="Confirm new password" className="rounded-xl border-border/30" />
            </div>
          </div>
          <Button className="rounded-xl gap-2" disabled>
            <Shield className="h-4 w-4" /> Update Password
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export { SettingsPage };
