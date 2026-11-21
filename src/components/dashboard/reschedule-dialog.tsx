"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import type { Booking } from "@/types";

const DEFAULT_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export function RescheduleDialog({
  booking,
  onOpenChange,
  onSubmit,
}: {
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function today() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  return (
    <Dialog
      open={Boolean(booking)}
      onOpenChange={(open) => {
        if (!open) {
          setDate("");
          setTime("");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule booking</DialogTitle>
          <DialogDescription>
            {booking
              ? `${booking.reference} · ${booking.clientName} · currently ${booking.date} at ${booking.time}`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div>
            <Label htmlFor="reschedule-date">New date</Label>
            <Input
              id="reschedule-date"
              type="date"
              min={today()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="reschedule-time">New time</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5" role="group" aria-label="New time">
              {DEFAULT_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={time === slot}
                  onClick={() => setTime(slot)}
                  className={
                    time === slot
                      ? "rounded-lg border border-accent bg-accent/8 py-2 text-[11.5px] font-medium text-accent"
                      : "rounded-lg border border-border py-2 text-[11.5px] text-foreground transition-colors hover:bg-muted"
                  }
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Rescheduling returns the booking to pending so the change can be
            confirmed with the client.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!date || !time}
            onClick={() => {
              onSubmit(date, time);
              setDate("");
              setTime("");
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
