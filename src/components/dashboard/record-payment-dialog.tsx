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
import { formatBDT } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "bank-transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
];

export function RecordPaymentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { recordPayment, clients, cases } = useWorkspace();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client: clients[0]?.name ?? "",
    caseNo: cases[0]?.caseNo ?? "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    method: "bkash" as PaymentMethod,
    note: "",
  });
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep("form");
    setSaving(false);
    setError(null);
    setForm({
      client: clients[0]?.name ?? "",
      caseNo: cases[0]?.caseNo ?? "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      method: "bkash",
      note: "",
    });
  }

  function handlePrimary() {
    if (step === "form") {
      const amount = Number(form.amount);
      if (!form.client) {
        setError("Select a client.");
        return;
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        setError("Enter a payment amount greater than zero.");
        return;
      }
      if (!form.date) {
        setError("Choose the payment date.");
        return;
      }
      setError(null);
      setStep("confirm");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      recordPayment({
        client: form.client,
        caseNo: form.caseNo || null,
        amount: Number(form.amount),
        date: form.date,
        method: form.method,
        note: form.note.trim() || "Recorded from the billing workspace",
      });
      const receipt = `RCPT-${form.date.replaceAll("-", "")}`;
      toast.success(`Payment recorded · ${receipt}`);
      setSaving(false);
      reset();
      onOpenChange(false);
    }, 650);
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
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>
            {step === "form"
              ? "Add a receipt to the ledger. Nothing is saved until you confirm."
              : "Review before recording. This creates a permanent receipt."}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <DialogBody className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="pay-client">Client</Label>
                <Select
                  id="pay-client"
                  className="mt-1.5"
                  value={form.client}
                  onChange={(event) => setForm({ ...form, client: event.target.value })}
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="pay-case">Case (optional)</Label>
                <Select
                  id="pay-case"
                  className="mt-1.5"
                  value={form.caseNo}
                  onChange={(event) => setForm({ ...form, caseNo: event.target.value })}
                >
                  <option value="">Not linked</option>
                  {cases.map((legalCase) => (
                    <option key={legalCase.id} value={legalCase.caseNo}>
                      {legalCase.caseNo}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="pay-amount">Amount (৳)</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  min={1}
                  className="mt-1.5"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  placeholder="2000"
                />
              </div>
              <div>
                <Label htmlFor="pay-date">Payment date</Label>
                <Input
                  id="pay-date"
                  type="date"
                  className="mt-1.5"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pay-method">Method</Label>
              <Select
                id="pay-method"
                className="mt-1.5"
                value={form.method}
                onChange={(event) =>
                  setForm({ ...form, method: event.target.value as PaymentMethod })
                }
              >
                {METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="pay-note">Note</Label>
              <Textarea
                id="pay-note"
                rows={2}
                className="mt-1.5"
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                placeholder="Consultation fee, retainer tranche, etc."
              />
            </div>
            {error ? (
              <p role="alert" className="text-[11px] font-medium text-destructive">
                {error}
              </p>
            ) : null}
          </DialogBody>
        ) : (
          <DialogBody>
            <dl className="grid gap-2 rounded-[10px] border border-border bg-muted/40 p-3 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Client</dt>
                <dd className="font-medium text-foreground">{form.client}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Case</dt>
                <dd className="font-mono text-[11px] font-medium text-foreground">
                  {form.caseNo || "Not linked"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-semibold text-foreground">
                  {formatBDT(Number(form.amount))}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium text-foreground">{form.date}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Method</dt>
                <dd className="font-medium text-foreground">
                  {METHODS.find((method) => method.value === form.method)?.label}
                </dd>
              </div>
              {form.note ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Note</dt>
                  <dd className="max-w-[60%] text-right font-medium text-foreground">
                    {form.note}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Confirm only after the money is actually received. A receipt reference
              is generated automatically.
            </p>
          </DialogBody>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (step === "confirm" ? setStep("form") : onOpenChange(false))}
            disabled={saving}
          >
            {step === "confirm" ? "Back" : "Cancel"}
          </Button>
          <Button size="sm" onClick={handlePrimary} disabled={saving}>
            {saving
              ? "Recording…"
              : step === "form"
                ? "Review payment"
                : "Confirm & record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
