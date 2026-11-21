"use client";

import {
  Banknote,
  CircleDollarSign,
  Receipt,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState, TBody, TD, TH, THead, TR, TableShell } from "@/components/ui/table";
import { RecordPaymentDialog } from "@/components/dashboard/record-payment-dialog";
import { PageHeading } from "@/components/dashboard/page-heading";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatBDT } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const METHOD_LABEL: Record<PaymentMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  "bank-transfer": "Bank transfer",
  cash: "Cash",
  cheque: "Cheque",
};

export function BillingTracker() {
  const { payments } = useWorkspace();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("pay=1")) setRecording(true);
  }, []);

  const now = new Date();
  const collected = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const thisMonth = payments
    .filter((payment) => {
      const date = new Date(`${payment.date}T00:00:00`);
      return (
        payment.status === "paid" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const filtered = payments.filter((payment) => {
    if (statusFilter !== "all" && payment.status !== statusFilter) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      payment.client.toLowerCase().includes(needle) ||
      payment.receipt.toLowerCase().includes(needle) ||
      (payment.caseNo ?? "").toLowerCase().includes(needle)
    );
  });

  return (
    <div className="space-y-4">
      <PageHeading
        title="Billing & Fees"
        description="Consultation fees, retainers, and every receipt recorded by the chamber."
        actions={
          <Button size="sm" onClick={() => setRecording(true)}>
            <Receipt className="size-3.5" />
            Record Payment
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total collected",
            value: collected,
            icon: Wallet,
            note: "All recorded receipts",
          },
          {
            label: "Outstanding",
            value: outstanding,
            icon: CircleDollarSign,
            note: "Awaiting settlement",
            danger: outstanding > 0,
          },
          {
            label: "This month",
            value: thisMonth,
            icon: TrendingUp,
            note: now.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[12px] border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md border border-border bg-muted text-primary">
                  <Icon className="size-3.5" />
                </span>
                <p className="text-[11.5px] text-muted-foreground">{card.label}</p>
              </div>
              <p
                className={
                  card.danger
                    ? "mt-2.5 text-[24px] font-semibold tracking-tight text-destructive"
                    : "mt-2.5 text-[24px] font-semibold tracking-tight text-foreground"
                }
              >
                {formatBDT(card.value)}
              </p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">{card.note}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[12px] border border-border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search client, receipt, or case"
              aria-label="Search payments"
              className="h-9 pl-8 text-[12px]"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | "paid" | "pending")
            }
            aria-label="Filter by payment status"
            className="h-9 w-[140px] text-[12px]"
          >
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </Select>
          <p className="ml-auto text-[11px] text-muted-foreground">
            {filtered.length} transactions
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Banknote className="size-4" />}
            title="No payments found"
            description="Record a payment or clear the filters to see the ledger."
          />
        ) : (
          <TableShell>
            <THead>
              <TH>Receipt</TH>
              <TH>Client</TH>
              <TH>Case</TH>
              <TH>Amount</TH>
              <TH>Date</TH>
              <TH>Method</TH>
              <TH>Status</TH>
            </THead>
            <TBody>
              {filtered.map((payment) => (
                <TR key={payment.id}>
                  <TD className="font-mono text-[10.5px] text-muted-foreground">
                    {payment.receipt}
                  </TD>
                  <TD>
                    <span className="block text-[12px] font-medium text-foreground">
                      {payment.client}
                    </span>
                    <span className="block max-w-[200px] truncate text-[10.5px] text-muted-foreground">
                      {payment.note}
                    </span>
                  </TD>
                  <TD className="font-mono text-[10.5px] text-muted-foreground">
                    {payment.caseNo ?? "—"}
                  </TD>
                  <TD className="text-[12px] font-semibold text-foreground">
                    {formatBDT(payment.amount)}
                  </TD>
                  <TD className="text-[11.5px] text-foreground">
                    {new Date(`${payment.date}T00:00:00`).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TD>
                  <TD className="text-[11.5px] text-foreground">
                    {METHOD_LABEL[payment.method]}
                  </TD>
                  <TD>
                    <Badge variant={payment.status === "paid" ? "success" : "warning"}>
                      {payment.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </TableShell>
        )}
      </div>

      <RecordPaymentDialog open={recording} onOpenChange={setRecording} />
    </div>
  );
}
