"use client";

import { CalendarDays, FileText, Mail, MapPin, Phone, Wallet } from "lucide-react";
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
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatBDT, maskEmail, maskPhone } from "@/lib/utils";
import type { Appointment, Client } from "@/types";

export function ClientDetailSheet({
  client,
  onOpenChange,
  appointments,
}: {
  client: Client | null;
  onOpenChange: (open: boolean) => void;
  appointments: Appointment[];
}) {
  const { cases, payments } = useWorkspace();

  const linkedCases = client
    ? cases.filter((legalCase) => client.caseIds.includes(legalCase.id))
    : [];
  const clientPayments = client
    ? payments.filter((payment) => payment.client === client.name)
    : [];
  const clientAppointments = client
    ? appointments.filter((appointment) => appointment.clientName === client.name)
    : [];

  const paid = clientPayments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const due =
    clientPayments
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + payment.amount, 0) + (client?.due ?? 0);

  return (
    <Sheet open={Boolean(client)} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px]">
        {client ? (
          <>
            <SheetHeader>
              <SheetTitle>{client.name}</SheetTitle>
              <SheetDescription>
                Client since{" "}
                {new Date(`${client.since}T00:00:00`).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </SheetDescription>
            </SheetHeader>

            <SheetBody className="space-y-5 pr-4">
              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Contact (masked)
                </h3>
                <ul className="mt-2 space-y-1.5 text-[12px]">
                  <li className="flex items-center gap-2 text-foreground">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {maskPhone(client.phone)}
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <Mail className="size-3.5 text-muted-foreground" />
                    {maskEmail(client.email)}
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    {client.address}
                  </li>
                </ul>
                <p className="mt-2 text-[10.5px] text-muted-foreground">
                  Masked for demos. Authorization is enforced by the application in
                  production.
                </p>
              </section>

              <section className="grid grid-cols-2 gap-2">
                <div className="rounded-[10px] border border-border bg-muted/40 p-3">
                  <p className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                    <Wallet className="size-3" />
                    Total paid
                  </p>
                  <p className="mt-1 text-[16px] font-semibold text-foreground">
                    {formatBDT(paid)}
                  </p>
                </div>
                <div className="rounded-[10px] border border-border bg-muted/40 p-3">
                  <p className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                    <Wallet className="size-3" />
                    Due balance
                  </p>
                  <p
                    className={
                      due > 0
                        ? "mt-1 text-[16px] font-semibold text-destructive"
                        : "mt-1 text-[16px] font-semibold text-foreground"
                    }
                  >
                    {formatBDT(due)}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Linked cases
                </h3>
                {linkedCases.length === 0 ? (
                  <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                    No cases linked to this client yet.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {linkedCases.map((legalCase) => (
                      <li
                        key={legalCase.id}
                        className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2"
                      >
                        <FileText className="size-3.5 shrink-0 text-accent" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-medium text-foreground">
                            {legalCase.title}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {legalCase.caseNo} · {legalCase.court}
                          </p>
                        </div>
                        <Badge variant={legalCase.status === "closed" ? "outline" : "success"}>
                          {legalCase.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Appointments
                </h3>
                {clientAppointments.length === 0 ? (
                  <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                    No appointments scheduled.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {clientAppointments.map((appointment) => (
                      <li
                        key={appointment.id}
                        className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2"
                      >
                        <CalendarDays className="size-3.5 shrink-0 text-accent" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] text-foreground">
                            {new Date(`${appointment.date}T00:00:00`).toLocaleDateString(
                              "en-GB",
                              { day: "numeric", month: "short", year: "numeric" },
                            )}{" "}
                            · {appointment.time}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {appointment.mode === "online" ? "Online" : "In-chamber"} ·{" "}
                            {formatBDT(appointment.fee)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "success"
                              : appointment.status === "cancelled"
                                ? "destructive"
                                : "warning"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Payment history
                </h3>
                {clientPayments.length === 0 ? (
                  <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                    No payments recorded.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-border rounded-[10px] border border-border bg-card">
                    {clientPayments.map((payment) => (
                      <li key={payment.id} className="flex items-center justify-between gap-3 px-3 py-2">
                        <div>
                          <p className="text-[12px] text-foreground">
                            {formatBDT(payment.amount)}
                            <span className="ml-1.5 text-[10.5px] text-muted-foreground">
                              {payment.method}
                            </span>
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {payment.receipt}
                          </p>
                        </div>
                        <span className="text-[10.5px] text-muted-foreground">
                          {new Date(`${payment.date}T00:00:00`).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </SheetBody>

            <SheetFooter>
              <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
