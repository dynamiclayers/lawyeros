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
import { Label } from "@/components/ui/field";
import type { CauseItem } from "@/types";

const PURPOSES = [
  "Final Hearing",
  "Evidence",
  "Arguments",
  "Order",
  "Adjournment Request",
  "Judgment",
];

export function UpdateStageDialog({
  item,
  onOpenChange,
  onUpdate,
}: {
  item: CauseItem | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (purpose: string) => void;
}) {
  const [purpose, setPurpose] = useState("");

  return (
    <Dialog
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) setPurpose("");
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update case stage</DialogTitle>
          <DialogDescription>
            {item ? `${item.caseNo} · ${item.client} · ${item.court}` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Label htmlFor="stage-select">New stage / purpose</Label>
          <div className="mt-2 grid gap-1.5">
            {PURPOSES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPurpose(option)}
                aria-pressed={purpose === option}
                className={
                  purpose === option
                    ? "rounded-lg border border-accent bg-accent/8 px-3 py-2 text-left text-[12px] font-medium text-accent"
                    : "rounded-lg border border-border px-3 py-2 text-left text-[12px] text-foreground transition-colors hover:bg-muted"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!purpose}
            onClick={() => {
              onUpdate(purpose);
              setPurpose("");
              onOpenChange(false);
            }}
          >
            Save stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
