"use client";

import { useState } from "react";
import { AlertCircle, Bell, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string; title: string; message: string | null;
  type: string; read: boolean; link: string | null; createdAt: Date;
};

const typeIcons: Record<string, typeof Info> = { info: Info, warning: AlertTriangle, success: Check, error: AlertCircle };
const typeColors: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-500", warning: "bg-amber-500/10 text-amber-500",
  success: "bg-emerald-500/10 text-emerald-500", error: "bg-rose-500/10 text-rose-500",
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

function NotificationsPanel({ notifications, unreadCount }: { notifications: NotificationItem[]; unreadCount: number }) {
  const [items, setItems] = useState(notifications);

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Card className="glass border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 rounded-lg text-xs text-muted-foreground/60" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            )}
            <Bell className="h-4 w-4 text-muted-foreground/40" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." />
        ) : (
          <div className="space-y-1">
            {items.map((notification) => {
              const Icon = typeIcons[notification.type] ?? Info;
              const colorClass = typeColors[notification.type] ?? "bg-muted text-muted-foreground";
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "relative flex items-start gap-3 rounded-xl p-3 transition-colors group",
                    !notification.read && "bg-muted/30",
                  )}
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    {notification.message && (
                      <p className="mt-0.5 text-xs text-muted-foreground/60 line-clamp-2">{notification.message}</p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground/40">{timeAgo(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-100" onClick={() => handleMarkRead(notification.id)}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { NotificationsPanel };
