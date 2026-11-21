"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  Loader2,
  Search,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarPicker } from "@/components/public/calendar-picker";
import { BookingStatusDialog } from "@/components/public/booking-status-dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { cn, formatBDT } from "@/lib/utils";
import type { Booking, ConsultationMode } from "@/types";

const STEPS = [
  { id: 1, label: "Consultation Mode" },
  { id: 2, label: "Date & Time" },
  { id: 3, label: "Your Details" },
  { id: 4, label: "Confirmation" },
];

interface FormValues {
  clientName: string;
  phone: string;
  email: string;
  caseSummary: string;
}

const EMPTY_FORM: FormValues = {
  clientName: "",
  phone: "",
  email: "",
  caseSummary: "",
};

function validateDetails(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (values.clientName.trim().length < 3) {
    errors.clientName = "Enter your full name (at least 3 characters).";
  }
  if (!/^[+\d][\d\s-]{7,}$/.test(values.phone.trim())) {
    errors.phone = "Enter a reachable phone number, e.g. +880 1711-223344.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (values.caseSummary.trim().length < 12) {
    errors.caseSummary = "Add a brief summary (at least 12 characters).";
  }
  return errors;
}

export function BookingWizard() {
  const { landing, createBooking } = useWorkspace();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<ConsultationMode>("in-chamber");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const fee = mode === "in-chamber" ? landing.feeInChamber : landing.feeOnline;

  const availableTimes = useMemo(() => landing.bookingSlots, [landing.bookingSlots]);

  const dateLabel = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  function canAdvance() {
    if (step === 2) return Boolean(date && time);
    return true;
  }

  function goNext() {
    if (step === 3) {
      const nextErrors = validateDetails(values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
        return;
      }
      void submitBooking();
      return;
    }
    setStep((current) => Math.min(current + 1, 4));
  }

  async function submitBooking() {
    if (!date || !time) {
      setStep(2);
      return;
    }
    setStatus("loading");
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (typeof window !== "undefined" && window.location.search.includes("fail=1")) {
        throw new Error("Simulated network failure");
      }
      const booking = createBooking({
        clientName: values.clientName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        mode,
        fee,
        date,
        time,
        caseSummary: values.caseSummary.trim(),
      });
      setConfirmed(booking);
      setStatus("success");
      setStep(4);
    } catch {
      setStatus("error");
    }
  }

  function startOver() {
    setStep(1);
    setMode("in-chamber");
    setDate(null);
    setTime(null);
    setValues(EMPTY_FORM);
    setErrors({});
    setStatus("idle");
    setConfirmed(null);
  }

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      className="border-b border-border bg-hero-wash py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            <h2
              id="booking-title"
              className="font-editorial text-[28px] font-medium text-foreground sm:text-[32px]"
            >
              Book a Consultation
            </h2>
            <p className="mt-2.5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
              Choose your preferred mode, select a date and time, and share a
              brief case summary. The chamber reviews every request personally
              before it is confirmed.
            </p>

            <dl className="mt-6 space-y-2.5 border-t border-border pt-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-3 py-2.5">
                <dt className="flex items-center gap-2 text-[12.5px] font-medium text-foreground">
                  <Building2 className="size-4 text-accent" />
                  In-chamber consultation
                </dt>
                <dd className="text-[12.5px] font-semibold text-foreground">
                  {formatBDT(landing.feeInChamber)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-3 py-2.5">
                <dt className="flex items-center gap-2 text-[12.5px] font-medium text-foreground">
                  <Video className="size-4 text-accent" />
                  Online video consultation
                </dt>
                <dd className="text-[12.5px] font-semibold text-foreground">
                  {formatBDT(landing.feeOnline)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground">
              <Clock className="mt-px size-3.5 shrink-0 text-accent" />
              Chamber hours: {landing.chamberHours}. Requests outside these hours
              are scheduled on the next available working day.
            </p>

            <button
              type="button"
              onClick={() => setStatusOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent underline-offset-4 hover:underline"
            >
              <Search className="size-3.5" />
              Already booked? Track your status
            </button>
          </div>

          <div className="rounded-[12px] border border-border bg-card p-4 shadow-surface sm:p-6">
            <div className="sm:hidden">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11.5px] font-semibold text-foreground">
                  Step {step} of {STEPS.length} — {STEPS[step - 1].label}
                </p>
                <p className="text-[10.5px] text-muted-foreground">
                  {Math.round((step / STEPS.length) * 100)}%
                </p>
              </div>
              <ol className="mt-2 flex gap-1" aria-label="Booking progress">
                {STEPS.map((item) => (
                  <li
                    key={item.id}
                    aria-current={step === item.id ? "step" : undefined}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      step >= item.id ? "bg-accent" : "bg-border",
                    )}
                  >
                    <span className="sr-only">
                      {item.label}
                      {step > item.id ? " (completed)" : step === item.id ? " (current)" : ""}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <ol
              className="hidden items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:flex"
              aria-label="Booking steps"
            >
              {STEPS.map((item, index) => {
                const state =
                  step === item.id ? "current" : step > item.id ? "done" : "todo";
                return (
                  <li key={item.id} className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.id < step) setStep(item.id);
                      }}
                      disabled={item.id > step}
                      aria-current={state === "current" ? "step" : undefined}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                        state === "current" && "border-accent/40 bg-accent/10 text-accent",
                        state === "done" &&
                          "border-border bg-muted text-foreground hover:border-accent/30",
                        state === "todo" && "border-border bg-transparent text-muted-foreground/70",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-4 items-center justify-center rounded-full text-[9px]",
                          state === "done" && "bg-success/15 text-success",
                          state === "current" && "bg-accent text-accent-foreground",
                          state === "todo" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {state === "done" ? <Check className="size-2.5" /> : item.id}
                      </span>
                      {item.label}
                    </button>
                    {index < STEPS.length - 1 ? (
                      <span aria-hidden className="h-px w-2 bg-border" />
                    ) : null}
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 border-t border-border pt-5">
              {step === 1 ? (
                <fieldset>
                  <legend className="text-[12px] font-semibold text-foreground">
                    How would you like to consult?
                  </legend>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        {
                          value: "in-chamber" as const,
                          title: "In-Chamber Visit",
                          copy: "Meet at the chamber with your documents.",
                          icon: Building2,
                          price: landing.feeInChamber,
                        },
                        {
                          value: "online" as const,
                          title: "Online Video",
                          copy: "Consult over a scheduled video call.",
                          icon: Video,
                          price: landing.feeOnline,
                        },
                      ]
                    ).map((option) => {
                      const Icon = option.icon;
                      const selected = mode === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setMode(option.value)}
                          className={cn(
                            "flex h-full flex-col items-start gap-0.5 rounded-[10px] border p-3 text-left transition-colors",
                            selected
                              ? "border-accent bg-accent/6 ring-1 ring-accent/40"
                              : "border-border hover:border-primary/40",
                          )}
                        >
                          <span className="flex w-full items-center justify-between">
                            <Icon
                              className={cn(
                                "size-4",
                                selected ? "text-accent" : "text-muted-foreground",
                              )}
                            />
                            <span
                              aria-hidden
                              className={cn(
                                "flex size-4 items-center justify-center rounded-full border",
                                selected
                                  ? "border-accent bg-accent text-accent-foreground"
                                  : "border-border",
                              )}
                            >
                              {selected ? <Check className="size-2.5" /> : null}
                            </span>
                          </span>
                          <span className="mt-1.5 text-[13px] font-semibold text-foreground">
                            {option.title}
                          </span>
                          <span className="text-[11.5px] leading-snug text-muted-foreground">
                            {option.copy}
                          </span>
                          <span className="mt-1.5 text-[12px] font-semibold text-foreground">
                            {formatBDT(option.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                  <div>
                    <CalendarPicker
                      value={date}
                      onChange={(next) => {
                        setDate(next);
                        setTime(null);
                      }}
                      availableDays={landing.bookingDays}
                    />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">
                      Available time slots
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {date ? dateLabel : "Select a date first."}
                    </p>
                    <div
                      className="mt-2.5 grid grid-cols-2 gap-1.5"
                      role="group"
                      aria-label="Available time slots"
                    >
                      {availableTimes.map((slot) => {
                        const selected = time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!date}
                            aria-pressed={selected}
                            onClick={() => setTime(slot)}
                            className={cn(
                              "h-9 rounded-lg border text-[11.5px] font-medium transition-colors disabled:opacity-40",
                              selected
                                ? "border-accent bg-accent/10 text-accent ring-1 ring-accent/30"
                                : "border-border text-foreground hover:border-primary/40 hover:bg-muted",
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {date && !time ? (
                      <p className="mt-2.5 text-[11px] text-warning">
                        Choose a time slot to continue.
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    goNext();
                  }}
                  className="grid gap-3.5"
                  noValidate
                >
                  <div>
                    <Label htmlFor="booking-name">Full name</Label>
                    <Input
                      id="booking-name"
                      className="mt-1.5"
                      value={values.clientName}
                      onChange={(event) => update("clientName", event.target.value)}
                      aria-invalid={Boolean(errors.clientName)}
                      aria-describedby={errors.clientName ? "err-name" : undefined}
                      autoComplete="name"
                    />
                    <FieldError>{errors.clientName}</FieldError>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="booking-phone">Phone number</Label>
                      <Input
                        id="booking-phone"
                        type="tel"
                        inputMode="tel"
                        className="mt-1.5"
                        value={values.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        autoComplete="tel"
                      />
                      <FieldError>{errors.phone}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor="booking-email">Email address</Label>
                      <Input
                        id="booking-email"
                        type="email"
                        className="mt-1.5"
                        value={values.email}
                        onChange={(event) => update("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        autoComplete="email"
                      />
                      <FieldError>{errors.email}</FieldError>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="booking-summary">Brief case summary</Label>
                    <Textarea
                      id="booking-summary"
                      className="mt-1.5"
                      value={values.caseSummary}
                      onChange={(event) => update("caseSummary", event.target.value)}
                      aria-invalid={Boolean(errors.caseSummary)}
                      rows={3}
                      maxLength={400}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <FieldError>{errors.caseSummary}</FieldError>
                      <span className="ml-auto text-[10.5px] text-muted-foreground">
                        {values.caseSummary.length}/400
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[10px] border border-border bg-muted/50 p-3">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
                      Review
                    </p>
                    <dl className="mt-1.5 space-y-1 text-[11.5px]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">Mode</dt>
                        <dd className="font-medium text-foreground">
                          {mode === "online" ? "Online video" : "In-chamber"} ·{" "}
                          {formatBDT(fee)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">Date & time</dt>
                        <dd className="text-right font-medium text-foreground">
                          {dateLabel}
                          {time ? ` · ${time}` : ""}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {status === "error" ? (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-[10px] border border-destructive/25 bg-destructive/5 p-3"
                    >
                      <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                      <div>
                        <p className="text-[12px] font-semibold text-foreground">
                          Request not submitted
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          The chamber could not be reached. Nothing was booked —
                          retry or call{" "}
                          <span className="font-medium">{landing.phone}</span>.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <button type="submit" className="sr-only">
                    Submit booking
                  </button>
                </form>
              ) : null}

              {step === 4 ? (
                <div>
                  {status === "loading" ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                      <Loader2 className="size-6 animate-spin text-accent" />
                      <p className="text-[13px] font-semibold text-foreground">
                        Sending your request…
                      </p>
                      <p className="text-[11.5px] text-muted-foreground">
                        Please keep this page open.
                      </p>
                    </div>
                  ) : confirmed ? (
                    <div className="animate-enter-up">
                      <div className="flex flex-col items-center text-center">
                        <span className="flex size-12 items-center justify-center rounded-full border border-success/25 bg-success/10 text-success">
                          <CircleCheck className="size-6" strokeWidth={1.8} />
                        </span>
                        <p className="mt-3 text-[16px] font-semibold text-foreground">
                          Request received
                        </p>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                          Your booking reference ID
                        </p>
                        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
                          <code className="font-mono text-[13px] font-semibold tracking-wide text-foreground">
                            {confirmed.reference}
                          </code>
                          <button
                            type="button"
                            aria-label="Copy booking reference"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(confirmed.reference);
                                toast.success("Reference copied");
                              } catch {
                                toast.error("Could not copy — select it manually");
                              }
                            }}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <dl className="mt-4 grid gap-2 border-t border-border pt-4 text-[12px] sm:grid-cols-2">
                        <div>
                          <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                            Consultation
                          </dt>
                          <dd className="mt-0.5 font-medium text-foreground">
                            {confirmed.mode === "online"
                              ? "Online video consultation"
                              : "In-chamber visit"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                            Fee
                          </dt>
                          <dd className="mt-0.5 font-medium text-foreground">
                            {formatBDT(confirmed.fee)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                            Requested date
                          </dt>
                          <dd className="mt-0.5 font-medium text-foreground">
                            {dateLabel}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
                            Requested time
                          </dt>
                          <dd className="mt-0.5 font-medium text-foreground">
                            {confirmed.time}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4 rounded-[10px] border border-warning/25 bg-warning/5 p-3">
                        <p className="text-[11.5px] font-semibold text-foreground">
                          Next step
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          Your appointment is not yet confirmed. The chamber will
                          call or email you to confirm the slot. Keep the
                          reference above for any follow-up.
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" size="sm" onClick={startOver}>
                          <ArrowLeft className="size-3.5" />
                          Book another
                        </Button>
                        <Button size="sm" onClick={() => setStatusOpen(true)}>
                          <Search className="size-3.5" />
                          Check booking status
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step < 4 ? (
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep((current) => Math.max(1, current - 1))}
                    disabled={step === 1 || status === "loading"}
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant={step === 3 ? "accent" : "default"}
                    onClick={goNext}
                    disabled={!canAdvance() || status === "loading"}
                    className="w-full sm:w-auto"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Confirming…
                      </>
                    ) : step === 3 ? (
                      <>
                        <Check className="size-4" />
                        Confirm Booking
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              ) : null}
            </div>

            {step < 3 && (date || time) ? (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CalendarCheck className="size-3.5 text-accent" />
                {mode === "online" ? "Online video" : "In-chamber"} ·{" "}
                {formatBDT(fee)}
                {date ? ` · ${dateLabel}` : ""}
                {time ? ` · ${time}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <BookingStatusDialog open={statusOpen} onOpenChange={setStatusOpen} />
    </section>
  );
}
