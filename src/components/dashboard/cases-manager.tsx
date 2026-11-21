"use client";

import {
  ArrowUpDown,
  FolderOpen,
  Gavel,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState, TBody, TD, TH, THead, TR, TableShell } from "@/components/ui/table";
import {
  DesktopTableOnly,
  MobileCard,
  MobileCardList,
} from "@/components/ui/mobile-card-list";
import { CaseDetailSheet } from "@/components/dashboard/case-detail-sheet";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { PageHeading } from "@/components/dashboard/page-heading";
import { useWorkspace } from "@/components/providers/workspace-provider";
import type { CaseStatus, LegalCase } from "@/types";

const STATUS: Record<CaseStatus, { label: string; variant: "success" | "warning" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  adjourned: { label: "Adjourned", variant: "outline" },
  closed: { label: "Closed", variant: "destructive" },
};

export function CasesManager() {
  const { cases } = useWorkspace();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | CaseStatus>("all");
  const [court, setCourt] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<LegalCase | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("new=1")) setCreating(true);
  }, []);

  const courts = Array.from(new Set(cases.map((legalCase) => legalCase.court)));

  const filtered = cases
    .filter((legalCase) => {
      const needle = query.trim().toLowerCase();
      if (
        needle &&
        !legalCase.caseNo.toLowerCase().includes(needle) &&
        !legalCase.title.toLowerCase().includes(needle) &&
        !legalCase.client.toLowerCase().includes(needle) &&
        !legalCase.opposingParty.toLowerCase().includes(needle)
      ) {
        return false;
      }
      if (status !== "all" && legalCase.status !== status) return false;
      if (court !== "all" && legalCase.court !== court) return false;
      return true;
    })
    .sort((a, b) => {
      const left = a.nextHearing === "—" ? "9999-99-99" : a.nextHearing;
      const right = b.nextHearing === "—" ? "9999-99-99" : b.nextHearing;
      return sortAsc ? left.localeCompare(right) : right.localeCompare(left);
    });

  const active = selected ? cases.find((legalCase) => legalCase.id === selected.id) ?? selected : null;

  return (
    <div className="space-y-4">
      <PageHeading
        title="Cases & Court Diary"
        description="Every matter, its next date, and the private notes behind it."
        actions={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" />
            New Case
          </Button>
        }
      />

      <div className="rounded-[12px] border border-border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search case no., title, or party"
              aria-label="Search cases"
              className="h-9 pl-8 text-[12px]"
            />
          </div>
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | CaseStatus)}
            aria-label="Filter by status"
            className="h-9 w-[132px] text-[12px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="adjourned">Adjourned</option>
            <option value="closed">Closed</option>
          </Select>
          <Select
            value={court}
            onChange={(event) => setCourt(event.target.value)}
            aria-label="Filter by court"
            className="h-9 w-[132px] text-[12px]"
          >
            <option value="all">All courts</option>
            {courts.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
          {query || status !== "all" || court !== "all" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setStatus("all");
                setCourt("all");
              }}
            >
              <X className="size-3.5" />
              Clear
            </Button>
          ) : null}
          <p className="ml-auto text-[11px] text-muted-foreground">
            {filtered.length} of {cases.length} cases
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-4" />}
            title="No cases match"
            description="Change the filters or file a new case to begin tracking hearings."
            action={
              <Button size="sm" variant="outline" onClick={() => setCreating(true)}>
                <Plus className="size-3.5" />
                New Case
              </Button>
            }
          />
        ) : (
          <>
            <MobileCardList>
              {filtered.map((legalCase) => {
                const statusMeta = STATUS[legalCase.status];
                return (
                  <MobileCard
                    key={legalCase.id}
                    onClick={() => setSelected(legalCase)}
                    openLabel={`View ${legalCase.caseNo}`}
                    trailing={<Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>}
                    header={
                      <>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {legalCase.caseNo} · {legalCase.court}
                        </p>
                        <p className="mt-0.5 text-[12.5px] font-medium text-foreground">
                          {legalCase.title}
                        </p>
                      </>
                    }
                  >
                    <div
                      className="mt-2 grid cursor-pointer grid-cols-2 gap-x-3 gap-y-1 text-[11px]"
                      onClick={() => setSelected(legalCase)}
                    >
                      <div>
                        <p className="text-muted-foreground">Client</p>
                        <p className="text-foreground">{legalCase.client}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opposing</p>
                        <p className="truncate text-foreground">
                          {legalCase.opposingParty}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next hearing</p>
                        <p className="text-foreground">
                          {legalCase.nextHearing === "—"
                            ? "—"
                            : new Date(
                                `${legalCase.nextHearing}T00:00:00`,
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stage</p>
                        <p className="text-foreground">{legalCase.stage}</p>
                      </div>
                    </div>
                  </MobileCard>
                );
              })}
            </MobileCardList>

            <DesktopTableOnly>
              <TableShell>
                <THead>
                  <TH>Case No.</TH>
                  <TH>Case Title</TH>
                  <TH>Court Name</TH>
                  <TH>Opposing Party</TH>
                  <TH>
                    <button
                      type="button"
                      onClick={() => setSortAsc((value) => !value)}
                      className="inline-flex items-center gap-1 uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground"
                    >
                      Next Hearing
                      <ArrowUpDown className="size-3" />
                    </button>
                  </TH>
                  <TH>Status</TH>
                </THead>
                <TBody>
                  {filtered.map((legalCase) => {
                    const statusMeta = STATUS[legalCase.status];
                    return (
                      <TR
                        key={legalCase.id}
                        interactive
                        onClick={() => setSelected(legalCase)}
                      >
                        <TD className="font-mono text-[11px] font-medium text-foreground">
                          {legalCase.caseNo}
                        </TD>
                        <TD>
                          <span className="block max-w-[240px] text-[12px] font-medium text-foreground">
                            {legalCase.title}
                          </span>
                          <span className="block text-[10.5px] text-muted-foreground">
                            {legalCase.client}
                          </span>
                        </TD>
                        <TD className="text-[12px] text-foreground">{legalCase.court}</TD>
                        <TD className="text-[12px] text-muted-foreground">
                          {legalCase.opposingParty}
                        </TD>
                        <TD className="text-[12px] text-foreground">
                          {legalCase.nextHearing === "—"
                            ? "—"
                            : new Date(
                                `${legalCase.nextHearing}T00:00:00`,
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                          <span className="ml-1.5 text-[10.5px] text-muted-foreground">
                            {legalCase.stage}
                          </span>
                        </TD>
                        <TD>
                          <Badge variant={statusMeta.variant}>
                            <Gavel className="size-2.5" />
                            {statusMeta.label}
                          </Badge>
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

      <CaseDetailSheet
        legalCase={active}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />

      <NewCaseDialog
        open={creating}
        onOpenChange={setCreating}
        onCreate={(title) => toast.success(`Case filed: ${title}`)}
      />
    </div>
  );
}
