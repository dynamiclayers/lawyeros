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
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { useWorkspace } from "@/components/providers/workspace-provider";

export function NewCaseDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (title: string) => void;
}) {
  const { addCase, clients } = useWorkspace();
  const [form, setForm] = useState({
    title: "",
    client: clients[0]?.name ?? "",
    opposingParty: "",
    court: "DC Court",
    nextHearing: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const next: Record<string, string> = {};
    if (form.title.trim().length < 5) next.title = "Enter a descriptive case title.";
    if (!form.client.trim()) next.client = "Select the client.";
    if (form.opposingParty.trim().length < 2) {
      next.opposingParty = "Enter the opposing party.";
    }
    if (!form.nextHearing) next.nextHearing = "Choose the next hearing date.";
    setErrors(next);
    if (Object.keys(next).length) return;

    addCase({
      title: form.title.trim(),
      client: form.client,
      opposingParty: form.opposingParty.trim(),
      court: form.court,
      nextHearing: form.nextHearing,
      description: form.description.trim() || "No description recorded.",
    });
    onCreate?.(form.title.trim());
    setForm({
      title: "",
      client: clients[0]?.name ?? "",
      opposingParty: "",
      court: "DC Court",
      nextHearing: "",
      description: "",
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>File a new case</DialogTitle>
          <DialogDescription>
            The case number is generated when the matter is saved.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-3">
          <div>
            <Label htmlFor="case-title">Case title</Label>
            <Input
              id="case-title"
              className="mt-1.5"
              value={form.title}
              aria-invalid={Boolean(errors.title)}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Rahman v. Example Ltd."
            />
            {errors.title ? (
              <p role="alert" className="mt-1 text-[11px] text-destructive">{errors.title}</p>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="case-client">Client</Label>
              <Select
                id="case-client"
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
              <Label htmlFor="case-opposing">Opposing party</Label>
              <Input
                id="case-opposing"
                className="mt-1.5"
                value={form.opposingParty}
                aria-invalid={Boolean(errors.opposingParty)}
                onChange={(event) => setForm({ ...form, opposingParty: event.target.value })}
              />
              {errors.opposingParty ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.opposingParty}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="case-court">Court</Label>
              <Select
                id="case-court"
                className="mt-1.5"
                value={form.court}
                onChange={(event) => setForm({ ...form, court: event.target.value })}
              >
                {["SC Court", "DC Court", "HC", "Lab Court", "Tribunal"].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="case-hearing">Next hearing</Label>
              <Input
                id="case-hearing"
                type="date"
                className="mt-1.5"
                value={form.nextHearing}
                aria-invalid={Boolean(errors.nextHearing)}
                onChange={(event) => setForm({ ...form, nextHearing: event.target.value })}
              />
              {errors.nextHearing ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.nextHearing}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <Label htmlFor="case-description">Description</Label>
            <Textarea
              id="case-description"
              rows={3}
              className="mt-1.5"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            File case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
