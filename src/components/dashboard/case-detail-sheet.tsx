"use client";

import {
  CalendarClock,
  FileText,
  Gavel,
  Lock,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/field";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { newCaseNote } from "@/lib/demo-data";
import type { CaseStatus, LegalCase } from "@/types";

const STATUS: Record<CaseStatus, { label: string; variant: "success" | "warning" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  adjourned: { label: "Adjourned", variant: "outline" },
  closed: { label: "Closed", variant: "destructive" },
};

export function CaseDetailSheet({
  legalCase,
  onOpenChange,
}: {
  legalCase: LegalCase | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { addCaseNote, updateCaseStatus, documents } = useWorkspace();
  const [note, setNote] = useState("");
  const [internalOnly, setInternalOnly] = useState(true);

  const linkedDocuments = legalCase
    ? documents.filter((document) => document.caseNo === legalCase.caseNo)
    : [];

  function handleAddNote() {
    if (!legalCase || note.trim().length < 3) return;
    addCaseNote(legalCase.id, newCaseNote(note.trim(), internalOnly));
    toast.success(internalOnly ? "Private note saved" : "Client-visible note saved");
    setNote("");
  }

  return (
    <Sheet open={Boolean(legalCase)} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[520px]">
        {legalCase ? (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] text-muted-foreground">
                    {legalCase.caseNo}
                  </p>
                  <SheetTitle className="mt-1">{legalCase.title}</SheetTitle>
                  <SheetDescription>
                    {legalCase.client} v. {legalCase.opposingParty} ·{" "}
                    {legalCase.court}
                  </SheetDescription>
                </div>
                <Badge variant={STATUS[legalCase.status].variant}>
                  {STATUS[legalCase.status].label}
                </Badge>
              </div>
            </SheetHeader>

            <SheetBody className="pr-4">
              <dl className="grid grid-cols-2 gap-2 rounded-[10px] border border-border bg-muted/40 p-3 text-[12px]">
                <div>
                  <dt className="text-muted-foreground">Stage</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{legalCase.stage}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Next hearing</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {legalCase.nextHearing === "—"
                      ? "—"
                      : new Date(`${legalCase.nextHearing}T00:00:00`).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Filed on</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {new Date(`${legalCase.filedOn}T00:00:00`).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Court</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{legalCase.court}</dd>
                </div>
              </dl>

              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                {legalCase.description}
              </p>

              <Tabs defaultValue="timeline" className="mt-5">
                <TabsList>
                  <TabsTrigger value="timeline">Hearing Timeline</TabsTrigger>
                  <TabsTrigger value="notes">
                    Private Notes
                    <span className="ml-1.5 rounded-full bg-muted px-1.5 py-px text-[10px] text-muted-foreground">
                      {legalCase.notes.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    Documents
                    <span className="ml-1.5 rounded-full bg-muted px-1.5 py-px text-[10px] text-muted-foreground">
                      {linkedDocuments.length}
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                  {legalCase.hearings.length === 0 ? (
                    <p className="rounded-[10px] border border-dashed border-border px-3 py-6 text-center text-[12px] text-muted-foreground">
                      No hearings recorded yet.
                    </p>
                  ) : (
                    <ol className="space-y-0">
                      {legalCase.hearings.map((hearing, index) => (
                        <li key={hearing.id} className="relative flex gap-3 pb-4">
                          {index < legalCase.hearings.length - 1 ? (
                            <span
                              aria-hidden
                              className="absolute left-[7px] top-4 h-full w-px bg-border"
                            />
                          ) : null}
                          <span
                            aria-hidden
                            className="mt-1 size-3.5 shrink-0 rounded-full border-2 border-accent bg-card"
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-foreground">
                              {new Date(`${hearing.date}T00:00:00`).toLocaleDateString(
                                "en-GB",
                                { day: "numeric", month: "long", year: "numeric" },
                              )}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {hearing.court} · {hearing.purpose}
                            </p>
                            {hearing.outcome ? (
                              <p className="mt-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] text-foreground">
                                {hearing.outcome}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </TabsContent>

                <TabsContent value="notes">
                  <div className="flex items-start gap-2 rounded-[10px] border border-warning/30 bg-warning/8 px-3 py-2 text-[11px] leading-relaxed text-foreground">
                    <ShieldAlert className="mt-px size-3.5 shrink-0 text-warning" />
                    Private notes are visible only inside the chamber. Client-visible
                    notes may be shared when briefing the client.
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      rows={2}
                      placeholder="Add a note on this matter…"
                      aria-label="New case note"
                    />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={internalOnly}
                          onChange={(event) => setInternalOnly(event.target.checked)}
                          className="size-3.5 rounded border-border accent-accent"
                        />
                        Private (internal only)
                      </label>
                      <Button size="xs" onClick={handleAddNote} disabled={note.trim().length < 3}>
                        <Plus className="size-3" />
                        Add note
                      </Button>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {legalCase.notes.length === 0 ? (
                      <li className="text-[11.5px] text-muted-foreground">
                        No notes on this matter yet.
                      </li>
                    ) : (
                      legalCase.notes.map((entry) => (
                        <li
                          key={entry.id}
                          className="rounded-[10px] border border-border bg-card px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10.5px] text-muted-foreground">
                              {new Date(`${entry.at}T00:00:00`).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {entry.internal ? (
                              <Badge variant="warning">
                                <Lock className="size-2.5" />
                                Private
                              </Badge>
                            ) : (
                              <Badge variant="outline">Client-visible</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-foreground">
                            {entry.body}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </TabsContent>

                <TabsContent value="documents">
                  {linkedDocuments.length === 0 ? (
                    <p className="rounded-[10px] border border-dashed border-border px-3 py-6 text-center text-[12px] text-muted-foreground">
                      No documents linked to this case.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {linkedDocuments.map((document) => (
                        <li
                          key={document.id}
                          className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2"
                        >
                          <FileText className="size-4 shrink-0 text-accent" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-medium text-foreground">
                              {document.name}
                            </p>
                            <p className="text-[10.5px] text-muted-foreground">
                              {document.category} · {document.type}
                            </p>
                          </div>
                          {document.visibility === "client" ? (
                            <Badge variant="success">Shared</Badge>
                          ) : (
                            <Badge variant="warning">Private</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </SheetBody>

            <SheetFooter>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {legalCase.status !== "closed" ? (
                <Button
                  size="sm"
                  onClick={() => {
                    updateCaseStatus(legalCase.id, "closed");
                    toast.success(`${legalCase.caseNo} marked closed`);
                    onOpenChange(false);
                  }}
                >
                  <Gavel className="size-3.5" />
                  Mark disposed
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateCaseStatus(legalCase.id, "active");
                    toast.success(`${legalCase.caseNo} reopened`);
                  }}
                >
                  <CalendarClock className="size-3.5" />
                  Reopen case
                </Button>
              )}
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
