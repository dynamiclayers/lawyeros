"use client";

import {
  CalendarDays,
  CalendarPlus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, TableShell, EmptyState } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AppointmentsDrawer } from "@/components/dashboard/appointments-drawer";
import { AddAppointmentDialog } from "@/components/dashboard/add-appointment-dialog";
import { PageHeading } from "@/components/dashboard/page-heading";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatBDT } from "@/lib/utils";
import type { Appointment, BookingStatus, ConsultationMode } from "@/types";

const STATUS_LABEL: Record<BookingStatus, { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "success" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function AppointmentsManager() {
  const { appointments, updateAppointmentStatus } = useWorkspace();
  const [tab, setTab] = useState<BookingStatus>("pending");
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | ConsultationMode>("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [adding, setAdding] = useState(false);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);

  useEffect(() => {
    if (window.location.search.includes("new=1")) setAdding(true);
  }, []);

  const counts = useMemo(() => {
    return {
      all: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed").length,
      completed: appointments.filter((item) => item.status === "completed").length,
      cancelled: appointments.filter((item) => item.status === "cancelled").length,
    };
  }, [appointments]);

  const tabs: { value: BookingStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const filtered = appointments.filter((appointment) => {
    if (appointment.status !== tab) return false;
    const needle = query.trim().toLowerCase();
    if (
      needle &&
      !appointment.clientName.toLowerCase().includes(needle) &&
      !appointment.reference.toLowerCase().includes(needle)
    ) {
      return false;
    }
    if (dateFilter && appointment.date !== dateFilter) return false;
    if (modeFilter !== "all" && appointment.mode !== modeFilter) return false;
    return true;
  });

  const hasFilters = Boolean(query || dateFilter || modeFilter !== "all");

  return (
    <div className="space-y-4">
      <PageHeading
        title="Appointments"
        description="Approve requests, reschedule consultations, and keep the chamber diary accurate."
        actions={
          <Button size="sm" onClick={() => setAdding(true)}>
            <CalendarPlus className="size-3.5" />
            Add Appointment
          </Button>
        }
      />

      <div className="rounded-[12px] border border-border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search client or reference"
              aria-label="Search appointments"
              className="h-9 pl-8 text-[12px]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Label htmlFor="appt-date" className="sr-only">
              Filter by date
            </Label>
            <Input
              id="appt-date"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-9 w-[142px] text-[12px]"
            />
          </div>
          <Select
            value={modeFilter}
            onChange={(event) => setModeFilter(event.target.value as "all" | ConsultationMode)}
            aria-label="Filter by consultation mode"
            className="h-9 w-[150px] text-[12px]"
          >
            <option value="all">All modes</option>
            <option value="in-chamber">In-chamber</option>
            <option value="online">Online</option>
          </Select>
          {hasFilters ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setQuery("");
                setDateFilter("");
                setModeFilter("all");
              }}
            >
              <X className="size-3.5" />
              Clear
            </Button>
          ) : null}
          <p className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <SlidersHorizontal className="size-3" />
            {counts.all} appointments · {counts.pending} awaiting action
          </p>
        </div>

        <Tabs value={tab} onValueChange={(value) => setTab(value as BookingStatus)}>
          <div className="px-4 pt-1">
            <TabsList>
              {tabs.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                  <span className="ml-1.5 rounded-full border border-border bg-muted px-1.5 py-px text-[10px] font-semibold text-muted-foreground">
                    {counts[item.value]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((item) => (
            <TabsContent key={item.value} value={item.value} className="mt-0">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays className="size-4" />}
                  title={`No ${item.label.toLowerCase()} appointments`}
                  description={
                    hasFilters
                      ? "No records match the current filters. Clear them to see everything."
                      : "New booking requests from the public site will appear here."
                  }
                  action={
                    hasFilters ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setQuery("");
                          setDateFilter("");
                          setModeFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    ) : null
                  }
                />
              ) : (
                <>
                  <ul className="divide-y divide-border md:hidden">
                    {filtered.map((appointment) => {
                      const status = STATUS_LABEL[appointment.status];
                      return (
                        <li key={appointment.id}>
                          <div className="px-4 py-3">
                            <div className="flex items-start justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setSelected(appointment)}
                                aria-label={`View ${appointment.reference}`}
                                className="min-w-0 text-left"
                              >
                                <p className="text-[12.5px] font-medium text-foreground">
                                  {appointment.clientName}
                                </p>
                                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                                  {appointment.reference}
                                </p>
                              </button>
                              <Badge variant={status.variant} className="shrink-0">
                                {status.label}
                              </Badge>
                            </div>
                            <div
                              className="mt-2 grid cursor-pointer grid-cols-2 gap-x-3 gap-y-1 text-[11px]"
                              onClick={() => setSelected(appointment)}
                            >
                              <div>
                                <p className="text-muted-foreground">Date</p>
                                <p className="text-foreground">
                                  {new Date(
                                    `${appointment.date}T00:00:00`,
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                  , {appointment.time}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Mode</p>
                                <p className="text-foreground">
                                  {appointment.mode === "online" ? "Online" : "In-chamber"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Fee</p>
                                <p className="text-foreground">
                                  {formatBDT(appointment.fee)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="truncate text-foreground">
                                  {appointment.phone}
                                </p>
                              </div>
                            </div>
                            <AppointmentActions
                              appointment={appointment}
                              onChange={(next) => setSelected(next)}
                              onCancel={(next) => setCancelling(next)}
                              onStatus={(next, nextStatus, label) => {
                                updateAppointmentStatus(next.id, nextStatus, label);
                                toast.success(`${next.reference} → ${nextStatus}`);
                              }}
                              className="mt-2.5 flex flex-wrap gap-1.5"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="hidden md:block">
                    <TableShell className="border-t border-border">
                      <THead>
                        <TH>Client</TH>
                        <TH>Reference</TH>
                        <TH>Mode</TH>
                        <TH>Date / Time</TH>
                        <TH>Fee</TH>
                        <TH>Status</TH>
                        <TH className="text-right">Actions</TH>
                      </THead>
                      <TBody>
                        {filtered.map((appointment) => {
                          const status = STATUS_LABEL[appointment.status];
                          return (
                            <TR
                              key={appointment.id}
                              interactive
                              onClick={() => setSelected(appointment)}
                            >
                              <TD>
                                <span className="block text-[12.5px] font-medium text-foreground">
                                  {appointment.clientName}
                                </span>
                                <span className="block text-[10.5px] text-muted-foreground">
                                  {appointment.phone}
                                </span>
                              </TD>
                              <TD className="font-mono text-[10.5px] text-muted-foreground">
                                {appointment.reference}
                              </TD>
                              <TD className="text-[12px] text-foreground">
                                {appointment.mode === "online" ? "Online video" : "In-chamber"}
                              </TD>
                              <TD>
                                <span className="block text-[12px] text-foreground">
                                  {new Date(`${appointment.date}T00:00:00`).toLocaleDateString(
                                    "en-GB",
                                    { day: "numeric", month: "short", year: "numeric" },
                                  )}
                                </span>
                                <span className="block text-[10.5px] text-muted-foreground">
                                  {appointment.time}
                                </span>
                              </TD>
                              <TD className="text-[12px] font-medium text-foreground">
                                {formatBDT(appointment.fee)}
                              </TD>
                              <TD>
                                <Badge variant={status.variant}>{status.label}</Badge>
                              </TD>
                              <TD className="text-right">
                                <AppointmentActions
                                  appointment={appointment}
                                  onChange={(next) => setSelected(next)}
                                  onCancel={(next) => setCancelling(next)}
                                  onStatus={(next, nextStatus, label) => {
                                    updateAppointmentStatus(next.id, nextStatus, label);
                                    toast.success(`${next.reference} → ${nextStatus}`);
                                  }}
                                  className="flex items-center justify-end gap-1"
                                />
                              </TD>
                            </TR>
                          );
                        })}
                      </TBody>
                    </TableShell>
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <AppointmentsDrawer
        appointment={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onStatusChange={(appointment, status, label) => {
          updateAppointmentStatus(appointment.id, status, label);
          toast.success(`${appointment.reference} → ${status}`);
        }}
      />

      <ConfirmDialog
        open={Boolean(cancelling)}
        onOpenChange={(open) => {
          if (!open) setCancelling(null);
        }}
        title="Cancel appointment?"
        description={
          cancelling
            ? `${cancelling.reference} · ${cancelling.clientName} on ${cancelling.date} at ${cancelling.time}.`
            : undefined
        }
        confirmLabel="Cancel appointment"
        cancelLabel="Keep it"
        destructive
        onConfirm={() => {
          if (!cancelling) return;
          updateAppointmentStatus(
            cancelling.id,
            "cancelled",
            "Appointment cancelled by chamber",
          );
          toast.success(`${cancelling.reference} cancelled`);
        }}
      />

      <AddAppointmentDialog
        open={adding}
        onOpenChange={setAdding}
      />
    </div>
  );
}

function AppointmentActions({
  appointment,
  onChange,
  onCancel,
  onStatus,
  className,
}: {
  appointment: Appointment;
  onChange: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onStatus: (
    appointment: Appointment,
    status: BookingStatus,
    label: string,
  ) => void;
  className?: string;
}) {
  return (
    <div className={className} onClick={(event) => event.stopPropagation()}>
      {appointment.status === "pending" ? (
        <>
          <Button
            size="xs"
            variant="default"
            className="bg-success text-white hover:bg-success/90"
            onClick={() =>
              onStatus(appointment, "confirmed", "Appointment confirmed")
            }
          >
            Confirm
          </Button>
          <Button
            size="xs"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/8 hover:text-destructive"
            onClick={() => onCancel(appointment)}
          >
            Cancel
          </Button>
        </>
      ) : appointment.status === "confirmed" ? (
        <>
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              onStatus(appointment, "completed", "Appointment marked complete")
            }
          >
            Complete
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="text-destructive hover:bg-destructive/8 hover:text-destructive"
            onClick={() => onCancel(appointment)}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button size="xs" variant="ghost" onClick={() => onChange(appointment)}>
          View
        </Button>
      )}
    </div>
  );
}
