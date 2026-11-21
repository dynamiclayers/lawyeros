"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { useWorkspace } from "@/components/providers/workspace-provider";
import type { ConsultationMode } from "@/types";

const SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

export function AddAppointmentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addAppointment } = useWorkspace();
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    mode: "in-chamber" as ConsultationMode,
    date: "",
    time: SLOTS[0],
    fee: 2000,
    caseSummary: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setForm({
      clientName: "",
      phone: "",
      email: "",
      mode: "in-chamber",
      date: "",
      time: SLOTS[0],
      fee: 2000,
      caseSummary: "",
    });
    setErrors({});
  }

  function submit() {
    const next: Record<string, string> = {};
    if (form.clientName.trim().length < 3) next.clientName = "Enter the client's full name.";
    if (form.phone.trim().length < 8) next.phone = "Enter a reachable phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.date) next.date = "Choose a date.";
    setErrors(next);
    if (Object.keys(next).length) return;

    addAppointment({
      clientName: form.clientName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      mode: form.mode,
      fee: form.fee,
      date: form.date,
      time: form.time,
      caseSummary: form.caseSummary.trim() || "No summary provided.",
    });
    toast.success("Appointment added");
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add appointment</DialogTitle>
          <DialogDescription>
            Create a confirmed appointment for an existing client.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-3">
          <div>
            <Label htmlFor="new-appt-name">Client name</Label>
            <Input
              id="new-appt-name"
              className="mt-1.5"
              value={form.clientName}
              aria-invalid={Boolean(errors.clientName)}
              onChange={(event) => setForm({ ...form, clientName: event.target.value })}
            />
            {errors.clientName ? (
              <p role="alert" className="mt-1 text-[11px] text-destructive">
                {errors.clientName}
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="new-appt-phone">Phone</Label>
              <Input
                id="new-appt-phone"
                className="mt-1.5"
                value={form.phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
              {errors.phone ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.phone}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="new-appt-email">Email</Label>
              <Input
                id="new-appt-email"
                type="email"
                className="mt-1.5"
                value={form.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              {errors.email ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="new-appt-date">Date</Label>
              <Input
                id="new-appt-date"
                type="date"
                className="mt-1.5"
                value={form.date}
                aria-invalid={Boolean(errors.date)}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
              {errors.date ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.date}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="new-appt-time">Time</Label>
              <Select
                id="new-appt-time"
                className="mt-1.5"
                value={form.time}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
              >
                {SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="new-appt-mode">Mode</Label>
              <Select
                id="new-appt-mode"
                className="mt-1.5"
                value={form.mode}
                onChange={(event) => {
                  const mode = event.target.value as ConsultationMode;
                  setForm({ ...form, mode, fee: mode === "online" ? 1000 : 2000 });
                }}
              >
                <option value="in-chamber">In-chamber visit</option>
                <option value="online">Online video</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-appt-fee">Fee (৳)</Label>
              <Input
                id="new-appt-fee"
                type="number"
                min={0}
                className="mt-1.5"
                value={form.fee}
                onChange={(event) => setForm({ ...form, fee: Number(event.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="new-appt-summary">Case summary</Label>
            <Textarea
              id="new-appt-summary"
              rows={2}
              className="mt-1.5"
              value={form.caseSummary}
              onChange={(event) => setForm({ ...form, caseSummary: event.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            Create appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
