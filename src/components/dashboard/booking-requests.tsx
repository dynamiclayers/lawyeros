"use client";

import { ArrowUpRight, Inbox } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusDot } from "@/components/ui/badge";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { RescheduleDialog } from "@/components/dashboard/reschedule-dialog";
import { formatBDT, maskEmail } from "@/lib/utils";
import type { Booking } from "@/types";

export function BookingRequests() {
  const { bookings, updateBookingStatus, rescheduleBooking } = useWorkspace();
  const pending = bookings.filter((booking) => booking.status === "pending").slice(0, 5);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);

  return (
    <section className="rounded-[12px] border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">
          Recent Booking Requests
        </h2>
        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
        >
          View All
          <ArrowUpRight className="size-3" />
        </Link>
      </header>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
          <Inbox className="size-5 text-muted-foreground" />
          <p className="mt-2 text-[12.5px] font-medium text-foreground">
            No pending requests
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            New consultation requests appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {pending.map((booking) => (
            <li key={booking.id} className="px-4 py-3">
              <p className="font-mono text-[10.5px] text-muted-foreground">
                #{booking.reference}
              </p>
              <div className="mt-0.5 flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-foreground">
                    {booking.mode === "online"
                      ? "Online Consultation"
                      : "In-Chamber Visit"}
                    <span className="ml-1.5 text-[10.5px] font-normal text-muted-foreground">
                      {formatBDT(booking.fee)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {booking.clientName} · {maskEmail(booking.email)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                    <StatusDot tone="warning" />
                    {new Date(`${booking.date}T00:00:00`).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short" },
                    )}{" "}
                    · {booking.time}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <Button
                    size="xs"
                    variant="default"
                    className="bg-success text-white hover:bg-success/90"
                    onClick={() => {
                      updateBookingStatus(
                        booking.id,
                        "confirmed",
                        "Request approved and confirmed",
                      );
                      toast.success(`${booking.reference} approved`);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setRescheduling(booking)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/8 hover:text-destructive"
                    onClick={() => setCancelling(booking)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(cancelling)}
        onOpenChange={(open) => {
          if (!open) setCancelling(null);
        }}
        title="Cancel this booking request?"
        description={
          cancelling
            ? `${cancelling.reference} · ${cancelling.clientName}. The client will need to submit a new request.`
            : undefined
        }
        confirmLabel="Cancel request"
        cancelLabel="Keep request"
        destructive
        onConfirm={() => {
          if (!cancelling) return;
          updateBookingStatus(cancelling.id, "cancelled", "Request cancelled by chamber");
          toast.success(`${cancelling.reference} cancelled`);
        }}
      />

      <RescheduleDialog
        booking={rescheduling}
        onOpenChange={(open) => {
          if (!open) setRescheduling(null);
        }}
        onSubmit={(date, time) => {
          if (!rescheduling) return;
          rescheduleBooking(rescheduling.id, date, time);
          toast.success(
            `${rescheduling.reference} rescheduled to ${date} at ${time}`,
          );
        }}
      />
    </section>
  );
}
