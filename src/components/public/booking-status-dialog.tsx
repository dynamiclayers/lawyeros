"use client";

import {
  CircleCheck,
  CircleX,
  Clock,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { Badge, StatusDot } from "@/components/ui/badge";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatBDT } from "@/lib/utils";
import type { Booking } from "@/types";

const STATUS_MAP = {
  pending: { label: "Awaiting chamber approval", tone: "warning" as const, variant: "warning" as const },
  confirmed: { label: "Confirmed", tone: "success" as const, variant: "success" as const },
  completed: { label: "Completed", tone: "success" as const, variant: "success" as const },
  cancelled: { label: "Cancelled", tone: "destructive" as const, variant: "destructive" as const },
};

export function BookingStatusDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lookupBooking } = useWorkspace();
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = reference.trim();
    if (!trimmed) {
      setError("Enter the booking reference from your confirmation.");
      setResult(null);
      return;
    }
    setError(null);
    const booking = lookupBooking(trimmed);
    setResult(booking ?? null);
    setSearched(true);
  }

  function reset() {
    setReference("");
    setError(null);
    setResult(null);
    setSearched(false);
  }

  const status = result ? STATUS_MAP[result.status] : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Track booking status</DialogTitle>
          <DialogDescription>
            Enter the reference shown on your confirmation, for example
            LC-2025-0816-0423.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-2">
            <Label htmlFor="booking-reference">Booking reference</Label>
            <div className="flex gap-2">
              <Input
                id="booking-reference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="LC-2025-0816-0423"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "booking-reference-error" : undefined}
                className="font-mono uppercase tracking-wide"
              />
              <Button type="submit" className="shrink-0">
                <Search className="size-4" />
                Find
              </Button>
            </div>
            {error ? (
              <p
                id="booking-reference-error"
                role="alert"
                className="text-[11px] font-medium text-destructive"
              >
                {error}
              </p>
            ) : null}
            <p className="text-[11px] text-muted-foreground">
              Demo workspace: try LC-2025-0816-0421 or LC-2025-0815-0402.
            </p>
          </form>

          {searched && !result ? (
            <div className="flex items-start gap-2.5 rounded-[10px] border border-destructive/25 bg-destructive/5 p-3">
              <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div>
                <p className="text-[12.5px] font-semibold text-foreground">
                  No booking found
                </p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  Check the reference for typos. New requests appear here once
                  the chamber has received them.
                </p>
              </div>
            </div>
          ) : null}

          {result && status ? (
            <div className="rounded-[10px] border border-border bg-muted/50 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[12px] font-semibold text-foreground">
                    {result.reference}
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-foreground">
                    {result.clientName}
                  </p>
                </div>
                <Badge variant={status.variant}>
                  <StatusDot tone={status.tone} />
                  {status.label}
                </Badge>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border pt-3 text-[12px]">
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                    Mode
                  </dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {result.mode === "online"
                      ? "Online video consultation"
                      : "In-chamber visit"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                    Fee
                  </dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {formatBDT(result.fee)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                    Date
                  </dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {new Date(result.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                    Time
                  </dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {result.time}
                  </dd>
                </div>
              </dl>

              <p className="mt-3 flex items-start gap-1.5 border-t border-border pt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                <Clock className="mt-px size-3.5 shrink-0" />
                {result.status === "pending"
                  ? "The chamber will confirm this slot by phone or email. Until then it is a request only."
                  : result.status === "cancelled"
                    ? "This slot was cancelled. Book a new consultation to continue."
                    : "The chamber will contact you before the appointment to confirm arrangements."}
              </p>
            </div>
          ) : null}

          {result && status ? (
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4 text-success" />
              <p className="text-[11.5px] text-muted-foreground">
                Need a change? Call the chamber quoting your reference.
              </p>
            </div>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
