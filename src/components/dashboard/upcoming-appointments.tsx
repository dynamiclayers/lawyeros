"use client";

import { ArrowUpRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/components/providers/workspace-provider";

const STATUS: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  confirmed: { label: "Confirmed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "success" },
};

export function UpcomingAppointments() {
  const { appointments } = useWorkspace();
  const upcoming = appointments
    .filter((appointment) => appointment.status === "confirmed" || appointment.status === "pending")
    .slice(0, 3);

  return (
    <section className="rounded-[12px] border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">
          Upcoming Appointments
        </h2>
        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
        >
          View All
          <ArrowUpRight className="size-3" />
        </Link>
      </header>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
          <CalendarDays className="size-5 text-muted-foreground" />
          <p className="mt-2 text-[12.5px] font-medium text-foreground">
            Nothing scheduled
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Confirmed consultations will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {upcoming.map((appointment) => {
            const date = new Date(`${appointment.date}T00:00:00`);
            const status = STATUS[appointment.status];
            return (
              <li key={appointment.id} className="flex items-start gap-3 px-4 py-3">
                <div className="flex w-9 shrink-0 flex-col items-center rounded-md border border-border bg-muted/60 py-1">
                  <span className="text-[13px] font-semibold leading-none text-foreground">
                    {date.getDate()}
                  </span>
                  <span className="mt-0.5 text-[9.5px] uppercase leading-none text-muted-foreground">
                    {date.toLocaleDateString("en-GB", { month: "short" })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">
                    {appointment.time}
                    <span className="mx-1">·</span>
                    {appointment.mode === "online" ? "Online Consultation" : "In-Chamber Visit"}
                  </p>
                  <p className="mt-0.5 text-[12.5px] font-medium text-foreground">
                    {appointment.clientName}
                  </p>
                </div>
                <Badge variant={status.variant} className="shrink-0">
                  {status.label}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
