"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: "task" | "milestone" | "deliverable" | "deadline";
  project: string;
};

const typeColors: Record<string, string> = {
  task: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  milestone: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  deliverable: "bg-violet-500/20 text-violet-500 border-violet-500/30",
  deadline: "bg-rose-500/20 text-rose-500 border-rose-500/30",
};

const typeLabels: Record<string, string> = {
  task: "Task", milestone: "Milestone", deliverable: "Deliverable", deadline: "Deadline",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarView({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  };

  const getEventsForDay = (day: number) => {
    return events.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground/60">Calendar</p>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        </div>
        <Button className="rounded-xl h-9 gap-2">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>

      <Card className="glass border-border/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/20 p-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{MONTHS[currentMonth]} {currentYear}</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7">
            {DAYS.map((day) => (
              <div key={day} className="border-b border-border/20 p-2 text-center text-xs font-medium text-muted-foreground/50">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[100px] border-b border-r border-border/20 p-1.5 transition-colors",
                    day === null && "bg-muted/10",
                  )}
                >
                  {day && (
                    <>
                      <div className={cn(
                        "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday(day) ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground",
                      )}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className={cn("rounded px-1.5 py-0.5 text-[10px] border truncate", typeColors[event.type])}>
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <p className="px-1 text-[10px] text-muted-foreground/50">+{dayEvents.length - 3} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <div className="h-3 w-3 rounded bg-blue-500/30" /> Task
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <div className="h-3 w-3 rounded bg-emerald-500/30" /> Milestone
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <div className="h-3 w-3 rounded bg-violet-500/30" /> Deliverable
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <div className="h-3 w-3 rounded bg-rose-500/30" /> Deadline
        </div>
      </div>
    </motion.div>
  );
}

export { CalendarView };
export type { CalendarEvent };
