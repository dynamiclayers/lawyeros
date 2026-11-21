"use client";

import { Clock, Mail, Phone } from "lucide-react";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/utils";
import type { Appointment, BookingStatus } from "@/types";

const STATUS: Record<BookingStatus, { label: string; variant: "success" | "warning" | "destructive" | "outline" }> = {
  pending: { label: "Pending review", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "success" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function AppointmentsDrawer({
  appointment,
  onOpenChange,
  onStatusChange,
}: {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (
    appointment: Appointment,
    status: BookingStatus,
    label: string,
  ) => void;
}) {
  return (
    <Sheet open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[440px]">
        {appointment ? (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle>{appointment.clientName}</SheetTitle>
                  <SheetDescription>
                    {appointment.reference}
                  </SheetDescription>
                </div>
                <Badge variant={STATUS[appointment.status].variant}>
                  {STATUS[appointment.status].label}
                </Badge>
              </div>
            </SheetHeader>

            <SheetBody className="space-y-5 pr-4">
              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Client contact
                </h3>
                <ul className="mt-2 space-y-1.5 text-[12px]">
                  <li className="flex items-center gap-2 text-foreground">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {appointment.phone}
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <Mail className="size-3.5 text-muted-foreground" />
                    {appointment.email}
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <Clock className="size-3.5 text-muted-foreground" />
                    {new Date(`${appointment.date}T00:00:00`).toLocaleDateString(
                      "en-GB",
                      { weekday: "short", day: "numeric", month: "long", year: "numeric" },
                    )}{" "}
                    · {appointment.time}
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Booking details
                </h3>
                <dl className="mt-2 grid grid-cols-2 gap-2 rounded-[10px] border border-border bg-muted/40 p-3 text-[12px]">
                  <div>
                    <dt className="text-muted-foreground">Mode</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {appointment.mode === "online" ? "Online video" : "In-chamber visit"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fee</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {formatBDT(appointment.fee)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Reference</dt>
                    <dd className="mt-0.5 font-mono text-[10.5px] font-medium text-foreground">
                      {appointment.reference}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Booked on</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {new Date(appointment.history[0]?.at ?? appointment.date).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Case summary
                </h3>
                <p className="mt-1.5 rounded-[10px] border border-border bg-card px-3 py-2.5 text-[12px] leading-relaxed text-foreground">
                  {appointment.caseSummary}
                </p>
              </section>

              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Action history
                </h3>
                {appointment.history.length === 0 ? (
                  <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                    No actions recorded yet.
                  </p>
                ) : (
                  <ol className="mt-2 space-y-2">
                    {appointment.history.map((entry, index) => (
                      <li key={`${entry.at}-${index}`} className="flex gap-2.5">
                        <span
                          aria-hidden
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                        />
                        <div>
                          <p className="text-[12px] text-foreground">{entry.label}</p>
                          <p className="text-[10.5px] text-muted-foreground">
                            {entry.actor} ·{" "}
                            {new Date(entry.at).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </SheetBody>

            <SheetFooter>
              {appointment.status === "pending" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() =>
                      onStatusChange(appointment, "cancelled", "Cancelled from detail panel")
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      onStatusChange(appointment, "confirmed", "Confirmed from detail panel")
                    }
                  >
                    Confirm appointment
                  </Button>
                </>
              ) : appointment.status === "confirmed" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() =>
                      onStatusChange(appointment, "cancelled", "Cancelled from detail panel")
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      onStatusChange(appointment, "completed", "Marked complete")
                    }
                  >
                    Mark complete
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              )}
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
