"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { EmptyState, TBody, TD, TH, THead, TR, TableShell } from "@/components/ui/table";
import {
  DesktopTableOnly,
  MobileCard,
  MobileCardList,
} from "@/components/ui/mobile-card-list";
import { ClientDetailSheet } from "@/components/dashboard/client-detail-sheet";
import { PageHeading } from "@/components/dashboard/page-heading";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatBDT, maskEmail, maskPhone } from "@/lib/utils";
import type { Client } from "@/types";

export function ClientsDirectory() {
  const { clients, cases, payments, appointments } = useWorkspace();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  const enriched = clients.map((client) => {
    const clientPayments = payments.filter(
      (payment) => payment.client === client.name && payment.status === "paid",
    );
    const totalPaid = clientPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const due =
      payments
        .filter((payment) => payment.client === client.name && payment.status === "pending")
        .reduce((sum, payment) => sum + payment.amount, 0) + client.due;
    return { ...client, totalPaid, due };
  });

  const filtered = enriched.filter((client) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      client.name.toLowerCase().includes(needle) ||
      client.email.toLowerCase().includes(needle) ||
      client.phone.replace(/\s/g, "").includes(needle.replace(/\s/g, ""))
    );
  });

  const active = selected
    ? enriched.find((client) => client.id === selected.id) ?? null
    : null;

  return (
    <div className="space-y-4">
      <PageHeading
        title="Clients"
        description="Contact details, linked matters, and fee history in one directory."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[12px] border border-border bg-card px-4 py-3">
          <p className="text-[11px] text-muted-foreground">Clients on record</p>
          <p className="mt-1 text-[22px] font-semibold text-foreground">{clients.length}</p>
        </div>
        <div className="rounded-[12px] border border-border bg-card px-4 py-3">
          <p className="text-[11px] text-muted-foreground">Linked cases</p>
          <p className="mt-1 text-[22px] font-semibold text-foreground">
            {cases.length}
          </p>
        </div>
        <div className="rounded-[12px] border border-border bg-card px-4 py-3">
          <p className="text-[11px] text-muted-foreground">Outstanding balance</p>
          <p className="mt-1 text-[22px] font-semibold text-foreground">
            {formatBDT(enriched.reduce((sum, client) => sum + client.due, 0))}
          </p>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative w-full max-w-[320px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, or phone"
              aria-label="Search clients"
              className="h-9 pl-8 text-[12px]"
            />
          </div>
          <button
            type="button"
            onClick={() => setReveal((current) => ({ ...current, all: !current.all }))}
            aria-pressed={Boolean(reveal.all)}
            className="ml-auto text-[11px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {reveal.all ? "Mask sensitive data" : "Reveal contact details"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="size-4" />}
            title="No clients found"
            description="Try a different name, or clear the search to list everyone."
          />
        ) : (
          <>
            <MobileCardList>
              {filtered.map((client) => {
                const linked = cases.filter((legalCase) =>
                  client.caseIds.includes(legalCase.id),
                );
                return (
                  <MobileCard
                    key={client.id}
                    onClick={() => setSelected(client)}
                    openLabel={`View ${client.name}`}
                    trailing={
                      client.due > 0 ? (
                        <Badge variant="destructive">{formatBDT(client.due)} due</Badge>
                      ) : (
                        <Badge variant="success">Settled</Badge>
                      )
                    }
                    header={
                      <p className="text-[12.5px] font-medium text-foreground">
                        {client.name}
                      </p>
                    }
                  >
                    <div
                      className="mt-2 grid cursor-pointer grid-cols-2 gap-x-3 gap-y-1 text-[11px]"
                      onClick={() => setSelected(client)}
                    >
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="text-foreground">
                          {reveal.all ? client.phone : maskPhone(client.phone)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cases</p>
                        <p className="text-foreground">{linked.length} linked</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total paid</p>
                        <p className="text-foreground">{formatBDT(client.totalPaid)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="truncate text-foreground">
                          {reveal.all ? client.email : maskEmail(client.email)}
                        </p>
                      </div>
                    </div>
                  </MobileCard>
                );
              })}
            </MobileCardList>

            <DesktopTableOnly>
              <TableShell>
                <THead>
                  <TH>Client</TH>
                  <TH>Contact</TH>
                  <TH>Linked Cases</TH>
                  <TH>Total Paid</TH>
                  <TH>Due Balance</TH>
                  <TH className="text-right">Detail</TH>
                </THead>
                <TBody>
                  {filtered.map((client) => {
                    const linked = cases.filter((legalCase) =>
                      client.caseIds.includes(legalCase.id),
                    );
                    return (
                      <TR key={client.id} interactive onClick={() => setSelected(client)}>
                        <TD>
                          <span className="block text-[12.5px] font-medium text-foreground">
                            {client.name}
                          </span>
                          <span className="block text-[10.5px] text-muted-foreground">
                            Client since{" "}
                            {new Date(`${client.since}T00:00:00`).toLocaleDateString(
                              "en-GB",
                              { month: "short", year: "numeric" },
                            )}
                          </span>
                        </TD>
                        <TD>
                          <span className="flex items-center gap-1.5 text-[11.5px] text-foreground">
                            <Phone className="size-3 text-muted-foreground" />
                            {reveal.all ? client.phone : maskPhone(client.phone)}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Mail className="size-3" />
                            {reveal.all ? client.email : maskEmail(client.email)}
                          </span>
                        </TD>
                        <TD>
                          <Badge variant="outline">
                            <BriefcaseBusiness className="size-2.5" />
                            {linked.length} {linked.length === 1 ? "case" : "cases"}
                          </Badge>
                        </TD>
                        <TD className="text-[12px] font-medium text-foreground">
                          {formatBDT(client.totalPaid)}
                        </TD>
                        <TD>
                          {client.due > 0 ? (
                            <span className="text-[12px] font-semibold text-destructive">
                              {formatBDT(client.due)}
                            </span>
                          ) : (
                            <Badge variant="success">Settled</Badge>
                          )}
                        </TD>
                        <TD className="text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent">
                            View
                            <ArrowUpRight className="size-3" />
                          </span>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </TableShell>
            </DesktopTableOnly>
          </>
        )}
      </div>

      <ClientDetailSheet
        client={active}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        appointments={appointments}
      />
    </div>
  );
}
